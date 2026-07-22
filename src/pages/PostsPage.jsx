import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { postsApi } from "../api/postsApi";
import { formatPostDate, resolvePostImageUrl } from "../lib/posts";
import { publicPostsFallback } from "../data/publicPostsFallback";

const fallbackNewsImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBDE1haaerqpkwW7XgrNkUiGgWog9TfWGLiZrGP28d-XQ-5qXaozWdyMVG7R633a0sHzNNf9pCm4bNdalbgA6ZAKqTqY1MBod_4_ruhnUL6rpCxghon742FBi1h4YmmhzB8_bMaWHovlGW9JmP0hd3I5INdmJj6oSrENvhQqWZxw57b3SVdsdzd5rOZ7TLucUMjtieTB_HIv86TXLd7Y_9sVHM2o1o5ASAsv8ffi8RIGvmqC3KGbrv-AA";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await postsApi.listPublic({ limit: 3 });
      setPosts(data.slice(0, 3));
    } catch (err) {
      setPosts(publicPostsFallback);
      setError("");
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

      {error && <p className="posts-state posts-state--error">{error}</p>}

      {loading ? (
        <p className="posts-state">Cargando posts…</p>
      ) : posts.length === 0 ? (
        <p className="posts-state">Todavía no hay posts publicados.</p>
      ) : (
        <section className="posts-grid">
          {posts.map((post) => (
            <article key={post.id} className="posts-card">
              <div className="posts-card__media">
                <img
                  src={resolvePostImageUrl(post.imageUrl) || fallbackNewsImage}
                  alt={post.title}
                />
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
