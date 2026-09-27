// Descifra un bundle v2 (copia de seguridad) y restaura los archivos en un
// directorio local. Escribe la version mas reciente de cada ruta.
// Password: env VIMAP_VAULT_PASSWORD o stdin oculto.
// Uso: node scripts/decrypt-vault.mjs <bundle.json> [--out dir]

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import { pbkdf2Sync, createDecipheriv } from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");

function argV(name) {
  const i = process.argv.indexOf("--" + name);
  return i >= 0 ? process.argv[i + 1] : null;
}
function firstArg() {
  return process.argv.slice(2).find((a) => a && !a.startsWith("--"));
}

const src = firstArg();
if (!src) {
  console.error("[decrypt] uso: node scripts/decrypt-vault.mjs <bundle.json> [--out dir]");
  process.exit(2);
}
const BUNDLE_PATH = path.resolve(ROOT, src);
const OUT_DIR = path.resolve(ROOT, argV("out") || "restored");

async function readPassword() {
  if (process.env.VIMAP_VAULT_PASSWORD) return process.env.VIMAP_VAULT_PASSWORD;
  const rl = readline.createInterface({ input: process.stdin, output: process.stderr });
  const password = await new Promise((resolve) => {
    rl.question("Contrasena (oculta): ", (pw) => {
      rl.close();
      resolve(pw);
    });
  });
  return password;
}

const bundle = JSON.parse(fs.readFileSync(BUNDLE_PATH, "utf8"));
if (!bundle || bundle.version !== 2 || typeof bundle.manifest !== "string" || typeof bundle.blobs !== "object") {
  console.error("[decrypt] bundle invalido (no es una copia de seguridad v2)");
  process.exit(2);
}

const manifestEnv = JSON.parse(bundle.manifest);
const key = pbkdf2Sync(
  await readPassword(),
  Buffer.from(manifestEnv.kdf.salt, "base64"),
  manifestEnv.kdf.iterations,
  32,
  "sha256"
);

function decryptEnvelope(envText) {
  const env = JSON.parse(envText);
  const buf = Buffer.from(env.ciphertext, "base64");
  const cipher = createDecipheriv("aes-256-gcm", key, Buffer.from(env.iv, "base64"));
  cipher.setAuthTag(buf.slice(-16));
  return Buffer.concat([cipher.update(buf.slice(0, -16)), cipher.final()]).toString("utf8");
}

// Une una ruta relativa al directorio de salida sin permitir salir de el.
function safeJoin(base, rel) {
  if (typeof rel !== "string" || !rel || rel.startsWith("/") || /^[a-zA-Z]/.test(rel)) return null;
  if (rel.split("/").some((part) => !part || part === "." || part === ".." || part.includes("\\") || part.length > 255)) {
    return null;
  }
  const abs = path.resolve(base, ...rel.split("/"));
  if (abs !== base && !abs.startsWith(base + path.sep)) return null;
  return abs;
}

let manifest;
try {
  manifest = JSON.parse(decryptEnvelope(bundle.manifest));
} catch (err) {
  console.error("[decrypt] contrasena incorrecta o bundle corrupto");
  process.exit(3);
}
if (manifest.version !== 2 || !Array.isArray(manifest.files)) {
  console.error("[decrypt] manifest v2 no reconocido");
  process.exit(3);
}

let count = 0;
for (const f of manifest.files) {
  const abs = safeJoin(OUT_DIR, f.path);
  if (!abs) {
    console.warn(`[decrypt] ruta ignorada por insegura: ${JSON.stringify(f.path)}`);
    continue;
  }
  const latest = f.versions[f.versions.length - 1];
  if (!latest) continue;
  const envText = bundle.blobs[latest.key];
  if (!envText) {
    console.error(`[decrypt] falta blob ${latest.key.slice(0, 12)} para ${f.path}`);
    continue;
  }
  const plain = decryptEnvelope(envText);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  await fsp.writeFile(abs, plain, "utf8");
  console.log(`[decrypt] ${f.path}`);
  count++;
}
console.log(`[decrypt] ${count} archivos -> ${path.relative(ROOT, OUT_DIR).replace(/\\/g, "/")}/`);
const unused = Object.keys(bundle.blobs).length;
if (unused > Object.keys(manifest.files).length) {
  console.warn(`[decrypt] aviso: ${unused - Object.keys(manifest.files).length} blobs sin referenciar en el bundle`);
}
void ROOT;