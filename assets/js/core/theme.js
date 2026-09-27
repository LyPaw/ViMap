// Temas visuales por id (ver theme-catalog.js) aplicados con data-theme en
// <html>. La preferencia persiste en localStorage; "system" resuelve segun
// prefers-color-scheme. Los valores antiguos light/dark migran una vez.

import { store } from "./state.js";
import { THEME_IDS, LEGACY_MAP, SYSTEM_LIGHT_THEME, SYSTEM_DARK_THEME, FALLBACK_THEME } from "./theme-catalog.js";

const SYSTEM_QUERY = window.matchMedia("(prefers-color-scheme: light)");
const REDUCED_QUERY = window.matchMedia("(prefers-reduced-motion: reduce)");

let currentEffective = FALLBACK_THEME;

export function effectiveTheme() {
  return currentEffective;
}

function systemTheme() {
  return SYSTEM_QUERY.matches ? SYSTEM_LIGHT_THEME : SYSTEM_DARK_THEME;
}

function resolveId(pref) {
  if (pref === "system") return systemTheme();
  if (THEME_IDS.has(pref)) return pref;
  return FALLBACK_THEME;
}

export function currentPref() {
  return store.getTheme() || "system";
}

export function applyTheme(pref) {
  currentEffective = resolveId(pref);
  document.documentElement.dataset.theme = currentEffective;
  document.querySelectorAll(".theme-btn").forEach((btn) => btn.classList.remove("active"));
  const btn = document.getElementById("theme-" + currentEffective);
  if (btn) btn.classList.add("active");
}

export function setTheme(pref) {
  const value = pref === "system" || THEME_IDS.has(pref) ? pref : FALLBACK_THEME;
  store.setTheme(value);
  applyTheme(value);
}

export function resetTheme() {
  setTheme("system");
}

// ---------------------------------------------------------------------------
// Reduccion de animaciones: preferencia manual o prefers-reduced-motion.
// ---------------------------------------------------------------------------

export function getReduceMotion() {
  const saved = store.getReduceMotion();
  if (saved === "reduce" || saved === "full") return saved;
  return REDUCED_QUERY.matches ? "reduce" : "full";
}

export function applyReduceMotion() {
  document.documentElement.dataset.rmotion = getReduceMotion();
}

export function setReduceMotion(v) {
  store.setReduceMotion(v === "reduce" ? "reduce" : "full");
  applyReduceMotion();
}

function migrateLegacy() {
  const saved = store.getTheme();
  if (saved && LEGACY_MAP[saved]) store.setTheme(LEGACY_MAP[saved]);
}

export function initTheme(defaultTheme) {
  migrateLegacy();
  const saved = store.getTheme();
  applyTheme(saved || defaultTheme || "system");
  applyReduceMotion();

  SYSTEM_QUERY.addEventListener("change", () => {
    if (currentPref() === "system") applyTheme("system");
  });
  REDUCED_QUERY.addEventListener("change", () => {
    if (!store.getReduceMotion()) applyReduceMotion();
  });
}
