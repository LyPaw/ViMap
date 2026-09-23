// ViMap main: orquestador de arranque e interfaz.
// Carga config, manifiesto e indice de bovedas; monta el arbol publico,
// la boveda cifrada, la busqueda, el router de hash, teclado, tema y visores.

import { loadConfig, getConfig } from "./config.js";
import { initTheme } from "./core/theme.js";
import { loadManifest, loadVaultsIndex } from "./core/manifest.js";
import { createTree } from "./core/tree.js";
import { parseRoute, navigateTo, initRouter } from "./core/router.js";
import { SearchEngine } from "./core/search.js";
import { isTypingTarget, initGlobalKeyboard } from "./core/keyboard.js";
import { on, emit } from "./core/events.js";
import { toast, announce } from "./core/toast.js";
import { store } from "./core/state.js";
import { render as renderViewer, getViewer } from "./viewers/registry.js";
import {
  unlockVault,
  lockVault,
  isUnlocked,
  vaultIdOf,
  getVaultEntries,
  getVaultEntryByPath,
  decryptVaultFile,
  vaultEntryAttempts,
} from "./crypto/session.js";
import { esc, el } from "./core/utils.js";

const Q = (sel) => document.querySelector(sel);
const Qa = (sel) => [...document.querySelectorAll(sel)];

function buildByPath(entries) {
  return new Map(entries.map((e) => [e.path, e]));
}

function lastPathOf(p) {
  const i = p.lastIndexOf("/");
  return i >= 0 ? p.slice(i + 1) : p;
}

function dirOf(p) {
  const i = p.lastIndexOf("/");
  return i >= 0 ? p.slice(0, i) : "";
}

async function boot() {
  const cfg = await loadConfig();
  initTheme(cfg.defaultTheme || "system");

  const manifest = await loadManifest();
  const entries = manifest.entries;
  const byPath = manifest.byPath;

  // Identidad de marca.
  document.querySelectorAll("[data-brand]").forEach((node) => {
    node.textContent = cfg.appName;
  });

  const searchEngine = new SearchEngine(entries, byPath);
  const searchInput = Q("#search-input");
  const searchResults = Q("#search-results");
  const treeContainer = Q("#public-tree");

  // Arbol publico.
  const treeApi = createTree(treeContainer, entries, {
    onOpen: async (entry) => {
      await openEntry(entry);
    },
  });

  wireSearch(searchEngine, entries, byPath, searchInput, searchResults);
  wireKeyboard(searchInput);
  wireRouter(manifest, byPath);
  wireWelcome(byPath);
  wireSidebar();

  // Apertura inicial por hash (enlace compartido #/file/<ruta>).
  const initial = parseRoute();
  if (initial) {
    const entry = byPath.get(initial);
    if (entry) openEntry(entry);
  }

  // Bovedas cifradas.
  try {
    const vaults = await loadVaultsIndex();
    if (vaults.length) initVaultUi(vaults, byPath);
  } catch (err) {
    console.warn("[vault] sin indice de bovedas:", err);
  }
}

// ---------------------------------------------------------------------------
// Apertura publica de un archivo (desde arbol, router o historial).
// ---------------------------------------------------------------------------

async function openEntry(entry) {
  const pane = Q("#pane");
  const bar = Q("#viewer-bar");
  const crumb = Q("#breadcrumb");
  const badge = Q("#lang-badge");
  const actions = Q("#file-actions");
  const btnWrap = Q("#btn-wrap");
  const btnCopy = Q("#btn-copy");
  const btnDownload = Q("#btn-download");

  // Ruta en el hash para enlazar/compartir: el router la re-abre (un solo render).
  const targetHash = "#/file/" + encodeURIComponent(entry.path);
  if (window.location.hash !== targetHash) {
    window.location.hash = targetHash;
    return;
  }

  welcomeHide();
  bar.hidden = false;

  crumb.replaceChildren(
    el("a", { href: "#/file/" + encodeURIComponent(dirOf(entry.path)), text: dirOf(entry.path) || "raiz" }),
    el("span", { class: "crumb-sep", text: "/" }),
    el("span", { class: "crumb-file", text: entry.name })
  );

  badge.textContent = entry.language || entry.ext || "";
  badge.hidden = !badge.textContent;

  if (btnWrap) btnWrap.hidden = !(entry.viewer === "code" && !entry.encrypted);
  if (btnCopy) btnCopy.hidden = entry.encrypted;
  if (btnDownload) btnDownload.hidden = false;

  btnCopy.onclick = async () => {
    try {
      const text = entry.encrypted
        ? await decryptVaultFile(vaultIdOf(), entry.id)
        : await entry.fetch();
      await copyToClipboard(text);
      toast("Copiado al portapapeles");
    } catch (err) {
      toast("No se pudo copiar: " + (err && err.message ? err.message : err), "error");
    }
  };
  btnDownload.onclick = () => {
    if (entry.encrypted) {
      toast("La boveda cifrada no usa descarga directa: usa el boton de copia o bloques el visor", "warn");
      return;
    }
    const link = document.createElement("a");
    link.href = entry.downloadUrl || entry.path;
    link.download = entry.name;
    link.rel = "noopener";
    document.body.append(link);
    link.click();
    link.remove();
  };

  emit("viewer:open", { entry, pane });

  const viewer = await getViewer(entry.viewer);
  const container = pane;
  container.textContent = "";
  try {
    await viewer.render(entry, container, {
      toast,
      onData: (d) => announce(d && d.announce),
    });
  } catch (err) {
    container.textContent = "";
    const box = el("div", { class: "viewer-error", role: "alert" }, [
      el("p", {}, ["No se pudo abrir " + esc(entry.name)]),
      el("p", { class: "muted" }, [esc(err && err.message ? err.message : String(err))]),
    ]);
    container.append(box);
  }

  Qa(".tree-row").forEach((r) => {
    r.classList.toggle("selected", r.dataset.path === entry.path);
  });
}

// ---------------------------------------------------------------------------
// Busqueda: filtros + resultados en <ul> con contador accesible.
// ---------------------------------------------------------------------------

function wireSearch(engine, entries, byPath, input, results) {
  input.closest("form")?.addEventListener("submit", (ev) => ev.preventDefault());
  let timer = null;
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => runSearch(engine, input.value, results), 180);
  });
  input.addEventListener("focus", () => runSearch(engine, input.value, results));

  results.addEventListener("mousedown", (ev) => {
    const row = ev.target.closest("[data-path]");
    if (row) {
      ev.preventDefault();
      const entry = byPath.get(row.dataset.path);
      if (entry) openEntry(entry);
    }
  });

  results.addEventListener("click", (ev) => {
    const row = ev.target.closest("[data-path]");
    if (row) {
      ev.preventDefault();
      results.hidden = true;
    }
  });
}

async function runSearch(engine, raw, results) {
  const q = raw.trim();
  results.textContent = "";
  if (!q) {
    results.hidden = true;
    return;
  }
  const r = engine.search(q);
  const list = el("ul", { class: "search-list", role: "listbox", "aria-label": "Resultados de busqueda" });
  if (!r.results.length) {
    list.append(el("li", { class: "search-empty", role: "option" }, ["Sin coincidencias"]));
  } else {
    for (const e of r.results) {
      list.append(
        el("li", { class: "search-item", role: "option", dataset: { path: e.path } }, [
          el("span", { class: "search-name" }, e.name),
          el("span", { class: "search-path" }, dirOf(e.path)),
        ])
      );
    }
  }
  results.append(list);
  results.hidden = false;
  announce(list.querySelector(".search-empty") ? "Sin coincidencias" : r.results.length + " resultados");
}

// ---------------------------------------------------------------------------
// Teclado y router.
// ---------------------------------------------------------------------------

function wireKeyboard(searchInput) {
  initGlobalKeyboard({
    onSearchFocus: () => {
      searchInput.focus();
      searchInput.select();
    },
    onEscape: () => {
      document.querySelectorAll(".dialog").forEach((d) => (d.hidden = true));
      const s = Q("#search-results");
      if (s && !s.hidden) s.hidden = true;
    },
  });
}

function wireRouter(_manifest, byPath) {
  initRouter((path) => {
    const entry = byPath.get(path) || getVaultEntryByPath(path);
    if (entry) openEntry(entry);
    else {
      announce("Archivo no encontrado: " + path);
      toast("No existe un archivo publico con esa ruta", "warn");
    }
  });
}

// ---------------------------------------------------------------------------
// Pantalla de bienvenida (modo vacio / sin boveda desbloqueada).
// ---------------------------------------------------------------------------

function wireWelcome(byPath) {
  const welcome = Q("#welcome-screen");
  const desc = Q("#app-desc");

  if (byPath.size === 0) {
    desc.textContent = "Aun no hay archivos publicos. Añade contenido en la carpeta vault/ de tu repositorio y regenera el manifiesto.";
    welcome.hidden = false;
    return;
  }
  welcome.hidden = true;
}

// Panel lateral: toggle off-canvas en movil con scrim (cierra al clicar fuera).
function wireSidebar() {
  const btn = Q("#sidebar-toggle");
  const sidebar = Q("#sidebar");
  const scrim = Q("#scrim");
  if (!btn || !sidebar) return;

  function toggle() {
    const open = sidebar.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (scrim) scrim.hidden = !open;
  }

  btn.addEventListener("click", toggle);
  if (scrim) scrim.addEventListener("click", toggle);
}

function welcomeHide() {
  const w = Q("#welcome-screen");
  if (w) w.hidden = true;
}

// ---------------------------------------------------------------------------
// Boveda cifrada: dialogo de desbloqueo + arbol + visor de entrada.
// ---------------------------------------------------------------------------

function initVaultUi(vaults, byPath) {
  const dialogo = Q("#unlock-dialog");
  const sel = Q("#vault-select");
  const pass = Q("#unlock-password");
  const errBox = Q("#unlock-error");
  const riskPanel = Q("#dialog-risk");
  const unlockPanel = Q("#dialog-unlock");
  const riskAccept = Q("#risk-accept");
  const btnUnlock = Q("#btn-unlock-submit");
  const btnCancel = Q("#btn-unlock-cancel");
  const btnClose = Q("#btn-dialog-close");
  const vaultChip = Q("#vault-chip");
  const vaultStatus = Q("#vault-status");
  const vaultTree = Q("#vault-tree");
  const vaultTreeSection = Q("#vault-tree-section");
  const btnVault = Q("#btn-vault");

  for (const v of vaults) {
    const o = document.createElement("option");
    o.value = v.id;
    o.textContent = typeof v.label === "string" ? v.label : (v.label && v.label.name) || v.id;
    sel.append(o);
  }

  function openDialog() {
    errBox.hidden = true;
    const accepted = store.isRiskAccepted();
    riskPanel.hidden = accepted;
    unlockPanel.hidden = !accepted;
    dialogo.hidden = false;
    (accepted ? sel : riskAccept).focus();
  }

  function closeDialog() {
    dialogo.hidden = true;
    errBox.hidden = true;
  }

  btnVault.addEventListener("click", () => {
    if (isUnlocked()) {
      lockVault();
      vaultStatus.textContent = "Bloqueado";
      vaultChip.dataset.state = "locked";
      vaultTree.textContent = "";
      if (vaultTreeSection) vaultTreeSection.hidden = true;
      toast("Boveda bloqueada");
      return;
    }
    openDialog();
  });

  btnCancel.addEventListener("click", closeDialog);
  btnClose.addEventListener("click", closeDialog);

  const btnWelcome = Q("#btn-unlock-welcome");
  if (btnWelcome) btnWelcome.addEventListener("click", openDialog);

  riskAccept.addEventListener("change", () => {
    if (riskAccept.checked) {
      riskPanel.hidden = true;
      unlockPanel.hidden = false;
      sel.focus();
    }
    errBox.hidden = true;
  });

  btnUnlock.addEventListener("click", async () => {
    const v = vaults.find((x) => x.id === sel.value);
    const password = pass.value;
    if (!v || !password) {
      showUnlockError("Elige una boveda y escribe la contrasena");
      return;
    }
    if (!riskAccept.checked && !store.isRiskAccepted()) {
      showUnlockError("Debes aceptar el aviso de riesgos para desbloquear");
      return;
    }
    try {
      await unlockVault(v, password);
      dialogo.hidden = true;
      pass.value = "";
      vaultStatus.textContent = "Desbloqueada";
      vaultChip.dataset.state = "unlocked";
      store.setRiskAccepted();

      const entries = getVaultEntries();
      createTree(vaultTree, entries, {
        onOpen: async (e) => openEntry(e),
      });
      if (vaultTreeSection) vaultTreeSection.hidden = false;
      announce("Boveda desbloqueada: " + entries.length + " archivos");
    } catch (err) {
      unlockPanel.hidden = false;
      riskPanel.hidden = true;
      showUnlockError((err && err.message) || "No se pudo desbloquear");
      if (err && err.code === "AUTH_FAILED") {
        const n = vaultEntryAttempts();
        if (n >= (getConfig().security ? getConfig().security.maxAttemptsNotice : 5)) {
          toast("Reintentos agotados por ahora: recarga la pagina para reintentar", "warn", 6000);
        }
      }
    }
  });

  function showUnlockError(msg) {
    errBox.textContent = msg;
    errBox.hidden = false;
  }
}

// Datos cedidos por scripts (cifrados). Se inyectan despues del unlock.
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.append(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

boot().catch((err) => {
  console.error("[vimap] arranque fallido:", err);
  announce("No se pudo cargar la aplicacion");
  const pane = Q("#pane");
  if (pane) {
    pane.textContent = "";
    pane.append(el("div", { class: "viewer-error" }, [
      el("p", {}, ["No se pudo cargar ViMap"]),
      el("p", { class: "muted" }, [esc(err && err.message ? err.message : String(err))]),
    ]));
  }
});
