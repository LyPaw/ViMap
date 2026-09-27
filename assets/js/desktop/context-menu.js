// Menu contextual del escritorio: se muestra en las coordenadas del clic,
// se cierra con clic fuera, Escape o al actuar sobre un item.

import { el } from "../core/utils.js";
import { iconSvg } from "./icons.js";

let current = null;
let onDoc = null;
let onKey = null;
let onBlur = null;

// Limpieza explicita de listeners globales. (El DOM no emite un evento
// "remove" al llamar a node.remove(), asi que no se puede delegar en el.)
function dispose() {
  if (onDoc) {
    document.removeEventListener("mousedown", onDoc);
    onDoc = null;
  }
  if (onKey) {
    document.removeEventListener("keydown", onKey);
    onKey = null;
  }
  if (onBlur) {
    window.removeEventListener("blur", onBlur);
    onBlur = null;
  }
}

function close() {
  if (current) {
    current.remove();
    current = null;
  }
  dispose();
}

function position(menu, x, y) {
  menu.style.visibility = "hidden";
  document.body.appendChild(menu);
  const r = menu.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const nx = Math.min(x, vw - r.width - 6);
  const ny = Math.min(y, vh - r.height - 6);
  menu.style.left = Math.max(4, nx) + "px";
  menu.style.top = Math.max(4, ny) + "px";
  menu.style.visibility = "visible";
}

export function showContextMenu(x, y, items) {
  close();
  const menu = el("div", { class: "context-menu", role: "menu" });
  for (const item of items) {
    if (item.sep) {
      menu.appendChild(el("div", { class: "ctx-sep", role: "separator" }));
      continue;
    }
    if (item.hidden) continue;
    const btn = el("button", {
      class: "ctx-item" + (item.danger ? " danger" : "") + (item.disabled ? " disabled" : ""),
      type: "button",
      role: "menuitem",
      disabled: !!item.disabled,
    });
    if (item.icon) {
      const ic = el("span", { class: "ctx-icon" });
      ic.innerHTML = iconSvg(item.icon);
      btn.appendChild(ic);
    }
    btn.appendChild(el("span", { class: "ctx-label", text: item.label }));
    if (item.checked) {
      const chk = el("span", { class: "ctx-check" });
      chk.innerHTML = iconSvg("check");
      btn.appendChild(chk);
    }
    btn.addEventListener("click", () => {
      close();
      item.action();
    });
    menu.appendChild(btn);
  }
  position(menu, x, y);
  current = menu;

  // showContextMenu() ya cerro el menu anterior (y dispose() sus listeners),
  // asi que estas referencias siempre son las del menu actual.
  onDoc = (ev) => {
    if (!menu.contains(ev.target)) close();
  };
  onKey = (ev) => {
    if (ev.key === "Escape") {
      ev.preventDefault();
      ev.stopPropagation();
      close();
    }
  };
  onBlur = () => {
    close();
  };
  // El mousedown del propio clic derecho que abre el menu ocurre ANTES de que
  // exista el menu; diferir el registro evita que ese mismo gesto lo cierre.
  // Los clics en items no cierran antes: el mousedown cae dentro (contains) y
  // solo el click posterior ejecuta close() + action().
  setTimeout(() => {
    if (current === menu) document.addEventListener("mousedown", onDoc);
  }, 0);
  document.addEventListener("keydown", onKey);
  // Clic derecho dentro del menu: bloquear el menu nativo del navegador pero
  // NO cerrar el nuestro (el cierre por mousedown fuera ya filtra con contains).
  menu.addEventListener(
    "contextmenu",
    (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
    },
    true
  );
  window.addEventListener("blur", onBlur);
}

export function closeContextMenu() {
  close();
}