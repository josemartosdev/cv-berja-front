import { apiFetch } from "./client";

export const portalApi = {
  me: () => apiFetch("/api/portal/me"),
  updateMe: (body) =>
    apiFetch("/api/portal/me", { method: "PATCH", body: JSON.stringify(body) }),
  medical: () => apiFetch("/api/portal/me/medical"),
};
