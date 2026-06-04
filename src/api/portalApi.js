import { apiFetch } from "./client";

export const portalApi = {
  me: () => apiFetch("/portal/me"),
  updateMe: (body) =>
    apiFetch("/portal/me", { method: "PATCH", body: JSON.stringify(body) }),
  medical: () => apiFetch("/portal/me/medical"),
};
