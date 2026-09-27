// Backend ViMap (Cloudflare Workers).
// Autenticacion por sesion (cookie HttpOnly) + vault cifrado por usuario.
// El servidor guarda SOLO ciphertext: el contenido, las rutas y los nombres
// viven en un manifest cifrado en el cliente. Aqui solo hay cuentas, sesiones,
// un contador de revision (concurrencia optimista) y blobs content-addressed
// (key = sha256 del sobre cifrado) guardados troceados en D1 (sin R2).

const ITERATIONS = 100000;
const SALT_BYTES = 16;
const TOKEN_BYTES = 32;
const MAX_BLOB_BYTES = 32 * 1024 * 1024;
const MAX_MANIFEST_BYTES = 1900000;
const BLOB_CHUNK_BYTES = 1500000;
const DEFAULT_QUOTA_BYTES = 100 * 1024 * 1024;
const BATCH_KEYS = 50;
const SESSION_TTL_MS = 7 * 24 * 3600 * 1000;
const LOCK_WINDOW_MS = 60 * 1000;
const MAX_FAILS = 5;
const COOKIE = "vimap_session";

const encoder = new TextEncoder();

function secHeaders(headers) {
  headers.set("x-content-type-options", "nosniff");
  // HSTS solo lo aplican los navegadores en HTTPS; en HTTP local se ignora.
  headers.set("strict-transport-security", "max-age=31536000");
  return headers;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: secHeaders(
      new Headers({
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
        "x-frame-options": "DENY",
        "referrer-policy": "no-referrer",
      })
    ),
  });
}

function err(code, message, status) {
  return json({ error: code, message }, status);
}

function hex(bytes) {
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function b64Encode(bytes) {
  let bin = "";
  for (const b of new Uint8Array(bytes)) bin += String.fromCharCode(b);
  return btoa(bin);
}

function b64Decode(s) {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function randomHex(n) {
  const a = new Uint8Array(n);
  crypto.getRandomValues(a);
  return hex(a);
}

async function shaHex(s) {
  return hex(await crypto.subtle.digest("SHA-256", encoder.encode(s)));
}

async function pbkdf2Hex(password, saltB64, iterations) {
  const salt = b64Decode(saltB64);
  const material = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, material, 256);
  return hex(bits);
}

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function parseCookies(request) {
  const out = new Map();
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out.set(part.slice(0, i).trim(), part.slice(i + 1).trim());
  }
  return out;
}

function isHttps(request) {
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return false;
  }
}

// Secure solo en HTTPS: en claro la cookie seria rechazada por el navegador
// (romperia el login en HTTP no-localhost, p. ej. LAN/Docker). En localhost
// los navegadores modernos aceptan Secure, pero en HTTP remoto no.
function sessionCookie(token, secure) {
  return `${COOKIE}=${token}; Path=/; HttpOnly;${secure ? " Secure;" : ""} SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`;
}

function clearCookie(secure) {
  return `${COOKIE}=; Path=/; HttpOnly;${secure ? " Secure;" : ""} SameSite=Lax; Max-Age=0`;
}

async function currentUser(request, env) {
  const token = parseCookies(request).get(COOKIE);
  if (!token) return null;
  const tokenHash = await shaHex(token);
  const row = await env.DB.prepare(
    `SELECT u.id, u.username, u.display_name, u.role, u.status, u.quota_bytes,
            u.quota_used, u.salt, u.iterations, u.vault_salt, u.vault_iterations, u.vault_id
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > ? LIMIT 1`
  )
    .bind(tokenHash, Date.now())
    .first();
  return row || null;
}

function assertStateChange(request) {
  if (request.headers.get("x-vimap") !== "1") {
    throw new HttpError("CSRF mismatch", 403, "BAD_REQUEST");
  }
}

class HttpError {
  constructor(message, status, code = "ERROR") {
    this.message = message;
    this.status = status;
    this.code = code;
  }
}

async function readBody(request, maxBytes) {
  const len = Number(request.headers.get("content-length") || 0);
  if (len > maxBytes) throw new HttpError("Cuerpo demasiado grande", 413, "PAYLOAD_TOO_LARGE");
  const text = await request.text();
  if (text.length > maxBytes) throw new HttpError("Cuerpo demasiado grande", 413, "PAYLOAD_TOO_LARGE");
  return text;
}

async function requireUser(request, env) {
  const user = await currentUser(request, env);
  if (!user) throw new HttpError("Sesion no valida", 401, "UNAUTHORIZED");
  if (user.status !== "enabled") throw new HttpError("Cuenta deshabilitada", 403, "DISABLED");
  return user;
}

function requireJson(object) {
  if (typeof object === "string") {
    try {
      object = JSON.parse(object);
    } catch {
      throw new HttpError("JSON invalido", 400, "BAD_REQUEST");
    }
  }
  if (!object || typeof object !== "object") throw new HttpError("JSON invalido", 400, "BAD_REQUEST");
  return object;
}

function isHex64(s) {
  return typeof s === "string" && /^[0-9a-f]{64}$/.test(s);
}

function normalizeUsername(u) {
  return String(u || "").trim().toLowerCase();
}

function validatePassword(p) {
  return typeof p === "string" && p.length >= 12;
}

function validateIdentity(username, displayName) {
  if (!username || username.length > 64) return false;
  if (displayName != null && String(displayName).length > 128) return false;
  return true;
}

// ---------------------------------------------------------------------------

async function prepareVaultFor(user, env) {
  await env.DB.prepare("INSERT OR IGNORE INTO vaults (user_id, rev, updated_at) VALUES (?, 0, ?)")
    .bind(user.id, Date.now())
    .run();
}

async function vaultRev(env, userId) {
  const row = await env.DB.prepare("SELECT rev FROM vaults WHERE user_id = ?").bind(userId).first();
  return row ? row.rev : 0;
}

async function latestManifest(env, user) {
  const row = await env.DB.prepare("SELECT manifest FROM vaults WHERE user_id = ?").bind(user.id).first();
  return row ? row.manifest : "";
}

async function vaultBlobKeys(env, vaultId) {
  const res = await env.DB.prepare("SELECT key FROM blobs WHERE vault_id = ?").bind(vaultId).all();
  return res.results.map((r) => r.key);
}

function chunkText(text, chunkBytes) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkBytes) chunks.push(text.slice(i, i + chunkBytes));
  return chunks;
}

async function blobExists(env, vaultId, key) {
  return !!(await env.DB.prepare("SELECT 1 AS x FROM blobs WHERE vault_id = ? AND key = ?").bind(vaultId, key).first());
}

// Suma de tamanos de un conjunto de blobs en tandas de BATCH_KEYS (D1 limita a
// 100 parametros por query).
async function sumBlobSizes(env, vaultId, keys) {
  let total = 0;
  for (let i = 0; i < keys.length; i += BATCH_KEYS) {
    const slice = keys.slice(i, i + BATCH_KEYS);
    const placeholders = slice.map(() => "?").join(",");
    const row = await env.DB.prepare(
      `SELECT COALESCE(SUM(size), 0) AS s FROM blobs WHERE vault_id = ? AND key IN (${placeholders})`
    )
      .bind(vaultId, ...slice)
      .first();
    total += row ? row.s : 0;
  }
  return total;
}

// ---------------------------------------------------------------------------
// Handlers de la API
// ---------------------------------------------------------------------------

async function handleLogin(request, env) {
  const body = requireJson(await readBody(request, 16 * 1024));
  const username = normalizeUsername(body.username);
  const password = body.password;
  if (!username || username.length > 64 || typeof password !== "string" || password.length > 256) {
    return err("BAD_REQUEST", "Credenciales invalidas", 400);
  }

  const scope = "login:" + username + ":" + (request.headers.get("cf-connecting-ip") || "unknown");
  const attempt = await env.DB.prepare("SELECT fails, locked_until FROM login_attempts WHERE scope = ?").bind(scope).first();
  if (attempt && attempt.locked_until && attempt.locked_until > Date.now()) {
    return err("RATE_LIMITED", "Demasiados intentos. Espera un minuto.", 429);
  }

  const user = await env.DB.prepare("SELECT * FROM users WHERE username = ?").bind(username).first();
  // KDF tambien con usuario inexistente (sal ficticia): evita distinguir por
  // tiempo si el nombre existe (oraculo de enumeracion).
  const DUMMY_SALT = "AAAAAAAAAAAAAAAAAAAAAA==";
  const ok =
    user &&
    user.status === "enabled" &&
    safeEqual(await pbkdf2Hex(password, user.salt, user.iterations), user.password_hash);
  if (!user) await pbkdf2Hex(password, DUMMY_SALT, ITERATIONS);

  if (!ok) {
    const fails = Math.min(MAX_FAILS, (attempt ? attempt.fails : 0) + 1);
    const lockedUntil = fails >= MAX_FAILS ? Date.now() + LOCK_WINDOW_MS : null;
    // Conteo atomico en el conflicto: dos logins simultaneos no pierden intentos.
    // MAX_FAILS es constante JS: interpolar su valor (en SQL seria columna).
    await env.DB.prepare(
      `INSERT INTO login_attempts (scope, fails, locked_until) VALUES (?, ?, ?)
       ON CONFLICT(scope) DO UPDATE SET
         fails = MIN(${MAX_FAILS}, login_attempts.fails + 1),
         locked_until = CASE
           WHEN login_attempts.fails + 1 >= ${MAX_FAILS} THEN excluded.locked_until
           ELSE NULL
         END`
    )
      .bind(scope, fails, lockedUntil)
      .run();
    throw new HttpError("Usuario o contrasena incorrectos", 401, "AUTH_FAILED");
  }

  await env.DB.prepare("DELETE FROM login_attempts WHERE scope = ?").bind(scope).run();
  const token = randomHex(TOKEN_BYTES);
  const expires = Date.now() + SESSION_TTL_MS;
  await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)")
    .bind(await shaHex(token), user.id, Date.now(), expires)
    .run();

  return withCookie(
    json({
      username: user.username,
      displayName: user.display_name,
      role: user.role,
      vaultId: user.vault_id,
      quotaBytes: user.quota_bytes,
      quotaUsed: user.quota_used,
    }),
    sessionCookie(token, isHttps(request)),
  );
}

// se anade cabecera Set-Cookie a una respuesta (login/logout)
function withCookie(response, cookie) {
  const res = new Response(response.body, response);
  res.headers.set("Set-Cookie", cookie);
  return res;
}

async function handleLogout(request, env) {
  assertStateChange(request);
  const token = parseCookies(request).get(COOKIE);
  if (token) {
    const hash = await shaHex(token);
    await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(hash).run();
  }
  return withCookie(json({ ok: true }), clearCookie(isHttps(request)));
}

async function handleVault(request, env, user) {
  const manifestText = await latestManifest(env, user);
  const blobKeys = await vaultBlobKeys(env, user.vault_id);
  return json({
    vaultSalt: user.vault_salt,
    vaultIterations: user.vault_iterations,
    rev: await vaultRev(env, user.id),
    vaultId: user.vault_id,
    manifestText,
    blobKeys,
  });
}

async function handleBlobPut(request, env, user, key) {
  if (!isHex64(key)) return err("BAD_REQUEST", "Clave de blob invalida", 400);
  const exists = await blobExists(env, user.vault_id, key);
  if (exists) return json({ ok: true, existed: true });

  const body = await readBody(request, MAX_BLOB_BYTES);
  const size = encoder.encode(body).length;
  if (size === 0) return err("BAD_REQUEST", "Blob vacio", 400);
  if (size > MAX_BLOB_BYTES) return err("PAYLOAD_TOO_LARGE", "Archivo demasiado grande (max. 32 MB)", 413);
  if ((await shaHex(body)) !== key) return err("BAD_REQUEST", "Hash del blob no coincide con la clave", 400);
  if (user.quota_used + size > user.quota_bytes) return err("QUOTA_EXCEEDED", "Cuota de almacenamiento agotada", 413);

  const chunks = chunkText(body, BLOB_CHUNK_BYTES);
  const ops = chunks.map((data, idx) =>
    env.DB.prepare("INSERT OR IGNORE INTO blob_chunks (vault_id, key, idx, data) VALUES (?, ?, ?, ?)").bind(user.vault_id, key, idx, data)
  );
  ops.push(
    env.DB.prepare(
      "INSERT INTO blobs (vault_id, key, size, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(vault_id, key) DO NOTHING"
    ).bind(user.vault_id, key, size, Date.now()),
  );

  const res = await env.DB.batch(ops);
  const inserted = res[res.length - 1].meta.changes;
  if (inserted === 0) return json({ ok: true, existed: true });

  // Reserva de cuota atomica: solo contabiliza si el UPDATE condicional no excede el tope.
  const qres = await env.DB.prepare(
    "UPDATE users SET quota_used = quota_used + ? WHERE id = ? AND quota_used + ? <= quota_bytes"
  ).bind(size, user.id, size).run();
  if (qres.meta.changes === 0) {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM blob_chunks WHERE vault_id = ? AND key = ?").bind(user.vault_id, key),
      env.DB.prepare("DELETE FROM blobs WHERE vault_id = ? AND key = ?").bind(user.vault_id, key),
    ]);
    return err("QUOTA_EXCEEDED", "Cuota de almacenamiento agotada", 413);
  }
  return json({ ok: true, existed: false });
}

async function handleBlobGet(request, env, user, key) {
  if (!isHex64(key)) return err("BAD_REQUEST", "Clave de blob invalida", 400);
  const chunks = await env.DB.prepare("SELECT data FROM blob_chunks WHERE vault_id = ? AND key = ? ORDER BY idx")
    .bind(user.vault_id, key)
    .all();
  if (!chunks.results.length) return err("NOT_FOUND", "Blob no encontrado", 404);
  return new Response(chunks.results.map((r) => r.data).join(""), {
    status: 200,
    headers: secHeaders(
      new Headers({
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "x-frame-options": "DENY",
        "referrer-policy": "no-referrer",
      })
    ),
  });
}

async function handleManifestPush(request, env, user) {
  const body = requireJson(await readBody(request, MAX_MANIFEST_BYTES));
  const baseRev = Number(body.baseRev);
  const manifestText = body.manifestText;
  const blobKeys = Array.isArray(body.blobKeys) ? [...new Set(body.blobKeys.filter(isHex64))] : [];
  if (!Number.isInteger(baseRev) || baseRev < 0) return err("BAD_REQUEST", "baseRev invalido", 400);
  if (blobKeys.length > 20000) return err("PAYLOAD_TOO_LARGE", "Demasiadas claves de blob", 413);
  if (typeof manifestText !== "string" || !manifestText.length || manifestText.length > MAX_MANIFEST_BYTES) {
    return err("BAD_REQUEST", "Manifest invalido", 400);
  }

  const upd = await env.DB.prepare("UPDATE vaults SET rev = rev + 1, updated_at = ?, manifest = ? WHERE user_id = ? AND rev = ?")
    .bind(Date.now(), manifestText, user.id, baseRev)
    .run();

  if (upd.meta.changes === 0) {
    const text = await latestManifest(env, user);
    const keys = await vaultBlobKeys(env, user.vault_id);
    return json(
      {
        error: "CONFLICT",
        rev: await vaultRev(env, user.id),
        manifestText: text,
        blobKeys: keys,
      },
      409,
    );
  }

  const existing = await env.DB.prepare("SELECT key FROM blobs WHERE vault_id = ?").bind(user.vault_id).all();
  const keep = new Set(blobKeys);
  const removed = existing.results.map((r) => r.key).filter((k) => !keep.has(k));

  const ops = [];
  for (const k of removed) {
    ops.push(env.DB.prepare("DELETE FROM blob_chunks WHERE vault_id = ? AND key = ?").bind(user.vault_id, k));
    ops.push(env.DB.prepare("DELETE FROM blobs WHERE vault_id = ? AND key = ?").bind(user.vault_id, k));
  }
  const kept = await sumBlobSizes(env, user.vault_id, blobKeys);
  ops.push(env.DB.prepare("UPDATE users SET quota_used = ? WHERE id = ?").bind(kept, user.id));
  await env.DB.batch(ops);

  // Revolucion atornillada a la transaccion: baseRev + 1 (evita carreras de relectura).
  return json({ rev: baseRev + 1 });
}

// ---------------------------------------------------------------------------
// Sesiones propias (higiene de cuenta: ver y revocar)
// ---------------------------------------------------------------------------

async function handleSessionsList(request, env, user) {
  const token = parseCookies(request).get(COOKIE);
  const currentHash = token ? await shaHex(token) : null;
  const res = await env.DB.prepare("SELECT id, created_at, expires_at, token_hash FROM sessions WHERE user_id = ? AND expires_at > ? ORDER BY created_at DESC")
    .bind(user.id, Date.now())
    .all();
  return json({
    sessions: res.results.map((r) => ({
      id: r.id,
      createdAt: r.created_at,
      expiresAt: r.expires_at,
      current: !!currentHash && r.token_hash === currentHash,
    })),
  });
}

async function handleSessionRevoke(request, env, user, id) {
  assertStateChange(request);
  const row = await env.DB.prepare("SELECT id, user_id FROM sessions WHERE id = ?").bind(Number(id)).first();
  // 404 tambien si es de otro usuario: no revelar existencia (anti-enumeracion).
  if (!row || row.user_id !== user.id) return err("NOT_FOUND", "Sesion no existe", 404);
  await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(row.id).run();
  return json({ ok: true });
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

async function requireAdmin(request, env) {
  const user = await requireUser(request, env);
  if (user.role !== "admin") throw new HttpError("Requiere permisos de administrador", 403, "FORBIDDEN");
  return user;
}

async function createUser(env, { username, displayName, password, role, quotaBytes }) {
  const salt = b64Encode(crypto.getRandomValues(new Uint8Array(SALT_BYTES)));
  const iterations = ITERATIONS;
  const hash = await pbkdf2Hex(password, salt, iterations);
  const vaultSalt = b64Encode(crypto.getRandomValues(new Uint8Array(SALT_BYTES)));
  const vaultIterations = ITERATIONS;
  const vaultId = randomHex(16);
  const now = Date.now();
  const ins = await env.DB.prepare(
    `INSERT INTO users (username, display_name, role, status, password_hash, salt, iterations,
                        vault_salt, vault_iterations, quota_bytes, quota_used, vault_id, created_at)
     VALUES (?, ?, ?, 'enabled', ?, ?, ?, ?, ?, ?, 0, ?, ?)`
  )
    .bind(username, displayName, role, hash, salt, iterations, vaultSalt, vaultIterations, quotaBytes, vaultId, now)
    .run();
  const userId = ins.meta.last_row_id;
  await env.DB.prepare("INSERT OR IGNORE INTO vaults (user_id, rev, updated_at) VALUES (?, 0, ?)")
    .bind(userId, now)
    .run();
  return vaultId;
}

async function handleSetupStatus(env) {
  const row = await env.DB.prepare("SELECT COUNT(*) AS n FROM users").first();
  return json({ exists: (row && row.n ? Number(row.n) : 0) > 0 });
}

const SETUP_MAX_FAILS = 10;
const SETUP_WINDOW_MS = 3600 * 1000;

async function handleSetup(request, env, body) {
  const existing = await env.DB.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").first();
  if (existing) return err("FORBIDDEN", "Administrador ya creado", 403);
  if (!env.ADMIN_SETUP_TOKEN) return err("NOT_CONFIGURED", "ADMIN_SETUP_TOKEN no definido", 503);
  // Throttle global del setup (endpoint potente y sin autenticar).
  const scope = "setup";
  const attempt = await env.DB.prepare("SELECT fails, locked_until FROM login_attempts WHERE scope = ?").bind(scope).first();
  if (attempt && attempt.locked_until && attempt.locked_until > Date.now()) {
    return err("RATE_LIMITED", "Demasiados intentos. Espera una hora.", 429);
  }
  const token = body.token;
  if (typeof token !== "string" || !safeEqual(token, env.ADMIN_SETUP_TOKEN)) {
    const fails = Math.min(SETUP_MAX_FAILS, (attempt ? attempt.fails : 0) + 1);
    const lockedUntil = fails >= SETUP_MAX_FAILS ? Date.now() + SETUP_WINDOW_MS : null;
    await env.DB.prepare(
      `INSERT INTO login_attempts (scope, fails, locked_until) VALUES (?, ?, ?)
       ON CONFLICT(scope) DO UPDATE SET
         fails = MIN(${SETUP_MAX_FAILS}, login_attempts.fails + 1),
         locked_until = CASE
           WHEN login_attempts.fails + 1 >= ${SETUP_MAX_FAILS} THEN excluded.locked_until
           ELSE NULL
         END`
    )
      .bind(scope, fails, lockedUntil)
      .run();
    return err("FORBIDDEN", "Token de setup invalido", 403);
  }
  await env.DB.prepare("DELETE FROM login_attempts WHERE scope = ?").bind(scope).run();
  const username = normalizeUsername(body.username);
  const password = body.password;
  const displayName = String(body.displayName || username);
  if (!validateIdentity(username, displayName) || !validatePassword(password)) {
    return err("BAD_REQUEST", "Usuario invalido o contrasena demasiado corta (min. 12)", 400);
  }
  try {
    await createUser(env, { username, displayName, password, role: "admin", quotaBytes: Number(body.quotaBytes) || DEFAULT_QUOTA_BYTES });
  } catch (e) {
    console.error("setup.createUser err:", e instanceof Error ? e.stack || e.message : e);
    return err("CONFLICT", "El nombre de usuario ya existe", 409);
  }
  return json({ ok: true });
}

async function handleAdminStats(env) {
  const users = await env.DB.prepare("SELECT COUNT(*) AS n, COALESCE(SUM(quota_used), 0) AS used, COALESCE(SUM(quota_bytes), 0) AS quota FROM users").first();
  const blobs = await env.DB.prepare("SELECT COUNT(*) AS n, COALESCE(SUM(size), 0) AS bytes FROM blobs").first();
  return json({
    users: users ? Number(users.n) : 0,
    quotaUsed: users ? Number(users.used) : 0,
    quotaBytes: users ? Number(users.quota) : 0,
    blobs: blobs ? Number(blobs.n) : 0,
    blobBytes: blobs ? Number(blobs.bytes) : 0,
  });
}

async function handleAdminList(env) {
  const res = await env.DB.prepare(
    "SELECT id, username, display_name, role, status, quota_bytes, quota_used, created_at FROM users ORDER BY username"
  ).all();
  return json({ users: res.results });
}

async function handleAdminCreate(env, body) {
  const username = normalizeUsername(body.username);
  const password = body.password;
  const displayName = String(body.displayName || username);
  const quotaBytes = Number(body.quotaBytes) || DEFAULT_QUOTA_BYTES;
  if (!validateIdentity(username, displayName) || !validatePassword(password)) {
    return err("BAD_REQUEST", "Usuario invalido o contrasena (min. 12)", 400);
  }
  try {
    await createUser(env, { username, displayName, password, role: "user", quotaBytes });
  } catch (e) {
    console.error("adminCreate.createUser err:", e instanceof Error ? e.stack || e.message : e);
    return err("CONFLICT", "El nombre de usuario ya existe", 409);
  }
  return json({ ok: true });
}

async function getUserRow(env, id) {
  return env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(Number(id)).first();
}

async function handleAdminPatch(request, env, user, id) {
  const target = await getUserRow(env, id);
  if (!target) return err("NOT_FOUND", "Usuario no existe", 404);
  const body = requireJson(await readBody(request, 16 * 1024));
  const ops = [];
  if (typeof body.displayName === "string") {
    if (body.displayName.length > 128) return err("BAD_REQUEST", "Nombre demasiado largo", 400);
    ops.push(env.DB.prepare("UPDATE users SET display_name = ? WHERE id = ?").bind(body.displayName, target.id));
  }
  if (typeof body.quotaBytes === "number" && body.quotaBytes >= 0) {
    ops.push(env.DB.prepare("UPDATE users SET quota_bytes = ? WHERE id = ?").bind(body.quotaBytes, target.id));
  }
  if (body.status === "enabled" || body.status === "disabled") {
    ops.push(env.DB.prepare("UPDATE users SET status = ? WHERE id = ?").bind(body.status, target.id));
    if (body.status === "disabled") {
      await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(target.id).run();
    }
  }
  if (typeof body.password === "string") {
    // Sin un protocolo de re-cifrado (re-wrap) el cambio bloquea el vault para siempre:
    // la clave se deriva del password + vault_salt del usuario.
    return err("NOT_SUPPORTED", "Cambiar la contrasena no esta soportado: re-cifrado pendiente", 400);
  }
  if (user.id === target.id && body.status === "disabled") {
    return err("BAD_REQUEST", "No puedes deshabilitar tu propia cuenta", 400);
  }
  if (ops.length) await env.DB.batch(ops);
  return json({ ok: true });
}

async function handleAdminDelete(env, admin, id) {
  const target = await getUserRow(env, id);
  if (!target) return err("NOT_FOUND", "Usuario no existe", 404);
  if (target.role === "admin") {
    const admins = await env.DB.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'").first();
    if (admins.n <= 1) return err("BAD_REQUEST", "No se puede borrar al ultimo administrador", 400);
  }
  const writes = [
    env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(target.id),
    env.DB.prepare("DELETE FROM blobs WHERE vault_id = ?").bind(target.vault_id),
    env.DB.prepare("DELETE FROM blob_chunks WHERE vault_id = ?").bind(target.vault_id),
    env.DB.prepare("DELETE FROM vaults WHERE user_id = ?").bind(target.id),
    env.DB.prepare("DELETE FROM users WHERE id = ?").bind(target.id),
  ];
  await env.DB.batch(writes);
  return json({ ok: true });
}

// ---------------------------------------------------------------------------

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname.startsWith("/api/")) {
        return await route(request, env, url);
      }
      if (request.method === "GET" || request.method === "HEAD") {
        const res = await env.ASSETS.fetch(request);
        if (res && res.status < 400) {
          const headers = secHeaders(new Headers(res.headers));
          headers.set("cache-control", "no-cache");
          headers.set("x-frame-options", "DENY");
          headers.set("referrer-policy", "no-referrer");
          return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
        }
        return res;
      }
      return err("METHOD_NOT_ALLOWED", "Metodo no permitido", 405);
    } catch (e) {
      if (e instanceof HttpError) return err(e.code, e.message, e.status);
      console.error(e);
      return err("INTERNAL", "Error interno", 500);
    }
  },

  async scheduled(_event, env) {
    // Limpieza periodica de sesiones y login_attempts vencidos.
    await env.DB.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(Date.now()).run();
    await env.DB.prepare("DELETE FROM login_attempts WHERE locked_until IS NOT NULL AND locked_until < ?").bind(Date.now()).run();
  },
};

async function route(request, env, url) {
  const method = request.method;
  const p = url.pathname.replace(/^\/api/, "");
  const parts = p.split("/").filter(Boolean);

  // GET /api/me
  if (method === "GET" && p === "/me") {
    const u = await currentUser(request, env);
    if (!u) return err("UNAUTHORIZED", "Sesion no validada", 401);
    return json({ username: u.username, displayName: u.display_name, role: u.role, vaultId: u.vault_id, quotaBytes: u.quota_bytes, quotaUsed: u.quota_used });
  }

  // POST /api/login | /api/logout
  if (method === "POST" && p === "/login") return handleLogin(request, env);
  if (method === "POST" && p === "/logout") return handleLogout(request, env);

  // POST /api/admin/setup (una sola vez)
  if (method === "POST" && p === "/admin/setup") {
    assertStateChange(request);
    return handleSetup(request, env, requireJson(await readBody(request, 16 * 1024)));
  }

  // GET /api/setup/status (cliente: decide si mostrar la pantalla de setup)
  if (method === "GET" && p === "/setup/status") return handleSetupStatus(env);

  const user = await requireUser(request, env);

  // Sesiones propias
  if (method === "GET" && p === "/sessions") return handleSessionsList(request, env, user);
  if (method === "DELETE" && parts.length === 2 && parts[0] === "sessions") {
    return handleSessionRevoke(request, env, user, parts[1]);
  }

  // Vault
  if (method === "GET" && p === "/vault") return handleVault(request, env, user);
  if (method === "PUT" && p === "/vault/manifest") {
    assertStateChange(request);
    return handleManifestPush(request, env, user);
  }
  if (method === "PUT" && parts.length === 3 && parts[0] === "vault" && parts[1] === "blobs") {
    assertStateChange(request);
    return handleBlobPut(request, env, user, parts[2]);
  }
  if (method === "GET" && parts.length === 3 && parts[0] === "vault" && parts[1] === "blobs") {
    return handleBlobGet(request, env, user, parts[2]);
  }

  // Admin
  const admin = await requireAdmin(request, env);
  if (method === "GET" && p === "/admin/users") return handleAdminList(env);
  if (method === "GET" && p === "/admin/stats") return handleAdminStats(env);
  if (method === "POST" && p === "/admin/users") {
    assertStateChange(request);
    return handleAdminCreate(env, requireJson(await readBody(request, 16 * 1024)));
  }
  if (method === "PATCH" && parts.length === 3 && parts[0] === "admin" && parts[1] === "users") {
    assertStateChange(request);
    return handleAdminPatch(request, env, admin, parts[2]);
  }
  if (method === "DELETE" && parts.length === 3 && parts[0] === "admin" && parts[1] === "users") {
    assertStateChange(request);
    return handleAdminDelete(env, admin, parts[2]);
  }

  return err("NOT_FOUND", "Ruta no encontrada", 404);
}