// Taskbar del escritorio: boton Inicio con su menu, botones de ventanas
// (minimizar/restaurar/enfocar), reloj y chip de cuota.

import { el, esc } from "../core/utils.js";
import { subscribe as wmSubscribe, getActiveWindow, focusWindow, toggleMinimize } from "./windows.js";
import { iconSvg } from "./icons.js";
import { setTheme } from "../core/theme.js";
import { store } from "../core/state.js";
import { onSyncChange, getSyncInfo } from "./store.js";
import { session } from "../crypto/session.js";
import { openSearchWindow, openTrashWindow, doBackup, openAdminWindow } from "./apps.js";
import { openThemesWindow } from "./themes-window.js";
import { openAccountWindow } from "./account.js";
import { openFavsWindow, openRecentWindow } from "./places.js";

let startBtn, windowsBox, clockEl, quotaEl, menu = null;
let ctx = null;

export function initTaskbar(desktopCtx) {
  ctx = desktopCtx;
  startBtn = document.querySelector("#btn-start");
  windowsBox = document.querySelector("#taskbar-windows");
  clockEl = document.querySelector("#taskbar-clock");
  quotaEl = document.querySelector("#quota-chip");

  wmSubscribe(renderTaskButtons);
  onSyncChange(() => updateQuota());

  startBtn.addEventListener("click", () => toggleStartMenu());

  const tick = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    clockEl.textContent = hh + ":" + mm;
  };
  tick();
  setInterval(tick, 30000);
}

function renderTaskButtons(wins) {
  windowsBox.textContent = "";
  const active = getActiveWindow();
  for (const w of wins) {
    const btn = el("button", {
      class: "tb-win" + (active && active.id === w.id ? " active" : ""),
      type: "button",
      title: w.title,
      "aria-label": w.title,
    });
    const ic = el("span", { class: "tb-icon" });
    if (w.iconHtml) ic.innerHTML = w.iconHtml;
    btn.append(ic, el("span", { class: "tb-label", text: w.title }));
    btn.addEventListener("click", () => {
      const cur = getActiveWindow();
      if (w.minimized) focusWindow(w);
      else if (cur && cur.id === w.id) toggleMinimize(w);
      else focusWindow(w);
    });
    windowsBox.appendChild(btn);
  }
}

export function updateQuota() {
  if (!quotaEl) return;
  const sync = getSyncInfo();
  const mark = sync.status === "saving" ? " · Guardando…" : sync.status === "error" ? " · Error al guardar" : "";
  quotaEl.textContent = session.quotaLabel() + mark;
  quotaEl.title = sync.at ? "Sincronizado " + new Date(sync.at).toLocaleTimeString() : "Sincronizacion";
}

// ---------------------------------------------------------------------------
// Menu Inicio
// ---------------------------------------------------------------------------

function buildStartMenu() {
  if (menu) menu.remove();
  menu = el("div", { id: "start-menu", role: "menu" });
  const user = session.currentUser();
  const display = user ? user.displayName || user.username : "";
  const isAdmin = !!(user && user.role === "admin");

  menu.appendChild(
    el("div", { class: "sm-head" }, [
      el("span", { class: "sm-head-user", text: display || "Usuario" }),
      el("span", { class: "muted", text: " · " + (isAdmin ? "administrador" : "usuario") }),
    ])
  );

  menu.appendChild(
    smItem("Buscar...", "search", () => {
      const engine = ctx && ctx.getEngine ? ctx.getEngine() : null;
      openSearchWindow(engine);
      closeStartMenu();
    })
  );
  menu.appendChild(smItem("Papelera", "trash", () => {
    openTrashWindow();
    closeStartMenu();
  }));
  menu.appendChild(smItem("Mi cuenta", "shield", () => {
    openAccountWindow(ctx.api);
    closeStartMenu();
  }));
  menu.appendChild(smItem("Favoritos", "star", () => {
    openFavsWindow();
    closeStartMenu();
  }));
  menu.appendChild(smItem("Recientes", "clock", () => {
    openRecentWindow();
    closeStartMenu();
  }));
  menu.appendChild(smItem("Copia de seguridad", "upload", () => {
    doBackup();
    closeStartMenu();
  }));
  if (isAdmin) {
    menu.appendChild(
      smItem("Administracion", "users", () => {
        openAdminWindow(ctx.api, ctx.refreshQuota);
        closeStartMenu();
      })
    );
  }

  menu.appendChild(el("div", { class: "sm-sep" }));
  const activePref = store.getTheme() || "system";
  menu.appendChild(themeItem("Tema claro", "sun", "xp-luna", activePref));
  menu.appendChild(themeItem("Tema oscuro", "moon", "dark-pro", activePref));
  menu.appendChild(themeItem("Tema del sistema", "monitor", "system", activePref));
  menu.appendChild(
    smItem("Cambiar tema…", "palette", () => {
      openThemesWindow();
      closeStartMenu();
    })
  );

  menu.appendChild(el("div", { class: "sm-sep" }));
  menu.appendChild(
    smItem("Cerrar sesion", "power", () => {
      closeStartMenu();
      if (ctx && ctx.onLogout) ctx.onLogout();
    })
  );

  document.body.appendChild(menu);

  const onDoc = (ev) => {
    if (!menu.contains(ev.target) && !startBtn.contains(ev.target)) closeStartMenu();
  };
  const onKey = (ev) => {
    if (ev.key === "Escape") {
      ev.preventDefault();
      ev.stopPropagation();
      closeStartMenu();
    }
  };
  setTimeout(() => document.addEventListener("mousedown", onDoc), 0);
  document.addEventListener("keydown", onKey);
  menu.addEventListener("remove", () => {
    document.removeEventListener("mousedown", onDoc);
    document.removeEventListener("keydown", onKey);
  });
}

function smItem(label, icon, action) {
  const b = el("button", { class: "sm-item", type: "button", role: "menuitem" });
  const ic = el("span", { class: "sm-icon" });
  ic.innerHTML = iconSvg(icon);
  b.append(ic, el("span", { text: label }));
  b.addEventListener("click", action);
  return b;
}

function themeMark(active, menu) {
  const span = el("span", { class: "sm-check" + (active ? "" : " empty") });
  if (active) span.innerHTML = iconSvg("check");
  return span;
}

function themeItem(label, icon, pref, activePref) {
  const b = el("button", { class: "sm-item theme-quick" + (pref === activePref ? " sm-checked" : ""), type: "button", role: "menuitem" });
  const ic = el("span", { class: "sm-icon" });
  ic.innerHTML = iconSvg(icon);
  b.append(ic, el("span", { text: label }), themeMark(pref === activePref));
  b.addEventListener("click", () => setThemePref(pref, b));
  return b;
}

function setThemePref(pref, btn) {
  setTheme(pref);
  const menu = document.getElementById("start-menu");
  for (const item of menu.querySelectorAll(".sm-item.theme-quick")) {
    const active = item === btn;
    item.classList.toggle("sm-checked", active);
    let check = item.querySelector(".sm-check");
    if (!check) {
      check = themeMark(active, menu);
      item.appendChild(check);
    } else {
      check.classList.toggle("empty", !active);
      check.innerHTML = active ? iconSvg("check") : "";
    }
  }
}

export function toggleStartMenu() {
  if (!document.getElementById("start-menu")) {
    buildStartMenu();
    startBtn.classList.add("active");
  } else {
    closeStartMenu();
  }
}

export function closeStartMenu() {
  const m = document.getElementById("start-menu");
  if (m) m.remove();
  if (startBtn) startBtn.classList.remove("active");
}