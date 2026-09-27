// Portapapeles interno del escritorio: cortar/copiar/pegar entre carpetas.
// Guarda rutas (no contenido) y el modo; el pegado lo ejecuta el explorador.

let clip = null;

function dirOf(p) {
  const i = String(p).lastIndexOf("/");
  return i >= 0 ? p.slice(0, i) : "";
}

export function setClipboard(mode, paths) {
  clip = { mode, paths: [...paths], sourceDir: dirOf(paths[0] || ""), at: Date.now() };
}

export function getClipboard() {
  return clip;
}

export function clipboardInfo() {
  if (!clip) return null;
  return {
    operation: clip.mode,
    itemIds: [...clip.paths],
    sourceFolderId: clip.sourceDir,
    timestamp: clip.at,
  };
}

export function clearClipboard() {
  clip = null;
}

export function hasClipboard() {
  return !!(clip && clip.paths && clip.paths.length);
}

export function clipboardLabel() {
  if (!clip) return "";
  const n = clip.paths.length;
  const what = n + (n === 1 ? " elemento" : " elementos");
  return clip.mode === "cut" ? "Pegar " + what + " (cortados)" : "Pegar " + what;
}

export function consumePaste() {
  // El pegado tras "cortar" mueve; el portapapeles de "cortar" se limpia al pegar.
  const wasCut = clip && clip.mode === "cut";
  clip = null;
  return wasCut;
}