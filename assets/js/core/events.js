// Bus de eventos minimo para desacoplar modulos (vault, tree, search, viewer).

const listeners = new Map();

export function on(channel, fn) {
  if (!listeners.has(channel)) listeners.set(channel, new Set());
  listeners.get(channel).add(fn);
  return () => off(channel, fn);
}

export function off(channel, fn) {
  if (listeners.has(channel)) listeners.get(channel).delete(fn);
}

export function emit(channel, payload) {
  if (!listeners.has(channel)) return;
  for (const fn of listeners.get(channel)) {
    try {
      fn(payload);
    } catch (err) {
      console.error("[bus]", channel, err);
    }
  }
}