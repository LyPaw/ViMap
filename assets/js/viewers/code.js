// Visor de codigo: highlight.js con resaltado lazy, numeros de linea, ajuste de
// linea y lista de "saltos a linea" cuando una ruta cifrada referencia este archivo.
// El contenido se pinta siempre escapado y con textContent tras montar el DOM.

import { el, esc } from "../core/utils.js";
import { highlightJsReady, ensureGrammar } from "../vendor.js";
import { toast } from "../core/toast.js";

let count = 0;

export async function render(entry, container, ctx) {
  container.textContent = "";
  const text = entry.fetch
    ? await entry.fetch()
    : await fetch(entry.downloadUrl || entry.path, { cache: "no-store" }).then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      });
  count = (text.match(/\n/g) || []).length + 1;

  await highlightJsReady();
  if (entry.hljs) {
    await ensureGrammar(entry.hljs).catch((err) => console.warn("[hljs]", err));
  }

  const wrap = el("div", { class: "code-wrap", "data-wrap": ctx && ctx.wrap ? "1" : "0" });
  const table = el("table", { class: "code-table", "aria-label": "Codigo: " + entry.name });
  const tbody = el("tbody");

  let line = 1;
  for (const chunk of text.split("\n")) {
    const tr = el("tr", { class: "code-line", id: entry.id + "-L" + line });
    tr.append(
      el("td", { class: "lineno", "aria-hidden": "true" }, [String(line)]),
      el("td", { class: "hljs lang-" + (entry.hljs || "plaintext") }, [esc(chunk) || " "])
    );
    tbody.append(tr);
    line += 1;
  }
  table.append(tbody);
  wrap.append(table);
  container.append(wrap);

  if (window.hljs && entry.hljs) {
    requestAnimationFrame(() => {
      for (const cell of table.querySelectorAll("td.hljs")) {
        try {
          window.hljs.highlightElement(cell);
        } catch (err) {
          /* sin resaltado para esta gramatica */
        }
      }
    });
  }

  if (ctx && ctx.onData) ctx.onData({ size: text.length, lines: count });
}
