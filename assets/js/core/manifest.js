// Carga del manifiesto publico y del indice de bovedas.
// El manifiesto lo genera scripts/build-manifest.mjs; no depende de listado de directorios.

import { getConfig } from "../config.js";
import { classifyFile } from "./languages.js";

export async function fetchText(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) {
    if (res.status === 404) throw new Error("El archivo no esta publicado en este despliegue");
    throw new Error("Error " + res.status + " al leer " + path);
  }
  return res.text();
}

function buildEntry(file) {
  const cls = classifyFile(file);
  return Object.freeze({
    id: file.id,
    name: file.name,
    path: file.path,
    ext: cls.ext,
    language: file.language || cls.language,
    category: file.category || cls.category,
    viewer: cls.viewer,
    hljs: cls.hljs,
    size: file.size ?? null,
    updatedAt: file.updatedAt ?? null,
    tags: Array.isArray(file.tags) ? file.tags : [],
    encrypted: false,
    fetch: () => fetchText(file.download || file.path),
    downloadUrl: file.download || file.path,
  });
}

export async function loadManifest() {
  const cfg = getConfig();
  const res = await fetch(cfg.manifestPath, { cache: "no-store" });
  if (!res.ok) throw new Error("Manifiesto no disponible: " + cfg.manifestPath);
  const data = await res.json();
  if (!data || !Array.isArray(data.files)) throw new Error("Manifiesto con formato invalido");

  const entries = data.files.map(buildEntry);
  const byId = new Map();
  const byPath = new Map();
  for (const e of entries) {
    byId.set(e.id, e);
    byPath.set(e.path, e);
  }
  return { entries, byId, byPath, generatedAt: data.generatedAt || null };
}

export async function loadVaultsIndex() {
  const cfg = getConfig();
  try {
    const res = await fetch(cfg.vaultsIndexPath, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const vaults = Array.isArray(data.vaults) ? data.vaults : [];
    return vaults.filter((v) => v && typeof v.id === "string" && typeof v.encryptedManifest === "string");
  } catch (err) {
    console.warn("[manifest] sin indice de bovedas:", err.message);
    return [];
  }
}