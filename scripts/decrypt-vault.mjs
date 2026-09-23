// Descifra encrypted/<vaultId>/ a un directorio de salida. Inverso de
// encrypt-vault.mjs: lee manifest.enc (indice cifrado) y cada <id>.enc.
// Password: VIMAP_VAULT_PASSWORD o stdin oculto.
// Uso: node scripts/decrypt-vault.mjs <vaultId> [--out descifrado]

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import { pbkdf2Sync, createDecipheriv } from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");

function argValue(name) {
  const i = process.argv.indexOf("--" + name);
  return i >= 0 ? process.argv[i + 1] : null;
}
const vaultId = process.argv.slice(2).find((a) => a && !a.startsWith("--"));
if (!vaultId) {
  console.error("[decrypt] uso: node scripts/decrypt-vault.mjs <vaultId> [--out dir]");
  process.exit(2);
}
const VAULT_DIR = path.join(ROOT, "encrypted", vaultId);
const OUT = path.resolve(ROOT, argValue("out") || "decrypted");

async function askPassword() {
  if (process.env.VIMAP_VAULT_PASSWORD) return process.env.VIMAP_VAULT_PASSWORD;
  const rl = readline.createInterface({ input: process.stdin, output: process.stderr });
  return new Promise((resolve) => {
    rl.question("Password de la boveda: ", (pw) => {
      rl.close();
      resolve(pw);
    });
  });
}
const password = await askPassword();

function b64ToBuf(s) {
  return Buffer.from(s, "base64");
}
function decryptEnvelope(env, password) {
  const salt = b64ToBuf(env.kdf.salt);
  const key = pbkdf2Sync(password, salt, env.kdf.iterations, 32, "sha256");
  const iv = b64ToBuf(env.iv);
  const buf = b64ToBuf(env.ciphertext);
  const tag = buf.subarray(buf.length - 16);
  const data = buf.subarray(0, buf.length - 16);
  const d = createDecipheriv("aes-256-gcm", key, iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(data), d.final()]);
}

if (!fs.existsSync(path.join(VAULT_DIR, "manifest.enc"))) {
  console.error(`[decrypt] no hay boveda cifrada: ${vaultId}`);
  process.exit(3);
}
const manifestEnv = JSON.parse(await fsp.readFile(path.join(VAULT_DIR, "manifest.enc"), "utf8"));
const manifest = JSON.parse(decryptEnvelope(manifestEnv, password).toString("utf8"));
if (!Array.isArray(manifest.files)) {
  console.error("[decrypt] indice cifrado invalido");
  process.exit(4);
}

fs.mkdirSync(OUT, { recursive: true });
let n = 0;
for (const f of manifest.files) {
  const env = JSON.parse(await fsp.readFile(path.join(VAULT_DIR, f.id + ".enc"), "utf8"));
  const plain = decryptEnvelope(env, password);
  const target = path.join(OUT, f.path);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  await fsp.writeFile(target, plain);
  n++;
  console.log(`[decrypt] ${f.path}`);
}
console.log(`[decrypt] ${n} archivos restaurados en ${path.relative(ROOT, OUT).replace(/\\/g, "/")}`);
