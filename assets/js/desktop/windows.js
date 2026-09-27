// WindowManager: ventanas flotantes del escritorio ViMap.
// Arrastre por la barra de titulo, redimension por la esquina, minimizar,
// maximizar, cerrar, z-order y estado activo. Emite cambios al taskbar.

import { el, esc } from "../core/utils.js";

const Z_BASE = 1000;
const TASKBAR_H = () => {
  const bar = document.getElementById("taskbar");
  return bar ? bar.offsetHeight || 40 : 40;
};

const wins = new Map(); // id -> win
const listeners = new Set();
const byEl = new WeakMap();
let zTop = Z_BASE;
let activeId = null;
let seq = 0;

function layer() {
  return document.getElementById("window-layer");
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  for (const fn of listeners) {
    try {
      fn(getWindows());
    } catch (err) {
      console.error(err);
    }
  }
}

export function getWindows() {
  return [...wins.values()];
}

export function getActiveWindow() {
  return wins.get(activeId) || null;
}

export function getWindow(id) {
  return wins.get(id) || null;
}

function setActive(win) {
  for (const w of wins.values()) w.el.classList.toggle("win-active", w === win);
  activeId = win ? win.id : null;
  emit();
}

export function closeWindow(win) {
  if (!win || !wins.has(win.id)) return;
  const onClose = win.onClose;
  wins.delete(win.id);
  win.el.remove();
  if (activeId === win.id) {
    activeId = null;
    const rest = [...wins.values()];
    if (rest.length) setActive(rest[rest.length - 1]);
  }
  emit();
  if (typeof onClose === "function") onClose(win);
}

export function closeWindowById(id) {
  const w = wins.get(id);
  if (w) closeWindow(w);
}

export function focusWindow(win) {
  if (!win || !wins.has(win.id)) return;
  restoreWindow(win);
  zTop += 1;
  win.el.style.zIndex = String(zTop);
  setActive(win);
}

export function focusWindowById(id) {
  const w = wins.get(id);
  if (w) focusWindow(w);
}

export function minimizeWindow(win) {
  if (!wins.has(win.id) || win.minimized) return;
  win.minimized = true;
  win.el.classList.add("win-minimized");
  if (activeId === win.id) {
    activeId = null;
    const rest = [...wins.values()].filter((w) => w !== win && !w.minimized);
    if (rest.length) {
      setActive(rest[rest.length - 1]);
    } else {
      for (const w of wins.values()) w.el.classList.remove("win-active");
      emit();
    }
  } else {
    emit();
  }
}

export function restoreWindow(win) {
  if (!win || !win.minimized) return;
  win.minimized = false;
  win.el.classList.remove("win-minimized");
  emit();
}

function applyGeom(win) {
  win.el.style.left = win.x + "px";
  win.el.style.top = win.y + "px";
  win.el.style.width = win.w + "px";
  win.el.style.height = win.h + "px";
}

export function toggleMaximize(win) {
  if (!wins.has(win.id)) return;
  if (win.maximized) {
    win.el.classList.remove("win-maximized");
    const p = win.prev || { x: win.x, y: win.y, w: win.w, h: win.h };
    // Reencuadrar por si el viewport cambio mientras estaba maximizada.
    win.x = clamp(p.x, -p.w + 120, Math.max(0, window.innerWidth - 40));
    win.y = clamp(p.y, 0, Math.max(0, window.innerHeight - TASKBAR_H() - 32));
    win.w = Math.min(p.w, window.innerWidth);
    win.h = Math.min(p.h, window.innerHeight - TASKBAR_H());
    applyGeom(win);
    win.maximized = false;
  } else {
    win.prev = { x: win.x, y: win.y, w: win.w, h: win.h };
    win.x = 0;
    win.y = 0;
    win.w = window.innerWidth;
    win.h = window.innerHeight - TASKBAR_H();
    win.el.classList.add("win-maximized");
    applyGeom(win);
    win.maximized = true;
  }
  emit();
}

export function toggleMinimize(win) {
  if (win.minimized) {
    restoreWindow(win);
    focusWindow(win);
  } else {
    minimizeWindow(win);
  }
}

export function setWindowId(win, newId) {
  if (!win || !wins.has(win.id)) return;
  const oldId = win.id;
  wins.delete(oldId);
  win.id = newId;
  wins.set(newId, win);
  // Al renombrar la ventana (p. ej. navegar a otra carpeta), conservar su
  // estado activo: si era la activa, seguir siendolo con el nuevo id.
  if (activeId === oldId) activeId = newId;
  emit();
}

// Enfoca la ventana bajo el puntero si existe (escalas de arrastre de iconos).
export function windowFromChild(node) {
  while (node && node !== document.body) {
    if (byEl.has(node)) return byEl.get(node);
    node = node.parentElement;
  }
  return null;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

const MIN_VISIBLE = 24;

export function openWindow({
  id,
  title,
  icon = "",
  width = 480,
  height = 320,
  x,
  y,
  minWidth = 240,
  minHeight = 140,
  content,
  onClose,
  resizable = true,
  modal = false,
  extraClass = "",
}) {
  if (wins.has(id)) {
    focusWindow(wins.get(id));
    return wins.get(id);
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight - TASKBAR_H();
  seq += 1;
  if (x == null) x = clamp(36 + ((seq % 10) * 30), 0, Math.max(0, vw - width - MIN_VISIBLE));
  if (y == null) y = clamp(24 + ((seq % 10) * 24), 0, Math.max(0, vh - height - MIN_VISIBLE));

  const elWin = el("section", {
    class: "win" + (modal ? " win-modal" : "") + (extraClass ? " " + extraClass : ""),
    role: "dialog",
    "aria-label": title,
  });
  elWin.style.left = x + "px";
  elWin.style.top = y + "px";
  elWin.style.width = width + "px";
  elWin.style.height = height + "px";

  const titlebar = el("div", { class: "win-titlebar" }, [
    spanIcon(icon),
    el("span", { class: "win-title", text: title }),
    el("span", { class: "win-controls" }, [
      el("button", {
        class: "win-btn win-min",
        type: "button",
        title: "Minimizar",
        "aria-label": "Minimizar",
        text: "\u2012",
      }),
      modal
        ? null
        : el("button", {
            class: "win-btn win-max",
            type: "button",
            title: "Maximizar",
            "aria-label": "Maximizar",
            text: "\u25a3",
          }),
      el("button", {
        class: "win-btn win-close",
        type: "button",
        title: "Cerrar",
        "aria-label": "Cerrar ventana",
        text: "\u2715",
      }),
    ]),
  ]);
  const body = el("div", { class: "win-body" });

  if (resizable && !modal) {
    body.appendChild(el("div", { class: "win-resize", "aria-hidden": "true" }));
  }

  elWin.append(titlebar, body);
  layer().appendChild(elWin);

  const win = {
    id,
    title,
    iconHtml: icon || "",
    el: elWin,
    titlebar,
    body,
    x,
    y,
    w: width,
    h: height,
    minWidth,
    minHeight,
    minimized: false,
    maximized: false,
    modal: !!modal,
    onClose,
  };
  wins.set(id, win);
  byEl.set(elWin, win);

  titlebar
    .querySelector(".win-close")
    .addEventListener("click", (ev) => {
      ev.stopPropagation();
      closeWindow(win);
    });
  const maxBtn = titlebar.querySelector(".win-max");
  if (maxBtn) {
    maxBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      toggleMaximize(win);
    });
  }
  titlebar.querySelector(".win-min").addEventListener("click", (ev) => {
    ev.stopPropagation();
    minimizeWindow(win);
  });

  elWin.addEventListener("pointerdown", () => focusWindow(win));

  if (!modal) {
    enableDrag(win, titlebar);
    enableResize(win, elWin.querySelector(".win-resize"));
  }

  zTop += 1;
  elWin.style.zIndex = String(zTop);
  setActive(win);

  if (typeof content === "function") {
    try {
      content(body, win);
    } catch (err) {
      body.textContent = "Error al construir la ventana: " + (err && err.message ? err.message : err);
      console.error(err);
    }
  } else if (content instanceof Node) {
    body.appendChild(content);
  } else if (content != null) {
    body.textContent = String(content);
  }

  emit();
  return win;
}

function spanIcon(html) {
  if (!html) return null;
  const span = el("span", { class: "win-icon" });
  span.innerHTML = html;
  return span;
}

function enableDrag(win, handle) {
  let sx = 0,
    sy = 0,
    ox = 0,
    oy = 0;

  handle.addEventListener("pointerdown", (ev) => {
    if (ev.button !== 0) return;
    if (ev.target.closest(".win-btn")) return;
    focusWindow(win);
    // Como en Windows: arrastrar una maximizada la restaura primero.
    if (win.maximized) toggleMaximize(win);
    sx = ev.clientX;
    sy = ev.clientY;
    ox = win.x;
    oy = win.y;
    handle.setPointerCapture(ev.pointerId);

    const move = (e) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight - TASKBAR_H();
      let nx = clamp(ox + (e.clientX - sx), -win.w + 120, vw - 40);
      let ny = clamp(oy + (e.clientY - sy), 0, vh - 32);
      win.x = nx;
      win.y = ny;
      win.el.style.left = nx + "px";
      win.el.style.top = ny + "px";
    };
    const up = (e) => {
      handle.releasePointerCapture(e.pointerId);
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", up);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
  });
}

function enableResize(win, handle) {
  if (!handle) return;
  let sx = 0,
    sy = 0,
    ow = 0,
    oh = 0;

  handle.addEventListener("pointerdown", (ev) => {
    if (ev.button !== 0) return;
    ev.stopPropagation();
    focusWindow(win);
    sx = ev.clientX;
    sy = ev.clientY;
    ow = win.w;
    oh = win.h;
    handle.setPointerCapture(ev.pointerId);

    const move = (e) => {
      win.w = clamp(ow + (e.clientX - sx), win.minWidth, window.innerWidth - win.x);
      win.h = clamp(oh + (e.clientY - sy), win.minHeight, window.innerHeight - TASKBAR_H() - win.y - 24);
      win.el.style.width = win.w + "px";
      win.el.style.height = win.h + "px";
    };
    const up = (e) => {
      handle.releasePointerCapture(e.pointerId);
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", up);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
  });
}

export function handleGlobalEscape() {
  const win = getActiveWindow();
  if (!win) return false;
  if (win.minimized) {
    restoreWindow(win);
    return true;
  }
  closeWindow(win);
  return true;
}

export function closeWindowsByPrefix(prefix) {
  for (const id of [...wins.keys()]) {
    if (id.startsWith(prefix)) closeWindow(wins.get(id));
  }
}

export function closeAllWindows() {
  for (const id of [...wins.keys()]) closeWindow(wins.get(id));
}

export function escTitle(text) {
  return esc(text || "");
}