// Aplicaciones sobre el escritorio: Bloc de notas (editor), visores de
// imagen/binario/pdf (descarga), papelera, versiones, buscar, copia de
// seguridad y panel de administracion. Toda la criptografia vive en
// crypto/session; aqui solo se orquesta.

import { session } from "../crypto/session.js";
import { humanLabel } from "../core/languages.js";
import { downloadText, downloadBlob, b64ToBytes, el, esc, baseName, formatBytes } from "../core/utils.js";
import { toast } from "../core/toast.js";
import { openWindow, getWindow, focusWindow, closeWindow } from "./windows.js";
import { commit, onStoreChange } from "./store.js";
import { askConfirm } from "./dialogs.js";
import { iconSvg } from "./icons.js";

// ---------------------------------------------------------------------------
// Utilidades de la UI
// ---------------------------------------------------------------------------

function setBtnBusy(btn, busy) {
  if (!btn) return;
  btn.disabled = busy;
  btn.classList.toggle("busy", busy);
  btn.setAttribute("aria-busy", busy ? "true" : "false");
}

// ---------------------------------------------------------------------------
// Apertura de archivos
// ---------------------------------------------------------------------------

export async function openFileWindow(entry) {
  const path = entry.path;
  // Recientes: embudo unico de apertura (cubre crear, versiones, buscar,
  // recientes y router). Solo ficheros vivos; touchRecent lo garantiza.
  try {
    session.touchRecent(path);
    commit().catch(() => {});
  } catch {
    /* no bloquea la apertura */
  }
  if (getWindow("file:" + path)) {
    focusWindow(getWindow("file:" + path));
    return;
  }
  if (entry.viewer === "image") return openImageViewer(entry);
  if (entry.viewer === "pdf" || entry.viewer === "binary") return openDeferredViewer(entry);
  return openNotepad(entry);
}

export async function openEntryAtPath(path) {
  const entry = session.getByPath(path);
  if (!entry) {
    toast("No existe esa ruta", "warn");
    return;
  }
  return openFileWindow(entry);
}

// ---------------------------------------------------------------------------
// Bloc de notas
// ---------------------------------------------------------------------------

export async function openNotepad(entry) {
  const path = entry.path;
  if (getWindow("file:" + path)) {
    focusWindow(getWindow("file:" + path));
    return;
  }
  let content;
  try {
    content = await session.openEntry(path);
  } catch (err) {
    toast("No se pudo cargar el contenido", "error");
    return;
  }

  openWindow({
    id: "file:" + path,
    title: entry.name + " — Bloc de notas",
    icon: iconSvg("note"),
    width: 660,
    height: 460,
    content: (body) => buildNotepad(body, entry, content),
  });
}

function buildNotepad(body, entry, initial) {
  const win = getWindow("file:" + entry.path);
  const area = el("textarea", {
    class: "notepad-area",
    spellcheck: "false",
    wrap: "off",
    "aria-label": "Contenido de " + entry.name,
  });
  area.value = initial;

  const saveBtn = el("button", { class: "btn btn-ghost btn-sm", type: "button" });
  saveBtn.innerHTML = iconSvg("save");
  saveBtn.appendChild(el("span", { class: "btn-label", text: "Guardar" }));

  const copyBtn = el("button", { class: "btn btn-ghost btn-sm", type: "button" });
  copyBtn.innerHTML = iconSvg("copy");
  copyBtn.appendChild(el("span", { class: "btn-label", text: "Copiar" }));

  const dlBtn = el("button", { class: "btn btn-ghost btn-sm", type: "button" });
  dlBtn.innerHTML = iconSvg("download");
  dlBtn.appendChild(el("span", { class: "btn-label", text: "Descargar" }));

  const toolbar = el("div", { class: "notepad-bar" }, [saveBtn, copyBtn, dlBtn]);
  const status = el("div", { class: "notepad-status" });
  const lang = el("span", {});
  const chars = el("span", {});
  const pathEl = el("span", { class: "notepad-path", title: entry.path });
  status.append(lang, chars, pathEl);
  body.append(toolbar, area, status);

  let dirty = false;
  function setStatus() {
    lang.textContent = humanLabel(entry.language);
    chars.textContent = area.value.length + " caracteres";
    pathEl.textContent = entry.path;
    win.title = (dirty ? "* " : "") + entry.name + " — Bloc de notas";
    win.el.querySelector(".win-title").textContent = win.title;
  }
  setStatus();

  async function save() {
    if (!session.getByPath(entry.path) && !session.getTrashed().some((t) => t.path === entry.path)) {
      toast("El archivo ya no existe", "error");
      closeWindow(win);
      return;
    }
    setBtnBusy(saveBtn, true);
    try {
      await session.updateFile(entry.path, area.value);
      if (await commit()) {
        dirty = false;
        setStatus();
        toast("Guardado", "ok");
      }
    } catch (err) {
      toast((err && err.message) || "No se pudo guardar", "error");
    } finally {
      setBtnBusy(saveBtn, false);
    }
  }

  saveBtn.addEventListener("click", save);
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(area.value);
      toast("Contenido copiado al portapapeles", "ok");
    } catch (err) {
      toast("No se pudo copiar", "error");
    }
  });
  dlBtn.addEventListener("click", () => {
    downloadText(entry.name, area.value);
  });

  area.addEventListener("input", () => {
    if (!dirty) {
      dirty = true;
      setStatus();
    }
    chars.textContent = area.value.length + " caracteres";
  });
  area.addEventListener("keydown", (ev) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key === "s" && !ev.altKey) {
      ev.preventDefault();
      ev.stopPropagation();
      save();
    }
  });

  setTimeout(() => area.focus(), 0);
}

// ---------------------------------------------------------------------------
// Visor de imagen
// ---------------------------------------------------------------------------

const IMAGE_MIME = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  bmp: "image/bmp",
};

export async function openImageViewer(entry) {
  const path = entry.path;
  let b64;
  try {
    b64 = await session.openEntry(path);
  } catch (err) {
    toast("No se pudo cargar la imagen", "error");
    return;
  }
  const mime = IMAGE_MIME[entry.ext] || "application/octet-stream";
  const dataUrl = "data:" + mime + ";base64," + b64;

  openWindow({
    id: "file:" + path,
    title: entry.name + " — Visor",
    icon: iconSvg("image"),
    width: 720,
    height: 520,
    content: (body) => {
      const dlBtn = el("button", { class: "btn btn-ghost btn-sm", type: "button" });
      dlBtn.innerHTML = iconSvg("download");
      dlBtn.appendChild(el("span", { class: "btn-label", text: "Descargar" }));
      dlBtn.addEventListener("click", () => downloadStored(entry.name, b64));

      const img = el("img", {
        src: dataUrl,
        alt: "Imagen " + entry.name,
        class: "viewer-image",
      });
      const side = el("div", { class: "viewer-pane" }, [
        el("div", { class: "viewer-actions" }, [dlBtn]),
        el("div", { class: "viewer-stage" }),
      ]);
      side.querySelector(".viewer-stage").appendChild(img);
      body.appendChild(side);
    },
  });
}

// ---------------------------------------------------------------------------
// Visor diferido (pdf / binario): sin previa por CSP; solo descarga
// ---------------------------------------------------------------------------

export async function openDeferredViewer(entry) {
  const path = entry.path;
  const infoIcon = entry.viewer === "pdf" ? "pdf" : "binary";
  openWindow({
    id: "file:" + path,
    title: entry.name + " — " + humanLabel(entry.language),
    icon: iconSvg(infoIcon),
    width: 460,
    height: 260,
    content: (body) => {
      const dlBtn = el("button", { class: "btn btn-primary", type: "button" });
      dlBtn.textContent = "Descargar archivo";
      dlBtn.addEventListener("click", async () => {
        setBtnBusy(dlBtn, true);
        try {
          const text = await session.openEntry(path);
          downloadStored(entry.name, text);
        } catch (err) {
          toast("No se pudo descargar", "error");
        } finally {
          setBtnBusy(dlBtn, false);
        }
      });
      body.append(
        el("div", { class: "viewer-deferred" }, [
          el("p", {}, [
            entry.viewer === "pdf"
              ? "Este PDF no se puede previsualizar aqui (limites de seguridad del navegador)."
              : "Este tipo de archivo no tiene vista previa en el navegador.",
          ]),
          el("p", { class: "muted" }, ["El contenido se descifra en tu navegador al descargarlo."]),
          el("div", { class: "dlg-actions" }, [dlBtn]),
        ])
      );
    },
  });
}

// El contenido almacenado puede ser texto plano o base64 (binarios importados).
export function contentToBytes(text) {
  if (typeof text === "string" && /^[A-Za-z0-9+/]+={0,2}$/.test(text.trim()) && (text.length % 4) === 0) {
    try {
      return b64ToBytes(text.trim());
    } catch {
      /* no es base64: tratar como texto */
    }
  }
  return new TextEncoder().encode(text);
}

export function downloadStored(name, text) {
  const bytes = contentToBytes(text);
  const type = /^[A-Za-z0-9+/]+={0,2}$/.test(text.trim()) ? "application/octet-stream" : "text/plain;charset=utf-8";
  downloadBlob(name, new Blob([bytes], { type }));
}

// ---------------------------------------------------------------------------
// Papelera
// ---------------------------------------------------------------------------

export function openTrashWindow() {
  if (getWindow("trash")) {
    focusWindow(getWindow("trash"));
    return;
  }
  const win = openWindow({
    id: "trash",
    title: "Papelera",
    icon: iconSvg("trash"),
    width: 540,
    height: 400,
    content: (body) => renderTrashBody(body),
  });
  win.el.querySelector(".win-body").classList.add("has-dlg-actions");
}

function renderTrashBody(body) {
  body.textContent = "";
  const list = session.getTrashed();
  const box = el("div", { class: "version-list" });
  if (!list.length) {
    box.appendChild(el("p", { class: "muted", text: "La papelera esta vacia" }));
  }
  for (const e of list) {
    const row = el("div", { class: "version-row" });
    const info = el("div", { class: "version-meta" }, [
      el("strong", { text: e.path }),
      el("span", { class: "muted", text: (e.trashedAt || "").slice(0, 16).replace("T", " ") + "  " + formatBytes(e.size) }),
    ]);
    const actions = el("div", { class: "version-actions" }, [
      el("button", { class: "btn btn-ghost btn-sm", type: "button", text: "Restaurar" }),
      el("button", { class: "btn btn-danger-ghost btn-sm", type: "button", text: "Borrar" }),
    ]);
    actions.children[0].addEventListener("click", async () => {
      setBtnBusy(actions.children[0], true);
      try {
        session.restorePaths([e.path]);
        if (await commit()) {
          toast("Restaurado", "ok");
          renderTrashBody(body);
        }
      } finally {
        setBtnBusy(actions.children[0], false);
      }
    });
    actions.children[1].addEventListener("click", async () => {
      const yes = await askConfirm({ title: "Borrar para siempre", text: 'Se eliminara\u201c' + e.path + '\u201d definitivamente.' });
      if (!yes) return;
      setBtnBusy(actions.children[1], true);
      try {
        session.purgePaths([e.path]);
        if (await commit()) {
          toast("Eliminado", "ok");
          renderTrashBody(body);
        }
      } finally {
        setBtnBusy(actions.children[1], false);
      }
    });
    row.append(info, actions);
    box.append(row);
  }
  const emptyBtn = el("button", { class: "btn btn-danger", type: "button", text: "Vaciar papelera" });
  emptyBtn.addEventListener("click", async () => {
    const yes = await askConfirm({ title: "Vaciar papelera", text: "Se eliminaran definitivamente todos los archivos de la papelera." });
    if (!yes) return;
    setBtnBusy(emptyBtn, true);
    try {
      session.emptyTrash();
      if (await commit()) {
        toast("Papelera vaciada", "ok");
        renderTrashBody(body);
      }
    } finally {
      setBtnBusy(emptyBtn, false);
    }
  });
  body.append(box, el("div", { class: "dlg-actions" }, [emptyBtn]));
}

// ---------------------------------------------------------------------------
// Versiones
// ---------------------------------------------------------------------------

export function openVersionsWindow(entry) {
  const path = entry.path;
  const id = "versions:" + path;
  if (getWindow(id)) {
    focusWindow(getWindow(id));
    return;
  }
  const win = openWindow({
    id,
    title: "Versiones de " + baseName(path),
    icon: iconSvg("clock"),
    width: 500,
    height: 380,
    content: (body) => renderVersionsBody(body, entry),
  });
  win.el.querySelector(".win-body").classList.add("has-dlg-actions");
}

function renderVersionsBody(body, entry) {
  body.textContent = "";
  const versions = session.fileVersions(entry.path);
  const box = el("div", { class: "version-list" });
  if (!versions.length) box.appendChild(el("p", { class: "muted", text: "Sin versiones" }));
  for (const v of versions) {
    const isCurrent = v.index === versions[0].index;
    const row = el("div", { class: "version-row" });
    const info = el("div", { class: "version-meta" }, [
      el("strong", { text: "v" + (v.index + 1) + (isCurrent ? " (actual)" : "") }),
      el("span", { class: "muted", text: v.createdAt.slice(0, 19).replace("T", " ") + "  ·  " + formatBytes(v.size) }),
    ]);
    const actions = el("div", { class: "version-actions" });
    if (!isCurrent) {
      const btn = el("button", { class: "btn btn-ghost btn-sm", type: "button", text: "Restaurar" });
      btn.addEventListener("click", async () => {
        setBtnBusy(btn, true);
        try {
          session.restoreVersion(entry.path, v.index);
          if (await commit()) {
            toast("Version restaurada", "ok");
            renderVersionsBody(body, entry);
          }
        } finally {
          setBtnBusy(btn, false);
        }
      });
      actions.append(btn);
    } else {
      const btn = el("button", { class: "btn btn-ghost btn-sm", type: "button", text: "Abrir" });
      btn.addEventListener("click", () => openEntryAtPath(entry.path));
      actions.append(btn);
    }
    row.append(info, actions);
    box.append(row);
  }
  body.append(box, el("div", { class: "dlg-actions" }, [el("span", {}, [])]));
}

// ---------------------------------------------------------------------------
// Buscar
// ---------------------------------------------------------------------------

export function openSearchWindow(engine) {
  const id = "search";
  if (getWindow(id)) {
    focusWindow(getWindow(id));
    const input = document.querySelector("#search-window-input");
    if (input) {
      input.focus();
      input.select();
    }
    return getWindow(id);
  }
  const win = openWindow({
    id,
    title: "Buscar en el vault",
    icon: iconSvg("search"),
    width: 520,
    height: 440,
    content: (body) => buildSearchBody(body, engine),
  });
  setTimeout(() => {
    const input = document.querySelector("#search-window-input");
    if (input) input.focus();
  }, 0);
  return win;
}

function buildSearchBody(body, engine) {
  const input = el("input", {
    id: "search-window-input",
    type: "search",
    class: "field-input",
    placeholder: "Nombre, ruta, ext:py, lang:python, path:src...",
    autocomplete: "off",
    spellcheck: "false",
    "aria-label": "Buscar en el vault",
  });
  const results = el("div", { class: "search-results-inline", role: "listbox" });
  body.append(el("div", { class: "search-window-bar" }, [input]), results);

  let activeIdx = -1;
  const closeResults = () => {
    results.textContent = "";
    activeIdx = -1;
  };

  const open = (path) => {
    const e = session.getByPath(path);
    if (e) {
      closeWindow(win);
      openFileWindow(e);
    }
  };

  input.addEventListener("input", () => {
    const q = input.value.trim();
    results.textContent = "";
    activeIdx = -1;
    if (!engine || !q) {
      if (!q) results.appendChild(el("p", { class: "muted", text: "Escribe para buscar" }));
      return;
    }
    const { results: found } = engine.search(q);
    if (!found.length) {
      results.appendChild(el("p", { class: "muted", text: "Sin resultados" }));
      return;
    }
    for (const r of found.slice(0, 25)) {
      const ql = q.toLowerCase();
      const hidx = r.path.toLowerCase().indexOf(ql);
      const item = el("button", { class: "search-item", type: "button", role: "option" });
      item.innerHTML =
        '<span class="search-path">' +
        esc(r.path.slice(0, hidx === -1 ? r.path.length : hidx)) +
        (hidx === -1 ? "" : "<mark>" + esc(r.path.slice(hidx, hidx + ql.length)) + "</mark>" + esc(r.path.slice(hidx + ql.length))) +
        "</span>" +
        '<span class="sr-type">' + esc(humanLabel(r.language)) + "</span>";
      item.addEventListener("click", () => open(r.path));
      results.append(item);
    }
  });

  input.addEventListener("keydown", (ev) => {
    const items = [...results.querySelectorAll(".search-item")];
    if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
      ev.preventDefault();
      if (!items.length) return;
      activeIdx = ev.key === "ArrowDown" ? (activeIdx + 1) % items.length : (activeIdx - 1 + items.length) % items.length;
      items.forEach((i, idx) => i.setAttribute("aria-selected", String(idx === activeIdx)));
      items[activeIdx].scrollIntoView({ block: "nearest" });
    } else if (ev.key === "Enter") {
      ev.preventDefault();
      if (items[activeIdx]) items[activeIdx].click();
      else if (items.length) items[0].click();
    } else if (ev.key === "Escape") {
      ev.stopPropagation();
      if (input.value) {
        input.value = "";
        closeResults();
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Copia de seguridad
// ---------------------------------------------------------------------------

export async function doBackup() {
  try {
    const bundle = await session.exportBundle();
    const stamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-");
    downloadText("vimap-backup-" + stamp + ".json", bundle);
    toast("Copia de seguridad descargada", "ok");
  } catch (err) {
    toast("No se pudo generar la copia: " + ((err && err.message) || err), "error");
  }
}

// ---------------------------------------------------------------------------
// Administracion
// ---------------------------------------------------------------------------

export function openAdminWindow(api, refreshQuota) {
  const id = "admin";
  if (getWindow(id)) {
    focusWindow(getWindow(id));
    return;
  }
  const win = openWindow({
    id,
    title: "Administracion de usuarios",
    icon: iconSvg("users"),
    width: 760,
    height: 500,
    content: (body) => {
      body.textContent = "Cargando...";
      import("../admin.js")
        .then((mod) => mod.renderAdmin(body, { api, refreshQuota }))
        .catch((err) => {
          body.textContent = "No se pudo cargar la administracion: " + ((err && err.message) || err);
        });
    },
  });
  return win;
}