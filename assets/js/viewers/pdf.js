// Visor PDF via <embed>/<iframe> con tooltip de descarga. No requiere libreria.
import { el } from "../core/utils.js";

export async function render(entry, container, ctx) {
  container.textContent = "";
  const url = entry.downloadUrl || entry.path;
  const frame = el("iframe", {
    src: url,
    class: "viewer-pdf",
    title: "Documento PDF: " + entry.name,
    loading: "lazy",
  });
  container.append(frame);
  if (ctx && ctx.onData) ctx.onData({ size: null });
}