import { apiOrigin } from "../services/apiClient.js";

export function mediaUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${apiOrigin()}${p}`;
}
