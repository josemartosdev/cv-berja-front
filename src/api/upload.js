import { getAuthToken } from "./client";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function uploadFile(url, file) {
  const form = new FormData();
  form.append("file", file);

  const headers = {};
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    credentials: "include",
    headers,
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Error al subir archivo");
  return data;
}
