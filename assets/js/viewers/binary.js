// Visor de archivos binarios no clasificados: no se intenta renderizar,
// solo ofrece descarga. La parte de descarga vive en main.js (btn-download).
import { el } from "../core/utils.js";

export async function render(entry, container, ctx) {
  container.textContent = "";
  container.append(
    el("div", { class: "viewer-binary" }, [
      el("p", {}, ["Este tipo de archivo no tiene vista previa en el navegador."]),
      el("p", { class: "muted" }, ["Usa el boton de descarga para obtener una copia local."]),
    ])
  );
  if (ctx && ctx.onData) ctx.onData({ size: null });
}