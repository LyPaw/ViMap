// Arbol de carpetas construido a partir de rutas del manifiesto. Renders en `container`
// con roles ARIA (tree/treeitem), plegado/desplegado y navegacion por teclado (roving).

import { el, esc } from "./utils.js";

const TYPE_ICON = {
  folder: '<svg class="icon tree-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  file: '<svg class="icon tree-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-6Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M13 3v6h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
};

function buildNesting(entries) {
  const root = { dirs: new Map(), files: [] };
  for (const e of entries) {
    const parts = e.path.split("/");
    const fileName = parts.pop();
    let node = root;
    let acc = [];
    for (const part of parts) {
      if (!node.dirs.has(part)) {
        node.dirs.set(part, { name: part, rel: (acc.length ? acc.join("/") + "/" : "") + part, dirs: new Map(), files: [] });
      }
      node = node.dirs.get(part);
      acc.push(part);
    }
    node.files.push({ entry: e, name: fileName });
  }
  return root;
}

export function createTree(container, entries, { onOpen }) {
  container.textContent = "";
  const all = buildNesting(entries);
  const rows = []; // filas planas para navegacion de teclado
  let openRequests = [];

  function renderChildren(node, depth, parentEl, parentRel) {
    const dirs = [...node.dirs.values()].sort((a, b) => a.name.localeCompare(b.name));
    const files = node.files.slice().sort((a, b) => a.name.localeCompare(b.name));

    for (const dir of dirs) {
      const childrenBox = el("div", { class: "tree-children" });
      const row = el("div", {
        class: "tree-row",
        role: "treeitem",
        tabindex: "-1",
        "aria-expanded": "false",
        dataset: { rowRole: "dir", dir: dir.rel, expanded: "false" },
      });
      row.innerHTML = '<span class="tree-arrow"><svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M5 3l6 5-6 5Z" fill="currentColor"/></svg></span>' + TYPE_ICON.folder + '<span class="tree-name">' + esc(dir.name) + "</span>";
      row.style.setProperty("--pad", (10 + depth * 16) + "px");
      row.addEventListener("click", (ev) => toggleDir(row, childrenBox));

      const item = el("div", { class: "tree-item", role: "none" }, [row, childrenBox]);
      item.querySelector(".tree-row").dirNode = item;

      renderChildren(dir, depth + 1, childrenBox, dir.rel);

      row.dataset.flatIndex = String(rows.length);
      rows.push(row);
      parentEl.appendChild(item);
    }

    for (const f of files) {
      const row = el("div", {
        class: "tree-row",
        role: "treeitem",
        tabindex: "-1",
        "aria-selected": "false",
        dataset: { rowRole: "file", path: f.entry.path },
      });
      row.innerHTML = '<span class="tree-arrow"></span>' + TYPE_ICON.file + '<span class="tree-name">' + esc(f.name) + "</span>";
      if (f.entry.tags && f.entry.tags.length) row.title = f.entry.tags.join(", ");
      row.style.setProperty("--pad", (10 + depth * 16) + "px");
      row.addEventListener("click", () => {
        setSelected(row);
        onOpen(f.entry);
      });
      const wrap = el("div", { class: "tree-item", role: "none" }, [row]);
      row.dataset.flatIndex = String(rows.length);
      rows.push(row);
      parentEl.appendChild(wrap);
    }

    if (!dirs.length && !files.length) {
      parentEl.appendChild(el("div", { class: "tree-empty", text: "vacio" }));
    }
  }

  function toggleDir(row, childrenBox, forceOpen) {
    const dir = row.dataset.dir;
    const isOpen = row.dataset.expanded === "true";
    const target = forceOpen === undefined ? !isOpen : forceOpen;
    row.dataset.expanded = String(target);
    row.setAttribute("aria-expanded", String(target));
    childrenBox.classList.toggle("open", target);
    if (target && onDirChange) onDirChange(dir);
    row.scrollIntoView({ block: "nearest" });
  }

  let onDirChange = null;
  container.addEventListener("keydown", onKeydown);

  renderChildren(all, 0, container, "");

  function setSelected(row) {
    for (const r of rows) {
      r.setAttribute("aria-selected", r === row ? "true" : "false");
    }
    row.tabIndex = 0;
  }

  function focusRow(src) {
    src.focus();
    src.scrollIntoView({ block: "nearest" });
  }

  function onKeydown(ev) {
    const idx = rows.indexOf(document.activeElement);
    if (idx === -1) return;
    const row = rows[idx];
    const isDir = row.dataset.rowRole === "dir";
    let next = -1;
    switch (ev.key) {
      case "ArrowDown":
        next = Math.min(rows.length - 1, idx + 1);
        break;
      case "ArrowUp":
        next = Math.max(0, idx - 1);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = rows.length - 1;
        break;
      case "ArrowRight":
        if (isDir && row.dataset.expanded === "false") {
          ev.preventDefault();
          toggleDir(row, row.dirNode.lastChild, true);
        } else if (isDir) {
          ev.preventDefault();
          next = Math.min(rows.length - 1, idx + 1);
        }
        break;
      case "ArrowLeft":
        if (isDir && row.dataset.expanded === "true") {
          ev.preventDefault();
          toggleDir(row, row.dirNode.lastChild, false);
        }
        break;
      case "Enter":
      case " ":
        ev.preventDefault();
        if (isDir) toggleDir(row, row.dirNode.lastChild);
        else {
          setSelected(row);
          const entryPath = row.dataset.path;
          if (entriesByPathMap && entriesByPathMap.has(entryPath)) onOpen(entriesByPathMap.get(entryPath));
        }
        break;
    }
    if (next !== -1) {
      ev.preventDefault();
      focusRow(rows[next]);
    }
  }

  const api = {
    rows,
    toggleAll: (open) => {
      for (const row of rows) {
        if (row.dataset.rowRole === "dir") toggleDir(row, row.dirNode.lastChild, open);
      }
    },
    onDirChange: (fn) => {
      onDirChange = fn;
    },
    revealPath(path) {
      const dirsNeeded = path.split("/").slice(0, -1);
      for (const row of rows) {
        if (row.dataset.rowRole === "dir" && dirsNeeded.includes(row.dataset.dir)) {
          const isOpen = row.dataset.expanded === "true";
          if (!isOpen) toggleDir(row, row.dirNode.lastChild, true);
        }
      }
      const target = rows.find((r) => r.dataset.path === path);
      if (target) {
        setSelected(target);
        target.scrollIntoView({ block: "nearest" });
      }
    },
  };

  // Permite a onKeydown resolver rutas a entries sin closures.
  const entriesByPathMap = new Map(entries.map((e) => [e.path, e]));
  api.entriesByPath = entriesByPathMap;

  if (rows[0]) rows[0].tabIndex = 0; // roving tabindex: solo el primero tabulable
  return api;
}