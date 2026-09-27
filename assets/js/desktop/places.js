// Lugares virtuales: Favoritos y Recientes. Leen metadatos del manifest
// (cifrado) y abren con las acciones estandar; se refrescan con el store.

import { session } from "../crypto/session.js";
import { el, baseName, formatBytes } from "../core/utils.js";
import { openWindow } from "./windows.js";
import { onStoreChange } from "./store.js";
import { openEntryAtPath } from "./apps.js";
import { openExplorer } from "./explorer.js";
import { iconSvg } from "./icons.js";

function placeRow(path, meta) {
  const isDir = session.getDirPaths().includes(path);
  const row = el("button", { class: "search-item", type: "button", role: "option" });
  const ic = el("span", { class: "sm-icon" });
  ic.innerHTML = iconSvg(isDir ? "folder" : "note");
  row.append(ic, el("span", { class: "search-path", text: (isDir ? baseName(path) : baseName(path)) + (meta ? "  ·  " + meta : "") }));
  row.addEventListener("click", () => {
    if (isDir) openExplorer(path);
    else openEntryAtPath(path);
  });
  return row;
}

function openPlacesWindow({ id, title, icon, emptyText, collect }) {
  const win = openWindow({
    id,
    title,
    icon: iconSvg(icon),
    width: 460,
    height: 420,
    content: (body) => {
      const render = () => {
        body.textContent = "";
        const list = el("div", { class: "search-results-inline" });
        const items = collect();
        if (!items.length) list.appendChild(el("p", { class: "muted", text: emptyText }));
        for (const it of items.slice(0, 100)) list.appendChild(placeRow(it.path, it.meta));
        body.appendChild(list);
      };
      render();
      const off = onStoreChange(() => {
        if (document.contains(body)) render();
        else off();
      });
    },
  });
  return win;
}

export function openFavsWindow() {
  return openPlacesWindow({
    id: "places:favs",
    title: "Favoritos",
    icon: "star",
    emptyText: "Sin favoritos. Usa «Favorito» en el menu contextual de un elemento.",
    collect: () =>
      session.getFavs().map((p) => {
        const e = session.getByPath(p);
        return { path: p, meta: e && e.size != null ? formatBytes(e.size) : e ? "" : "" };
      }),
  });
}

export function openRecentWindow() {
  return openPlacesWindow({
    id: "places:recent",
    title: "Recientes",
    icon: "clock",
    emptyText: "Abre algun archivo y aparecera aqui.",
    collect: () =>
      session.getRecent().map((r) => {
        const e = session.getByPath(r.path);
        return { path: r.path, meta: e && e.updatedAt ? new Date(e.updatedAt).toLocaleString() : "" };
      }),
  });
}
