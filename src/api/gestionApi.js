import { apiFetch } from "./client";

export const gestionApi = {
  teams: {
    list: () => apiFetch("/api/gestion/teams"),
    create: (body) =>
      apiFetch("/api/gestion/teams", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) =>
      apiFetch(`/api/gestion/teams/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id) => apiFetch(`/api/gestion/teams/${id}`, { method: "DELETE" }),
  },
  players: {
    list: (teamId) => {
      const q = teamId ? `?teamId=${teamId}` : "";
      return apiFetch(`/api/gestion/players${q}`);
    },
    get: (id) => apiFetch(`/api/gestion/players/${id}`),
    create: (body) =>
      apiFetch("/api/gestion/players", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) =>
      apiFetch(`/api/gestion/players/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id) => apiFetch(`/api/gestion/players/${id}`, { method: "DELETE" }),
    suggestUsername: (id) => apiFetch(`/api/gestion/players/${id}/suggest-username`),
    updateCredentials: (id, body) =>
      apiFetch(`/api/gestion/players/${id}/credentials`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
  },
  payments: {
    list: () => apiFetch("/api/gestion/payments"),
    create: (body) =>
      apiFetch("/api/gestion/payments", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) =>
      apiFetch(`/api/gestion/payments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id) => apiFetch(`/api/gestion/payments/${id}`, { method: "DELETE" }),
    feePlans: () => apiFetch("/api/gestion/payments/fee-plans"),
    createFeePlan: (body) =>
      apiFetch("/api/gestion/payments/fee-plans", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    updateFeePlan: (id, body) =>
      apiFetch(`/api/gestion/payments/fee-plans/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    removeFeePlan: (id) =>
      apiFetch(`/api/gestion/payments/fee-plans/${id}`, { method: "DELETE" }),
  },
  coaches: {
    list: () => apiFetch("/api/gestion/coaches"),
    me: () => apiFetch("/api/gestion/coaches/me"),
    updateMe: (body) =>
      apiFetch("/api/gestion/coaches/me", { method: "PATCH", body: JSON.stringify(body) }),
    get: (id) => apiFetch(`/api/gestion/coaches/${id}`),
    create: (body) =>
      apiFetch("/api/gestion/coaches", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) =>
      apiFetch(`/api/gestion/coaches/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id) => apiFetch(`/api/gestion/coaches/${id}`, { method: "DELETE" }),
    tactics: {
      list: (coachId) => apiFetch(`/api/gestion/coaches/${coachId}/tactics`),
      create: (coachId, body) =>
        apiFetch(`/api/gestion/coaches/${coachId}/tactics`, {
          method: "POST",
          body: JSON.stringify(body),
        }),
      update: (coachId, tacticId, body) =>
        apiFetch(`/api/gestion/coaches/${coachId}/tactics/${tacticId}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        }),
      remove: (coachId, tacticId) =>
        apiFetch(`/api/gestion/coaches/${coachId}/tactics/${tacticId}`, {
          method: "DELETE",
        }),
    },
  },
  medical: {
    list: (playerId) => apiFetch(`/api/gestion/players/${playerId}/medical`),
    create: (playerId, body) =>
      apiFetch(`/api/gestion/players/${playerId}/medical`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (playerId, id, body) =>
      apiFetch(`/api/gestion/players/${playerId}/medical/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (playerId, id) =>
      apiFetch(`/api/gestion/players/${playerId}/medical/${id}`, { method: "DELETE" }),
  },
  users: {
    list: () => apiFetch("/api/gestion/users"),
    create: (body) =>
      apiFetch("/api/gestion/users", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) =>
      apiFetch(`/api/gestion/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id) => apiFetch(`/api/gestion/users/${id}`, { method: "DELETE" }),
  },
};
