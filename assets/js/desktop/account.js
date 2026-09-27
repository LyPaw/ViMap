// Ventana "Mi cuenta": cuota usada, sesiones activas con revocacion remota
// y nota de seguridad (sin cambio de contrasena: re-cifrado no soportado).

import { el, formatBytes } from "../core/utils.js";
import { session } from "../crypto/session.js";
import { openWindow } from "./windows.js";
import { askConfirm } from "./dialogs.js";
import { toast } from "../core/toast.js";
import { iconSvg } from "./icons.js";

function fmtDate(ms) {
  try {
    return new Date(Number(ms)).toLocaleString();
  } catch {
    return "";
  }
}

export function openAccountWindow(api, { refreshQuota, onLogout } = {}) {
  const win = openWindow({
    id: "account",
    title: "Mi cuenta",
    icon: iconSvg("shield"),
    width: 480,
    height: 420,
    content: (body) => {
      render(body);
    },
  });

  async function render(body) {
    body.textContent = "";
    const me = session.currentUser() || {};
    const wrap = el("div", { class: "dlg-wrap" });
    wrap.appendChild(el("h3", { class: "tree-heading", text: me.displayName || me.username || "Cuenta" }));

    const quotaBox = el("div", { class: "field" }, [el("span", { class: "field-label", text: "Almacenamiento" })]);
    try {
      const info = await api.me();
      const used = Number(info.quotaUsed) || 0;
      const total = Number(info.quotaBytes) || 0;
      const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
      const bar = el("div", { class: "quota-bar" });
      const fill = el("div", { class: "quota-fill" });
      fill.style.width = pct + "%";
      bar.appendChild(fill);
      quotaBox.append(
        bar,
        el("span", { class: "field-hint", text: formatBytes(used) + " de " + formatBytes(total) + " (" + pct + "%)" })
      );
    } catch {
      quotaBox.appendChild(el("span", { class: "field-hint", text: "No se pudo leer la cuota" }));
    }
    wrap.appendChild(quotaBox);

    wrap.appendChild(el("h3", { class: "tree-heading", text: "Sesiones activas" }));
    const list = el("div", { class: "session-list" });
    wrap.appendChild(list);
    try {
      const sessions = await api.sessions();
      if (!sessions.length) list.appendChild(el("p", { class: "muted", text: "Sin sesiones." }));
      for (const s of sessions) {
        const row = el("div", { class: "session-row" }, [
          el("span", { text: (s.current ? "Este dispositivo · " : "") + "Creada " + fmtDate(s.createdAt) }),
        ]);
        if (s.current) {
          row.appendChild(el("span", { class: "muted", text: "actual" }));
        } else {
          const btn = el("button", { class: "btn btn-ghost btn-sm", type: "button", text: "Revocar" });
          btn.addEventListener("click", async () => {
            const yes = await askConfirm({ title: "Revocar sesion", text: "¿Cerrar la sesion de ese dispositivo?", okLabel: "Revocar" });
            if (!yes) return;
            try {
              await api.revokeSession(s.id);
              toast("Sesion revocada", "ok");
              render(body);
            } catch (err) {
              toast(err.message, "error");
            }
          });
          row.appendChild(btn);
        }
        list.appendChild(row);
      }
    } catch {
      list.appendChild(el("p", { class: "muted", text: "No se pudieron leer las sesiones" }));
    }

    wrap.appendChild(
      el("p", { class: "field-hint", text: "El cambio de contrasena no esta disponible: invalidaria el cifrado del vault." })
    );
    body.appendChild(wrap);
  }

  return win;
}
