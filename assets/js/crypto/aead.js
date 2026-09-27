// AES-256-GCM: descifrado en memoria con clave ya derivada (ver kdf.js).
// La integridad la garantiza el tag de autenticacion de GCM; una contrasena
// incorrecta o un ciphertext adulterado fallan aqui sin revelar contenido.

import { b64ToBytes } from "../core/utils.js";
import { deriveKey } from "./kdf.js";

function bytesToB64(bytes) {
  let bin = "";
  for (const b of new Uint8Array(bytes)) bin += String.fromCharCode(b);
  return btoa(bin);
}

export async function deriveAndDecrypt(password, envelope) {
  const key = await deriveKey(password, b64ToBytes(envelope.kdf.salt), envelope.kdf.iterations);
  return decryptEnvelope(key, envelope);
}

export async function decryptEnvelope(key, envelope) {
  const iv = b64ToBytes(envelope.iv);
  const ct = b64ToBytes(envelope.ciphertext);
  let plain;
  try {
    plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  } catch (err) {
    if (err && (err.name === "OperationError" || err.name === "DataError")) {
      const e = new Error("Constrasena incorrecta o dato corrupto");
      e.code = "AUTH_FAILED";
      throw e;
    }
    throw err;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(plain);
}

// Cifra texto con la clave ya derivada. Reutiliza salt + iteraciones del vault
// (iguales para todos sus sobre(s)) de modo que una misma clave descifra todo.
export async function encryptEnvelope(key, text, saltB64, iterations) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(text);
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  return {
    version: 1,
    algo: "AES-256-GCM",
    kdf: { name: "PBKDF2", hash: "SHA-256", salt: saltB64, iterations },
    iv: bytesToB64(iv),
    ciphertext: bytesToB64(ct),
  };
}