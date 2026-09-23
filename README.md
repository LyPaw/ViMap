# ViMap

Archivo personal de notas y codigo como SPA estatica (ESM puro, sin build, sin
dependencias runtime). Corre en GitHub Pages y descifra la boveda privada
**en el navegador**: la contrasena nunca viaja por la red.

## Demostracion rapida

```powershell
npm start          # servidor local -> http://localhost:8080
npm run ci         # validate -> build-manifest -> assemble-dist (dist/)
```

Abrir `http://localhost:8080`, elegir la boveda y probar con la password de
ejemplo generada al cifrar `encrypted/personal-notes/` (ver
[Formato de boveda](docs/encrypted-format.md)).

## Scripts

| Script                      | Descripcion                                                     |
|-----------------------------|-----------------------------------------------------------------|
| `npm start`                 | Servidor estatico local (SPA por hash, CSP, no-store indices)   |
| `npm run build:manifest`    | Escanea `vault/` -> `public/manifest.json`                      |
| `npm run validate`          | Chequea estructura, ESM y ausencia de secretos en lo publico    |
| `npm run dist`              | Ensambla `dist/` listo para Pages (html, config, public, assets, encrypted) |
| `npm run ci`                | validate -> build-manifest -> assemble-dist (usado por CI)      |
| `npm run encrypt`           | `node scripts/encrypt-vault.mjs` (ver abajo)                    |
| `npm run decrypt`           | `node scripts/decrypt-vault.mjs` (ver abajo)                    |

## Boveda cifrada

La fuente en claro vive en `vault/` (contenido de ejemplo: `javascript/`,
`markdown/`, `python/`). La boveda cifrada se genera con:

```powershell
$env:VIMAP_VAULT_PASSWORD = "mi-password"
node scripts/encrypt-vault.mjs vault --vault-id personal-notes --iterations 310000
```

- `VIMAP_VAULT_PASSWORD` se prefiere sobre stdin oculto. Nunca pases la
  contrasena como argumento.
- Salida: `encrypted/<vault-id>/manifest.enc` (indice cifrado) y un `<id>.enc`
  por archivo (envelope v1: AES-256-GCM, PBKDF2-SHA-256, 310000 iteraciones).
- `public/vaults.json` apunta a la boveda; el `id` localiza, no autentica.
- Para descifrar: `node scripts/decrypt-vault.mjs personal-notes --out <dir>`.

Detalles del formato y verificacion por SHA-256 en
[docs/encrypted-format.md](docs/encrypted-format.md).

## Despliegue (GitHub Pages)

`.github/workflows/deploy.yml` ejecuta CI y publica `dist/` con Pages cuando se
empuja a `main`. Requisitos una vez:

1. Repositorio -> Settings -> Pages -> Source: **GitHub Actions**.
2. La boveda `encrypted/<vault-id>/` debe estar commiteada (solo blobs
   cifrados; `validate.mjs` garantiza que no haya secretos en lo publico).
3. `vault/` (fuente en claro) queda fuera de `dist/`; si alguna vez contiene
   material privado, move la fuente a `vault-private/` (gitignored) y cifra de
   ahi en adelante.

## Estructura

```
index.html / 404.html      SPA (rutas por hash) y pagina 404
assets/js/                 ESM del cliente: core/, crypto/, viewers/, config
assets/vendor/             marked.min.js, purify.min.js, highlight.min.js
config/public-config.json  config publica (iterations, paths, limites)
public/                    manifest.json + vaults.json (indices publicos)
vault/                     fuente en claro de la boveda de ejemplo
encrypted/                 boveda cifrada (envelope v1)
scripts/                   serve/validate/build-manifest/assemble-dist/encrypt/decrypt
docs/                      documentacion tecnica
dist/                      build de Pages (generado, gitignored)
```

## Seguridad

- Sin backend ni telemetria; CSP estricta, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: no-referrer`, `no-store` en indices.
- El indice privado (rutas/nombres) viaja cifrado en `manifest.enc`.
- GCM autentica el tag de 16 bytes: la contrasena incorrecta falla
  inmediatamente. Politica de intentos y aviso de riesgo en el cliente.
- `npm run validate` escanea lo publicable en busca de tokens/PATs/keys.

## Licencia

(C) 2025 Manuel Fuentes Cruz · Todos los derechos reservados.