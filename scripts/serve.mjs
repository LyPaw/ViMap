// Servidor estatico local para desarrollo. Sin dependencias: http nativo + fs.
// Sirve index.html para rutas sin extension (SPA por hash), nunca lista
// directorios, cachea con no-store el manifiesto y envia cabeceras de seguridad.
// Uso:  node scripts/serve.mjs [--port 8080] [--root .]

import http from "node:http";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DEFAULT = path.resolve(here, "..");

function argValue(name) {
  const i = process.argv.indexOf("--" + name);
  return i >= 0 ? process.argv[i + 1] : null;
}

const port = Number.parseInt(argValue("port") || process.env.PORT || "8080", 10) || 8080;
const root = path.resolve(argValue("root") || ROOT_DEFAULT);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
};

function mimeOf(p) {
  return MIME[path.extname(p).toLowerCase()] || "application/octet-stream";
}

const CSP =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data: blob:; connect-src 'self' blob:; font-src 'self'; " +
  "frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'";

async function sendFile(res, abs) {
  if (!abs.startsWith(root) && !abs.startsWith(root + path.sep)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("403: fuera de la raiz");
    return;
  }
  let data;
  try {
    data = await fsp.readFile(abs);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404: recurso no encontrado");
    return;
  }
  const noStore = /manifest\.json$|vaults\.json$/.test(abs);
  res.writeHead(200, {
    "Content-Type": mimeOf(abs),
    "Content-Length": data.length,
    "Cache-Control": noStore ? "no-store" : "public, max-age=0, must-revalidate",
    "Content-Security-Policy": CSP,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "X-Frame-Options": "SAMEORIGIN",
  });
  res.end(data);
}

function notFound(res) {
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("404: recurso no encontrado");
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("405: metodo no permitido");
      return;
    }
    const url = new URL(req.url, "http://localhost");
    const decoded = decodeURIComponent(url.pathname);
    let rel = decoded;
    if (rel === "/") rel = "/index.html";
    const abs = path.resolve(root, "." + rel);
    if (!abs.startsWith(root) && !abs.startsWith(root + path.sep)) return notFound(res);
    const ext = path.extname(rel).toLowerCase();
    if (!ext) {
      // SPA con rutas por hash: cualquier ruta sin extension -> index.html
      return sendFile(res, path.join(root, "index.html"));
    }
    await sendFile(res, abs);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("500: " + (err && err.stack ? err.stack : String(err)));
  }
});

server.listen(port, () => {
  console.log(`[vimap] servidor local en http://localhost:${port}  (raiz: ${root})`);
});
