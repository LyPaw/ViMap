// Ventana "Temas / Apariencia": selector visual con tarjetas de
// previsualizacion (renderizadas con las variables de cada tema via
// data-preview), boton Aplicar, restablecer predeterminado y accesibilidad.

import { el } from "../core/utils.js";
import { THEMES, CATEGORIES } from "../core/theme-catalog.js";
import { effectiveTheme, setTheme, resetTheme, getReduceMotion, setReduceMotion } from "../core/theme.js";
import { openWindow, focusWindow } from "./windows.js";
import { iconSvg } from "./icons.js";

function previewCard(theme) {
  const preview = el("div", { class: "theme-preview", dataset: { preview: theme.id } }, [
    el("div", { class: "tp-win" }, [
      el("div", { class: "tp-title" }, [
        el("span", { text: "Ventana" }),
        el("i"),
        el("i"),
        el("i"),
      ]),
      el("div", { class: "tp-body" }, [
        el("div", { class: "tp-line" }),
        el("div", { class: "tp-line short" }),
        el("span", { class: "tp-btn", text: "Aceptar" }),
      ]),
    ]),
  ]);
  return preview;
}

function renderCards(list, activeId) {
  list.textContent = "";
  for (const cat of CATEGORIES) {
    const items = THEMES.filter((t) => (t.cat || "clasicos") === cat.id);
    if (!items.length) continue;
    list.appendChild(el("h3", { class: "themes-cat", text: cat.title }));
    for (const theme of items) {
      list.appendChild(themeCard(theme, list, theme.id === activeId));
    }
  }
}

function themeCard(theme, list, active) {
  {
    const card = el("button", {
      class: "theme-card" + (active ? " active" : ""),
      type: "button",
      "aria-pressed": active ? "true" : "false",
      "aria-label": "Aplicar tema " + theme.name,
    });
    const state = el("span", { class: "theme-state", text: active ? "Activo" : "Aplicar" });
    card.append(
      previewCard(theme),
      el("span", { class: "theme-name", text: theme.name }),
      el("span", { class: "theme-desc", text: theme.desc }),
      el("span", { class: "theme-apply" }, [state, (() => {
        const ic = el("span", { class: "sm-icon" });
        ic.innerHTML = iconSvg(active ? "check" : "palette");
        return ic;
      })()])
    );
    card.addEventListener("click", () => {
      setTheme(theme.id);
      renderCards(list, theme.id);
    });
    return card;
  }
}

export function openThemesWindow() {
  // openWindow() enfoca la ventana si ya existe con id "themes": sin duplicados.
  const win = openWindow({
    id: "themes",
    title: "Temas — Apariencia",
    icon: iconSvg("palette"),
    width: 660,
    height: 500,
    content: (body) => {
      const grid = el("div", { class: "themes-grid", role: "listbox", "aria-label": "Temas disponibles" });
      renderCards(grid, effectiveTheme());

      const resetBtn = el("button", { class: "btn btn-ghost btn-sm", type: "button", text: "Restablecer predeterminado" });
      resetBtn.addEventListener("click", () => {
        resetTheme();
        renderCards(grid, effectiveTheme());
      });

      const rmCheck = el("input", { type: "checkbox", id: "themes-rmotion", "aria-label": "Reducir animaciones" });
      rmCheck.checked = getReduceMotion() === "reduce";
      rmCheck.addEventListener("change", () => {
        setReduceMotion(rmCheck.checked ? "reduce" : "full");
      });
      const rmRow = el("label", { class: "rmotion-row", for: "themes-rmotion" }, [
        rmCheck,
        el("span", { text: "Reducir animaciones" }),
      ]);

      const foot = el("div", { class: "themes-foot" }, [
        resetBtn,
        el("span", { class: "muted", text: "El tema se guarda y se aplica al instante." }),
        rmRow,
      ]);
      body.append(grid, foot);
      body.style.display = "grid";
      body.style.gridTemplateRows = "minmax(0, 1fr) auto";
    },
  });
  if (win) focusWindow(win);
  return win;
}
