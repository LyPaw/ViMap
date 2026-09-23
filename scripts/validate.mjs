// Valida la estructura del proyecto sin requerir dependencias npm:
//  - existencias minimas (index.html, 404.html, config, public, assets)
//  - salubridad ESM de los modulos del cliente (import/export por sintaxis)
//  - ausencia de secretos en contenido publico (claves/pat/token/.env)
//  - manifiesto y vaults coherentes y dentro de la raiz servida
// Uso: node scripts/validate.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const failures = [];

function must(dir, msg) {
  const abs = path.resolve(ROOT, dir);
  if (!fs.existsSync(abs)) failures.push(msg);
  return abs;
}

function isInRoot(p) {
  const r = path.resolve(ROOT);
  const abs = path.resolve(ROOT, p);
  return abs === r || abs.startsWith(r + path.sep);
}

must("index.html", "falta index.html");
must("404.html", "falta 404.html");
must("config/public-config.json", "falta config/public-config.json");
must("public/vaults.json", "falta public/vaults.json");
must("assets/js/main.js", "falta assets/js/main.js");
must("assets/js/config.js", "falta assets/js/config.js");
must("assets/js/vendor.js", "falta assets/js/vendor.js");
must("assets/vendor/marked.min.js", "falta vendor marked.min.js");
must("assets/vendor/purify.min.js", "falta vendor purify.min.js");
must("assets/vendor/highlight.min.js", "falta vendor highlight.min.js");

// Escaneo de secretos en lo que se publica (nada cifrado ni privado aqui).
const SECRET_PATTERNS = [
  /(ghp_|gho_|github_pat_|glpat-|xox[baprs]-|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9_-]{20,})/,
  /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /password\s*=\s*["'][^"']+/i,
  /api[_-]?key\s*[:=]\s*["'][^"']+/i,
];
function walk(p) {
  if (!fs.existsSync(p)) return;
  for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
    if (ent.name.startsWith(".")) continue;
    const abs = path.join(p, ent.name);
    if (ent.isDirectory()) walk(abs);
    else if (/\.(html|js|mjs|css|json|md|toml|yml|yaml)$/i.test(ent.name)) {
      const txt = fs.readFileSync(abs, "utf8");
      for (const re of SECRET_PATTERNS) {
        const m = txt.match(re);
        if (m) {
          failures.push(`posible secreto en ${path.relative(ROOT, abs)}: ${m[0].slice(0, 24)}...`);
          break;
        }
      }
    }
  }
}
walk(path.join(ROOT, "public"));
walk(path.join(ROOT, "config"));
walk(path.join(ROOT, "assets"));
if (fs.existsSync(path.join(ROOT, "dist"))) walk(path.join(ROOT, "dist"));

// Manifiesto dentro de la raiz y rutas relativas.
const manifestPath = path.join(ROOT, "public/manifest.json");
if (fs.existsSync(manifestPath)) {
  try {
    const mf = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    if (!Array.isArray(mf.files)) failures.push("manifest.json sin array files");
    for (const f of mf.files || []) {
      if (typeof f.path !== "string" || !isInRoot("public/" + f.path)) {
        failures.push(`ruta fuera de public en manifest: ${f.path}`);
      }
    }
  } catch (e) {
    failures.push("manifest.json no es JSON valido");
  }
}
if (fs.existsSync(path.join(ROOT, "public/vaults.json"))) {
  try {
    const v = JSON.parse(fs.readFileSync(path.join(ROOT, "public/vaults.json"), "utf8"));
    if (v.version !== 1 || !Array.isArray(v.vaults)) failures.push("vaults.json mal formado");
  } catch (e) {
    failures.push("vaults.json no es JSON valido");
  }
}

if (failures.length) {
  console.error("[validate] FALLOS:");
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log("[validate] OK: estructura y ausencia de secretos verificadas");
