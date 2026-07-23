import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { postsApi } from "../api/postsApi";
import { formatPostDate, resolvePostImageUrl } from "../lib/posts";
import { publicPostsFallback } from "../data/publicPostsFallback";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageExpanded, setImageExpanded] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPost(await postsApi.getPublic(id));
    } catch (err) {
      const fallbackPost = publicPostsFallback.find(
        (item) => String(item.id) === String(id),
      );
      if (fallbackPost) {
        setPost(fallbackPost);
      } else {
        setPost(null);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!imageExpanded) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setImageExpanded(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [imageExpanded]);

  return (
    <PublicLayout className="post-detail-page">
      <div className="post-detail__back">
        <Link to="/posts">Volver a posts</Link>
      </div>

      {loading ? (
        <p className="posts-state">Cargando detalle…</p>
      ) : error || !post ? (
        <p className="posts-state posts-state--error">
          {error || "No se pudo encontrar este post."}
        </p>
      ) : (
        <article className="post-detail">
          <header className="post-detail__hero">
            <div className="post-detail__meta">
              <span>{post.category || post.categoryName || "Actualidad"}</span>
              <small>{formatPostDate(post.publishedAt)}</small>
            </div>
            <h1>{post.title}</h1>
            <Link to="/posts" className="post-detail__link-inline">
              Ver más noticias
            </Link>
            {post.excerpt && <p>{post.excerpt}</p>}
          </header>

          {post.imageUrl && (
            <button
              type="button"
              className={`post-detail__media post-detail__media--${post.imageLayout || "normal"}`}
              onClick={() => setImageExpanded(true)}
              aria-label="Ampliar imagen del post"
            >
              <img src={resolvePostImageUrl(post.imageUrl)} alt={post.title} />
              <span className="post-detail__media-hint">
                Click para ampliar
              </span>
            </button>
          )}
          {!post.imageUrl && (
            <div
              className="post-detail__media post-detail__media--normal"
              style={{ background: "#e5e7eb", minHeight: "300px" }}
            />
          )}

          <div className="post-detail__content">
            <p>{post.content}</p>
          </div>

          {imageExpanded && (
            <div
              className="post-detail__lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={`Imagen ampliada de ${post.title}`}
              onClick={() => setImageExpanded(false)}
            >
              <button
                type="button"
                className="post-detail__lightbox-close"
                onClick={() => setImageExpanded(false)}
                aria-label="Cerrar imagen ampliada"
              >
                ×
              </button>
              {post.imageUrl && (
                <img
                  src={resolvePostImageUrl(post.imageUrl)}
                  alt={post.title}
                />
              )}
              {!post.imageUrl && (
                <div style={{ background: "#e5e7eb", height: "100%" }} />
              )}
            </div>
          )}
        </article>
      )}
    </PublicLayout>
  );
}
