// Valida la estructura del proyecto (sin dependencias npm):
//  - existencias minimas (index, assets, worker, wrangler, migrations)
//  - wrangler.json coherente (assets para el front, D1)
//  - salubridad ESM de los modulos JS (import/export por sintaxis) en el
//    cliente, el worker y los scripts
//  - ausencia de secretos en el codigo fuente
//  - placeholder de database_id sin desplegar accidentalmente
// Uso: node scripts/validate.mjs [--allow-placeholder]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const allowPlaceholder = process.argv.includes("--allow-placeholder");
const failures = [];
const warnings = [];

function must(dir, msg) {
  const abs = path.resolve(ROOT, dir);
  if (!fs.existsSync(abs)) failures.push(msg);
  return abs;
}

must("index.html", "falta index.html");
must("assets/js/main.js", "falta assets/js/main.js");
must("assets/js/api.js", "falta assets/js/api.js");
must("assets/js/config.js", "falta assets/js/config.js");
must("assets/js/vendor.js", "falta assets/js/vendor.js");
must("assets/js/crypto/session.js", "falta assets/js/crypto/session.js");
must("assets/vendor/marked.min.js", "falta vendor marked.min.js");
must("assets/vendor/purify.min.js", "falta vendor purify.min.js");
must("assets/vendor/highlight.min.js", "falta vendor highlight.min.js");
must("src/worker.js", "falta src/worker.js");
must("wrangler.json", "falta wrangler.json");
must("migrations/0001_init.sql", "falta migrations/0001_init.sql");

// wrangler.json: estructura minima y placeholders
try {
  const w = JSON.parse(fs.readFileSync(path.join(ROOT, "wrangler.json"), "utf8"));
  if (w.main !== "src/worker.js") failures.push("wrangler.json: main debe ser src/worker.js");
  if (!w.assets) failures.push("wrangler.json: falta la seccion assets");
  if (w.assets && w.assets.binding !== "ASSETS") warnings.push("wrangler.json: binding de assets distinto de ASSETS");
  if (!Array.isArray(w.d1_databases) || !w.d1_databases.length) failures.push("wrangler.json: falta el binding D1");
  if (Array.isArray(w.r2_buckets) && w.r2_buckets.length) warnings.push("wrangler.json: se declara un bucket R2 pero el almacen es solo D1");
  for (const d of w.d1_databases || []) {
    if (typeof d.database_id === "string" && /REPLACE_WITH_/.test(d.database_id)) {
      if (allowPlaceholder) warnings.push("wrangler.json: database_id sigue con placeholder");
      else failures.push("wrangler.json: database_id es un placeholder (ejecuta wrangler d1 create)");
    }
  }
} catch (e) {
  failures.push("wrangler.json no es JSON valido: " + e.message);
}

// Migraciones: cualquier *.sql cargado como migracion debe existir en disco.
const migrationsDir = path.join(ROOT, "migrations");
if (fs.existsSync(migrationsDir)) {
  const sql = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));
  if (!sql.length) failures.push("migrations/ vacio");
} else {
  failures.push("falta migrations/");
}

// Escaneo de secretos en el codigo fuente.
const SECRET_PATTERNS = [
  /(ghp_|gho_|github_pat_|glpat-|xox[baprs]-|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9_-]{20,})/,
  /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /password\s*=\s*["'][^"']+/i,
  /api[_-]?key\s*[:=]\s*["'][^"']+/i,
];
function walk(p, skipMarkers) {
  if (!fs.existsSync(p)) return;
  for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
    if (ent.name.startsWith(".")) continue;
    const abs = path.join(p, ent.name);
    if (ent.isDirectory()) walk(abs, skipMarkers);
    else if (/\.(html|js|mjs|css|json|md|toml|yml|yaml|sql)$/i.test(ent.name)) {
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
walk(path.join(ROOT, "assets"));
walk(path.join(ROOT, "src"));

// Verificacion cruzada de imports/exports ESM.
function esmExports(src) {
  const names = new Set();
  for (const m of src.matchAll(/export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g)) names.add(m[1]);
  for (const m of src.matchAll(/export\s+(?:async\s+)?(?:const|let|var|class)\s+([A-Za-z_$][\w$]*)/g)) names.add(m[1]);
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(",")) {
      const p = part.trim().split(/\s+as\s+/)[0].trim();
      if (p) names.add(p);
    }
  }
  if (/export\s+default\s+\w+|export\s+default\s+f\s*\{|const\s+\w+\s*=\s*[^;]*;\s*export\s+default/.test(src)) names.add("default");
  return names;
}

function verifyModule(abs) {
  let src;
  try {
    src = fs.readFileSync(abs, "utf8");
  } catch {
    failures.push("no se pudo leer " + path.relative(ROOT, abs));
    return;
  }
  for (const m of src.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']/g)) {
    const names = m[1].split(",").map((s) => s.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
    if (!names.length) continue;
    const spec = m[2];
    if (!spec.startsWith(".")) continue; // imports de node: o de paquetes
    const targetPath = spec.endsWith(".js") ? spec : spec + ".js";
    const target = path.resolve(path.dirname(abs), targetPath);
    if (!fs.existsSync(target)) {
      failures.push(`import destino inexistente en ${path.relative(ROOT, abs)}: ${m[2]}`);
      continue;
    }
    const exports = esmExports(fs.readFileSync(target, "utf8"));
    for (const n of names) {
      if (!exports.has(n)) {
        failures.push(`import inexistente en ${path.relative(ROOT, abs)}: ${n} (no lo exporta ${m[2]})`);
      }
    }
  }
}

function walkJs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJs(abs);
    else if (/\.(js|mjs)$/.test(ent.name)) verifyModule(abs);
  }
}
walkJs(path.join(ROOT, "assets/js"));
walkJs(path.join(ROOT, "src"));
walkJs(path.join(ROOT, "scripts"));

for (const wtext of warnings) console.warn("[validate] aviso: " + wtext);

if (failures.length) {
  console.error("[validate] FALLOS:");
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log("[validate] OK: estructura, bindings y ausencia de secretos verificados");