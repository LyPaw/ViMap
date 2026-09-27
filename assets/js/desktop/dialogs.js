// Dialogos modales del escritorio: confirmacion y captura de texto (prompt).
// Son ventanas modales centradas; solo puede haber una abierta a la vez.

import { el } from "../core/utils.js";
import { openWindow, closeWindow } from "./windows.js";
import { iconSvg } from "./icons.js";

let activeDialog = null;

function dismissActive() {
  if (activeDialog) {
    const d = activeDialog;
    activeDialog = null;
    closeWindow(d);
  }
}

function makeModal({ id, title, icon, width, height, body, actions, onResolve }) {
  dismissActive();
  const win = openWindow({
    id: id || "dlg-" + Date.now(),
    title,
    icon: iconSvg(icon || "info"),
    modal: true,
    width,
    height,
    resizable: false,
    onClose: () => {
      if (activeDialog === win) activeDialog = null;
      if (typeof win._resolve === "function") {
        const r = win._resolve;
        win._resolve = null;
        r(null);
      }
    },
  });
  activeDialog = win;
  win._resolve = onResolve;
  win.el.classList.add("win-dialog");
  win.el.setAttribute("aria-modal", "true");
  win.body.style.padding = "16px 18px";

  const wrap = el("div", { class: "dlg-wrap" });
  if (body) wrap.appendChild(body);
  const acts = el("div", { class: "dlg-actions" });
  for (const a of actions) {
    const btn = el("button", {
      class: "btn " + (a.kind || "btn-ghost"),
      type: "button",
      text: a.label,
    });
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (a.action) a.action();
    });
    acts.appendChild(btn);
    if (a.autofocus) setTimeout(() => btn.focus(), 0);
  }
  wrap.appendChild(acts);
  win.body.appendChild(wrap);

  win.el.addEventListener("keydown", (ev) => {
    ev.stopPropagation();
    if (ev.key === "Escape") {
      ev.preventDefault();
      closeWindow(win);
    }
  });
  return win;
}

function resolveWin(win, value) {
  if (win && win._resolve) {
    const r = win._resolve;
    win._resolve = null;
    r(value);
  }
  closeWindow(win);
}

export function askConfirm({ title = "Confirmar", text = "\u00bfSeguro?", icon = "info", okLabel = "Confirmar", okKind = "btn-danger" }) {
  return new Promise((resolve) => {
    const win = makeModal({
      title,
      icon,
      width: 400,
      height: 180,
      body: el("p", { class: "dlg-text", text }),
      actions: [
        { label: "Cancelar", kind: "btn-ghost", action: () => resolveWin(win, false) },
        { label: okLabel, kind: okKind, autofocus: true, action: () => resolveWin(win, true) },
      ],
      onResolve: resolve,
    });
  });
}

export function promptInput({ title = "Introduce un valor", icon = "rename", label, placeholder = "", value = "", submitLabel = "Aceptar" }) {
  return new Promise((resolve) => {
    const input = el("input", {
      type: "text",
      class: "field-input",
      value,
      placeholder,
      autocomplete: "off",
      autocapitalize: "off",
      autocorrect: "off",
      spellcheck: "false",
    });
    const win = makeModal({
      title,
      icon,
      width: 440,
      height: 200,
      body: el("label", { class: "field" }, [
        el("span", { class: "field-label", text: label || title }),
        input,
      ]),
      actions: [
        { label: "Cancelar", kind: "btn-ghost", action: () => resolveWin(win, null) },
        { label: submitLabel, kind: "btn-primary", autofocus: true, action: submit },
      ],
      onResolve: resolve,
    });

    function submit() {
      const v = input.value.trim();
      if (!v) {
        input.focus();
        return;
      }
      resolveWin(win, v);
    }
    input.addEventListener("keydown", (ev) => {
      ev.stopPropagation();
      if (ev.key === "Enter") submit();
      else if (ev.key === "Escape") resolveWin(win, null);
    });
    setTimeout(() => {
      input.focus();
      input.select();
    }, 0);
  });
}