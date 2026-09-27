// Seleccion multiple con una unica fuente de verdad por vista.
// Cada vista (escritorio o ventana de carpeta) guarda { ids: Set<path>, anchor }.
// El DOM (.selected) es solo una proyeccion que se repinta desde el store,
// asi los re-renderizados no pierden la seleccion. Los identificadores son
// rutas (no indices de array); el rango (Shift+clic) sigue el orden DOM.

const byView = new WeakMap();

function itemsOf(container) {
  return [...container.querySelectorAll(".dicon")];
}

// Raiz estable de la vista: el contenedor del escritorio persiste, y en el
// explorador la ventana (win.el) persiste aunque la rejilla se recree.
function viewRootOf(container) {
  if (!container) return null;
  if (container.id === "desktop-icons") return container;
  const win = container.closest ? container.closest(".win") : null;
  return win || container;
}

function stateOf(root, create) {
  let st = root ? byView.get(root) : undefined;
  if (!st && create && root) {
    st = { ids: new Set(), anchor: null };
    byView.set(root, st);
  }
  return st || null;
}

function pathOf(item) {
  return item && item.dataset ? item.dataset.path || "" : "";
}

function paint(container) {
  const st = stateOf(viewRootOf(container), false);
  const ids = st ? st.ids : new Set();
  for (const n of itemsOf(container)) {
    const p = pathOf(n);
    n.classList.toggle("selected", !!p && ids.has(p));
  }
}

function rangeSelect(container, st, path) {
  const all = itemsOf(container).map(pathOf);
  const aIdx = all.indexOf(st.anchor);
  const iIdx = all.indexOf(path);
  if (aIdx < 0 || iIdx < 0) {
    st.ids = new Set([path]);
    st.anchor = path;
    return;
  }
  const lo = Math.min(aIdx, iIdx);
  const hi = Math.max(aIdx, iIdx);
  st.ids = new Set(all.slice(lo, hi + 1).filter((p) => !!p));
  st.anchor = path;
}

function selectOnlyVisual(container, item) {
  for (const n of itemsOf(container)) n.classList.remove("selected");
  item.classList.add("selected");
}

export function clickSelect(container, item, { ctrl = false, shift = false } = {}) {
  if (!item) return;
  const path = pathOf(item);
  if (!path) {
    // Iconos sin ruta (papelera): solo marca visual, fuera del store.
    selectOnlyVisual(container, item);
    return;
  }
  const st = stateOf(viewRootOf(container), true);
  if (shift) {
    rangeSelect(container, st, path);
  } else if (ctrl) {
    if (st.ids.has(path)) st.ids.delete(path);
    else st.ids.add(path);
    st.anchor = path;
  } else {
    st.ids = new Set([path]);
    st.anchor = path;
  }
  paint(container);
}

export function clearSelection(container) {
  const root = viewRootOf(container);
  if (root) byView.delete(root);
  if (!container) return;
  for (const n of itemsOf(container)) n.classList.remove("selected");
}

// Limpia el store de una vista aunque su rejilla se haya recreado
// (p. ej. al navegar a otra carpeta).
export function clearViewSelection(viewRoot) {
  const root = viewRootOf(viewRoot);
  if (root) byView.delete(root);
  const scope = root || viewRoot;
  if (scope && scope.querySelectorAll) {
    for (const n of scope.querySelectorAll(".dicon.selected")) n.classList.remove("selected");
  }
}

export function selectAll(container) {
  if (!container) return;
  const st = stateOf(viewRootOf(container), true);
  const withPath = itemsOf(container).map(pathOf).filter((p) => !!p);
  st.ids = new Set(withPath);
  st.anchor = withPath.length ? withPath[0] : null;
  paint(container);
}

// Reemplaza la seleccion por las rutas dadas (normaliza el inicio de arrastre).
export function selectPaths(container, paths) {
  if (!container) return;
  const st = stateOf(viewRootOf(container), true);
  const list = (paths || []).filter((p) => !!p);
  st.ids = new Set(list);
  st.anchor = list.length ? list[list.length - 1] : null;
  paint(container);
}

// Repinta la vista desde el store (llamar tras cada render).
export function reapplySelection(container) {
  if (!container) return;
  paint(container);
}

export function selectedPaths(container) {
  if (!container) return [];
  const st = stateOf(viewRootOf(container), false);
  if (!st) return [];
  const ordered = itemsOf(container).map(pathOf).filter((p) => !!p && st.ids.has(p));
  // Podar del store las rutas que ya no existen en la vista (stale).
  st.ids = new Set(ordered);
  return ordered;
}

export function hasSelection(container) {
  return selectedPaths(container).length > 0;
}
