// El escritorio: iconos de la raiz (carpetas y archivos) + iconos de sistema
// (papelera), seleccion multiple, doble clic para abrir, menu contextual,
// atajos de teclado propios de icono y objetivo de arrastre para importar
// archivos a la raiz.

import { session } from "../crypto/session.js";
import { el, dirName, formatBytes } from "../core/utils.js";
import { showItemCtx, showDirCtx, openExplorer } from "./explorer.js";
import { openEntryAtPath, openTrashWindow } from "./apps.js";
import { iconSvg } from "./icons.js";
import { onStoreChange } from "./store.js";
import { getClipboard } from "./clipboard.js";
import { clickSelect, clearSelection, reapplySelection } from "./selection.js";
import { consumeSuppressClick } from "./vault-dnd.js";

const FILE_ICON = {
  md: "note",
  text: "note",
  code: "code",
  image: "image",
  pdf: "pdf",
  binary: "binary",
};

let container = null;

export function initDesktop() {
  container = document.querySelector("#desktop-icons");
  container.dataset.dndDir = "";
  renderDesktop();
  document.addEventListener("vimap:refresh-views", renderDesktop);

  container.addEventListener("click", (ev) => {
    if (consumeSuppressClick()) return;
    const item = ev.target.closest(".dicon");
    if (!item) {
      clearSelection(container);
      return;
    }
    clickSelect(container, item, { ctrl: ev.ctrlKey || ev.metaKey, shift: ev.shiftKey });
  });
  container.addEventListener("dblclick", (ev) => {
    const item = ev.target.closest(".dicon");
    if (!item) return;
    item.classList.remove("selected");
    openIcon(item);
  });
  container.addEventListener("keydown", (ev) => {
    const item = ev.target && ev.target.closest ? ev.target.closest(".dicon") : null;
    if (!item) return;
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      ev.stopPropagation();
      openIcon(item);
    } else if (ev.key === "ContextMenu" || (ev.shiftKey && ev.key === "F10")) {
      ev.preventDefault();
      const r = item.getBoundingClientRect();
      const datum = item.dataset;
      if (datum && datum.kind !== "system") showItemCtx(r.left, r.bottom, datum, "", { el: item, container });
      else showDirCtx(r.left, r.bottom, "");
    }
  });
  container.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
    const item = ev.target.closest(".dicon");
    const datum = item ? item.dataset : null;
    if (datum && datum.kind !== "system") {
      showItemCtx(ev.clientX, ev.clientY, datum, "", item ? { el: item, container } : null);
    } else {
      showDirCtx(ev.clientX, ev.clientY, "");
    }
  });

  onStoreChange(renderDesktop);
}

function openIcon(item) {
  if (item.dataset.kind === "system") {
    openTrashWindow();
  } else if (item.dataset.kind === "dir") {
    openExplorer(item.dataset.path);
  } else if (item.dataset.kind === "file") {
    openEntryAtPath(item.dataset.path);
  }
}

function fileIcon(viewer) {
  return FILE_ICON[viewer] || "file";
}

function addIcon(kind, label, icon, path) {
  const it = el("div", {
    class: "dicon",
    dataset: { kind, path: path || "" },
    tabindex: "0",
    role: "button",
    draggable: "true",
    "aria-label": label,
  });
  const img = el("div", { class: "dicon-img" });
  img.innerHTML = iconSvg(icon);
  it.append(img, el("span", { class: "dicon-label", text: label }));
  return it;
}

export function renderDesktop() {
  if (!container) return;
  container.textContent = "";

  container.appendChild(addIcon("system", "Papelera", "trash", ""));

  const cutPaths = (() => {
    const c = getClipboard();
    return c && c.mode === "cut" ? new Set(c.paths) : null;
  })();

  const rootDirs = session
    .getDirPaths()
    .filter((d) => !d.includes("/"))
    .sort((a, b) => a.localeCompare(b));
  for (const d of rootDirs) {
    const it = addIcon("dir", d, "folder", d);
    if (cutPaths && cutPaths.has(d)) it.classList.add("cut");
    container.appendChild(it);
  }

  const rootFiles = session
    .getEntries()
    .filter((e) => dirName(e.path) === "" && !e.trashedAt)
    .sort((a, b) => a.name.localeCompare(b.name));
  for (const f of rootFiles) {
    const it = addIcon("file", f.name, fileIcon(f.viewer), f.path);
    it.title = f.name + (f.size != null ? "  ·  " + formatBytes(f.size) : "");
    if (cutPaths && cutPaths.has(f.path)) it.classList.add("cut");
    container.appendChild(it);
  }

  const anyContent = session.getEntries().length > 0 || session.getDirPaths().length > 0;
  const hint = container.querySelector("#desktop-hint");
  if (!anyContent && !hint) {
    const h = el("div", { id: "desktop-hint", class: "desktop-hint" });
    h.appendChild(
      el("p", {}, ["Tu vault esta vacio."]),
      el("p", { class: "muted" }, ["Crea archivos con el menu contextual, o arrastra archivos locales aqui para cifrarlos en tu navegador."])
    );
    container.appendChild(h);
  } else if (hint && anyContent) {
    hint.remove();
  }

  reapplySelection(container);
}