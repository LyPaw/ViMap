// Cifra un directorio ("vault/" por defecto) en encrypted/<vault-id>/ usando el
// envelope v1 que entiende el cliente (assets/js/crypto/envelope.js). Formato:
// { version:1, algo:"AES-256-GCM", kdf:{name:"PBKDF2",hash:"SHA-256",
//   salt:<b64>,iterations}, iv:<b64>, ciphertext:<b64(ct+tag>} }.
// Escribe encrypted/<vault-id>/manifest.enc (indice cifrado) y un <id>.enc por
// archivo. Password: env VIMAP_VAULT_PASSWORD o stdin oculto.
// Uso: node scripts/encrypt-vault.mjs <dir> [--vault-id id] [--iterations 310000]

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import {
  pbkdf2Sync, createCipheriv, randomBytes, createHash,
} from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
function argV(name) {
  const i = process.argv.indexOf("--" + name);
  return i >= 0 ? process.argv[i + 1] : null;
}

const ROOT = path.resolve(here, "..");
function firstArg() {
  return process.argv.slice(2).find((a) => a && !a.startsWith("--"));
}
const src = firstArg();
if (!src) {
  console.error("[encrypt] uso: node scripts/encrypt-vault.mjs <dir> [--vault-id id]");
  process.exit(2);
}
const SRC_DIR = path.resolve(ROOT, src);
const vaultId = argV("vault-id") || path.basename(SRC_DIR);
const iterations = Number(argV("iterations")) || 310000;
const OUT_DIR = path.join(ROOT, "encrypted", vaultId);
const b64 = (b) => Buffer.from(b).toString("base64");

async function askPassword() {
  if (process.env.VIMAP_VAULT_PASSWORD) return process.env.VIMAP_VAULT_PASSWORD;
  const rl = readline.createInterface({ input: process.stdin, output: process.stderr });
  return new Promise((resolve) => {
    rl.question("Password de la boveda (oculto): ", (pw) => {
      rl.close();
      resolve(pw);
    });
  });
}

const key = await (async () => {
  const password = await askPassword();
  const salt = randomBytes(16);
  return { password, salt, key: pbkdf2Sync(password, salt, iterations, 32, "sha256"), salt };
})();

function envelopeFor(plainBuf) {
  const { key: k, salt } = key;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", k, iv);
  const ct = Buffer.concat([cipher.update(plainBuf), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    version: 1,
    algo: "AES-256-GCM",
    kdf: {
      name: "PBKDF2", hash: "SHA-256",
      salt: b64(salt), iterations,
    },
    iv: b64(iv),
    ciphertext: b64(Buffer.concat([ct, tag])),
  };
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const files = [];
async function walk(dir, base) {
  const ents = await fsp.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const ent of ents) {
    if (!ent || ent.name.startsWith(".")) continue;
    const abs = path.join(dir, ent.name);
    const rel = base ? base + "/" + ent.name : ent.name;
    if (ent.isDirectory()) {
      await walk(abs, rel);
    } else if (ent.isFile()) {
      const plain = await fsp.readFile(abs, "utf8");
      const id = createHash("sha1").update(rel).digest("hex").slice(0, 12);
      const env = envelopeFor(Buffer.from(plain, "utf8"));
      await fsp.writeFile(path.join(OUT_DIR, id + ".enc"), JSON.stringify(env), "utf8");
      const st = await fsp.stat(abs);
      files.push({ id, name: ent.name, path: rel, size: st.size, updatedAt: st.mtime.toISOString() });
      console.log(`[encrypt] ${rel} -> ${id}.enc`);
    }
  }
}
await walk(SRC_DIR, "");

const manifestPlain = JSON.stringify({ version: 1, files }, null, 2);
await fsp.writeFile(path.join(OUT_DIR, "manifest.enc"), JSON.stringify(envelopeFor(Buffer.from(manifestPlain, "utf8"))), "utf8");
console.log(`[encrypt] ${files.length} archivos -> encrypted/${vaultId}/ (iter ${iterations})`);
