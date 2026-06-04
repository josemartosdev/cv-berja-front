/**
 * Mismo patrón que SRM Compras (srm-compras-front/src/services/apiClient.js).
 */
export const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

export function apiUrl(endpoint) {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE}${path}`;
}

export function apiOrigin() {
  return API_BASE.replace(/\/api$/, "") || API_BASE;
}
