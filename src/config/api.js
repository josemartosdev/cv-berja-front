/**
 * Misma convención que SRM Compras:
 * - VITE_API_URL apunta a la raíz de la API (termina en /api).
 * - API_ORIGIN = host del backend (fotos, /uploads).
 */
const DEFAULT_ORIGIN = "http://127.0.0.1:8000";
const raw = import.meta.env.VITE_API_URL;

function resolve() {
  if (!raw || String(raw).trim() === "") {
    return { base: `${DEFAULT_ORIGIN}/api`, origin: DEFAULT_ORIGIN };
  }
  const trimmed = String(raw).replace(/\/$/, "");
  if (trimmed.endsWith("/api")) {
    return { base: trimmed, origin: trimmed.slice(0, -4) || DEFAULT_ORIGIN };
  }
  return { base: `${trimmed}/api`, origin: trimmed };
}

export const { base: API_BASE, origin: API_ORIGIN } = resolve();

/** Ruta bajo /api (ej. /auth/login, /gestion/teams). */
export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

/** URL absoluta para estáticos del backend (/uploads/...). */
export function assetUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_ORIGIN}${p}`;
}
