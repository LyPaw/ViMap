// Registro de visores: mapea entry.viewer (md, code, text, image, pdf, binary)
// a su modulo de renderizado, cargado de forma perezosa para no pagar todo
// el peso del renderizador en el arranque.

const REGISTRY = {
  md: () => import("./markdown.js"),
  code: () => import("./code.js"),
  text: () => import("./text.js"),
  image: () => import("./image.js"),
  pdf: () => import("./pdf.js"),
  binary: () => import("./binary.js"),
};

const loaded = new Map();

export async function getViewer(viewer) {
  if (!viewer || !REGISTRY[viewer]) return null;
  if (!loaded.has(viewer)) loaded.set(viewer, REGISTRY[viewer]());
  return loaded.get(viewer);
}

export async function render(viewer, entry, container, ctx) {
  const mod = await getViewer(viewer);
  if (!mod) {
    container.textContent = "Sin visor disponible para este archivo";
    return;
  }
  await mod.render(entry, container, ctx);
}
