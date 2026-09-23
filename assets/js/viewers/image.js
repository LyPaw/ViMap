 // Visor de imagenes (png/jpg/gif/webp/svg/bmp). La miniatura en arboles usa
// la URL de descarga directa; aqui ampliamos la imagen completa con borde de imagen para codigo de referencia.
import { el } from "../core/utils.js";
import { toast } from "../core/toast.js";

export async function render(entry, container, ctx) {
  container.textContent = "";
  const url = entry.downloadUrl || entry.path;
  const img = el("img", {
    src: url,
    alt: "Imagen " + entry.name,
    class: "viewer-image",
    loading: "lazy",
  });
  container.append(img);
  if (ctx && ctx.onData) ctx.onData({ size: null });
}