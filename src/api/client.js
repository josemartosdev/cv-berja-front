import { apiUrl } from "../services/apiClient.js";

const TOKEN_KEY = "cv_berja_token";

export function getAuthToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

export async function apiFetch(path, options = {}) {
  const token = getAuthToken();
  const headers = {};

  // DEBUG
  console.log(
    `[apiFetch] Path: ${path}, Token exists: ${!!token}, auth flag: ${options.auth}`,
  );

  // Solo agregar Content-Type si no es FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Merge con headers personalizados
  Object.assign(headers, options.headers);

  // Solo agregar token si options.auth !== false y tenemos token
  if (options.auth !== false && token) {
    headers.Authorization = `Bearer ${token}`;
    console.log(`[apiFetch] ✅ Token added to Authorization header`);
  } else if (options.auth !== false && !token) {
    console.log(`[apiFetch] ⚠️  No token available for protected request`);
  }

  const res = await fetch(apiUrl(path), {
    headers,
    ...options,
  });

  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    const sqlMatch = text.match(/SQLSTATE\[[^\]]+\][^<]*/);
    const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
    if (sqlMatch) {
      data.error = sqlMatch[0].trim();
    } else if (titleMatch) {
      data.error = titleMatch[1].replace(/\s*\(\d+[^)]*\)\s*$/, "").trim();
    }
  }

  if (!res.ok) {
    console.error(`❌ HTTP ${res.status} @ ${apiUrl(path)}`);
    console.error("📝 Response body:", text);
    console.error("📦 Parsed data:", data);

    // Determinar el mensaje de error más apropiado
    let fallback = "Error en la petición";

    if (res.status === 400) {
      // Si hay un error específico en data.error, lo usamos
      fallback = data.error || data.message || "Petición inválida";
    } else if (res.status === 401) {
      // Si es un endpoint público (auth: false), el 401 significa que el endpoint no es público
      fallback =
        options.auth === false
          ? "Endpoint no disponible públicamente. Inicia sesión para acceder."
          : "No autenticado. Vuelve a iniciar sesión.";
    } else if (res.status === 403) {
      fallback = "No tienes permisos para acceder a esto.";
    } else if (res.status === 404) {
      fallback = "Recurso no encontrado.";
    } else if (res.status >= 500) {
      fallback = "Error del servidor. Intenta más tarde.";
    }

    const err = new Error(data.error || data.message || fallback);
    err.status = res.status;
    throw err;
  }

  return data;
}

export const authApi = {
  login: async (username, password) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },
  logout: async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } finally {
      setAuthToken(null);
    }
  },
  me: async () => {
    try {
      return await apiFetch("/auth/me");
    } catch (err) {
      // 401 es esperado cuando no hay sesión activa
      if (err.status === 401) {
        return { user: null };
      }
      throw err;
    }
  },
};
