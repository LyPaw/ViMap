// Cliente HTTP de la API del backend (mismo origen: /api).
// La sesion viaja en una cookie HttpOnly; aqui solo se envian/usen datos.
// Las mutaciones llevan X-Vimap: 1 (anti-CSRF, el servidor lo exige).

export class ApiError extends Error {
  constructor(code, message, status, data) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.data = data || null;
  }
}

async function request(method, path, body) {
  const headers = {};
  let payload;
  if (body !== undefined) {
    if (body instanceof Blob || typeof body === "string") {
      payload = body;
      headers["content-type"] = "text/plain; charset=utf-8";
    } else {
      payload = JSON.stringify(body);
      headers["content-type"] = "application/json; charset=utf-8";
    }
  }
  if (method !== "GET" && method !== "HEAD") headers["x-vimap"] = "1";

  let res;
  try {
    res = await fetch("/api" + path, { method, headers, body: payload, credentials: "same-origin" });
  } catch (err) {
    throw new ApiError("NETWORK", "No se pudo contactar con el servidor: " + (err.message || err), 0);
  }

  let data = null;
  const type = res.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else if (type.startsWith("text/")) {
    data = await res.text();
  }

  if (!res.ok) {
    const code = (data && data.error) || "ERROR";
    const message = (data && data.message) || "Error " + res.status;
    const e = new ApiError(code, message, res.status, data);
    if (res.status === 409 && data) e.data = data;
    if (res.status === 401 && path !== "/me" && path !== "/login" && path !== "/logout" && path !== "/admin/setup" && path !== "/setup/status") {
      document.dispatchEvent(new CustomEvent("vimap:unauthorized"));
    }
    throw e;
  }
  return data;
}

export const api = {
  me: () => request("GET", "/me"),

  async login(username, password) {
    return request("POST", "/login", { username, password });
  },
  logout: () => request("POST", "/logout", {}),

  vault: () => request("GET", "/vault"),

  async sessions() {
    const data = await request("GET", "/sessions");
    return Array.isArray(data && data.sessions) ? data.sessions : [];
  },
  revokeSession: (id) => request("DELETE", "/sessions/" + id, {}),

  adminStats: () => request("GET", "/admin/stats"),

  blobPut(key, envelopeText) {
    return request("PUT", "/vault/blobs/" + encodeURIComponent(key), envelopeText);
  },
  blobGet(key) {
    return request("GET", "/vault/blobs/" + encodeURIComponent(key));
  },
  manifestPush(payload) {
    return request("PUT", "/vault/manifest", payload);
  },

  adminSetup(body) {
    return request("POST", "/admin/setup", body);
  },
  setupStatus: () => request("GET", "/setup/status"),
  async adminUsers() {
    const data = await request("GET", "/admin/users");
    const rows = Array.isArray(data && data.users) ? data.users : [];
    return rows.map((u) => ({
      id: u.id,
      username: u.username,
      displayName: u.display_name,
      role: u.role,
      status: u.status,
      quotaBytes: u.quota_bytes,
      quotaUsed: u.quota_used,
      createdAt: u.created_at,
    }));
  },
  adminCreateUser: (body) => request("POST", "/admin/users", body),
  adminPatchUser: (id, body) => request("PATCH", "/admin/users/" + id, body),
  adminDeleteUser: (id) => request("DELETE", "/admin/users/" + id, {}),
};

export function apiErrorMessage(err) {
  return err instanceof ApiError ? err.message : String((err && err.message) || err);
}