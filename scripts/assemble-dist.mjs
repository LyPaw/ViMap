// Ensambla dist/ como raiz de static assets para Cloudflare Workers (wrangler
// sirve ./dist via el binding ASSETS). Copia solo lo servible: index.html + assets/.
// Uso: node scripts/assemble-dist.mjs [--out dist]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const arg = process.argv.indexOf("--out");
const OUT = path.resolve(ROOT, arg !== -1 ? process.argv[arg + 1] : "dist");

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const ENTRIES = ["index.html", "assets"];
for (const e of ENTRIES) {
  const src = path.join(ROOT, e);
  if (!fs.existsSync(src)) {
    console.warn(`[dist] aviso: ${e}/ no existe y se omite`);
    continue;
  }
  fs.cpSync(src, path.join(OUT, e), { recursive: true });
}

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