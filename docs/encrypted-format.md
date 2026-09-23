# Formato de boveda cifrada (envelope v1)

ViMap sirve una boveda privada cifrada en el cliente. Todo el cifrado ocurre en
`assets/js/crypto/` (navegador) y en `scripts/encrypt-vault.mjs` /
`scripts/decrypt-vault.mjs` (CLI). No hay backend: la contrasena nunca sale del
navegador y el indice de archivos viaja cifrado.

## Algoritmo

| Parametro       | Valor            |
|-----------------|------------------|
| Cifrado         | AES-256-GCM      |
| KDF             | PBKDF2-HMAC-SHA-256 |
| Iteraciones     | 310000 (config/public-config.json `passwordIterations`) |
| Salt / IV       | 16 / 12 bytes aleatorios por operacion |
| Tag GCM         | 16 bytes, anexado al ciphertext base64 |

La clave se deriva asi:

```
key = PBKDF2(password, salt, iterations, 32, "sha256")
```

## Envelope JSON (v1)

Cada artefacto cifrado (manifiesto o archivo) es un unico objeto JSON:

```json
{
  "version": 1,
  "algo": "AES-256-GCM",
  "kdf": {
    "name": "PBKDF2",
    "hash": "SHA-256",
    "salt": "<base64 16 bytes>",
    "iterations": 310000
  },
  "iv": "<base64 12 bytes>",
  "ciphertext": "<base64(ciphertext || tag 16 bytes)>"
}
```

Descifrado: derivar `key`, crear `createDecipheriv("aes-256-gcm", key, iv)`,
`setAuthTag(tag)` (ultimos 16 bytes del plain decodificado) y descifrar el resto.
Cualquier error de tamano, sal o contrasena hace fallar GCM con
`Unsupported state or unable to authenticate data` (no hay oraculo de padding).

## Layout en el repositorio

```
vault/                        # fuente en claro (demo). NUNCA se sirve
  <carpetas>/<archivos>
encrypted/<vault-id>/
  manifest.enc                # indice cifrado
  <id>.enc                    # un envelope por archivo
public/
  manifest.json               # indice publico generado (rutas, viewers)
  vaults.json                 # indice publico de bovedas (no autentica)
config/public-config.json     # config publica (iterations, paths)
```

`build-manifest.mjs` genera `public/manifest.json` desde `demo/` (nombres,
tamano, viewer/categoria/lenguaje). `public/vaults.json` apunta a
`encrypted/<vault-id>/manifest.enc`; el `id` solo localiza la boveda, no
autentica.

El enfoque por defecto: `vault/` contiene contenido de ejemplo y sirve de
plantilla; la boveda real se cifra por separado. Para material realmente
privado, colocar la fuente fuera del arbol servido y no commitearla
(p. ej. `vault-private/`, ya gitignored) y cifrar hacia `encrypted/`.

## Round-trip CLI

```powershell
$env:VIMAP_VAULT_PASSWORD = "mi-password"

# Cifrar vault/ -> encrypted/personal-notes/
node scripts/encrypt-vault.mjs vault --vault-id personal-notes --iterations 310000

# Descifrar encrypted/personal-notes/ -> ruta salida
node scripts/decrypt-vault.mjs personal-notes --out "$env:TEMP\vimap_pn"
```

Verificacion por archivo (Windows):

```powershell
Get-ChildItem vault -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring((Resolve-Path vault).Path.Length + 1)
  Compare-Object `
    ((Get-FileHash $_.FullName -Algorithm SHA256).Hash) `
    ((Get-FileHash "$env:TEMP\vimap_pn\$rel" -Algorithm SHA256).Hash)
}
```

La password se lee de `VIMAP_VAULT_PASSWORD` (recomendado) o por stdin oculto
si la variable no existe. Seguridad: `encrypt-vault.mjs` escribe `.enc` con un
salt e iv frescos **por archivo**, por lo que dos ejecuciones del mismo texto
nunca generan ciphertexts iguales.

## En el navegador

`assets/js/crypto/session.js`:

1. `vaults.json` -> obtener `encryptedManifest` del `vault-id` activo.
2. Fetch de `manifest.enc` -> `envelope.js` deriva la clave y descifra el indice.
3. Para cada archivo, fetch de `encrypted/<vault-id>/<id>.enc` y descifrado.
4. `aead.js` (WebCrypto `AES-GCM`) autentica los 16 bytes de tag.

Politica de intentos (`attempts.js`) y aceptacion de riesgo
(`vimap.crypto.risk-accepted` en localStorage) limitan re-intentos y avisan al
usuario. `validate.mjs` escanea el contenido publico en busca de secretos y
verifica que manifest/vaults solo referencien rutas dentro de lo servido.