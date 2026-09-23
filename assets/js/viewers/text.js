
// Visor de archivos de texto plano (config, env, csv, log, etc.).
// El HTML se escapa siempre: esta app nunca pinta contenido no saneado.

import { esc, el } from "../core/utils.js";
import { toast } from "../core/toast.js";

export async function render(entry, container, ctx) {
  const res = await fetch(entry.downloadUrl || entry.path, { cache: "no-store" });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const text = await res.text();

  container.textContent = "";
  const pre = el("pre", { class: "text-pre" },
    el("code", { class: "lang-" + (entry.hljs || "plaintext") }, [esc(text)])
  );
  container.appendChild(pre);

  if (ctx && ctx.onData) ctx.onData({ size: text.length });
}