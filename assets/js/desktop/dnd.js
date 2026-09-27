// Arrastrar y soltar archivos locales sobre el escritorio (raiz) o sobre una
// ventana de carpeta (esa carpeta). El contenido se cifra en el navegador:
// texto si es UTF-8 legible y clasificable, base64 para binarios/imagenes/pdf.
// Respeta el limite de blob del backend (32 MiB del sobre).

import { session } from "../crypto/session.js";
import { classifyFile } from "../core/languages.js";
import { getConfig } from "../config.js";
import { bytesToB64, utf8Decode } from "../core/utils.js";
import { toast } from "../core/toast.js";
import { commit } from "./store.js";

const EXTRA_OVERHEAD = 8192;

function appVisible() {
  const app = document.getElementById("app");
  return app && !app.hidden;
}

function findHost(ev) {
  const node = ev.target && ev.target.closest ? ev.target.closest("[data-dnd-dir]") : null;
  return node;
}

let hoverHost = null;

function clearHover() {
  if (hoverHost) {
    hoverHost.classList.remove("dnd-hover");
    hoverHost = null;
  }
}

const INTERNAL_MIME = "application/x-vimap-paths";

function isInternalDrag(ev) {
  return !!(ev.dataTransfer && [...(ev.dataTransfer.types || [])].includes(INTERNAL_MIME));
}

export function initDnd() {
  document.addEventListener("dragover", (ev) => {
    if (!appVisible()) return;
    if (isInternalDrag(ev)) return;
    if (!ev.dataTransfer || ![...(ev.dataTransfer.types || [])].includes("Files")) return;
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = "copy";
    const host = findHost(ev);
    if (host !== hoverHost) {
      clearHover();
      hoverHost = host;
      if (host) host.classList.add("dnd-hover");
    }
  });
  document.addEventListener("dragleave", (ev) => {
    if (hoverHost && ev.relatedTarget && !hoverHost.contains(ev.relatedTarget)) clearHover();
  });
  document.addEventListener("drop", (ev) => {
    if (!appVisible()) return;
    if (isInternalDrag(ev)) return;
    ev.preventDefault();
    clearHover();
    const files = ev.dataTransfer ? [...(ev.dataTransfer.files || [])] : [];
    if (!files.length) return;
    const host = findHost(ev);
    if (!host) {
      toast("Suelta los archivos sobre el escritorio o una ventana de carpeta", "info", 4000);
      return;
    }
    importFiles(host.dataset.dndDir || "", files);
  });
}

function sanitizeName(name) {
  return String(name || "archivo").replace(/[\\/\u0000-\u001f]/g, "").trim() || "archivo";
}

function b64Len(bytes) {
  return 4 * Math.ceil(bytes / 3);
}

async function importFiles(dir, files) {
  const cfg = getConfig();
  const maxEnv = cfg.maxBlobBytes - EXTRA_OVERHEAD;
  const ok = [];
  const failed = [];

  for (const file of files) {
    const name = sanitizeName(file.name);
    if (file.size && file.size >= cfg.maxBlobBytes) {
      failed.push(name + " (excede " + Math.floor(cfg.maxBlobBytes / (1024 * 1024)) + " MB)");
      continue;
    }
    try {
      const target = session.uniqueName(dir, name);
      const cls = classifyFile({ name });
      const buf = new Uint8Array(await file.arrayBuffer());
      let content;

      if (cls.viewer === "image" || cls.viewer === "pdf") {
        if (b64Len(buf.length) > maxEnv) throw new Error("demasiado grande");
        content = bytesToB64(buf);
      } else {
        let text = null;
        try {
          text = utf8Decode(buf);
        } catch {
          /* binario */
        }
        if (text !== null) {
          if (new TextEncoder().encode(text).length > maxEnv) throw new Error("demasiado grande");
          content = text;
        } else {
          if (b64Len(buf.length) > maxEnv) throw new Error("demasiado grande");
          content = bytesToB64(buf);
        }
      }
      await session.createFile(target, content);
      ok.push(name);
    } catch (err) {
      failed.push(name + (err && err.message ? " (" + err.message + ")" : ""));
    }
  }

  if (ok.length) {
    const saved = await commit();
    if (saved) {
      toast("Importados " + ok.length + (ok.length === 1 ? " archivo" : " archivos") + " y cifrados", "ok", 4200);
    }
  }
  if (failed.length) {
    toast("No se pudo importar: " + failed.join(", "), "error", 7000);
  }
}