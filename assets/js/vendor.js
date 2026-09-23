// Carga perezosa de librerias vendor locales (mismo origen). Marca marcada y DOMPurify
// ya se cargan al inicio desde index.html; highlight.js solo si hace falta.

const cache = new Map();

function loadScript(src) {
  if (cache.has(src)) return cache.get(src);
  const p = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("No se pudo cargar " + src));
    document.head.appendChild(s);
  });
  cache.set(src, p);
  return p;
}

export const markedReady = () =>
  window.marked ? Promise.resolve() : loadScript("assets/vendor/marked.min.js");

export const dompurifyReady = () =>
  window.DOMPurify ? Promise.resolve() : loadScript("assets/vendor/purify.min.js");

export const highlightJsReady = () =>
  window.hljs ? Promise.resolve() : loadScript("assets/vendor/highlight.min.js");

// Gramaticas extra de highlight.js (ESM locales) registradas bajo demanda.
const EXTRA_GRAMMARS = {
  groovy: "groovy",
  gradle: "gradle",
  properties: "properties",
  dockerfile: "dockerfile",
  powershell: "powershell",
  erlang: "erlang",
  elixir: "elixir",
  fsharp: "fsharp",
  haskell: "haskell",
  clojure: "clojure",
  scala: "scala",
  dart: "dart",
  x86asm: "x86asm",
};

const grammarPromises = new Map();

export async function ensureGrammar(lang) {
  if (!lang) return;
  const file = EXTRA_GRAMMARS[lang];
  if (!file) return;
  if (window.hljs && window.hljs.getLanguage(lang)) return;
  if (grammarPromises.has(lang)) return grammarPromises.get(lang);

  const p = import(`../vendor/hljs/${file}.min.js`)
    .then((mod) => {
      if (window.hljs && !window.hljs.getLanguage(lang) && mod && mod.default) {
        window.hljs.registerLanguage(lang, mod.default);
      }
    })
    .catch((err) => console.warn("[hljs] no se pudo cargar la gramatica", lang, err));
  grammarPromises.set(lang, p);
  return p;
}