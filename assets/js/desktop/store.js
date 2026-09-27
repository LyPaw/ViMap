// Persistencia central: un unico commit que sube blobs y push del manifiesto
// con merge, luego avisa a las vistas (escritorio, exploradores, quota).

import { session } from "../crypto/session.js";
import { toast } from "../core/toast.js";

let refreshQuotaFn = null;
const subs = new Set();
const syncSubs = new Set();
let syncState = { status: "saved", at: 0 };

export function initStore({ refreshQuota } = {}) {
  refreshQuotaFn = refreshQuota;
}

export function onSyncChange(fn) {
  syncSubs.add(fn);
  return () => syncSubs.delete(fn);
}

export function getSyncInfo() {
  return { ...syncState };
}

function setSync(patch) {
  syncState = { ...syncState, ...patch };
  for (const fn of [...syncSubs]) {
    try {
      fn({ ...syncState });
    } catch (err) {
      console.error(err);
    }
  }
}

export function onStoreChange(fn) {
  subs.add(fn);
  return () => subs.delete(fn);
}

// Refresco inmediato de vistas sin persistir (p. ej. estado de "cortado" al
// llenar el portapapeles). El escritorio se re-renderiza escuchando el evento.
export function refreshViews() {
  document.dispatchEvent(new CustomEvent("vimap:refresh-views"));
}

function emit() {
  for (const fn of [...subs]) {
    try {
      fn();
    } catch (err) {
      console.error(err);
    }
  }
}

export async function commit() {
  setSync({ status: "saving" });
  try {
    await session.persist();
    if (refreshQuotaFn) {
      try {
        refreshQuotaFn();
      } catch (err) {
        console.error(err);
      }
    }
    setSync({ status: "saved", at: Date.now() });
    emit();
    return true;
  } catch (err) {
    setSync({ status: "error" });
    if (err && err.code === "QUOTA_EXCEEDED") toast("Cuota de almacenamiento agotada", "error");
    else if (err && err.code === "NETWORK") toast("Sin conexion. Reintentando al volver.", "error");
    else toast((err && err.message) || "Error al guardar", "error");
    return false;
  }
}