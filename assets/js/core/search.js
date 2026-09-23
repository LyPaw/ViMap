// Busqueda global: por nombre, extension, ruta, lenguaje, etiqueta y contenido
// (el contenido solo se escanea bajo demanda y nunca sobre archivos cifrados).

import { getConfig } from "../config.js";
import { fetchText } from "./manifest.js";

const MAX_CONTENT_FETCH_BYTES = 2 * 1024 * 1024;

export class SearchEngine {
  constructor(entries, byPath) {
    this.entries = entries;
    this.byPath = byPath || new Map(entries.map((e) => [e.path, e]));
    this.cache = new Map();
  }

  // Devuelve {query, kind, needle, filters}
  parseQuery(raw) {
    const tokens = raw.toLowerCase().split(/\s+/).filter(Boolean);
    const filters = { ext: null, lang: null, path: null, tag: null, cat: null };
    const rest = [];
    for (const t of tokens) {
      const m = t.match(/^(ext|lang|path|tag|cat):(.+)$/);
      if (m && filters[m[1]] === null) filters[m[1]] = m[2];
      else rest.push(t);
    }
    return { filters, needle: rest.join(" ") };
  }

  search(raw) {
    const cfg = getConfig();
    const { filters, needle } = this.parseQuery(raw);
    const q = needle.toLowerCase();
    const out = [];
    let hasMeta = false;

    for (const e of this.entries) {
      if (!filters.ext && !filters.lang && !filters.path && !filters.tag && !filters.cat && !q) continue;

      if (filters.ext && e.ext !== filters.ext) continue;
      if (filters.lang && e.language !== filters.lang) continue;
      if (filters.path && !e.path.toLowerCase().includes(filters.path)) continue;
      if (filters.cat && e.category !== filters.cat) continue;
      if (filters.tag && !(e.tags || []).includes(filters.tag)) continue;

      const nameL = e.name.toLowerCase();
      const pathL = e.path.toLowerCase();

      if (q) {
        const inName = nameL.includes(q);
        const inPath = pathL.includes(q);
        if (!inName && !inPath) continue;
        hasMeta = true;
        e._lastScore = (inName && nameL.startsWith(q) ? 2 : inName ? 1 : 0.5) + (inPath ? 0.25 : 0);
      } else {
        e._lastScore = 0;
      }
      out.push(e);
    }

    out.sort((a, b) => (b._lastScore - a._lastScore) || (a.path < b.path ? -1 : 1));
    return { results: out.slice(0, cfg.search.maxResults), hasMetaOnly: !q || hasMeta };
  }

  // Busqueda de contenido: escanea bajo demanda en segundo plano.
  // Nunca toca entradas encrypted. Respeta maxContentScan.
  async searchContent(raw, { signal, onProgress } = {}) {
    const cfg = getConfig();
    const { needle } = this.parseQuery(raw);
    const q = needle.toLowerCase();
    if (!q) return [];

    const candidates = this.entries.filter(
      (e) =>
        !e.encrypted &&
        (e.viewer === "code" || e.viewer === "text" || e.viewer === "md") &&
        (e.size == null || e.size <= MAX_CONTENT_FETCH_BYTES)
    ).slice(0, cfg.search.maxContentScan);

    const hits = [];
    let done = 0;
    const errors = [];

    const workers = Array.from({ length: 3 }, async () => {
      while (true) {
        if (signal && signal.aborted) return;
        const e = candidates.shift();
        if (!e) return;
        try {
          let text = this.cache.get(e.path);
          if (text === undefined) {
            text = await fetchText(e.downloadUrl || e.path);
            this.cache.set(e.path, text);
          }
          if (text.toLowerCase().includes(q)) hits.push(e);
          if (onProgress) onProgress(++done, candidates.length + done);
        } catch (err) {
          errors.push(err.message);
        }
      }
    });
    await Promise.all(workers);
    return { hits, errors: errors.length };
  }
}