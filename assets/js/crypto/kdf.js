// Derivacion de clave PBKDF2-HMAC-SHA256 siguiendo el mismo esquema que
// scripts/encrypt-vault.mjs (node:crypto). Produce una CryptoKey AES-GCM.

const MIN_ITERATIONS = 100000;

export async function deriveKey(password, salt, iterations) {
  if (!password || typeof password !== "string") throw new Error("Contrasena requerida");
  if (iterations == null || !(iterations >= MIN_ITERATIONS)) iterations = MIN_ITERATIONS;

  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveBits",
    "deriveKey",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    keyMaterial,
    256
  );
  return crypto.subtle.importKey("raw", bits, { name: "AES-GCM", length: 256 }, false, [
    "decrypt",
    "encrypt",
  ]);
}