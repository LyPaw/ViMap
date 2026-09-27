// Atajos de teclado globales y foco del buscador.

export function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable
  );
}

export function initGlobalKeyboard({ onSearchFocus, onEscape }) {
  document.addEventListener("keydown", (ev) => {
    const mod = ev.ctrlKey || ev.metaKey || ev.altKey;
    const target = ev.target;

    if (ev.key === "/" && !isTypingTarget(target) && !mod) {
      ev.preventDefault();
      onSearchFocus();
      return;
    }
    if ((ev.key === "s" || ev.key === "k") && (ev.ctrlKey || ev.metaKey) && !ev.altKey) {
      ev.preventDefault();
      onSearchFocus();
      return;
    }
    if (ev.key === "Escape") {
      // Mientras se escribe, Escape solo suelta el foco del campo: cerrar la
      // ventana activa aqui perderia texto sin guardar (Bloc de notas) y los
      // dialogos manejan su propio Escape (stopPropagation en win.el).
      if (isTypingTarget(target)) {
        target.blur();
        return;
      }
      // El menu contextual y el menu Inicio ya cierran con su propio handler
      // de document; no cerrar ademas la ventana activa.
      if (document.querySelector(".context-menu") || document.querySelector("#start-menu")) {
        return;
      }
      onEscape();
    }
  });
}