import { Link } from "react-router-dom";
import SponsorsCarousel from "./SponsorCarousel";
import ResultadosCarousel from "./ResultadosCarousel";
import Noticias from "./Noticias";
import RedesSociales from "./RedesSociales";

const stats = [
  { value: "1990", label: "Fundado" },
  { value: "13", label: "Campeonatos" },
  { value: "1.000+", label: "Jugadores" },
  { value: "5", label: "Equipos activos" },
];

function Inicio() {
  return (
    <section className="inicio">
      <div className="hero">
        <div className="hero__inner">
          <div className="hero__content">
            <span className="hero__eyebrow">Temporada 2025–26</span>
            <h1 className="hero__title">
              Reinventamos<br />el voleibol<br />
              <em>con fuerza y estilo</em>
            </h1>
            <p className="hero__sub">
              Un club moderno, competitivo y abierto a todos: jugadores, familias y patrocinadores.
            </p>
            <div className="hero__ctas">
              <Link to="/equipos" className="btn-primary">Ver equipos</Link>
              <Link to="/calendario" className="btn-ghost">Calendario</Link>
            </div>
          </div>
          <div className="hero__visual">
            <img src={`${import.meta.env.BASE_URL}img/hero.png`} alt="Jugador de voleibol rematando" />
          </div>
        </div>
        <div className="hero__stats">
          {stats.map(s => (
            <div className="hero__stat" key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="home-modules">
        <Noticias />
        <ResultadosCarousel />
        <RedesSociales />
        <section className="home-module home-module--sponsors">
          <div className="home-module__header home-module__header--row">
            <div>
              <span className="home-eyebrow">Patrocinadores</span>
              <h2>Aliados del club</h2>
            </div>
            <Link to="/patrocinadores" className="home-module__link">
              Ver área de patrocinadores →
            </Link>
          </div>
          <SponsorsCarousel />
        </section>
      </div>
    </section>
  );
}

export default Inicio;