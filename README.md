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
| `npm run build:manifest`    | Escanea `demo/` -> `public/manifest.json`                      |
| `npm run validate`          | Chequea estructura, ESM y ausencia de secretos en lo publico    |
| `npm run dist`              | Ensambla `dist/` listo para Pages (html, config, public, assets, encrypted) |
| `npm run ci`                | validate -> build-manifest -> assemble-dist (usado por CI)      |
| `npm run encrypt`           | `node scripts/encrypt-vault.mjs` (ver abajo)                    |
| `npm run decrypt`           | `node scripts/decrypt-vault.mjs` (ver abajo)                    |

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
