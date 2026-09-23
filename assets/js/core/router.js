// Enrutado por hash para compartir/enlazar archivos publicos:  #/file/<path urlencoded>

const PREFIX = "#/file/";

export function parseRoute() {
  const h = window.location.hash;
  if (h.startsWith(PREFIX)) {
    try {
      return decodeURIComponent(h.slice(PREFIX.length));
    } catch {
      return null;
    }
  }
  return null;
}

export function navigateTo(path) {
  const target = PREFIX + encodeURIComponent(path);
  if (window.location.hash === target) return false;
  window.location.hash = target;
  return true;
}

export function initRouter(onOpenByPath) {
  window.addEventListener("hashchange", () => {
    const p = parseRoute();
    if (p) onOpenByPath(p);
  });
}