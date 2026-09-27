-- Esquema inicial del backend ViMap (D1/SQLite).
-- El servidor guarda SOLO: cuentas, sesiones, contador de revision, el manifest
-- cifrado y los blobs cifrados (key = sha256 del sobre). Los nombres de archivo,
-- rutas y contenido viven cifrados. Sin R2: todo vive en D1. Un blob se parte en
-- trozos de <=1.5 MB (limite de fila de D1 = 2 MB) en la tabla blob_chunks.
-- Seguridad: el hash de login se deriva con salt de LOGIN; el vault se deriva en
-- el cliente con un salt de VAULT distinto, de forma que el servidor nunca
-- posee la clave de descifrado (ni puede derivarla del hash de login).

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin','user')),
  status TEXT NOT NULL DEFAULT 'enabled' CHECK (status IN ('enabled','disabled')),
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  iterations INTEGER NOT NULL,
  vault_salt TEXT NOT NULL,
  vault_iterations INTEGER NOT NULL,
  quota_bytes INTEGER NOT NULL DEFAULT 104857600,
  quota_used INTEGER NOT NULL DEFAULT 0,
  vault_id TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);

CREATE TABLE IF NOT EXISTS vaults (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  rev INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  manifest TEXT NOT NULL DEFAULT ''
);

-- Metadatos de blob (existencia, tamano para cuota). El contenido cifrado vive
-- troceado en blob_chunks; vaultBlobKeys usa esta tabla como indice.
CREATE TABLE IF NOT EXISTS blobs (
  vault_id TEXT NOT NULL,
  key TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (vault_id, key)
);

-- Trozos (sobre cifrado, base64) de cada blob. Cada fila < 2 MB (limite D1).
CREATE TABLE IF NOT EXISTS blob_chunks (
  vault_id TEXT NOT NULL,
  key TEXT NOT NULL,
  idx INTEGER NOT NULL,
  data TEXT NOT NULL,
  PRIMARY KEY (vault_id, key, idx)
);

CREATE TABLE IF NOT EXISTS login_attempts (
  scope TEXT PRIMARY KEY,
  fails INTEGER NOT NULL DEFAULT 0,
  locked_until INTEGER
);