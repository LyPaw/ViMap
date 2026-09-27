// Cifra un directorio local en un bundle v2 (mismo formato que la copia de
// seguridad que descarga la app: manifest cifrado + blobs content-addressed).
// Genera: { version:2, exportedAt, manifest: <JSON cifrado como texto>,
//           blobs: { <sha256-del-sobre>: <sobre JSON> } }.
// Password: env VIMAP_VAULT_PASSWORD o stdin oculto.
// Uso: node scripts/encrypt-vault.mjs <dir> [--out bundle.json] [--iterations 310000]

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import { pbkdf2Sync, createCipheriv, randomBytes, createHash, randomUUID } from "node:crypto";
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
  console.error("[encrypt] uso: node scripts/encrypt-vault.mjs <dir> [--out bundle.json] [--iterations N]");
  process.exit(2);
}
const SRC_DIR = path.resolve(ROOT, src);
const iterations = Number(argV("iterations")) || 310000;
const OUT_PATH = path.resolve(ROOT, argV("out") || "backup-v2.bundle.json");
const MAX_BLOB_BYTES = 32 * 1024 * 1024; // coincide con el tope del backend (sobre cifrado)
const b64 = (b) => Buffer.from(b).toString("base64");

async function askPassword() {
  if (process.env.VIMAP_VAULT_PASSWORD) return process.env.VIMAP_VAULT_PASSWORD;
  const rl = readline.createInterface({ input: process.stdin, output: process.stderr });
  const password = await new Promise((resolve) => {
    rl.question("Contrasena (oculta): ", (pw) => {
      rl.close();
      resolve(pw);
    });
  });
  rl.on("close", () => {});
  return password;
}

const password = await askPassword();
const salt = randomBytes(16);
const key = pbkdf2Sync(password, salt, iterations, 32, "sha256");

function envelopeFor(plainBuf) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(plainBuf), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    version: 1,
    algo: "AES-256-GCM",
    kdf: { name: "PBKDF2", hash: "SHA-256", salt: b64(salt), iterations },
    iv: b64(iv),
    ciphertext: b64(Buffer.concat([ct, tag])),
  };
}

async function envelopeTextFor(plain) {
  const env = envelopeFor(Buffer.from(plain, "utf8"));
  const text = JSON.stringify(env);
  const keyHex = createHash("sha256").update(text).digest("hex");
  return { text, keyHex };
}

const files = [];
const blobs = {};
const now = new Date().toISOString();
let skipped = 0;

async function walk(dir, base) {
  const ents = await fsp.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const ent of ents) {
    if (!ent || ent.name.startsWith(".")) continue;
    const abs = path.join(dir, ent.name);
    const rel = base ? base + "/" + ent.name : ent.name;
    if (ent.isDirectory()) continue;
    if (!ent.isFile()) continue;
    const plain = await fsp.readFile(abs, "utf8");
    const { text, keyHex } = await envelopeTextFor(plain);
    if (Buffer.byteLength(text, "utf8") > MAX_BLOB_BYTES) {
      console.warn(`[encrypt] aviso: ${rel} pasa de 32 MB (sobre cifrado) y la app no puede subirlo; se omite`);
      skipped += 1;
      continue;
    }
    blobs[keyHex] = text;
    files.push({
      fileId: randomUUID(),
      path: rel,
      name: ent.name,
      size: Buffer.byteLength(plain, "utf8"),
      createdAt: now,
      updatedAt: now,
      trashedAt: null,
      versions: [{ key: keyHex, size: Buffer.byteLength(plain, "utf8"), createdAt: now }],
    });
    console.log(`[encrypt] ${rel} -> ${keyHex.slice(0, 12)}`);
  }
}
await walk(SRC_DIR, "");

const manifestPlain = JSON.stringify(
  { version: 2, dirs: [], files: files.map((f) => ({ ...f })) },
  null,
  1
);
const { text: manifestText } = await envelopeTextFor(manifestPlain);

const bundle = { version: 2, exportedAt: now, manifest: manifestText, blobs };
await fsp.writeFile(OUT_PATH, JSON.stringify(bundle, null, 1), "utf8");
console.log(`[encrypt] ${files.length} archivos -> ${path.relative(ROOT, OUT_PATH).replace(/\\/g, "/")} (iter ${iterations})`);
if (skipped) console.warn(`[encrypt] ${skipped} archivos omitidos por superar 32 MB de sobre cifrado`);