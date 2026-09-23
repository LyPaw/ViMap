// Notificaciones accesibles (aria-live) y estados transitorios.

let timer = null;

export function toast(message, kind = "info", ms = 3200) {
  const node = document.getElementById("toast");
  if (!node) return;
  node.textContent = message;
  node.className = "toast " + kind;
  node.hidden = false;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    node.hidden = true;
    node.textContent = "";
  }, ms);
}

export function announce(message) {
  // Anuncio de estado via region aria-live (el propio toast).
  toast(message, "info", 2500);
}