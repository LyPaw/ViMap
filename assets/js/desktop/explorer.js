// Explorador de carpetas: ventana con iconos en rejilla, ruta editable,
// toolbar (subir, nueva carpeta/archivo, pegar), menu contextual por elemento
// y por zona vacia, portapapeles interno (cortar/copiar/pegar), seleccion
// multiple y atajos reutilizables desde el escritorio (F2, Supr, Ctrl+V...).

import { session } from "../crypto/session.js";
import { el, baseName, dirName, formatBytes } from "../core/utils.js";
import { toast } from "../core/toast.js";
import { openWindow, getWindow, focusWindow, setWindowId, closeWindow, closeWindowById, closeWindowsByPrefix } from "./windows.js";
import { showContextMenu } from "./context-menu.js";
import { askConfirm, promptInput } from "./dialogs.js";
import { setClipboard, clearClipboard, getClipboard, hasClipboard, clipboardLabel } from "./clipboard.js";
import { commit, onStoreChange, refreshViews } from "./store.js";
import { clickSelect, selectedPaths, clearViewSelection, reapplySelection } from "./selection.js";
import { consumeSuppressClick } from "./vault-dnd.js";
import { openFileWindow, openVersionsWindow, openEntryAtPath, downloadStored } from "./apps.js";
import { iconSvg } from "./icons.js";

const FILE_ICON = {
  md: "note",
  text: "note",
  code: "code",
  image: "image",
  pdf: "pdf",
  binary: "binary",
};

const openExplorers = new Map(); // id -> win

function fileIcon(viewer) {
  return FILE_ICON[viewer] || "file";
}

function knownDirs() {
  const s = new Set();
  for (const d of session.getDirPaths()) s.add(d);
  for (const e of session.getEntries()) {
    let p = dirName(e.path);
    while (p) {
      s.add(p);
      p = dirName(p);
    }
  }
  return s;
}

function dirExists(p) {
  return p === "" || knownDirs().has(p);
}

function normalizeDir(p) {
  return String(p || "").trim().replace(/(^\/+|\/+$)/g, "");
}

// Menus contextuales reutilizables (tambien desde el escritorio).
export function showItemCtx(x, y, item, dir, context) {
  gridCtx(x, y, item, dir, context || null);
}

export function showDirCtx(x, y, dir) {
  gridCtx(x, y, null, dir, null);
}

export function desktopNewFile(dir) {
  return newFileIn(dir);
}

export function desktopNewFolder(dir) {
  return newFolderIn(dir);
}

export function desktopPaste(dir) {
  return handlePaste(dir);
}

// Acciones reutilizables por los atajos globales y el drag&drop.
export function requestNewFile(dir) {
  return newFileIn(dir);
}

export function requestNewFolder(dir) {
  return newFolderIn(dir);
}

export function requestRename(path) {
  return renameEntry(path);
}

export function requestDelete(paths) {
  return deleteEntries(paths);
}

export function requestPurge(paths) {
  return purgeEntries(paths);
}

export function requestPaste(dir) {
  return handlePaste(dir);
}

export function refreshAllExplorers() {
  for (const [dir, win] of [...openExplorers]) {
    if (getWindow(win.id)) renderExplorer(win.body, win, dir);
  }
}

export function navHistory(win, delta) {
  if (!win) return false;
  const back = (win._histBack = win._histBack || []);
  const fwd = (win._histFwd = win._histFwd || []);
  const cur = win.el.dataset.dndDir || "";
  if (delta < 0) {
    if (!back.length) return false;
    const dir = back.pop();
    fwd.push(cur);
    renderTarget(win, dir);
    return true;
  }
  if (!fwd.length) return false;
  const dir = fwd.pop();
  back.push(cur);
  renderTarget(win, dir);
  return true;
}

export function navUp(win) {
  if (!win) return false;
  const parent = dirName(win.el.dataset.dndDir || "");
  if (!parent) {
    closeWindow(win);
    return true;
  }
  navigate(win, parent);
  return true;
}

export function openExplorer(dir) {
  dir = normalizeDir(dir);
  if (!dir) return null;
  if (openExplorers.has(dir)) {
    focusWindow(openExplorers.get(dir));
    return openExplorers.get(dir);
  }
  const win = openWindow({
    id: "folder:" + dir,
    title: baseName(dir) + " — Archivos",
    icon: iconSvg("folderOpen"),
    width: 620,
    height: 440,
    extraClass: "win-explorer",
    onClose: () => {
      openExplorers.delete(dir);
    },
    content: (body, win) => {
      openExplorers.set(dir, win);
      win.el.dataset.kind = "folder";
      renderExplorer(body, win, dir);
    },
  });
  return win;
}

function iconBtn(label, icon) {
  const b = el("button", { class: "btn btn-ghost btn-sm", type: "button", title: label });
  b.innerHTML = iconSvg(icon);
  b.appendChild(el("span", { class: "btn-label", text: label }));
  return b;
}

// Vista de rejilla/lista + orden: preferencia UI por ventana (persiste global).
const VIEW_KEY = "vimap.explorerView";

function defaultView() {
  return { mode: "grid", sort: "name", dir: 1 };
}

function loadView(cur) {
  if (cur && (cur.mode === "grid" || cur.mode === "list")) return cur;
  try {
    const s = JSON.parse(localStorage.getItem(VIEW_KEY));
    if (s && (s.mode === "grid" || s.mode === "list") && ["name", "date", "size"].includes(s.sort)) {
      return { mode: s.mode, sort: s.sort, dir: s.dir === -1 ? -1 : 1 };
    }
  } catch {
    /* sin preferencia guardada */
  }
  return defaultView();
}

function saveView(view) {
  try {
    localStorage.setItem(VIEW_KEY, JSON.stringify(view));
  } catch {
    /* almacenamiento no disponible */
  }
}

function renderExplorer(body, win, dir) {
  body.textContent = "";
  win.el.dataset.dndDir = dir;
  win.title = baseName(dir || "Vault") + " — Archivos";
  const titleEl = win.el.querySelector(".win-title");
  if (titleEl) titleEl.textContent = win.title;

  const upBtn = iconBtn("Subir", "up");
  const pathInput = el("input", {
    type: "text",
    class: "explorer-path",
    value: dir,
    autocomplete: "off",
    autocapitalize: "off",
    spellcheck: "false",
    "aria-label": "Ruta de la carpeta",
  });
  const newFileBtn = iconBtn("Archivo", "newFile");
  const newFolderBtn = iconBtn("Carpeta", "newFolder");
  const pasteBtn = iconBtn(clipboardLabel() || "Pegar", "paste");
  pasteBtn.disabled = !hasClipboard();

  const view = (win._view = loadView(win._view));
  const viewBtn = iconBtn(view.mode === "grid" ? "Lista" : "Rejilla", view.mode === "grid" ? "viewList" : "viewGrid");
  const sortSel = el("select", { class: "explorer-sort", "aria-label": "Ordenar por" }, [
    el("option", { value: "name", text: "Nombre" }),
    el("option", { value: "date", text: "Fecha" }),
    el("option", { value: "size", text: "Tamaño" }),
  ]);
  sortSel.value = view.sort;
  const dirBtn = el("button", {
    class: "btn btn-ghost btn-sm",
    type: "button",
    title: view.dir === 1 ? "Ascendente" : "Descendente",
    "aria-label": "Cambiar orden",
    text: view.dir === 1 ? "↑" : "↓",
  });
  const viewBox = el("div", { class: "explorer-viewopts" }, [viewBtn, sortSel, dirBtn]);

  const toolbar = el("div", { class: "explorer-toolbar" }, [upBtn, pathInput, newFileBtn, newFolderBtn, pasteBtn, viewBox]);
  const grid = el("div", {
    class: view.mode === "list" ? "explorer-list" : "explorer-icons",
    "aria-label": "Contenido de " + (dir || "raiz"),
  });

  upBtn.addEventListener("click", () => {
    const parent = dirName(dir);
    if (!parent) closeWindow(win);
    else navigate(win, parent);
  });
  pathInput.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      const target = normalizeDir(pathInput.value);
      if (target === dir) return;
      if (!target) closeWindow(win);
      else if (dirExists(target)) navigate(win, target);
      else toast("La carpeta no existe", "warn");
    }
  });
  newFileBtn.addEventListener("click", () => newFileIn(dir, win));
  newFolderBtn.addEventListener("click", () => newFolderIn(dir));
  pasteBtn.addEventListener("click", () => handlePaste(dir));

  viewBtn.addEventListener("click", () => {
    win._view = { ...view, mode: view.mode === "grid" ? "list" : "grid" };
    saveView(win._view);
    renderExplorer(body, win, dir);
  });
  sortSel.addEventListener("change", () => {
    win._view = { ...view, sort: sortSel.value };
    saveView(win._view);
    renderExplorer(body, win, dir);
  });
  dirBtn.addEventListener("click", () => {
    win._view = { ...view, dir: view.dir === 1 ? -1 : 1 };
    saveView(win._view);
    renderExplorer(body, win, dir);
  });

  body.append(toolbar, grid);
  renderList(grid, dir, view);

  grid.addEventListener("click", (ev) => {
    if (consumeSuppressClick()) return;
    const item = ev.target.closest(".dicon");
    if (!item) {
      clearViewSelection(win.el);
      return;
    }
    clickSelect(grid, item, { ctrl: ev.ctrlKey || ev.metaKey, shift: ev.shiftKey });
  });
  grid.addEventListener("dblclick", (ev) => {
    const item = ev.target.closest(".dicon");
    if (!item) return;
    item.classList.remove("selected");
    if (item.dataset.kind === "dir") navigate(win, item.dataset.path);
    else openEntryAtPath(item.dataset.path);
  });
  grid.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
    const item = ev.target.closest(".dicon");
    gridCtx(ev.clientX, ev.clientY, item ? item.dataset : null, dir, item ? { el: item, container: grid } : null);
  });
  grid.addEventListener("keydown", (ev) => {
    const item = ev.target && ev.target.closest ? ev.target.closest(".dicon") : null;
    if (!item) return;
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      ev.stopPropagation();
      openEntryPoint(item);
    }
  });
}

function openEntryPoint(item) {
  if (item.dataset.kind === "dir") {
    const win = openExplorer(item.dataset.path);
    if (win) navigate(win, item.dataset.path);
  } else {
    openEntryAtPath(item.dataset.path);
  }
}

function navigate(win, dir) {
  dir = normalizeDir(dir);
  const prev = win.el.dataset.dndDir || "";
  if (!dir) {
    closeWindow(win);
    return;
  }
  if (dir === prev) {
    renderExplorer(win.body, win, dir);
    return;
  }
  const back = (win._histBack = win._histBack || []);
  if (back[back.length - 1] !== prev) back.push(prev);
  renderTarget(win, dir);
}

function renderTarget(win, dir) {
  const prev = win.el.dataset.dndDir || "";
  // Cambiar de carpeta invalida la seleccion de la vista anterior.
  clearViewSelection(win.el);
  openExplorers.delete(prev);
  openExplorers.set(dir, win);
  setWindowId(win, "folder:" + dir);
  renderExplorer(win.body, win, dir);
}

export function renderList(grid, dir, view) {
  const cutPaths = (() => {
    const c = getClipboard();
    return c && c.mode === "cut" ? new Set(c.paths) : null;
  })();
  const mode = view && view.mode === "list" ? "list" : "grid";
  const sort = view && ["name", "date", "size"].includes(view.sort) ? view.sort : "name";
  const mul = view && view.dir === -1 ? -1 : 1;

  const byName = (a, b) => mul * baseName(a).localeCompare(baseName(b));
  const dirs = session
    .getDirPaths()
    .filter((d) => dirName(d) === dir)
    .sort(byName);
  const files = session
    .getEntries()
    .filter((e) => dirName(e.path) === dir)
    .sort((a, b) => {
      if (sort === "date") return mul * String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
      if (sort === "size") return mul * ((b.size || 0) - (a.size || 0));
      return mul * a.name.localeCompare(b.name);
    });

  if (!dirs.length && !files.length) {
    grid.appendChild(
      el("p", {
        class: "explorer-empty muted",
        text: dir ? "Esta carpeta esta vacia" : "Tu vault esta vacio. Arrastra archivos locales o usa el menu contextual.",
      })
    );
    return;
  }

  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return "";
    }
  };

  for (const d of dirs) {
    const it = el("div", { class: "dicon", dataset: { kind: "dir", path: d }, draggable: "true", tabindex: "0", role: "button", "aria-label": baseName(d) });
    const img = el("div", { class: "dicon-img" });
    img.innerHTML = iconSvg("folder");
    it.append(img, el("span", { class: "dicon-label", text: baseName(d) }));
    if (mode === "list") it.appendChild(el("span", { class: "lr-meta", text: "Carpeta" }));
    if (cutPaths && cutPaths.has(d)) it.classList.add("cut");
    grid.appendChild(it);
  }
  for (const f of files) {
    const it = el("div", { class: "dicon", dataset: { kind: "file", path: f.path }, draggable: "true", tabindex: "0", role: "button", "aria-label": f.name });
    const img = el("div", { class: "dicon-img" });
    img.innerHTML = iconSvg(fileIcon(f.viewer));
    it.append(img, el("span", { class: "dicon-label", text: f.name }));
    it.title = f.name + (f.size != null ? "  ·  " + formatBytes(f.size) : "");
    if (mode === "list") {
      it.appendChild(el("span", { class: "lr-meta", text: (f.size != null ? formatBytes(f.size) : "") + (f.updatedAt ? "  ·  " + fmtDate(f.updatedAt) : "") }));
    }
    if (cutPaths && cutPaths.has(f.path)) it.classList.add("cut");
    grid.appendChild(it);
  }
  reapplySelection(grid);
}

// ---------------------------------------------------------------------------
// Menu contextual
// ---------------------------------------------------------------------------

function gridCtx(x, y, item, dir, context) {
  if (item) {
    const container = context && context.container;
    let paths = [item.path];
    if (context && context.el && container && context.el.classList.contains("selected")) {
      const sel = selectedPaths(container);
      if (sel.length >= 2) paths = sel;
    }
    const isSingle = paths.length === 1;
    const isDir = item.kind === "dir";
    const items = [];

    if (isSingle && isDir) {
      items.push({ label: "Abrir", icon: "folderOpen", action: () => openExplorer(item.path) });
      items.push({ sep: true });
      items.push({ label: session.isFav(item.path) ? "Quitar de favoritos" : "Añadir a favoritos", icon: "star", action: () => toggleFav(item.path) });
      items.push({ label: "Renombrar", icon: "rename", action: () => renameEntry(item.path) });
      items.push({ label: "Cortar", icon: "cut", action: () => takeClipboard("cut", paths) });
      items.push({ label: "Mover a...", icon: "move", action: () => moveTo(item.path, dir) });
      items.push({ sep: true });
      items.push({ label: "Borrar", icon: "trash", danger: true, action: () => deleteEntries(paths) });
    } else if (isSingle) {
      const entry = session.getByPath(item.path);
      items.push({ label: "Abrir", icon: "note", action: () => openEntryAtPath(item.path) });
      if (entry && entry.versions && entry.versions.length > 1) {
        items.push({ label: "Versiones", icon: "clock", action: () => openVersionsWindow(entry) });
      }
      items.push({ sep: true });
      items.push({ label: session.isFav(item.path) ? "Quitar de favoritos" : "Añadir a favoritos", icon: "star", action: () => toggleFav(item.path) });
      items.push({ label: "Renombrar", icon: "rename", action: () => renameEntry(item.path) });
      items.push({ label: "Cortar", icon: "cut", action: () => takeClipboard("cut", paths) });
      items.push({ label: "Copiar", icon: "copy", action: () => takeClipboard("copy", paths) });
      items.push({ label: "Mover a...", icon: "move", action: () => moveTo(item.path, dir) });
      items.push({ sep: true });
      items.push({ label: "Descargar", icon: "download", action: () => downloadEntry(entry) });
      items.push({ label: "Borrar", icon: "trash", danger: true, action: () => deleteEntries(paths) });
    } else {
      items.push({ label: paths.length + " elementos seleccionados", icon: "copy", disabled: true });
      items.push({ sep: true });
      items.push({ label: "Cortar", icon: "cut", action: () => takeClipboard("cut", paths) });
      items.push({ label: "Copiar", icon: "copy", action: () => takeClipboard("copy", paths) });
      items.push({ sep: true });
      items.push({ label: "Borrar", icon: "trash", danger: true, action: () => deleteEntries(paths) });
    }
    showContextMenu(x, y, items);
    return;
  }

  const items = [
    { label: "Nuevo archivo", icon: "newFile", action: () => newFileIn(dir) },
    { label: "Nueva carpeta", icon: "newFolder", action: () => newFolderIn(dir) },
  ];
  if (hasClipboard()) {
    items.push({ sep: true });
    items.push({ label: clipboardLabel(), icon: "paste", action: () => handlePaste(dir) });
  }
  showContextMenu(x, y, items);
}

async function toggleFav(path) {
  const on = session.toggleFav(path);
  refreshAllExplorers();
  refreshViews();
  if (await commit()) toast(on ? "Añadido a favoritos" : "Quitado de favoritos", "ok");
}

function takeClipboard(mode, paths) {
  setClipboard(mode, paths);
  toast(mode === "cut" ? (paths.length > 1 ? "Elementos cortados" : "Elemento cortado") : paths.length > 1 ? "Elementos copiados" : "Elemento copiado", "ok");
  refreshAllExplorers();
  refreshViews();
}

// ---------------------------------------------------------------------------
// Acciones
// ---------------------------------------------------------------------------

async function newFileIn(dir) {
  // El dialogo pide solo el NOMBRE: la ruta se ancla siempre a la carpeta
  // abierta, asi lo que escriba el usuario nunca acaba en la raiz por error.
  const where = dir || "el escritorio";
  const value = baseName(session.uniqueName(dir, "nuevo-archivo.txt"));
  const res = await promptInput({ title: "Nuevo archivo en " + where, label: "Nombre del archivo", value, submitLabel: "Crear" });
  if (!res) return;
  const path = normalizeDir(dir ? dir + "/" + res : res);
  try {
    await session.createFile(path, "");
  } catch (err) {
    toast(err.message, "error");
    return;
  }
  if (await commit()) {
    toast("Archivo creado", "ok");
    const e = session.getByPath(path);
    if (e) openFileWindow(e);
  }
}

async function newFolderIn(dir) {
  const where = dir || "el escritorio";
  const value = baseName(session.uniqueName(dir, "nueva-carpeta"));
  const res = await promptInput({ title: "Nueva carpeta en " + where, label: "Nombre de la carpeta", value });
  if (!res) return;
  const path = normalizeDir(dir ? dir + "/" + res : res);
  try {
    session.createDir(path);
  } catch (err) {
    toast(err.message, "error");
    return;
  }
  if (await commit()) toast("Carpeta creada", "ok");
}

async function renameEntry(path) {
  if (session.getTrashed().some((t) => t.path === path)) return;
  const name = baseName(path);
  const res = await promptInput({ title: "Renombrar", label: "Nuevo nombre", value: name, submitLabel: "Renombrar" });
  if (!res) return;
  const parent = dirName(path);
  const target = normalizeDir(res) === path ? path : (parent ? parent + "/" + res : res);
  const full = normalizeDir(target);
  if (!full || full === path) return;
  try {
    session.moveEntry(path, full);
  } catch (err) {
    toast(err.message, "error");
    return;
  }
  if (await commit()) {
    toast("Renombrado", "ok");
    refreshAllExplorers();
    refreshViews();
  }
}

async function moveTo(path, parentDir) {
  const name = baseName(path);
  const res = await promptInput({ title: "Mover " + name, label: "Carpeta de destino", value: normalizeDir(parentDir) || "", submitLabel: "Mover" });
  if (!res) return;
  const target = normalizeDir(res);
  const full = target ? target + "/" + name : name;
  if (full === path) return;
  try {
    session.moveEntry(path, full);
  } catch (err) {
    toast(err.message, "error");
    return;
  }
  if (await commit()) {
    toast("Movido", "ok");
    closeWindowsByPrefix("folder:" + path);
  }
}

async function deleteEntries(paths) {
  const live = paths.filter((p) => session.getByPath(p) || session.getDirPaths().includes(p));
  if (!live.length) return;
  const label = live.length === 1 ? baseName(live[0]) : live.length + " elementos";
  const yes = await askConfirm({ title: "Mover a la papelera", text: "\u00bfMover \u201c" + label + "\u201d a la papelera?" });
  if (!yes) return;
  session.trashPaths(live);
  for (const p of live) {
    closeWindowById("file:" + p);
    closeWindowsByPrefix("folder:" + p);
  }
  if (await commit()) toast("Movido a la papelera", "ok");
}

async function purgeEntries(paths) {
  const live = paths.filter((p) => session.getByPath(p) || session.getDirPaths().includes(p) || session.getTrashed().some((t) => t.path === p));
  if (!live.length) return;
  const label = live.length === 1 ? baseName(live[0]) : live.length + " elementos";
  const yes = await askConfirm({
    title: "Borrar para siempre",
    text: "Se eliminaran \u201c" + label + "\u201d definitivamente. Esta accion no se puede deshacer.",
    okLabel: "Eliminar",
  });
  if (!yes) return;
  session.deletePermanently(live);
  for (const p of live) {
    closeWindowById("file:" + p);
    closeWindowsByPrefix("folder:" + p);
  }
  if (await commit()) toast("Eliminado definitivamente", "ok");
}

async function downloadEntry(entry) {
  try {
    const text = await session.openEntry(entry.path);
    downloadStored(entry.name, text);
  } catch (err) {
    toast("No se pudo descargar", "error");
  }
}

async function handlePaste(dir) {
  if (!hasClipboard()) return;
  const { mode, paths } = getClipboard();
  let count = 0;
  try {
    if (mode === "cut") {
      const toMove = paths.filter((p) => dirName(p) !== dir && (session.getByPath(p) || session.getDirPaths().includes(p)));
      count = session.moveEntries(toMove, dir);
    } else {
      const live = paths.filter((p) => session.getByPath(p) || session.getDirPaths().includes(p));
      count = session.copyEntries(live, dir);
    }
  } catch (err) {
    toast(err.message, "error");
    return;
  }
  clearClipboard();
  refreshAllExplorers();
  refreshViews();
  if (await commit()) {
    if (count > 0) toast(mode === "cut" ? "Movido" : "Copiado", "ok");
  }
}

// ---------------------------------------------------------------------------
// Sincronizacion con cambios de estado
// ---------------------------------------------------------------------------

onStoreChange(() => {
  for (const [dir, win] of [...openExplorers]) {
    if (!getWindow(win.id)) {
      openExplorers.delete(dir);
      continue;
    }
    if (!dirExists(dir)) {
      closeWindow(win);
      continue;
    }
    renderExplorer(win.body, win, dir);
  }
});