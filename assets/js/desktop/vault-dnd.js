// Arrastrar y soltar ELEMENTOS del vault (escritorio y ventanas de carpeta),
// diferenciandolo del DnD de archivos locales de dnd.js (que sigue intacto).
// Mueve por defecto: actualiza las rutas existentes, sin crear copias, IDs ni
// registros nuevos. Un unico juego de listeners en el documento, sin
// re-registros al navegar.

import { session } from "../crypto/session.js";
import { dirName } from "../core/utils.js";
import { toast } from "../core/toast.js";
import { commit, refreshViews } from "./store.js";
import { selectedPaths, selectPaths } from "./selection.js";
import { refreshAllExplorers } from "./explorer.js";

const MIME = "application/x-vimap-paths";

let dragPaths = null;
let hoverEl = null;
// Se activa al soltar con exito: el click que algunos navegadores emiten tras
// el drag no debe colapsar la seleccion. Se consume una sola vez, sin timers.
let suppressClick = false;

export function consumeSuppressClick() {
  const v = suppressClick;
  suppressClick = false;
  return v;
}

function setHover(el) {
  if (hoverEl === el) return;
  clearHover();
  if (el && el.classList) el.classList.add("dnd-hover");
  hoverEl = el;
}

function clearHover() {
  if (hoverEl && hoverEl.classList) hoverEl.classList.remove("dnd-hover");
  hoverEl = null;
}

// Un arrastre interno lleva el MIME propio; los arrastres del SO no.
function isInternal(ev) {
  return !!(ev.dataTransfer && [...(ev.dataTransfer.types || [])].includes(MIME));
}

function resolveTarget(ev) {
  const node = ev.target && ev.target.closest ? ev.target : null;
  if (!node) return null;

  const anyDicon = node.closest(".dicon");
  if (anyDicon) {
    if (anyDicon.dataset.kind === "system") return null;
    if (anyDicon.dataset.kind === "dir") return { dir: anyDicon.dataset.path, el: anyDicon };
    // Soltar sobre un archivo: se redirige a la carpeta contenedora.
  }

  const win = node.closest(".win-explorer");
  if (win) {
    const grid = win.querySelector(".explorer-icons");
    return { dir: win.dataset.dndDir || "", el: grid };
  }

  const desktop = node.closest("#desktop-icons");
  if (desktop) return { dir: "", el: desktop };

  return null;
}

function canDrop(paths, dir) {
  for (const p of paths) {
    if (p === dir) return false;
    if (dir.startsWith(p + "/")) return false;
  }
  return true;
}

export function initVaultDnd() {
  // Un clic real siempre va precedido de mousedown; el clic sintetizado que
  // algunos navegadores emiten tras un drop, no. Asi el flag solo suprime ese.
  document.addEventListener(
    "mousedown",
    () => {
      suppressClick = false;
    },
    true
  );
  document.addEventListener("dragstart", (ev) => {
    const item = ev.target && ev.target.closest ? ev.target.closest(".dicon") : null;
    if (!item || !item.dataset || item.dataset.path === "") return;
    const container = item.closest(".explorer-icons") || item.closest("#desktop-icons");
    let paths;
    if (container && item.classList.contains("selected")) {
      // Arrastrar desde la seleccion: se mueven todos los seleccionados.
      paths = selectedPaths(container);
      if (!paths.length) paths = [item.dataset.path];
    } else {
      // Arrastrar desde un elemento no seleccionado: seleccionarlo solo a el
      // primero y arrastrar ese conjunto.
      if (container) selectPaths(container, [item.dataset.path]);
      paths = [item.dataset.path];
    }
    dragPaths = paths;
    ev.dataTransfer.setData(MIME, JSON.stringify(paths));
    ev.dataTransfer.setData("text/plain", item.dataset.path);
    ev.dataTransfer.effectAllowed = "move";
  });

  document.addEventListener("dragover", (ev) => {
    if (!dragPaths || !isInternal(ev)) return;
    const target = resolveTarget(ev);
    if (target && canDrop(dragPaths, target.dir)) {
      ev.preventDefault();
      if (ev.dataTransfer) ev.dataTransfer.dropEffect = "move";
      setHover(target.el);
    } else {
      clearHover();
    }
  });

  document.addEventListener("dragleave", (ev) => {
    if (hoverEl && ev.relatedTarget && !hoverEl.contains(ev.relatedTarget)) clearHover();
  });

  document.addEventListener("drop", async (ev) => {
    if (!dragPaths || !isInternal(ev)) return;
    const target = resolveTarget(ev);
    clearHover();
    if (!target || !canDrop(dragPaths, target.dir)) {
      dragPaths = null;
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    const paths = dragPaths;
    // Consumir el estado ANTES del await: un segundo drop no puede reprocesar.
    dragPaths = null;
    // Soltar en la carpeta donde ya estan: no-op, sin renombres ni duplicados.
    const toMove = paths.filter((p) => dirName(p) !== target.dir);
    if (!toMove.length) return;
    suppressClick = true;
    try {
      const count = session.moveEntries(toMove, target.dir);
      refreshAllExplorers();
      refreshViews();
      if (await commit()) {
        if (count > 0) toast(count === 1 ? "Movido" : "Movidos " + count + " elementos", "ok");
      }
    } catch (err) {
      toast(err.message, "error");
    } finally {
      clearHover();
      dragPaths = null;
    }
  });

  document.addEventListener("dragend", () => {
    dragPaths = null;
    clearHover();
  });
}
