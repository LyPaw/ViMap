// Ensambla dist/ (copia lista para subir a GitHub Pages), sin dependencias.
// Copia solo lo servible: html, config publica, public/, assets/. Elimina dist/ antes.
// Uso: node scripts/assemble-dist.mjs [--out dist]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const OUT = path.resolve(ROOT, "dist");

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const ENTRIES = ["index.html", "404.html", "config", "public", "assets", "encrypted"];
for (const e of ENTRIES) {
  const src = path.join(ROOT, e);
  if (!fs.existsSync(src)) {
    console.warn(`[dist] aviso: ${e}/ no existe y se omite`);
    continue;
  }
  fs.cpSync(src, path.join(OUT, e), { recursive: true });
}

// Un .nojekyll evita que Pages trate carpetas _* de forma especial (habilitado por Pages).
fs.writeFileSync(path.join(OUT, ".nojekyll"), "", "utf8");

const files = countFiles(OUT);
console.log(`[dist] ${files} archivos -> ${path.relative(ROOT, OUT).replace(/\\/g, "/")}/`);

function countFiles(dir) {
  let n = 0;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) n += countFiles(abs);
    else n++;
  }
  return n;
}
