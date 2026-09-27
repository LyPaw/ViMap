// ViMap: aplicacion principal. Gestiona sesion (login/desbloqueo/setup) y
// arranca el escritorio tipo OS (ventanas, taskbar, Inicio, drag&drop, buscar).
// Toda la criptografia vive en assets/js/crypto; aqui solo se orquesta.

import { getConfig } from "./config.js";
import { initTheme } from "./core/theme.js";
import { SearchEngine } from "./core/search.js";
import { parseRoute, initRouter } from "./core/router.js";
import { initGlobalKeyboard } from "./core/keyboard.js";
import { toast } from "./core/toast.js";
import { api } from "./api.js";
import { session } from "./crypto/session.js";
import { initStore } from "./desktop/store.js";
import { initDesktop, renderDesktop } from "./desktop/desktop.js";
import { initTaskbar, updateQuota, closeStartMenu } from "./desktop/taskbar.js";
import { initDnd } from "./desktop/dnd.js";
import { initVaultDnd } from "./desktop/vault-dnd.js";
import { initShortcuts, handleShortcutsEscape } from "./desktop/shortcuts.js";
import { closeAllWindows, handleGlobalEscape } from "./desktop/windows.js";
import { openEntryAtPath, openAdminWindow, openSearchWindow } from "./desktop/apps.js";

const Q = (sel) => document.querySelector(sel);
const cfg = getConfig();

let searchEngine = null;

boot();

function boot() {
  initTheme(cfg.defaultTheme);
  wireGates();
  initStore({ refreshQuota });
  initDesktop();
  initTaskbar({
    api,
    refreshQuota,
    getEngine: () => searchEngine,
    onLogout: async () => {
      try {
        await session.logout();
      } catch {
        session.lock();
      }
      closeAllWindows();
      closeStartMenu();
      showGate("login");
      toast("Sesion cerrada", "info");
    },
  });
  initDnd();
  initVaultDnd();

  initGlobalKeyboard({
    onSearchFocus: () => {
      if (appVisible() && session.isUnlocked()) openSearchWindow(searchEngine);
    },
    onEscape: () => {
      // Escape prioriza limpiar seleccion/cortado; solo si no habia nada que
      // limpiar se recurre al cierre de la ventana activa.
      if (!handleShortcutsEscape()) handleGlobalEscape();
    },
  });
  initShortcuts();

  initRouter((path) => {
    if (!session.isUnlocked()) return;
    openEntryAtPath(path);
  });

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#/admin" && session.isUnlocked() && (session.currentUser()?.role || "") === "admin") {
      openAdminWindow(api, refreshQuota);
    }
  });

  document.addEventListener("vimap:unauthorized", forceLockToLogin);

  bootstrapAuth();
}

function appVisible() {
  const app = Q("#app");
  return app && !app.hidden;
}

// ---------------------------------------------------------------------------
// Puertas (login / setup / desbloqueo)
// ---------------------------------------------------------------------------

function showGate(kind) {
  Q("#login-screen").hidden = kind !== "login";
  Q("#unlock-screen").hidden = kind !== "unlock";
  Q("#setup-screen").hidden = kind !== "setup";
  Q("#unlock-error").hidden = true;
  Q("#app").hidden = true;
}

function showApp() {
  Q("#login-screen").hidden = true;
  Q("#unlock-screen").hidden = true;
  Q("#setup-screen").hidden = true;
  Q("#app").hidden = false;
}

function setBusy(btn, busy) {
  if (!btn) return;
  btn.disabled = busy;
  btn.classList.toggle("busy", busy);
}

function hideError(node) {
  node.hidden = true;
  node.textContent = "";
}

function showFormError(node, err) {
  const msg =
    err && err.code === "AUTH_FAILED" ? "Usuario o contrasena incorrectos" :
    err && err.code === "RATE_LIMITED" ? (err.message || "Demasiados intentos") :
    err && err.message ? err.message : String(err);
  node.textContent = msg;
  node.hidden = false;
}

function wireGates() {
  Q("#login-form").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const username = Q("#login-username").value.trim();
    const password = Q("#login-password").value;
    setBusy(Q("#btn-login"), true);
    hideError(Q("#login-error"));
    try {
      await session.login(username, password);
      Q("#login-password").value = "";
      enterApp();
    } catch (err) {
      showFormError(Q("#login-error"), err);
    } finally {
      setBusy(Q("#btn-login"), false);
    }
  });

  Q("#unlock-form").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const password = Q("#unlock-password").value;
    setBusy(Q("#btn-unlock-submit"), true);
    hideError(Q("#unlock-error"));
    try {
      await session.unlock(password);
      Q("#unlock-password").value = "";
      enterApp();
    } catch (err) {
      showFormError(Q("#unlock-error"), err);
      Q("#unlock-password").select();
    } finally {
      setBusy(Q("#btn-unlock-submit"), false);
    }
  });

  Q("#setup-form").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const token = Q("#setup-token").value.trim();
    const username = Q("#setup-username").value.trim();
    const password = Q("#setup-password").value;
    const displayName = Q("#setup-displayname").value.trim();
    setBusy(Q("#btn-setup"), true);
    hideError(Q("#setup-error"));
    try {
      await api.adminSetup({ token, username, displayName, password });
      Q("#setup-token").value = "";
      Q("#setup-password").value = "";
      Q("#setup-displayname").value = "";
      Q("#login-username").value = username;
      Q("#login-password").value = "";
      showGate("login");
      toast("Administrador creado. Entra con tus credenciales.", "info");
      Q("#login-password").focus();
    } catch (err) {
      showFormError(Q("#setup-error"), err);
      Q("#setup-token").select();
    } finally {
      setBusy(Q("#btn-setup"), false);
    }
  });

  Q("#btn-unlock-back").addEventListener("click", async () => {
    try {
      await session.logout();
    } catch {
      session.lock();
    }
    showGate("login");
    toast("Sesion cerrada", "info");
  });
}

async function bootstrapAuth() {
  try {
    const me = await session.attachUser();
    showGate("unlock");
    const label = Q("#unlock-username");
    label.textContent = "Cuenta: " + (me.displayName || me.username);
    label.hidden = false;
  } catch {
    if (await needsSetup()) {
      showGate("setup");
      const tokenInput = Q("#setup-token");
      if (tokenInput) tokenInput.focus();
    } else {
      showGate("login");
    }
  }
}

async function needsSetup() {
  try {
    const s = await api.setupStatus();
    return !s.exists;
  } catch {
    return false;
  }
}

function forceLockToLogin() {
  try {
    session.lock();
    searchEngine = null;
    closeAllWindows();
    closeStartMenu();
    showGate("login");
    toast("Sesion caducada. Vuelve a entrar.", "warn");
  } catch (err) {
    console.error(err);
  }
}

// ---------------------------------------------------------------------------
// Entrada a la aplicacion
// ---------------------------------------------------------------------------

function enterApp() {
  showApp();
  refreshQuota();
  renderDesktop();
  searchEngine = new SearchEngine(session.getEntries(), session.getByPath);

  const route = parseRoute();
  if (route) {
    openEntryAtPath(route);
  } else if (window.location.hash === "#/admin" && (session.currentUser()?.role || "") === "admin") {
    openAdminWindow(api, refreshQuota);
  }
}

function refreshQuota() {
  updateQuota();
}