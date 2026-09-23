// Estado de sesion de la boveda. La clave derivada y el contenido descifrado
// viven SOLO en memoria y se limpian al bloquear o recargar. Nada va a localStorage.

import { fetchText } from "../core/manifest.js";
import { classifyFile } from "../core/languages.js";
import { b64ToBytes } from "../core/utils.js";
import { parseEnvelopeText } from "./envelope.js";
import { deriveKey } from "./kdf.js";
import { decryptEnvelope } from "./aead.js";
import { resetAttempts } from "./attempts.js";

const state = {
  vaultId: null,
  key: null,
  entries: [],
  byPath: new Map(),
  cache: new Map(),
};

export function isUnlocked() {
  return !!state.key;
}

export function unlockedVaultId() {
  return state.vaultId;
}

export function vaultEntryCount() {
  return state.entries.length;
}

export function getVaultEntries() {
  return state.entries.slice();
}

export function getVaultEntryByPath(path) {
  return state.byPath.get(path);
}

export async function unlockVault(vault, password) {
  const manifestPath = vault.encryptedManifest;
  const json = await fetchText(manifestPath).catch(() => {
    const e = new Error("Boveda no publicada");
    e.code = "MANIFEST_MISSING";
    throw e;
  });
  const envelope = parseEnvelopeText(json);

  let key;
  let plaintext;
  try {
    key = await deriveKey(password, b64ToBytes(envelope.kdf.salt), envelope.kdf.iterations);
    plaintext = await decryptEnvelope(key, envelope);
  } catch (err) {
    throw err;
  }

  let files;
  try {
    const parsed = JSON.parse(plaintext);
    if (!Array.isArray(parsed.files)) throw new Error("bad shape");
    files = parsed.files;
  } catch (err) {
    const e = new Error("Contenido de boveda invalido");
    e.code = "VAULT_STRUCTURE";
    throw e;
  }

  state.vaultId = vault.id;
  state.key = key;
  state.cache.clear();
  state.byPath.clear();

  state.entries = files.map((f) => {
    const cls = classifyFile(f);
    return Object.freeze({
      id: f.id,
      name: f.name,
      path: f.path,
      ext: cls.ext,
      language: f.language || cls.language,
      category: f.category || cls.category,
      viewer: cls.viewer,
      hljs: cls.hljs,
      size: f.size ?? null,
      updatedAt: f.updatedAt ?? null,
      tags: Array.isArray(f.tags) ? f.tags : [],
      encrypted: true,
      vaultId: state.vaultId,
      envelopePath: "encrypted/" + state.vaultId + "/" + f.id + ".enc",
      fetch: () => decryptVaultFile(state.vaultId, f.id),
    });
  });

  for (const e of state.entries) state.byPath.set(e.path, e);
  resetAttempts();
  return state.entries;
}

// Derivamos la clave una sola vez por desbloqueo y la reutilizamos.
async function deriveAndDecryptKey(password, envelope) {
  const { deriveKey } = await import("./kdf.js");
  const { b64ToBytes } = await import("../core/utils.js");
  return deriveKey(password, b64ToBytes(envelope.kdf.salt), envelope.kdf.iterations);
}

export async function decryptVaultFile(vaultId, id) {
  if (!state.key || state.vaultId !== vaultId) throw new Error("Boveda bloqueada");
  if (state.cache.has(id)) return state.cache.get(id);

  const envelopePath = "encrypted/" + vaultId + "/" + id + ".enc";
  const json = await fetchText(envelopePath);
  const envelope = parseEnvelopeText(json);
  const text = await decryptEnvelope(state.key, envelope);
  state.cache.set(id, text);
  return text;
}

export function dropFromCache(id) {
  state.cache.delete(id);
}

export function lockVault() {
  state.key = null;
  state.vaultId = null;
  state.entries = [];
  state.byPath.clear();
  state.cache.clear();
  state.entries = [];
}