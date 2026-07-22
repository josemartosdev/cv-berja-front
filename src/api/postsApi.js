import { apiFetch } from "./client";
import { normalizePostsResponse, normalizePost } from "../lib/posts";

async function requestWithFallback(candidates, options = {}) {
  let lastError;
  for (const path of candidates) {
    try {
      return await apiFetch(path, options);
    } catch (err) {
      lastError = err;
      if (![404, 405].includes(err?.status)) {
        throw err;
      }
    }
  }
  throw lastError || new Error("No se encontro endpoint disponible para posts");
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  return query.toString() ? `?${query.toString()}` : "";
}

const PUBLIC_LIST_ROUTES = ["/posts"];
const PUBLIC_DETAIL_ROUTES = ["/posts"];
const ADMIN_POSTS_ROUTES = ["/gestion/posts"];
const CATEGORY_ROUTES = ["/gestion/post-categories"];

export const postsApi = {
  async getPublic(id) {
    const data = await requestWithFallback(
      PUBLIC_DETAIL_ROUTES.map((route) => `${route}/${id}`),
      { auth: false },
    );
    return normalizePost(data);
  },

  async get(id) {
    const data = await requestWithFallback([`/gestion/posts/${id}`]);
    return normalizePost(data);
  },

  async listPublic(params = {}) {
    const query = buildQuery(params);
    const data = await requestWithFallback(
      PUBLIC_LIST_ROUTES.map((route) => `${route}${query}`),
      { auth: false },
    );
    return normalizePostsResponse(data)
      .filter((post) => post.published)
      .sort(
        (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0),
      );
  },

  async listAdmin(params = {}) {
    const query = buildQuery(params);
    const data = await requestWithFallback(
      ADMIN_POSTS_ROUTES.map((route) => `${route}${query}`),
    );
    return normalizePostsResponse(data).sort(
      (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0),
    );
  },

  async create(body) {
    const data = await requestWithFallback(ADMIN_POSTS_ROUTES, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return normalizePost(data);
  },

  async update(id, body) {
    const data = await requestWithFallback(
      ADMIN_POSTS_ROUTES.map((route) => `${route}/${id}`),
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
    );
    return normalizePost(data);
  },

  async remove(id) {
    await requestWithFallback(
      ADMIN_POSTS_ROUTES.map((route) => `${route}/${id}`),
      {
        method: "DELETE",
      },
    );
  },

  categories: {
    async list() {
      const data = await requestWithFallback(CATEGORY_ROUTES);
      return Array.isArray(data) ? data : data?.data || [];
    },
    async create(body) {
      return requestWithFallback(CATEGORY_ROUTES, {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    async update(id, body) {
      return requestWithFallback(
        CATEGORY_ROUTES.map((route) => `${route}/${id}`),
        {
          method: "PATCH",
          body: JSON.stringify(body),
        },
      );
    },
    async remove(id) {
      return requestWithFallback(
        CATEGORY_ROUTES.map((route) => `${route}/${id}`),
        {
          method: "DELETE",
        },
      );
    },
  },
};
