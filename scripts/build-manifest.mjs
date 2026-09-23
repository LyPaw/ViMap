// Escanea vault/ y escribe public/manifest.json. Sin dependencias.
// Uso: node scripts/build-manifest.mjs [--root .] [--vault vault] [--out public/manifest.json]

import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
function arg(name) {
  const i = process.argv.indexOf("--" + name);
  return i >= 0 ? process.argv[i + 1] : null;
}
const ROOT = path.resolve(arg("root") || path.resolve(here, ".."));
const VAULT = path.resolve(ROOT, arg("vault") || "vault");
const OUT = path.resolve(ROOT, arg("out") || "public/manifest.json");

const MD_RE = /\.(md|mdx|markdown|mdown|markdn)$/i;
const IMG_RE = /\.(png|jpe?g|gif|webp|avif|svg|ico|bmp)$/i;
const PDF_RE = /\.pdf$/i;
const CODE_EXT = new Set([
  "js","mjs","cjs","jsx","ts","tsx","json","html","css","scss","sass","less",
  "xml","svg","yml","yaml","toml","ini","conf","sh","bash","zsh","ps1","py",
  "rb","php","java","cs","c","h","cc","cpp","hpp","go","rs","sql","lua","pl",
  "r","swift","kt","dart","scala","clj","fs","hs","ex","exs","erl","gradle",
  "groovy","properties","proto","graphql","dockerfile","vue","svelte",
]);
const TEXT_EXT = new Set(["txt","log","csv","tsv","conf","cfg","env","properties"]);
const HLJS = {
  js:"javascript",mjs:"javascript",cjs:"javascript",jsx:"javascript",
  ts:"typescript",tsx:"typescript",json:"json",html:"xml",htm:"xml",
  css:"css",scss:"scss",sass:"scss",less:"less",xml:"xml",svg:"xml",
  yml:"yaml",yaml:"yaml",toml:"ini",ini:"ini",conf:"ini",sh:"bash",
  bash:"bash",zsh:"bash",ps1:"powershell",py:"python",rb:"ruby",php:"php",
  java:"java",cs:"csharp",c:"c",h:"c",cc:"cpp",cpp:"cpp",hpp:"cpp",go:"go",
  rs:"rust",sql:"sql",lua:"lua",pl:"perl",r:"r",swift:"swift",kt:"kotlin",
  dart:"dart",scala:"scala",clj:"clojure",fs:"fsharp",hs:"haskell",
  ex:"elixir",exs:"elixir",erl:"erlang",gradle:"gradle",groovy:"groovy",
  properties:"properties",proto:"protobuf",graphql:"graphql",
  dockerfile:"dockerfile",vue:"markup",svelte:"markup",
};

function classify(abs, rel) {
  const name = path.basename(rel);
  const ext = path.extname(name).toLowerCase().replace(/^\./, "");
  if (MD_RE.test(name)) return { viewer: "markdown", language: "markdown", category: "nota" };
  if (IMG_RE.test(name)) return { viewer: "image", language: null, category: "imagen" };
  if (PDF_RE.test(name)) return { viewer: "pdf", language: null, category: "documento" };
  if (CODE_EXT.has(ext)) {
    const lng = HLJS[ext] || null;
    return { viewer: "code", language: lng, category: "codigo" };
  }
  if (TEXT_EXT.has(ext)) return { viewer: "text", language: null, category: "texto" };
  return { viewer: "binary", language: null, category: "binario" };
}

const files = [];
function walk(dir, base) {
  if (!fs.existsSync(dir)) return;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith(".")) continue;
    const abs = path.join(dir, ent.name);
    const rel = base ? base + "/" + ent.name : ent.name;
    if (ent.isDirectory()) {
      walk(abs, rel);
    } else if (ent.isFile() && !ent.name.endsWith(".enc")) {
      const st = fs.statSync(abs);
      const cls = classify(abs, rel);
      const hash = createHash("sha1").update(rel).digest("hex").slice(0, 12);
      files.push({
        id: hash,
        name: ent.name,
        path: rel,
        ext: path.extname(ent.name).toLowerCase().replace(/^\./, ""),
        size: st.size,
        updatedAt: st.mtime.toISOString(),
        viewer: cls.viewer,
        category: cls.category,
        language: cls.language,
        tags: [],
      });
    }
  }
}
walk(VAULT, "");
files.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
const manifest = { version: 1, generatedAt: new Date().toISOString(), files };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`[manifest] ${files.length} archivos -> public/manifest.json`);
