import { apiFetch } from "./client";

async function fetchWithFallback(paths, options = undefined) {
  let lastError;
  for (const path of paths) {
    try {
      return await apiFetch(path, options);
    } catch (err) {
      lastError = err;
      if (![404, 405].includes(err?.status)) {
        throw err;
      }
    }
  }
  throw lastError || new Error("No se pudo resolver la ruta de API");
}

export const gestionApi = {
  teams: {
    list: () => apiFetch("/gestion/teams"),
    create: (body) =>
      apiFetch("/gestion/teams", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id, body) =>
      apiFetch(`/gestion/teams/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id) => apiFetch(`/gestion/teams/${id}`, { method: "DELETE" }),
  },
  players: {
    list: (teamId) => {
      const q = teamId ? `?teamId=${teamId}` : "";
      return apiFetch(`/gestion/players${q}`);
    },
    get: (id) => apiFetch(`/gestion/players/${id}`),
    create: (body) =>
      apiFetch("/gestion/players", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id, body) =>
      apiFetch(`/gestion/players/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id) => apiFetch(`/gestion/players/${id}`, { method: "DELETE" }),
    suggestUsername: (id) =>
      apiFetch(`/gestion/players/${id}/suggest-username`),
    updateCredentials: (id, body) =>
      apiFetch(`/gestion/players/${id}/credentials`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
  },
  payments: {
    list: () => apiFetch("/gestion/payments"),
    create: (body) =>
      apiFetch("/gestion/payments", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id, body) =>
      apiFetch(`/gestion/payments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id) => apiFetch(`/gestion/payments/${id}`, { method: "DELETE" }),
    feePlans: () => apiFetch("/gestion/payments/fee-plans"),
    createFeePlan: (body) =>
      apiFetch("/gestion/payments/fee-plans", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    updateFeePlan: (id, body) =>
      apiFetch(`/gestion/payments/fee-plans/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    removeFeePlan: (id) =>
      apiFetch(`/gestion/payments/fee-plans/${id}`, { method: "DELETE" }),
  },
  coaches: {
    list: () => apiFetch("/gestion/coaches"),
    me: () => apiFetch("/gestion/coaches/me"),
    updateMe: (body) =>
      apiFetch("/gestion/coaches/me", {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    get: (id) => apiFetch(`/gestion/coaches/${id}`),
    create: (body) =>
      apiFetch("/gestion/coaches", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id, body) =>
      apiFetch(`/gestion/coaches/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id) => apiFetch(`/gestion/coaches/${id}`, { method: "DELETE" }),
    tactics: {
      list: (coachId) => apiFetch(`/gestion/coaches/${coachId}/tactics`),
      create: (coachId, body) =>
        apiFetch(`/gestion/coaches/${coachId}/tactics`, {
          method: "POST",
          body: JSON.stringify(body),
        }),
      update: (coachId, tacticId, body) =>
        apiFetch(`/gestion/coaches/${coachId}/tactics/${tacticId}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        }),
      remove: (coachId, tacticId) =>
        apiFetch(`/gestion/coaches/${coachId}/tactics/${tacticId}`, {
          method: "DELETE",
        }),
    },
  },
  medical: {
    list: (playerId) => apiFetch(`/gestion/players/${playerId}/medical`),
    create: (playerId, body) =>
      apiFetch(`/gestion/players/${playerId}/medical`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (playerId, id, body) =>
      apiFetch(`/gestion/players/${playerId}/medical/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (playerId, id) =>
      apiFetch(`/gestion/players/${playerId}/medical/${id}`, {
        method: "DELETE",
      }),
  },
  users: {
    me: () => fetchWithFallback(["/gestion/users/me", "/auth/me"]),
    updateMe: (body, userId) =>
      fetchWithFallback(
        ["/gestion/users/me", userId ? `/gestion/users/${userId}` : ""].filter(
          Boolean,
        ),
        {
          method: "PATCH",
          body: JSON.stringify(body),
        },
      ),
    list: () => apiFetch("/gestion/users"),
    create: (body) =>
      apiFetch("/gestion/users", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id, body) =>
      apiFetch(`/gestion/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id) => apiFetch(`/gestion/users/${id}`, { method: "DELETE" }),
  },
};
