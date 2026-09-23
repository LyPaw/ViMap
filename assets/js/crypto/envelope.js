// Sobre cifrado v1 — formato documentado en docs/encrypted-format.md.
// Contiene SOLO parametros criptograficos (nunca la contrasena ni claves derivadas).

export class EnvelopeFormatError extends Error {
  constructor(message) {
    super(message);
    this.name = "EnvelopeFormatError";
    this.code = "FORMAT_INVALID";
  }
}

const REQUIRED_KDF_FIELDS = ["salt", "iterations"];
const REQUIRED_ENVELOPE_FIELDS = ["algo", "kdf", "iv", "ciphertext"];

export function parseEnvelope(obj) {
  if (!obj || typeof obj !== "object") throw new EnvelopeFormatError("Sobre invalido");
  if (obj.version !== 1) throw new EnvelopeFormatError("Version de sobre no soportada");

  for (const f of REQUIRED_ENVELOPE_FIELDS) {
    if (obj[f] == null || obj[f] === "") throw new EnvelopeFormatError("Campo de sobre ausente: " + f);
  }
  if (obj.algo !== "AES-256-GCM") throw new EnvelopeFormatError("Algoritmo no soportado");

  const kdf = obj.kdf;
  if (!kdf || typeof kdf !== "object") throw new EnvelopeFormatError("KDF invalido");
  if (kdf.name !== "PBKDF2" || kdf.hash !== "SHA-256") throw new EnvelopeFormatError("KDF no soportado");
  for (const f of REQUIRED_KDF_FIELDS) {
    if (kdf[f] == null || kdf[f] === "") throw new EnvelopeFormatError("Campo KDF ausente: " + f);
  }
  if (!Number.isInteger(kdf.iterations) || kdf.iterations < 10000) {
    throw new EnvelopeFormatError("Iteraciones fuera de rango");
  }
  if (typeof obj.iv !== "string" || obj.iv.length < 8) throw new EnvelopeFormatError("IV invalido");
  if (typeof obj.ciphertext !== "string" || obj.ciphertext.length < 16) {
    throw new EnvelopeFormatError("Ciphertext invalido");
  }

  return {
    version: 1,
    algo: "AES-256-GCM",
    kdf: { name: "PBKDF2", hash: "SHA-256", salt: kdf.salt, iterations: kdf.iterations },
    iv: obj.iv,
    ciphertext: obj.ciphertext,
  };
}

export function parseEnvelopeText(jsonText) {
  let obj;
  try {
    obj = JSON.parse(jsonText);
  } catch {
    throw new EnvelopeFormatError("Sobre no es JSON valido");
  }
  return parseEnvelope(obj);
}