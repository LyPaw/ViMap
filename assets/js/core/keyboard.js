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
      if (isTypingTarget(target)) {
        target.blur();
      }
      onEscape();
    }
  });
}