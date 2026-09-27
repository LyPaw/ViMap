// Atajos de teclado estilo Windows para el gestor de archivos:
// seleccion multiple, portapapeles interno, crear/renombrar/borrar, abrir,
// navegacion por historia (Alt+flechas) y F5. Un unico listener de documento;
// no aplica nada mientras se escribe en un campo (los atajos nativos siguen
// vivos). Undo/redo (Ctrl+Z/Y) no existe por falta de historial: se documenta
// la limitacion y la tecla se deja pasar.

import { isTypingTarget } from "../core/keyboard.js";
import { toast } from "../core/toast.js";
import { session } from "../crypto/session.js";
import { getActiveWindow } from "./windows.js";
import { setClipboard, clearClipboard, getClipboard } from "./clipboard.js";
import { selectedPaths, hasSelection, selectAll, clearSelection } from "./selection.js";
import {
  requestPaste,
  requestNewFolder,
  requestRename,
  requestDelete,
  requestPurge,
  navHistory,
  navUp,
  refreshAllExplorers,
  openExplorer as openFolder,
} from "./explorer.js";
import { renderDesktop } from "./desktop.js";
import { openEntryAtPath } from "./apps.js";
import { refreshViews } from "./store.js";

function appVisible() {
  const app = document.getElementById("app");
  return app && !app.hidden && session.isUnlocked();
}

function activeView() {
  const win = getActiveWindow();
  if (win && win.el.dataset.kind === "folder" && !win.minimized) {
    const grid = win.el.querySelector(".explorer-icons");
    if (grid) return { container: grid, dir: win.el.dataset.dndDir || "", win };
  }
  const desktop = document.querySelector("#desktop-icons");
  return { container: desktop, dir: desktop ? desktop.dataset.dndDir || "" : "", win: null };
}

function focusedPaths(ev) {
  const item = ev.target && ev.target.closest ? ev.target.closest(".dicon") : null;
  return item && item.dataset && item.dataset.path ? [item.dataset.path] : [];
}

function commitClipboard(mode, av, ev) {
  let paths = selectedPaths(av.container);
  if (!paths.length) paths = focusedPaths(ev);
  if (!paths.length) return false;
  setClipboard(mode, paths);
  toast(mode === "cut" ? "Elementos cortados" : "Elementos copiados", "ok");
  refreshAllExplorers();
  refreshViews();
  return true;
}

function openSelection(paths) {
  const p = paths[0];
  if (!p) return;
  if (session.getDirPaths().includes(p)) openFolder(p);
  else openEntryAtPath(p);
}

// Escape: el menú contextual/Inicio ya se cierran solos; aqui se cancela el
// estado de "cortado" y se limpia la seleccion. Devuelve true si consumo el
// atajo (para que no se cierre ademas la ventana activa).
export function handleShortcutsEscape() {
  let consumed = false;
  const desktop = document.querySelector("#desktop-icons");
  if (desktop && hasSelection(desktop)) {
    clearSelection(desktop);
    consumed = true;
  }
  for (const win of document.querySelectorAll(".win-explorer")) {
    const grid = win.querySelector(".explorer-icons");
    if (grid && hasSelection(grid)) {
      clearSelection(grid);
      consumed = true;
    }
  }
  const clip = getClipboard();
  if (clip && clip.mode === "cut") {
    clearClipboard();
    refreshAllExplorers();
    refreshViews();
    consumed = true;
  }
  return consumed;
}

export function initShortcuts() {
  document.addEventListener("keydown", (ev) => {
    if (!appVisible()) return;
    if (isTypingTarget(ev.target)) return;
    if (ev.defaultPrevented) return;

    const av = activeView();
    const mod = ev.ctrlKey || ev.metaKey;
    const key = ev.key;
    const k = typeof key === "string" ? key.toLowerCase() : "";

    if (ev.key === "Escape") return; // Recuperado por keyboard.js via onEscape.

    if (ev.altKey && !mod && !ev.shiftKey) {
      if (av.win) {
        ev.preventDefault();
        if (key === "ArrowLeft") navHistory(av.win, -1);
        else if (key === "ArrowRight") navHistory(av.win, 1);
        else if (key === "ArrowUp") navUp(av.win);
      }
      return;
    }

    if (mod) {
      if (k === "a") {
        if (av.container) {
          selectAll(av.container);
          ev.preventDefault();
        }
        return;
      }
      if (k === "c" && !ev.shiftKey) {
        if (commitClipboard("copy", av, ev)) ev.preventDefault();
        return;
      }
      if (k === "x" && !ev.shiftKey) {
        if (commitClipboard("cut", av, ev)) ev.preventDefault();
        return;
      }
      if (k === "v") {
        ev.preventDefault();
        requestPaste(av.dir);
        return;
      }
      if (ev.shiftKey && k === "n") {
        ev.preventDefault();
        requestNewFolder(av.dir);
        return;
      }
      return; // Ctrl+Z/Y, Ctrl+R, Ctrl+L etc.: sin interceptar.
    }

    if (key === "F2") {
      const paths = selectedPaths(av.container);
      if (paths.length === 1) requestRename(paths[0]);
      return;
    }
    if (key === "F5") {
      ev.preventDefault();
      refreshAllExplorers();
      renderDesktop();
      return;
    }
    if (key === "Delete" || key === "Backspace") {
      let paths = selectedPaths(av.container);
      if (!paths.length) paths = focusedPaths(ev);
      if (!paths.length) return;
      ev.preventDefault();
      if (ev.shiftKey) requestPurge(paths);
      else requestDelete(paths);
      return;
    }
    if (key === "Enter") {
      const paths = selectedPaths(av.container);
      if (paths.length === 1) {
        ev.preventDefault();
        openSelection(paths);
      }
      return;
    }
  });
}