// AES-256-GCM: descifrado en memoria con clave ya derivada (ver kdf.js).
// La integridad la garantiza el tag de autenticacion de GCM; una contrasena
// incorrecta o un ciphertext adulterado fallan aqui sin revelar contenido.

import { b64ToBytes } from "../core/utils.js";
import { deriveKey } from "./kdf.js";

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