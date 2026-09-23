// Tema claro / oscuro / sistema. La preferencia persiste en localStorage
// (no es material sensible). El atributo data-theme se aplica en <html>.

import { store } from "./state.js";

const SYSTEM_QUERY = window.matchMedia("(prefers-color-scheme: light)");

function systemPref() {
  return SYSTEM_QUERY.matches ? "light" : "dark";
}

let currentEffective = "dark";

export function effectiveTheme() {
  return currentEffective;
}

export function applyTheme(pref) {
  const effective = pref === "system" ? systemPref() : pref;
  const root = document.documentElement;
  root.dataset.theme = effective;
  currentEffective = effective;
  updateButtons(pref);
}

export function setTheme(pref) {
  store.setTheme(pref);
  applyTheme(pref);
}

function updateButtons(activePref) {
  document.querySelectorAll(".theme-btn").forEach((btn) => btn.classList.remove("active"));
  const btn = document.getElementById("theme-" + activePref);
  if (btn) btn.classList.add("active");
}

export function initTheme(defaultTheme) {
  const saved = store.getTheme();
  const start = saved || defaultTheme || "system";
  applyTheme(start);

  const map = { "theme-light": "light", "theme-dark": "dark", "theme-system": "system" };
  for (const [id, pref] of Object.entries(map)) {
    document.getElementById(id)?.addEventListener("click", () => setTheme(pref));
  }

  SYSTEM_QUERY.addEventListener("change", () => {
    const saved = store.getTheme();
    if (!saved || saved === "system") applyTheme("system");
  });
}