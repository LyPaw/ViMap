// Visor Markdown: marked + DOMPurify + resaltado de bloques de codigo (highlight.js).
// Monta: header de accion (copiar/descargar), breadcrumb de la nota y el HTML sanitizado.
// Nunca usa innerHTML con datos sin sanear; las rutas de imagen/enlace se reescriben
// para que apunten a la descarga real del archivo dentro de esta boveda (o public).

import { markedReady, dompurifyReady, highlightJsReady } from "../vendor.js";
import { esc, el, baseName, dirName } from "../core/utils.js";
import { classifyFile } from "../core/languages.js";

export async function render(entry, container, ctx) {
  const [marked, purify, hljsReady] = await Promise.all([
    markedReady(),
    dompurifyReady(),
    highlightJsReady(),
  ]);
  void marked; void purify; void hljsReady;
  await hljsReady;

  const text = await entry.fetch();
  const html = renderSafeMarkdown(text, entry);
  container.textContent = "";

  const breadcrumb = el("div", { class: "md-breadcrumb" }, [
    esc(dirName(entry.path)) || esc("~"),
  ]);
  const meta = el("div", { class: "md-meta" }, [
    esc(entry.name),
    entry.updatedAt ? " · " + esc(entry.updatedAt) : "",
  ]);

  const article = el("article", { class: "md-body", "aria-label": "Contenido Markdown" });
  article.innerHTML = html;

  container.append(breadcrumb, meta, articleapsed);
  wireAnchors(articlePreview);
}

function renderSafeMarkdown(text, entry) {
  const raw = window.marked.parse(text, { gfm: true, breaks: false });
  // Reescritura de rutas relativas: las imagenes/enlaces internos apuntan al archivo real.
  let html = raw.replace(/(\bsrc|href)="([^"]+)"/g, (m, attr, href) => {
    if (!href || /^(https?:|data:|#|\/|mailto:)/.test(href)) return m;
    const parts = href.split("#")[0];
    const hash = href.includes("#") ? href.slice(href.indexOf("#")) : "";
    const target = ctx && ctx.byPath && ctx.byPath.get(parts)
      ? ctx.byPath.get(parts).downloadUrl
      : "../" + parts;
    return `${attr}="${target}${hash}"`;
  });
  return window.DOMPurify.sanitize(html, {
    ADD_ATTR: ["target", "class", "id", "data-*"],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|data:image\/|\/|#)/i,
  });
}

function wireAnchors(root) {
  // Desplazamiento suave + actualizacion del TOC (si existe).
  root.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((h) => {
    if (!h.id) h.id = "h-" + Math.random().toString(36).slice(2, 8);
  });
}
