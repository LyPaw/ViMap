// Configuracion publica de la aplicacion (config/public-config.json).
// Modulo puro de datos: no importa DOM.

const DEFAULTS = {
  version: 1,
  appName: "ViMap",
  description: "Archivo personal de notas y codigo",
  defaultTheme: "system",
  themes: ["light", "dark", "system"],
  manifestPath: "public/manifest.json",
  vaultsIndexPath: "public/vaults.json",
  passwordIterations: 310000,
  cryptoEnvelopeVersion: 1,
  encryptedSuffix: ".enc",
  search: { maxContentScan: 300, maxResults: 80 },
  security: { maxAttemptsNotice: 5, riskAcceptanceKey: "vimap.crypto.risk-accepted" },
};

let cache = null;

export async function loadConfig() {
  if (cache) return cache;
  try {
    const res = await fetch("config/public-config.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cache = { ...DEFAULTS, ...data, search: { ...DEFAULTS.search, ...(data.search || {}) }, security: { ...DEFAULTS.security, ...(data.security || {}) } };
  } catch (err) {
    console.warn("[config] no se pudo cargar public-config.json; usando valores por defecto:", err);
    cache = DEFAULTS;
  }
  return cache;
}

export function getConfig() {
  return cache || DEFAULTS;
}