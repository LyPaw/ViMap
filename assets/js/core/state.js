// Preferencias locales NO sensibles (tema, aceptacion de riesgos).
// Nunca se guardan aqui contrasenas, claves ni contenido descifrado.

const KEYS = {
  theme: "vimap.theme",
  riskAccepted: "vimap.crypto.risk-accepted",
};

function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* almacenamiento no disponible: la preferencia dura solo la sesion */
  }
}

export const store = {
  getTheme() {
    return read(KEYS.theme);
  },
  setTheme(t) {
    write(KEYS.theme, t);
  },
  isRiskAccepted() {
    return read(KEYS.riskAccepted) === "1";
  },
  setRiskAccepted() {
    write(KEYS.riskAccepted, "1");
  },
};