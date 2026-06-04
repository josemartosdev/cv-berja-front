import { apiUrl } from "../services/apiClient.js";
import { getAuthToken } from "./client";

export async function uploadFile(url, file) {
  const form = new FormData();
  form.append("file", file);

  const headers = {};
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(apiUrl(url), {
    method: "POST",
    headers,
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Error al subir el archivo");
  }
  return data;
}
