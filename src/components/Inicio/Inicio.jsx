import { Link } from "react-router-dom";
import SponsorsCarousel from "./SponsorCarousel";
import ResultadosCarousel from "./ResultadosCarousel";
import RedesSociales from "./RedesSociales";

const news = [
  {
    id: 1,
    tag: "Cronica",
    date: "15 de Mayo, 2024",
    title: "Victoria epica en el tie-break ante el lider",
    text: "Nuestro equipo senior masculino remonta dos sets en contra para llevarse los puntos en un encuentro intenso.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDE1haaerqpkwW7XgrNkUiGgWog9TfWGLiZrGP28d-XQ-5qXaozWdyMVG7R633a0sHzNNf9pCm4bNdalbgA6ZAKqTqY1MBod_4_ruhnUL6rpCxghon742FBi1h4YmmhzB8_bMaWHovlGW9JmP0hd3I5INdmJj6oSrENvhQqWZxw57b3SVdsdzd5rOZ7TLucUMjtieTB_HIv86TXLd7Y_9sVHM2o1o5ASAsv8ffi8RIGvmqC3KGbrv-AA",
  },
  {
    id: 2,
    tag: "Club Cantera",
    date: "12 de Mayo, 2024",
    title: "Abiertas las inscripciones para el Campus de Verano",
    text: "Ya puedes inscribir a los mas pequenos en nuestra edicion numero XV del campus tecnico.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDCPPY5pntabrwl1M27r8r8Zs1N6c8uwEVQAXkYcNWXbageC0W9ZXNMya5EeAlwy4-1CzYyWbhATs5W2Qcho7Hd7foW8NSFOa7dfXGo2v9yFRNan2-0kyK4n0Y7cK_OOhUHG5G489DQp4TFxmjt16h-ThW25W5yuP1M7wiYZavNlczv8KSkzi-AsTP9pYNIBt5LsnVI8OV4_nA81mGsP9yXBijSavfwcwl24j-4ThS-2iG_zAiDFrbczg",
  },
  {
    id: 3,
    tag: "Instalaciones",
    date: "10 de Mayo, 2024",
    title: "Mejoras en el sistema de iluminacion del pabellon",
    text: "Gracias al acuerdo con el Patronato, se han instalado nuevos focos LED de ultima generacion.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgv-wLvq7QWKFaYj-Kul_ndx4nyRuH8DSLgmCh6Ck7OPPR7Do0rAH1ah-tD7P8DmLnjrhaibgqzHyJWzUJQfjat_Rn8m8TCA-hpQUmaYWOk0RfkxC9ADoF8bDUhJdtkt6xx01ETEywhADzRMh-rhtRht9rtQVdxqw1Ecm_SUthaSIS4j16EGEZkvtpTlWc-_oWJHqm3Be6jLxeXRkZ-0sSBwY9NJ4iIxdKKPFMU-07mTKLsy5lPx4C8w",
  },
];

function Inicio() {
  const heroImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCRf6I1LpKIhKvyEsHqPdHdefyKtGD2eR_6HRMUUQ5n4LgcTuhaGr55W4fDErGdYEc604gscwDERZFQTRHr0mLulZYNpsp-ZbHLd1udP-PMUdCp4H58HNVmIu_UFBHr7xSZ0U20p3745nQDqeer0wzkBlgshpcb_C5TpOM3qrz92zF0f0sm94aKbNCZreQBl5BEXUdX072flGD6GYf1F1Ix9RwkxOnVo7pbY5IgDVSmqoD2unrQ1X2eKQ";

  return (
    <section className="inicio home-dashboard">
      <section className="home-dashboard__hero">
        <div
          className="home-dashboard__hero-media"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden
        />
        <div className="home-dashboard__hero-overlay" aria-hidden />
        <div className="home-dashboard__hero-inner">
          <span className="home-dashboard__season">Temporada 2024/25</span>
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
          <Link to="/partidos">Ver todo el archivo</Link>
        </header>

        <div className="home-dashboard__news-grid">
          {news.map((item) => (
            <article key={item.id}>
              <div className="home-dashboard__news-media">
                <img src={item.image} alt={item.title} />
                <span>{item.tag}</span>
              </div>
              <div className="home-dashboard__news-copy">
                <small>{item.date}</small>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
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
