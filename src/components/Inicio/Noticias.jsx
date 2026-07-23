import React, { useEffect, useState } from "react";
import { postsApi } from "../../api/postsApi";
import { formatPostDate, resolvePostImageUrl } from "../../lib/posts";

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
            {featured.imageUrl && (
              <img
                src={resolvePostImageUrl(featured.imageUrl)}
                alt={featured.title}
              />
            )}
            {!featured.imageUrl && (
              <div style={{ background: "#e5e7eb", height: "100%" }} />
            )}
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
                {news.imageUrl && (
                  <img
                    src={resolvePostImageUrl(news.imageUrl)}
                    alt={news.title}
                  />
                )}
                {!news.imageUrl && (
                  <div style={{ background: "#e5e7eb", height: "100%" }} />
                )}
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
