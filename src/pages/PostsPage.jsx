import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { postsApi } from "../api/postsApi";
import { formatPostDate, resolvePostImageUrl } from "../lib/posts";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await postsApi.listPublic({ limit: 999 });
      setPosts(data);
    } catch (err) {
      console.error("Error cargando posts:", err);
      setError(err.message || "Error al cargar los posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <PublicLayout className="posts-page">
      <section className="posts-hero">
        <div className="posts-hero__copy">
          <span className="posts-hero__eyebrow">Noticias del club</span>
          <h1>Posts y publicaciones</h1>
          <p>
            Sigue la actualidad del CV Berja con crónicas, avisos, cantera y
            novedades del club.
          </p>
        </div>
      </section>

      {error && (
        <div
          style={{
            padding: "1rem",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: 6,
            marginBottom: "1.5rem",
            fontSize: "0.95rem",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <p className="posts-state">Cargando posts…</p>
      ) : posts.length === 0 ? (
        <p className="posts-state">Todavía no hay posts publicados.</p>
      ) : (
        <section className="posts-grid">
          {posts.map((post) => (
            <article key={post.id} className="posts-card">
              <div className="posts-card__media">
                {post.imageUrl ? (
                  <img
                    src={resolvePostImageUrl(post.imageUrl)}
                    alt={post.title}
                  />
                ) : (
                  <div style={{ background: "#e5e7eb", height: "100%" }} />
                )}
                <span>{post.category || "Actualidad"}</span>
              </div>
              <div className="posts-card__body">
                <small>{formatPostDate(post.publishedAt)}</small>
                <h2>{post.title}</h2>
                <p>{post.excerpt || post.content?.slice(0, 160) || ""}</p>
                <Link to={`/posts/${post.id}`} className="posts-card__cta">
                  Leer noticia
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </PublicLayout>
  );
}
