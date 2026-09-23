// Diccionario de tipos de archivo: idioma, categoria, visor y gramatica highlight.js.
// Modulo puro sin DOM: lo usan el navegador y los scripts Node (build-manifest, encrypt).

export const VIEWER_MD = "md";
export const VIEWER_CODE = "code";
export const VIEWER_TEXT = "text";
export const VIEWER_IMAGE = "image";
export const VIEWER_PDF = "pdf";
export const VIEWER_BINARY = "binary";

// extension -> { language, category, viewer, hljs }
const EXT = {
  // Documentacion
  md:        { language: "markdown",   category: "documentacion", viewer: VIEWER_MD,  hljs: "markdown" },
  mdx:       { language: "markdown",   category: "documentacion", viewer: VIEWER_MD,  hljs: "markdown" },
  markdown:  { language: "markdown",   category: "documentacion", viewer: VIEWER_MD,  hljs: "markdown" },
  txt:       { language: "texto",      category: "texto",        viewer: VIEWER_TEXT },
  text:      { language: "texto",      category: "texto",        viewer: VIEWER_TEXT },
  rst:       { language: "reST",       category: "documentacion", viewer: VIEWER_TEXT },
  adoc:      { language: "AsciiDoc",   category: "documentacion", viewer: VIEWER_TEXT },
  log:       { language: "texto",      category: "texto",        viewer: VIEWER_TEXT },
  csv:       { language: "CSV",        category: "datos",        viewer: VIEWER_TEXT },

  // Lenguajes prioritarios
  java:      { language: "java",       category: "codigo",  viewer: VIEWER_CODE, hljs: "java" },
  js:        { language: "javascript", category: "codigo",  viewer: VIEWER_CODE, hljs: "javascript" },
  mjs:       { language: "javascript", category: "codigo",  viewer: VIEWER_CODE, hljs: "javascript" },
  cjs:       { language: "javascript", category: "codigo",  viewer: VIEWER_CODE, hljs: "javascript" },
  jsx:       { language: "javascript", category: "codigo",  viewer: VIEWER_CODE, hljs: "javascript" },
  ts:        { language: "typescript", category: "codigo",  viewer: VIEWER_CODE, hljs: "typescript" },
  tsx:       { language: "typescript", category: "codigo",  viewer: VIEWER_CODE, hljs: "typescript" },
  mts:       { language: "typescript", category: "codigo",  viewer: VIEWER_CODE, hljs: "typescript" },
  cts:       { language: "typescript", category: "codigo",  viewer: VIEWER_CODE, hljs: "typescript" },
  kt:        { language: "kotlin",     category: "codigo",  viewer: VIEWER_CODE, hljs: "kotlin" },
  kts:       { language: "kotlin",     category: "codigo",  viewer: VIEWER_CODE, hljs: "kotlin" },
  c:         { language: "c",          category: "codigo",  viewer: VIEWER_CODE, hljs: "c" },
  h:         { language: "c",          category: "codigo",  viewer: VIEWER_CODE, hljs: "c" },

  // Lenguajes modernos
  cpp:       { language: "cpp",   category: "codigo", viewer: VIEWER_CODE, hljs: "cpp" },
  cc:        { language: "cpp",   category: "codigo", viewer: VIEWER_CODE, hljs: "cpp" },
  cxx:       { language: "cpp",   category: "codigo", viewer: VIEWER_CODE, hljs: "cpp" },
  hpp:       { language: "cpp",   category: "codigo", viewer: VIEWER_CODE, hljs: "cpp" },
  hh:        { language: "cpp",   category: "codigo", viewer: VIEWER_CODE, hljs: "cpp" },
  cs:        { language: "csharp",     category: "codigo", viewer: VIEWER_CODE, hljs: "csharp" },
  py:        { language: "python",     category: "codigo", viewer: VIEWER_CODE, hljs: "python" },
  pyw:       { language: "python",     category: "codigo", viewer: VIEWER_CODE, hljs: "python" },
  go:        { language: "go",         category: "codigo", viewer: VIEWER_CODE, hljs: "go" },
  rs:        { language: "rust",       category: "codigo", viewer: VIEWER_CODE, hljs: "rust" },
  swift:     { language: "swift",      category: "codigo", viewer: VIEWER_CODE, hljs: "swift" },
  dart:      { language: "dart",       category: "codigo", viewer: VIEWER_CODE, hljs: "dart" },
  php:       { language: "php",        category: "codigo", viewer: VIEWER_CODE, hljs: "php" },
  rb:        { language: "ruby",       category: "codigo", viewer: VIEWER_CODE, hljs: "ruby" },
  scala:     { language: "scala",      category: "codigo", viewer: VIEWER_CODE, hljs: "scala" },
  groovy:    { language: "groovy",     category: "codigo", viewer: VIEWER_CODE, hljs: "groovy" },
  gradle:    { language: "gradle",     category: "config", viewer: VIEWER_CODE, hljs: "gradle" },
  sh:        { language: "shell",      category: "script", viewer: VIEWER_CODE, hljs: "bash" },
  bash:      { language: "shell",      category: "script", viewer: VIEWER_CODE, hljs: "bash" },
  zsh:       { language: "shell",      category: "script", viewer: VIEWER_CODE, hljs: "bash" },
  fish:      { language: "shell",      category: "script", viewer: VIEWER_CODE, hljs: "bash" },
  ps1:       { language: "powershell", category: "script", viewer: VIEWER_CODE, hljs: "powershell" },
  sql:       { language: "sql",        category: "datos",  viewer: VIEWER_CODE, hljs: "sql" },
  r:         { language: "r",          category: "datos",  viewer: VIEWER_CODE, hljs: "r" },
  lua:       { language: "lua",        category: "script", viewer: VIEWER_CODE, hljs: "lua" },
  pl:        { language: "perl",       category: "script", viewer: VIEWER_CODE, hljs: "perl" },
  hs:        { language: "haskell",    category: "codigo", viewer: VIEWER_CODE, hljs: "haskell" },
  ex:        { language: "elixir",     category: "codigo", viewer: VIEWER_CODE, hljs: "elixir" },
  exs:       { language: "elixir",     category: "codigo", viewer: VIEWER_CODE, hljs: "elixir" },
  erl:       { language: "erlang",     category: "codigo", viewer: VIEWER_CODE, hljs: "erlang" },
  hrl:       { language: "erlang",     category: "codigo", viewer: VIEWER_CODE, hljs: "erlang" },
  clj:       { language: "clojure",    category: "codigo", viewer: VIEWER_CODE, hljs: "clojure" },
  cljs:      { language: "clojure",    category: "codigo", viewer: VIEWER_CODE, hljs: "clojure" },
  cljc:      { language: "clojure",    category: "codigo", viewer: VIEWER_CODE, hljs: "clojure" },
  fs:        { language: "fsharp",     category: "codigo", viewer: VIEWER_CODE, hljs: "fsharp" },
  fsi:       { language: "fsharp",     category: "codigo", viewer: VIEWER_CODE, hljs: "fsharp" },
  vb:        { language: "visual-basic", category: "codigo", viewer: VIEWER_CODE, hljs: "vbnet" },
  asm:       { language: "assembly",   category: "codigo", viewer: VIEWER_CODE, hljs: "x86asm" },
  s:         { language: "assembly",   category: "codigo", viewer: VIEWER_CODE, hljs: "x86asm" },
  ps:        { language: "powershell", category: "script", viewer: VIEWER_CODE, hljs: "powershell" },

  // Web / marcado
  html:      { language: "html",       category: "web",    viewer: VIEWER_CODE, hljs: "xml" },
  htm:       { language: "html",       category: "web",    viewer: VIEWER_CODE, hljs: "xml" },
  css:       { language: "css",        category: "web",    viewer: VIEWER_CODE, hljs: "css" },
  scss:      { language: "scss",       category: "web",    viewer: VIEWER_CODE, hljs: "scss" },
  sass:      { language: "scss",       category: "web",    viewer: VIEWER_CODE, hljs: "scss" },
  less:      { language: "less",       category: "web",    viewer: VIEWER_CODE, hljs: "less" },
  vue:       { language: "vue",        category: "web",    viewer: VIEWER_CODE, hljs: "xml" },
  svelte:    { language: "svelte",     category: "web",    viewer: VIEWER_CODE, hljs: "xml" },
  astro:     { language: "astro",      category: "web",    viewer: VIEWER_CODE, hljs: "xml" },
  json:      { language: "json",       category: "datos",  viewer: VIEWER_CODE, hljs: "json" },
  jsonc:     { language: "jsonc",      category: "datos",  viewer: VIEWER_CODE, hljs: "json" },
  yaml:      { language: "yaml",       category: "config", viewer: VIEWER_CODE, hljs: "yaml" },
  yml:       { language: "yaml",       category: "config", viewer: VIEWER_CODE, hljs: "yaml" },
  toml:      { language: "toml",       category: "config", viewer: VIEWER_CODE, hljs: "ini" },
  ini:       { language: "ini",        category: "config", viewer: VIEWER_CODE, hljs: "ini" },
  cfg:       { language: "config",     category: "config", viewer: VIEWER_CODE, hljs: "ini" },
  conf:      { language: "config",     category: "config", viewer: VIEWER_CODE, hljs: "ini" },
  env:       { language: "env",        category: "config", viewer: VIEWER_CODE, hljs: "ini" },
  properties:{ language: "properties", category: "config", viewer: VIEWER_CODE, hljs: "properties" },
  xml:       { language: "xml",        category: "datos",  viewer: VIEWER_CODE, hljs: "xml" },
  xsd:       { language: "xml",        category: "datos",  viewer: VIEWER_CODE, hljs: "xml" },
  xsl:       { language: "xslt",       category: "datos",  viewer: VIEWER_CODE, hljs: "xml" },
  xslt:      { language: "xslt",       category: "datos",  viewer: VIEWER_CODE, hljs: "xml" },
  graphql:   { language: "graphql",    category: "datos",  viewer: VIEWER_CODE, hljs: "graphql" },
  gql:       { language: "graphql",    category: "datos",  viewer: VIEWER_CODE, hljs: "graphql" },
  dockerfile:{ language: "dockerfile", category: "config", viewer: VIEWER_CODE, hljs: "dockerfile" },
  editorconfig:{ language: "editorconfig", category: "config", viewer: VIEWER_CODE, hljs: "ini" },
  makefile:  { language: "makefile",   category: "config", viewer: VIEWER_CODE, hljs: "makefile" },

  // Imagenes
  png:       { language: "imagen", category: "imagen", viewer: VIEWER_IMAGE },
  jpg:       { language: "imagen", category: "imagen", viewer: VIEWER_IMAGE },
  jpeg:      { language: "imagen", category: "imagen", viewer: VIEWER_IMAGE },
  gif:       { language: "imagen", category: "imagen", viewer: VIEWER_IMAGE },
  webp:      { language: "imagen", category: "imagen", viewer: VIEWER_IMAGE },
  svg:       { language: "imagen", category: "imagen", viewer: VIEWER_IMAGE },
  bmp:       { language: "imagen", category: "imagen", viewer: VIEWER_IMAGE },

  // PDF y binarios
  pdf:       { language: "pdf", category: "binario", viewer: VIEWER_PDF },
};

// Reglas por nombre de archivo (sin extension segun el nombre completo).
const NAME_RULES = [
  { re: /^dockerfile(?:[.-]|$)/i, meta: { language: "dockerfile", category: "config", viewer: VIEWER_CODE, hljs: "dockerfile" } },
  { re: /^(makefile|gnumakefile)$/i, meta: { language: "makefile", category: "config", viewer: VIEWER_CODE, hljs: "makefile" } },
  { re: /^(gitignore|gitattributes)$/i, meta: { language: "texto", category: "config", viewer: VIEWER_TEXT } },
  { re: /^(editorconfig)$/i, meta: { language: "editorconfig", category: "config", viewer: VIEWER_CODE, hljs: "ini" } },
  { re: /^jenkinsfile(?:[.-]|$)/i, meta: { language: "groovy", category: "config", viewer: VIEWER_CODE, hljs: "groovy" } },
  { re: /^.*\.properties$/i, meta: { language: "properties", category: "config", viewer: VIEWER_CODE, hljs: "properties" } },
];

function extOf(name) {
  const i = name.lastIndexOf(".");
  if (i <= 0) return (name || "").toLowerCase();
  return name.slice(i + 1).toLowerCase();
}

function extlessName(name) {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(0, i) : name;
}

export function classifyFile(entry) {
  const name = entry.name;
  const ext = extOf(name);

  for (const rule of NAME_RULES) {
    if (rule.re.test(name)) {
      return { ...rule.meta, ext: null, extless: extlessName(name) };
    }
  }

  const meta = EXT[ext];
  if (meta) {
    return { ...meta, ext, extless: extlessName(name) };
  }

  return { language: "desconocido", category: "binario", viewer: VIEWER_BINARY, ext, extless: extlessName(name), hljs: null };
}

export function extensionOf(name) {
  return extOf(name);
}

export function humanLabel(slug) {
  if (!slug) return "PLANO";
  const map = {
    markdown: "Markdown", java: "Java", javascript: "JavaScript", typescript: "TypeScript",
    kotlin: "Kotlin", c: "C", cpp: "C++", csharp: "C#", python: "Python", go: "Go",
    rust: "Rust", swift: "Swift", dart: "Dart", php: "PHP", ruby: "Ruby", scala: "Scala",
    groovy: "Groovy", gradle: "Gradle", shell: "Shell", powershell: "PowerShell", sql: "SQL",
    reST: "reST", asciidoc: "AsciiDoc", xml: "XML", xslt: "XSLT", yaml: "YAML", toml: "TOML",
    json: "JSON", html: "HTML", css: "CSS", scss: "SCSS", less: "Less", graphql: "GraphQL",
    dockerfile: "Dockerfile", makefile: "Makefile", editorconfig: "EditorConfig",
    properties: "Properties", ini: "INI", "visual-basic": "Visual Basic", assembly: "Assembly",
    haskell: "Haskell", elixir: "Elixir", erlang: "Erlang", clojure: "Clojure", fsharp: "F#",
    r: "R", lua: "Lua", perl: "Perl", elixir2: "Elixir", texto: "Texto", imagen: "Imagen",
    pdf: "PDF", desconocido: "Desconocido", env: "env", csv: "CSV", config: "Config",
  };
  return map[slug] || slug.toUpperCase();
}

export const LANGUAGES = [...new Set(Object.values(EXT).map((m) => m.language))].sort();