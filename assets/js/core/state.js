// Preferencias locales NO sensibles (tema). Nunca se guardan aqui contrasenas,
// claves ni contenido descifrado.

const KEYS = {
  theme: "vimap.theme",
  rmotion: "vimap.reduceMotion",
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
  getReduceMotion() {
    return read(KEYS.rmotion);
  },
  setReduceMotion(v) {
    write(KEYS.rmotion, v);
  },
};