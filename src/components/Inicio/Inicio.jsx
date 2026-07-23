import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SponsorsCarousel from "./SponsorCarousel";
import ResultadosCarousel from "./ResultadosCarousel";
import RedesSociales from "./RedesSociales";
import { postsApi } from "../../api/postsApi";
import { formatPostDate, resolvePostImageUrl } from "../../lib/posts";

function Inicio() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCRf6I1LpKIhKvyEsHqPdHdefyKtGD2eR_6HRMUUQ5n4LgcTuhaGr55W4fDErGdYEc604gscwDERZFQTRHr0mLulZYNpsp-ZbHLd1udP-PMUdCp4H58HNVmIu_UFBHr7xSZ0U20p3745nQDqeer0wzkBlgshpcb_C5TpOM3qrz92zF0f0sm94aKbNCZreQBl5BEXUdX072flGD6GYf1F1Ix9RwkxOnVo7pbY5IgDVSmqoD2unrQ1X2eKQ";

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await postsApi.listPublic({ limit: 3 });
        if (active) {
          setLatestPosts(data.slice(0, 3));
        }
      } catch (err) {
        console.error("Error cargando posts:", err);
        if (active) {
          setLatestPosts([]);
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

  const homeNews = latestPosts.map((post) => ({
    id: post.id,
    tag: post.category || "Actualidad",
    date: formatPostDate(post.publishedAt) || "Publicación reciente",
    title: post.title,
    text: post.excerpt || post.content?.slice(0, 160) || "",
    image: resolvePostImageUrl(post.imageUrl),
  }));

  const fallbackNewsImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBDE1haaerqpkwW7XgrNkUiGgWog9TfWGLiZrGP28d-XQ-5qXaozWdyMVG7R633a0sHzNNf9pCm4bNdalbgA6ZAKqTqY1MBod_4_ruhnUL6rpCxghon742FBi1h4YmmhzB8_bMaWHovlGW9JmP0hd3I5INdmJj6oSrENvhQqWZxw57b3SVdsdzd5rOZ7TLucUMjtieTB_HIv86TXLd7Y_9sVHM2o1o5ASAsv8ffi8RIGvmqC3KGbrv-AA";

  return (
    <section className="inicio home-dashboard">
      <section className="home-dashboard__hero">
        <div className="home-dashboard__hero-overlay" aria-hidden />
        <div className="home-dashboard__hero-inner">
          <div className="home-dashboard__hero-copy">
            <span className="home-dashboard__season">Temporada 2024/25</span>
            <p className="home-dashboard__hero-intro">
              Noticias, cantera y competición en un mismo espacio.
            </p>
            <h1>
              Precision, <span>pasion</span> y legado
            </h1>
            <p>
              Forjando el futuro del voleibol desde Berja. Unete a la elite y
              forma parte de nuestra historia.
            </p>
            <div className="home-dashboard__hero-actions">
              <Link
                to="/equipos"
                className="home-dashboard__btn home-dashboard__btn--primary"
              >
                Ver equipos
              </Link>
              <Link
                to="/partidos"
                className="home-dashboard__btn home-dashboard__btn--ghost"
              >
                Proximo partido
              </Link>
            </div>
          </div>

          <figure className="home-dashboard__hero-figure">
            <img
              className="home-dashboard__hero-image"
              src={heroImage}
              alt="Primer equipo de CV Berja en accion"
            />
            <figcaption className="home-dashboard__hero-caption">
              <strong>CV Berja</strong>
              <span>Competicion, cantera y ambicion de club</span>
            </figcaption>
          </figure>

          <div
            className="home-dashboard__hero-strip"
            aria-label="Datos clave del club"
          >
            <article>
              <strong>+250</strong>
              <span>Jugadores y jugadoras</span>
            </article>
            <article>
              <strong>12</strong>
              <span>Equipos federados</span>
            </article>
            <article>
              <strong>1990</strong>
              <span>Fundacion del club</span>
            </article>
          </div>
        </div>
      </section>

      <section className="home-dashboard__match">
        <div className="home-dashboard__match-copy">
          <span>Proximo gran partido</span>
          <h2>Liga Nacional - Jornada 12</h2>
          <p>24 Mayo, 2024 · Pabellon Municipal Berja</p>
        </div>
        <div className="home-dashboard__match-vs">
          <div>CV Berja</div>
          <strong>VS</strong>
          <div>AD Almeria</div>
        </div>
        <div className="home-dashboard__match-cta">
          <b>03 : 14 : 42</b>
        </div>
      </section>

      <section className="home-dashboard__news">
        <header>
          <div>
            <h2>Ultimas noticias</h2>
            <span />
          </div>
          <Link to="/posts">Ver todos los posts</Link>
        </header>

        <div className="home-dashboard__news-grid">
          {loading ? (
            <p
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: "#888",
                padding: "2rem",
              }}
            >
              Cargando noticias…
            </p>
          ) : homeNews.length === 0 ? (
            <p
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: "#888",
                padding: "2rem",
              }}
            >
              Aún no hay noticias. Vuelve pronto.
            </p>
          ) : (
            homeNews.map((item) => (
              <Link
                key={item.id}
                to={`/posts/${item.id}`}
                className="home-dashboard__news-link"
              >
                <article>
                  <div className="home-dashboard__news-media">
                    <img
                      src={item.image || fallbackNewsImage}
                      alt={item.title}
                    />
                    <span>{item.tag}</span>
                  </div>
                  <div className="home-dashboard__news-copy">
                    <small>{item.date}</small>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <span className="home-dashboard__news-cta">
                      Leer noticia
                    </span>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="home-dashboard__block home-dashboard__block--results">
        <ResultadosCarousel />
      </section>

      <section className="home-dashboard__block home-dashboard__block--social">
        <RedesSociales />
      </section>

      <section className="home-dashboard__academy">
        <div className="home-dashboard__academy-media">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaKWSseJtDZ25jFlF6lxg2zv4vRbN54prCuQDd_-ybHjyeeucFKKgMKefNn4gns_AfUuWvdfVBryr2NGxTzcW13yKiFk8ydoVV9DT6tcO8UeZuxXu2aTsA0NZKJHFtXjsuStQujhkIwfIs4w08mXef2Xaodgi32o0MlXfalOOSP_zvvlcH0y-Nq7HPQbN653_WbCv0in0GjIZ9ImtY6uuJ39PKd0BExAf3ESpEdXGGf8jVuBceemFvmQ"
            alt="Cantera CV Berja entrenando"
          />
          <div className="home-dashboard__academy-stats">
            <article>
              <strong>250+</strong>
              <span>Alumnos</span>
            </article>
            <article>
              <strong>12</strong>
              <span>Equipos federados</span>
            </article>
          </div>
        </div>

        <div className="home-dashboard__academy-copy">
          <span>Forjando el futuro</span>
          <h2>Nuestra cantera</h2>
          <p>
            El CV Berja es una escuela de vida. Combinamos excelencia tecnica,
            disciplina y valores para impulsar a cada jugador y jugadora.
          </p>
          <ul>
            <li>Entrenamiento elite con tecnicos titulados</li>
            <li>Valores y disciplina como identidad de club</li>
            <li>Proyeccion al primer equipo y becas deportivas</li>
          </ul>
          <button type="button">Inscribete en la academia</button>
        </div>
      </section>

      <section className="home-dashboard__block home-dashboard__block--sponsors home-module home-module--sponsors">
        <div className="home-module__header home-module__header--row">
          <div>
            <span className="home-eyebrow">Patrocinadores</span>
            <h2>Aliados del club</h2>
          </div>
          <Link to="/patrocinadores" className="home-module__link">
            Ver area de patrocinadores {">"}
          </Link>
        </div>
        <SponsorsCarousel />
      </section>
    </section>
  );
}

export default Inicio;
