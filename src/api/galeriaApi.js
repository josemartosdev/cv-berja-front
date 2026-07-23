import { apiFetch } from "./client";
import { apiUrl } from "../services/apiClient";
import { getAuthToken } from "./client";

export const galeriaApi = {
  /** Lista pública de todas las fotos (galería + jugadores + posts) */
  listPublic: () => apiFetch("/galeria", { auth: false }),

  /** Sube una foto nueva a la galería (requiere auth) */
  upload: async (file, titulo = "", tipo = "galeria", displayType = "web") => {
    const form = new FormData();
    form.append("foto", file);
    if (titulo) form.append("titulo", titulo);
    form.append("tipo", tipo);
    form.append("displayType", displayType);

    const headers = {};
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(apiUrl("/gestion/galeria"), {
      method: "POST",
      headers,
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Error al subir la foto");
    return data;
  },

  /** Elimina una foto de la galería por id */
  remove: (id) => apiFetch(`/gestion/galeria/${id}`, { method: "DELETE" }),

  /** Actualiza el tipo de visualización de una foto */
  updateDisplayType: (id, displayType) =>
    apiFetch(`/gestion/galeria/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ displayType }),
    }),
};
