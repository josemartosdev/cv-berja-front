import { apiOrigin } from "../services/apiClient";

function firstNonEmpty(values, fallback = "") {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return fallback;
}

export function normalizePost(raw = {}) {
  const content = firstNonEmpty([
    raw.content,
    raw.body,
    raw.descripcion,
    raw.descripcion_larga,
    raw.contenido,
    raw.text,
  ]);

  const excerpt = firstNonEmpty([
    raw.excerpt,
    raw.summary,
    raw.resumen,
    raw.descripcion_corta,
    content ? String(content).slice(0, 180) : "",
  ]);

  return {
    id: firstNonEmpty([raw.id, raw.post_id], null),
    categoryId: firstNonEmpty([raw.category_id, raw.categoryId], null),
    categoryName: String(
      firstNonEmpty(
        [raw.category_nombre, raw.categoryName, raw.category, raw.categoria],
        "",
      ),
    ),
    title: String(
      firstNonEmpty([raw.title, raw.titulo, raw.nombre], "Sin titulo"),
    ),
    excerpt: String(excerpt || ""),
    content: String(content || ""),
    imageUrl: String(
      firstNonEmpty([
        raw.image_url,
        raw.imageUrl,
        raw.image,
        raw.imagen,
        raw.thumbnail,
        raw.portada,
        raw.imagen_path,
      ]) || "",
    ),
    imageLayout: String(
      firstNonEmpty([
        raw.image_layout,
        raw.imageLayout,
        raw.image_size,
        raw.imageSize,
        raw.image_style,
      ]) || "normal",
    ),
    category: String(
      firstNonEmpty([
        raw.category,
        raw.categoria,
        raw.category_nombre,
        raw.categoryName,
        raw.tag,
        raw.tipo,
      ]) || "Actualidad",
    ),
    slug: String(firstNonEmpty([raw.slug], "")),
    published: Boolean(
      firstNonEmpty(
        [raw.is_published, raw.published, raw.publicado, raw.activo],
        true,
      ),
    ),
    publishedAt: firstNonEmpty(
      [
        raw.published_at,
        raw.publishedAt,
        raw.fecha_publicacion,
        raw.created_at,
        raw.fecha,
      ],
      null,
    ),
  };
}

export function normalizePostsResponse(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload?.data || payload?.items || payload?.results || [];
  if (!Array.isArray(list)) return [];
  return list.map(normalizePost);
}

export function resolvePostImageUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const origin = apiOrigin();
  if (path.startsWith("/")) return `${origin}${path}`;
  return `${origin}/${path}`;
}

export function formatPostDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function buildPostPayload(form) {
  const title = form.title?.trim() || "";
  const excerpt = form.excerpt?.trim() || "";
  const content = form.content?.trim() || "";
  const imageUrl = form.imageUrl?.trim() || null;
  const publishedAt = form.publishedAt || null;
  const categoryId = form.categoryId || null;

  return {
    categoryId: categoryId ? Number(categoryId) : null,
    title,
    excerpt,
    content,
    image_url: imageUrl,
    image_layout: form.imageLayout || "normal",
    published_at: publishedAt,
    is_published: !!form.published,
    titulo: title,
    resumen: excerpt,
    contenido: content,
    imagen: imageUrl,
    imageLayout: form.imageLayout || "normal",
    fecha_publicacion: publishedAt,
    publicado: !!form.published,
  };
}
