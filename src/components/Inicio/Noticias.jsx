import React, { useEffect, useState } from "react";
import { postsApi } from "../../api/postsApi";
import { formatPostDate, resolvePostImageUrl } from "../../lib/posts";

const fallbackNewsImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBDE1haaerqpkwW7XgrNkUiGgWog9TfWGLiZrGP28d-XQ-5qXaozWdyMVG7R633a0sHzNNf9pCm4bNdalbgA6ZAKqTqY1MBod_4_ruhnUL6rpCxghon742FBi1h4YmmhzB8_bMaWHovlGW9JmP0hd3I5INdmJj6oSrENvhQqWZxw57b3SVdsdzd5rOZ7TLucUMjtieTB_HIv86TXLd7Y_9sVHM2o1o5ASAsv8ffi8RIGvmqC3KGbrv-AA";

export default function Noticias() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await postsApi.listPublic({ limit: 4 });
        if (active) {
          setNewsData(data.slice(0, 4));
        }
      } catch (err) {
        console.error("Error cargando noticias:", err);
        if (active) {
          setNewsData([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const [featured, ...rest] = newsData;

  if (loading || newsData.length === 0) {
    return null;
  }

  return (
    <section className="noticias-section">
      <div className="home-module__header">
        <span className="home-eyebrow">Actualidad</span>
        <h2>Últimas noticias</h2>
      </div>
      <div className="noticias-grid">
        <article className="noticia-card noticia-card--featured">
          <div className="noticia-photo">
            <img
              src={resolvePostImageUrl(featured.imageUrl) || fallbackNewsImage}
              alt={featured.title}
            />
            <div className="noticia-overlay">
              <span className="noticia-cat">
                {featured.category || "Actualidad"}
              </span>
              <h3 className="noticia-title">{featured.title}</h3>
              <span className="noticia-time">
                {formatPostDate(featured.publishedAt)}
              </span>
            </div>
          </div>
        </article>
        <div className="noticias-sidebar">
          {rest.map((news) => (
            <article className="noticia-card noticia-card--small" key={news.id}>
              <div className="noticia-photo">
                <img
                  src={resolvePostImageUrl(news.imageUrl) || fallbackNewsImage}
                  alt={news.title}
                />
              </div>
              <div className="noticia-info">
                <span className="noticia-cat">
                  {news.category || "Actualidad"}
                </span>
                <h3 className="noticia-title">{news.title}</h3>
                <span className="noticia-time">
                  {formatPostDate(news.publishedAt)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
