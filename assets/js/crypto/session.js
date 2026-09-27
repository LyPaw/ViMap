// Sesion del vault del usuario. La clave derivada y el contenido descifrado
// viven SOLO en memoria; el servidor guarda unicamente ciphertext.
// El manifest cifrado (v2) contiene archivos, carpetas, papelera y versiones;
// los blobs son content-addressed (key = sha256 del sobre), lo que evita
// re-subir contenido al mover/renombrar y permite dedupe.
// El push usa concurrencia optimista (rev): en 409 se hace merge por ruta.

import { api, ApiError } from "../api.js";
import { getConfig } from "../config.js";
import { classifyFile } from "../core/languages.js";
import { b64ToBytes } from "../core/utils.js";
import { parseEnvelopeText } from "./envelope.js";
import { deriveKey } from "./kdf.js";
import { decryptEnvelope, encryptEnvelope } from "./aead.js";

const state = {
  gen: 0,
  user: null,
  vaultId: null,
  salt: null,
  iterations: null,
  key: null,
  serverRev: 0,
  blobStore: [],
  knownBlobs: new Set(),
  pendingUploads: new Map(),
  manifest: null,
  byPath: new Map(),
  trashed: new Map(),
  dirSet: new Set(),
  cache: new Map(),
  textCache: new Map(),
  dirty: false,
  mutRev: 0,
};

export function isUnlocked() {
  return !!state.key;
}

export function currentUser() {
  return state.user;
}

export function vaultId() {
  return state.vaultId;
}

function nowIso() {
  return new Date().toISOString();
}

function byteLength(text) {
  return new TextEncoder().encode(text).length;
}

async function shaHex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function lastPath(p) {
  const i = p.lastIndexOf("/");
  return i >= 0 ? p.slice(i + 1) : p;
}

function dirOf(p) {
  const i = p.lastIndexOf("/");
  return i >= 0 ? p.slice(0, i) : "";
}

function validPath(p) {
  if (typeof p !== "string" || !p || p.length > 1024 || p.startsWith("/") || p.endsWith("/")) return false;
  if (p === "." || p === "..") return false;
  for (const part of p.split("/")) {
    if (!part || part.length > 255 || part === "." || part === ".." || part.includes("\\") || /[\u0000-\u001f\u007f-\u009f]/.test(part)) return false;
  }
  return true;
}

function emptyManifest() {
  return { version: 2, dirs: [], files: [], favs: [], recent: [] };
}

// Manifiestos antiguos (sin favs/recent): normalizar tras descifrar.
function normalizeManifest(manifest) {
  if (!Array.isArray(manifest.favs)) manifest.favs = [];
  if (!Array.isArray(manifest.recent)) manifest.recent = [];
  return manifest;
}

function buildEntry(file) {
  const cls = classifyFile({ name: file.name });
  const entry = Object.freeze({
    kind: "file",
    fileId: file.fileId,
    path: file.path,
    name: file.name,
    size: file.size ?? null,
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
    trashedAt: file.trashedAt || null,
    versions: file.versions,
    ext: cls.ext,
    language: file.language || cls.language,
    category: cls.category,
    viewer: cls.viewer,
    hljs: cls.hljs,
    encrypted: true,
    fetch: () => openEntry(file.path),
  });
  return entry;
}

function rebuildIndex() {
  state.byPath.clear();
  state.trashed.clear();
  state.dirSet.clear();

  for (const d of state.manifest.dirs) state.dirSet.add(d);
  for (const f of state.manifest.files) {
    let parent = dirOf(f.path);
    while (parent) {
      state.dirSet.add(parent);
      parent = dirOf(parent);
    }
    if (f.trashedAt) state.trashed.set(f.path, f);
    else state.byPath.set(f.path, f);
  }

  // Purgar de la papelera lo expirado (compactar; el push posterior lo materializa).
  const limit = Date.now() - getConfig().trashRetentionDays * 86400000;
  let compacted = false;
  for (const f of state.manifest.files) {
    if (f.trashedAt && new Date(f.trashedAt).getTime() < limit) {
      state.manifest.files = state.manifest.files.filter((x) => x.fileId !== f.fileId);
      state.trashed.delete(f.path);
      compacted = true;
    }
  }
  if (compacted) state.dirty = true;
}

function allBlobKeys() {
  const set = new Set();
  for (const f of state.manifest.files) for (const v of f.versions) set.add(v.key);
  return [...set];
}

async function makeEnvelope(textEnvelope) {
  return JSON.stringify(await encryptEnvelope(state.key, textEnvelope, state.salt, state.iterations));
}

async function registerBlob(envelopeText) {
  const max = getConfig().maxBlobBytes;
  if (byteLength(envelopeText) > max) {
    throw new Error(`Archivo demasiado grande (max. ${Math.max(1, Math.floor(max / (1024 * 1024)))} MB)`);
  }
  const key = await shaHex(envelopeText);
  state.pendingUploads.set(key, envelopeText);
  state.cache.set(key, envelopeText);
  return key;
}

// ---------------------------------------------------------------------------
// Carga / descarga
// ---------------------------------------------------------------------------

async function loadVault(password) {
  const info = await api.vault();
  state.salt = info.vaultSalt;
  state.iterations = info.vaultIterations;
  state.vaultId = info.vaultId || (state.user && state.user.vaultId) || null;
  state.serverRev = Number(info.rev) || 0;
  state.knownBlobs = new Set(Array.isArray(info.blobKeys) ? info.blobKeys : []);

  // La clave no se expone en el estado hasta haber validado que descifra el
  // manifest (o que no hay manifest). Si el KDF/decrypt falla, la sesion
  // permanece cerrada y isUnlocked() sigue devolviendo false.
  const key = await deriveKey(password, b64ToBytes(state.salt), state.iterations);
  state.cache.clear();
  state.textCache.clear();
  state.pendingUploads.clear();

  let manifest;
  if (info.manifestText) {
    const envelope = parseEnvelopeText(info.manifestText);
    let text;
    try {
      text = await decryptEnvelope(key, envelope);
    } catch (err) {
      if (err && err.code === "AUTH_FAILED") {
        state.cache.clear();
        state.textCache.clear();
        state.pendingUploads.clear();
        const e = new Error("Contrasena incorrecta");
        e.code = "AUTH_FAILED";
        throw e;
      }
      throw err;
    }
    let parsed;
    try {
      parsed = JSON.parse(text);
      if (parsed.version !== 2 || !Array.isArray(parsed.files)) throw new Error("shape");
    } catch (err) {
      const e = new Error("Contenido de boveda invalido");
      e.code = "VAULT_STRUCTURE";
      throw e;
    }
    manifest = normalizeManifest(parsed);
  } else {
    manifest = emptyManifest();
  }

  state.key = key;
  state.manifest = manifest;

  // Arranca limpio; rebuildIndex() marca dirty si compacta la papelera.
  state.dirty = false;
  rebuildIndex();
}

export async function login(username, password) {
  const info = await api.login(username, password);
  state.user = info;
  await loadVault(password);
  return state.user;
}

export async function unlock(password) {
  await loadVault(password);
  return state.user;
}

export async function attachUser() {
  const me = await api.me();
  state.user = me;
  return me;
}

export async function logout() {
  // La clave se borra en memoria de inmediato; el cierre de sesion en el
  // servidor es best-effort y no debe bloquear el borrado local.
  lock();
  api.logout().catch(() => {});
}

export function lock() {
  state.gen++;
  state.user = null;
  state.vaultId = null;
  state.salt = null;
  state.iterations = null;
  state.key = null;
  state.serverRev = 0;
  state.blobStore = [];
  state.knownBlobs.clear();
  state.pendingUploads.clear();
  state.manifest = null;
  state.byPath.clear();
  state.trashed.clear();
  state.dirSet.clear();
  state.cache.clear();
  state.textCache.clear();
  state.dirty = false;
  state.mutRev = 0;
}

// ---------------------------------------------------------------------------
// Lectura
// ---------------------------------------------------------------------------

export function getEntries() {
  return [...state.byPath.values()].map(buildEntry).sort((a, b) => a.path.localeCompare(b.path));
}

export function getDirPaths() {
  return [...state.dirSet].sort();
}

export function getByPath(path) {
  const f = state.byPath.get(path);
  return f ? buildEntry(f) : null;
}

export function getTrashed() {
  return [...state.trashed.values()]
    .map(buildEntry)
    .sort((a, b) => (b.trashedAt || "").localeCompare(a.trashedAt || ""));
}

export async function openEntry(path) {
  const f = state.byPath.get(path) || state.trashed.get(path);
  if (!f) throw new Error("Archivo no encontrado");
  const version = f.versions[f.versions.length - 1];
  if (!version) return "";
  if (!state.textCache.has(version.key)) {
    let envelopeText = state.cache.get(version.key);
    if (envelopeText === undefined) {
      envelopeText = await api.blobGet(version.key);
      state.cache.set(version.key, envelopeText);
    }
    const envelope = parseEnvelopeText(envelopeText);
    const text = await decryptEnvelope(state.key, envelope);
    state.textCache.set(version.key, text);
  }
  return state.textCache.get(version.key);
}

export function fileVersions(path) {
  const f = state.byPath.get(path);
  if (!f) return [];
  return f.versions.map((v, i) => ({ ...v, index: i })).reverse();
}

// ---------------------------------------------------------------------------
// Favoritos y recientes (metadatos de vault: viajan cifrados en el manifest)
// ---------------------------------------------------------------------------

function favsAlive() {
  const favs = (state.manifest.favs || []).filter((p) => state.byPath.has(p) || state.dirSet.has(p));
  if (state.manifest && favs.length !== (state.manifest.favs || []).length) {
    state.manifest.favs = favs;
    markDirty();
  }
  return favs;
}

export function getFavs() {
  if (!state.manifest) return [];
  return favsAlive();
}

export function isFav(path) {
  if (!state.manifest) return false;
  return (state.manifest.favs || []).includes(path);
}

export function toggleFav(path) {
  assertWritable();
  if (!state.byPath.has(path) && !state.dirSet.has(path)) return false;
  const favs = new Set(state.manifest.favs || []);
  if (favs.has(path)) favs.delete(path);
  else favs.add(path);
  state.manifest.favs = [...favs];
  markDirty();
  rebuildIndex();
  return favs.has(path);
}

export function touchRecent(path) {
  if (!state.manifest || !state.byPath.has(path)) return;
  const rest = (state.manifest.recent || []).filter((r) => r && r.path !== path);
  state.manifest.recent = [{ path, at: Date.now() }, ...rest].slice(0, 20);
  markDirty();
}

export function getRecent() {
  if (!state.manifest) return [];
  const out = [];
  for (const r of state.manifest.recent || []) {
    if (r && state.byPath.has(r.path)) out.push({ path: r.path, at: r.at || 0 });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Operaciones tipo OS
// ---------------------------------------------------------------------------

function findFile(path) {
  return state.byPath.get(path) || state.trashed.get(path) || null;
}

function assertWritable() {
  if (!isUnlocked()) throw new Error("Boveda sin desbloquear");
}

function markDirty() {
  state.dirty = true;
  state.mutRev++;
}

// Las operaciones async pueden recibir un lock()/logout() mientras se cifra o
// se sube. Si la generacion de la sesion cambio, abortar limpio en vez de
// mutar (o subir) un estado ya cerrado.
function assertActive(gen) {
  if (gen !== state.gen) {
    const e = new Error("La sesion se cerro durante la operacion");
    e.code = "SESSION_LOCKED";
    throw e;
  }
}

export function createDir(dirPath) {
  assertWritable();
  if (!validPath(dirPath)) throw new Error("Ruta de carpeta invalida");
  if (state.dirSet.has(dirPath)) throw new Error("La carpeta ya existe");
  state.manifest.dirs = [...new Set([...state.manifest.dirs, dirPath])].sort();
  markDirty();
  rebuildIndex();
  return dirPath;
}

export async function createFile(path, content) {
  assertWritable();
  const gen = state.gen;
  if (!validPath(path)) throw new Error("Ruta de archivo invalida");
  if (state.byPath.has(path) || state.trashed.has(path)) {
    if (state.trashed.has(path)) {
      // Recrear sobre un archivo en la papelera: restaurar y sobrescribir.
      await updateFile(path, content);
      return;
    }
    throw new Error("Ya existe un archivo con esa ruta");
  }
  const name = lastPath(path);
  const text = String(content);
  const key = await registerBlob(await makeEnvelope(text));
  assertActive(gen);
  const file = {
    fileId: crypto.randomUUID(),
    path,
    name,
    size: byteLength(text),
    createdAt: nowIso(),
    updatedAt: nowIso(),
    trashedAt: null,
    versions: [{ key, size: byteLength(text), createdAt: nowIso() }],
  };
  state.manifest.files.push(file);
  markDirty();
  rebuildIndex();
}

function compactVersions(file) {
  const limit = getConfig().versionLimit;
  if (file.versions.length > limit) {
    file.versions = file.versions.slice(-limit);
  }
}

export async function updateFile(path, content) {
  assertWritable();
  const gen = state.gen;
  const f = findFile(path);
  if (!f) throw new Error("Archivo no encontrado");
  const text = String(content);
  const key = await registerBlob(await makeEnvelope(text));
  assertActive(gen);
  f.versions.push({ key, size: byteLength(text), createdAt: nowIso() });
  f.size = byteLength(text);
  f.updatedAt = nowIso();
  f.trashedAt = null;
  compactVersions(f);
  markDirty();
  rebuildIndex();
}

export async function moveEntry(oldPath, newPath) {
  assertWritable();
  if (!validPath(newPath)) throw new Error("Ruta destino invalida");
  if (oldPath === newPath) return;
  if (newPath === oldPath + "/" + lastPath(oldPath)) return;
  if (newPath.startsWith(oldPath + "/")) throw new Error("No se puede mover dentro de si mismo");
  if (state.byPath.has(newPath)) throw new Error("Ya existe algo en el destino");

  const isFile = !!state.byPath.get(oldPath);
  const isDir = state.dirSet.has(oldPath);

  if (isFile) {
    const f = state.byPath.get(oldPath);
    f.path = newPath;
    f.name = lastPath(newPath);
    f.updatedAt = nowIso();
  } else if (isDir) {
    for (const f of state.manifest.files) {
      if (f.path === oldPath || f.path.startsWith(oldPath + "/")) {
        f.path = newPath + f.path.slice(oldPath.length);
        f.name = lastPath(f.path);
        f.updatedAt = nowIso();
      }
    }
    const prefix = oldPath + "/";
    state.manifest.dirs = state.manifest.dirs
      .filter((d) => d !== oldPath)
      .map((d) => (d.startsWith(prefix) ? newPath + d.slice(oldPath.length) : d));
    if (state.manifest.dirs.includes(oldPath)) {
      state.manifest.dirs = state.manifest.dirs.filter((d) => d !== oldPath);
    }
    state.dirSet.delete(oldPath);
  } else {
    throw new Error("Ruta origen no existe");
  }
  markDirty();
  rebuildIndex();
}

export function trashPaths(paths) {
  assertWritable();
  const seen = new Set();
  for (const p of paths) {
    const f = state.byPath.get(p);
    if (!f) continue;
    f.trashedAt = nowIso();
    f.updatedAt = f.trashedAt;
    seen.add(p);
    for (const other of state.manifest.files) {
      if (other !== f && !other.trashedAt && other.path.startsWith(p + "/")) {
        other.trashedAt = f.trashedAt;
        other.updatedAt = f.trashedAt;
        seen.add(other.path);
      }
    }
  }
  const removedDirs = state.manifest.dirs.filter((d) => paths.some((p) => d === p || d.startsWith(p + "/")));
  if (removedDirs.length) {
    state.manifest.dirs = state.manifest.dirs.filter((d) => !removedDirs.includes(d));
  }
  if (seen.size) markDirty();
  rebuildIndex();
}

export function restorePaths(paths) {
  assertWritable();
  const set = new Set(paths);
  for (const f of state.manifest.files) {
    if (f.trashedAt && set.has(f.path)) {
      f.trashedAt = null;
      f.updatedAt = nowIso();
    }
  }
  markDirty();
  rebuildIndex();
}

export function purgePaths(paths) {
  assertWritable();
  const set = new Set(paths);
  state.manifest.files = state.manifest.files.filter((f) => !(f.trashedAt && set.has(f.path)));
  markDirty();
  rebuildIndex();
}

// Borrado definitivo (Shift+Delete): elimina los elementos vivos (o de la
// papelera) de forma permanente, tanto ficheros como carpetas y descendientes.
export function deletePermanently(paths) {
  assertWritable();
  const set = new Set(paths);
  const files = state.manifest.files.filter((f) => {
    if (set.has(f.path)) return false;
    return !set.has(dirOf(f.path)) && ![...set].some((p) => f.path.startsWith(p + "/"));
  });
  const dirs = state.manifest.dirs.filter((d) => {
    if (set.has(d)) return false;
    return ![...set].some((p) => d.startsWith(p + "/"));
  });
  const changed = state.manifest.files.length !== files.length || state.manifest.dirs.length !== dirs.length;
  state.manifest.files = files;
  state.manifest.dirs = dirs;
  if (changed) markDirty();
  rebuildIndex();
}

export function emptyTrash() {
  assertWritable();
  const had = state.manifest.files.some((f) => f.trashedAt);
  state.manifest.files = state.manifest.files.filter((f) => !f.trashedAt);
  if (had) markDirty();
  rebuildIndex();
}

export async function restoreVersion(path, versionIndex) {
  assertWritable();
  const f = findFile(path);
  if (!f) throw new Error("Archivo no encontrado");
  const target = f.versions[versionIndex];
  if (!target) throw new Error("Version no existe");
  f.versions.push({ key: target.key, size: target.size, createdAt: nowIso() });
  f.size = target.size;
  f.updatedAt = nowIso();
  compactVersions(f);
  markDirty();
  rebuildIndex();
}

// ---------------------------------------------------------------------------
// Nombres unicos y copiar / mover en lote
// ---------------------------------------------------------------------------

// Existe como fichero vivo, carpeta o elemento en la papelera. Fuente unica
// para creacion, pegado e importacion (antes duplicada en explorer/dnd).
export function pathExists(path) {
  if (!path) return false;
  if (state.byPath.has(path)) return true;
  if (state.dirSet.has(path)) return true;
  return state.trashed.has(path);
}

// Sugiere una ruta libre en dir con sufijo " (2)", " (3)", ... estilo Windows.
// Se usa al crear e importar; el pegado/movido usa copyName ("(copia)").
export function uniqueName(dir, name) {
  let k = 2;
  let cand = dir ? dir + "/" + name : name;
  while (pathExists(cand)) {
    const i = name.lastIndexOf(".");
    const current = i > 0 ? name.slice(0, i) + " (" + k + ")" + name.slice(i) : name + " (" + k + ")";
    cand = dir ? dir + "/" + current : current;
    k += 1;
  }
  return cand;
}

// Sufijo de copia estilo Explorador de Windows: "nombre (copia).ext",
// "nombre (copia 2).ext", ...
function copyName(name, k) {
  if (k <= 1) return name;
  const i = name.lastIndexOf(".");
  const stem = i > 0 ? name.slice(0, i) : name;
  const ext = i > 0 ? name.slice(i) : "";
  return stem + (k === 2 ? " (copia)" : " (copia " + (k - 1) + ")") + ext;
}

// Busca un nombre libre dentro de dir (si un toplevel colisiona, aplica el
// sufijo de copia incremental). Guarda en el Set `taken` para evitar dupes.
function uniqueIn(dir, name, taken) {
  let k = 1;
  let cand = dir ? dir + "/" + name : name;
  while (taken.has(cand)) {
    k += 1;
    cand = dir ? dir + "/" + copyName(name, k) : copyName(name, k);
  }
  return cand;
}

// Quita origenes que ya quedan cubiertos por otro (a/b dentro de a) y los que
// no existen o viven en la papelera.
function normalizeRoots(paths) {
  const list = [];
  for (const p of paths) {
    if (!p || state.trashed.has(p)) continue;
    if (!state.byPath.has(p) && !state.dirSet.has(p)) continue;
    list.push(p);
  }
  return list.filter((p) => !list.some((o) => o !== p && p.startsWith(o + "/")));
}

function assertTargetDir(targetDir) {
  if (targetDir === "") return;
  if (typeof targetDir !== "string" || !state.dirSet.has(targetDir)) {
    throw new Error("Carpeta destino no existe");
  }
}

export function copyEntries(paths, targetDir) {
  assertWritable();
  assertTargetDir(targetDir);
  const roots = normalizeRoots(paths);
  if (!roots.length) return 0;

  for (const p of roots) {
    if (p === targetDir || targetDir.startsWith(p + "/")) {
      throw new Error("No se puede copiar una carpeta dentro de si misma");
    }
  }

  const taken = new Set([...state.byPath.keys(), ...state.trashed.keys(), ...state.dirSet]);
  const dest = new Map();
  for (const p of roots) {
    const cand = uniqueIn(targetDir, lastPath(p), taken);
    dest.set(p, cand);
    taken.add(cand);
  }

  const now = nowIso();
  const newFiles = [];
  for (const f of state.manifest.files) {
    if (f.trashedAt) continue;
    for (const [oldP, newP] of dest) {
      if (f.path === oldP || f.path.startsWith(oldP + "/")) {
        const mapped = f.path === oldP ? newP : newP + f.path.slice(oldP.length);
        newFiles.push({
          fileId: crypto.randomUUID(),
          path: mapped,
          name: lastPath(mapped),
          size: f.size,
          createdAt: now,
          updatedAt: now,
          trashedAt: null,
          versions: f.versions.map((v) => ({ ...v })),
        });
        break;
      }
    }
  }

  const newDirs = [];
  for (const d of state.manifest.dirs) {
    for (const [oldP, newP] of dest) {
      if (d === oldP || d.startsWith(oldP + "/")) {
        newDirs.push(d === oldP ? newP : newP + d.slice(oldP.length));
        break;
      }
    }
  }

  state.manifest.files = state.manifest.files.concat(newFiles);
  state.manifest.dirs = [...new Set([...state.manifest.dirs, ...newDirs])].sort();
  markDirty();
  rebuildIndex();
  return roots.length;
}

export function moveEntries(paths, targetDir) {
  assertWritable();
  assertTargetDir(targetDir);
  const roots = normalizeRoots(paths);
  if (!roots.length) return 0;

  for (const p of roots) {
    if (p === targetDir || targetDir.startsWith(p + "/")) {
      throw new Error("No se puede mover un elemento dentro de si mismo");
    }
  }

  const taken = new Set([...state.byPath.keys(), ...state.trashed.keys(), ...state.dirSet]);
  const dest = [];
  for (const p of roots) {
    const cand = uniqueIn(targetDir, lastPath(p), taken);
    dest.push([p, cand]);
    taken.add(cand);
  }

  for (const [oldP, newP] of dest) {
    moveEntry(oldP, newP);
  }
  return roots.length;
}

// ---------------------------------------------------------------------------
// Persistencia (push optimista con merge)
// ---------------------------------------------------------------------------

function mergeRemote(remote) {
  const byPath = (m) => new Map(m.files.map((f) => [f.path, f]));
  const local = byPath(state.manifest);
  const remoteFiles = byPath(remote);

  const merged = [];
  const paths = new Set([...local.keys(), ...remoteFiles.keys()]);
  for (const p of paths) {
    const l = local.get(p);
    const r = remoteFiles.get(p);
    if (!r) merged.push(l);
    else if (!l) merged.push(r);
    else merged.push((l.updatedAt || "") > (r.updatedAt || "") ? l : r);
  }

  const favs = [...new Set([...(state.manifest.favs || []), ...((remote.favs || []))])];
  const recentByPath = new Map();
  for (const r of [...(state.manifest.recent || []), ...((remote.recent || []))]) {
    if (!r || typeof r.path !== "string") continue;
    const prev = recentByPath.get(r.path);
    if (!prev || (r.at || 0) > (prev.at || 0)) recentByPath.set(r.path, { path: r.path, at: r.at || 0 });
  }
  const recent = [...recentByPath.values()].sort((a, b) => b.at - a.at).slice(0, 20);
  state.manifest = {
    version: 2,
    dirs: [...new Set([...(state.manifest.dirs || []), ...(remote.dirs || [])])].sort(),
    files: merged,
    favs,
    recent,
  };
  markDirty();
}

async function uploadPending() {
  for (const [key, envelopeText] of [...state.pendingUploads]) {
    if (state.knownBlobs.has(key)) {
      state.pendingUploads.delete(key);
      continue;
    }
    const res = await api.blobPut(key, envelopeText);
    state.knownBlobs.add(key);
    state.pendingUploads.delete(key);
    if (res && res.existed) state.knownBlobs.add(key);
  }
}

async function pushManifest(payload) {
  try {
    return await api.manifestPush(payload);
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) return err.data;
    throw err;
  }
}

export async function persist() {
  if (!isUnlocked()) throw new Error("Boveda sin desbloquear");
  const gen = state.gen;

  for (let attempt = 0; attempt < 4; attempt++) {
    const epoch = state.mutRev;
    await uploadPending();
    assertActive(gen);
    const blobKeys = allBlobKeys();
    const manifestText = await makeEnvelope(JSON.stringify(state.manifest));
    assertActive(gen);
    if (epoch !== state.mutRev) continue; // cambiaron cosas durante el cifrado: reintenta

    const resp = await pushManifest({ baseRev: state.serverRev, manifestText, blobKeys });
    assertActive(gen);

    if (resp && resp.error === "CONFLICT") {
      try {
        const envelope = parseEnvelopeText(resp.manifestText);
        const text = await decryptEnvelope(state.key, envelope);
        const remote = JSON.parse(text);
        if (remote.version === 2) {
          mergeRemote(remote);
          state.serverRev = resp.rev;
          state.knownBlobs = new Set(resp.blobKeys || []);
          rebuildIndex();
          continue; // reintenta con el manifest fusionado
        }
      } catch (err) {
        if (err && err.code === "NETWORK") throw err;
        const e = new Error("Conflicto y no se pudo fusionar: " + (err && err.message ? err.message : err));
        e.code = "MERGE_FAILED";
        throw e;
      }
    }

    state.serverRev = resp.rev;
    if (epoch === state.mutRev) state.dirty = false;
    for (const k of blobKeys) state.knownBlobs.add(k);
    try {
      state.user = await api.me();
    } catch {
      /* no bloqueante */
    }
    return { merged: false };
  }

  const e = new Error("No se pudo sincronizar la boveda (muchos cambios simultaneos)");
  e.code = "SYNC_BUSY";
  throw e;
}

// ---------------------------------------------------------------------------
// Copia de seguridad (descarga manifest + blobs como un unico JSON)
// ---------------------------------------------------------------------------

export async function exportBundle() {
  if (!isUnlocked()) throw new Error("Boveda sin desbloquear");
  const blobs = {};
  for (const key of allBlobKeys()) {
    if (!state.cache.has(key)) {
      const envelopeText = await api.blobGet(key);
      state.cache.set(key, envelopeText);
    }
    blobs[key] = state.cache.get(key);
  }
  return JSON.stringify(
    {
      version: 2,
      exportedAt: nowIso(),
      manifest: await makeEnvelope(JSON.stringify(state.manifest)),
      blobs,
    },
    null,
    1,
  );
}

export function quotaLabel() {
  const u = state.user;
  if (!u) return "";
  const mb = (n) => (n / (1024 * 1024)).toFixed(1);
  return `${mb(u.quotaUsed)} / ${mb(u.quotaBytes)} MB`;
}

export const session = {
  isUnlocked,
  currentUser,
  vaultId,
  login,
  unlock,
  attachUser,
  logout,
  lock,
  getEntries,
  getDirPaths,
  getByPath,
  getTrashed,
  openEntry,
  fileVersions,
  getFavs,
  isFav,
  toggleFav,
  touchRecent,
  getRecent,
  createDir,
  createFile,
  updateFile,
  moveEntry,
  pathExists,
  uniqueName,
  copyEntries,
  moveEntries,
  trashPaths,
  restorePaths,
  purgePaths,
  deletePermanently,
  emptyTrash,
  restoreVersion,
  persist,
  exportBundle,
  quotaLabel,
};