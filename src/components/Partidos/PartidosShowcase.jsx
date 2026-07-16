import { useMemo, useState } from "react";

const filters = ["TODOS", "SENIOR MASC", "SENIOR FEM", "JUVENIL", "CADETE"];

const matches = [
  {
    id: 1,
    category: "SENIOR MASC",
    home: "CV BERJA",
    away: "CV ALMERIA",
    homeSide: "LOCAL",
    awaySide: "VISITANTE",
    date: "Sabado, 12 Oct",
    time: "18:30 H",
    venue: "Pabellon Municipal de Berja",
    action: "COMPRAR ENTRADAS",
    highlighted: true,
  },
  {
    id: 2,
    category: "JUVENIL",
    home: "CV ROQUETAS",
    away: "CV BERJA",
    homeSide: "LOCAL",
    awaySide: "VISITANTE",
    date: "Domingo, 20 Oct",
    time: "11:00 H",
    venue: "Pab. Infanta Cristina",
    action: "VER DETALLES",
    highlighted: false,
  },
  {
    id: 3,
    category: "SENIOR MASC",
    home: "CV BERJA",
    away: "CP ELCHE",
    homeSide: "LOCAL",
    awaySide: "VISITANTE",
    date: "Sabado, 26 Oct",
    time: "19:00 H",
    venue: "Pabellon Municipal de Berja",
    action: "COMPRAR ENTRADAS",
    highlighted: true,
  },
];

const events = [
  { day: "12", title: "Senior Masc. vs Almeria", meta: "18:30 H - Local" },
  { day: "26", title: "Senior Masc. vs Elche", meta: "19:00 H - Local" },
];

function TeamBadge({ name }) {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return <span className="matches-v3__team-badge">{letters}</span>;
}

export default function PartidosShowcase() {
  const [activeFilter, setActiveFilter] = useState("TODOS");

  const visibleMatches = useMemo(() => {
    if (activeFilter === "TODOS") return matches;
    return matches.filter((m) => m.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="matches-v3">
      <section className="matches-v3__hero">
        <div className="matches-v3__hero-overlay" />
        <div className="matches-v3__hero-content">
          <span className="matches-v3__chip">Temporada 24/25</span>
          <h1>
            Proximos <span>Partidos</span>
          </h1>
        </div>
      </section>

      <section className="matches-v3__layout">
        <div className="matches-v3__main">
          <div className="matches-v3__filters">
            <span>FILTRAR POR:</span>
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={filter === activeFilter ? "is-active" : ""}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="matches-v3__cards">
            {visibleMatches.map((match) => (
              <article key={match.id} className="matches-v3__card">
                <div className="matches-v3__card-body">
                  <div className="matches-v3__teams">
                    <div className="matches-v3__team matches-v3__team--home">
                      <TeamBadge name={match.home} />
                      <h3>{match.home}</h3>
                      <small>{match.homeSide}</small>
                    </div>

                    <strong className="matches-v3__vs">VS</strong>

                    <div className="matches-v3__team matches-v3__team--away">
                      <TeamBadge name={match.away} />
                      <h3>{match.away}</h3>
                      <small>{match.awaySide}</small>
                    </div>
                  </div>

                  <div className="matches-v3__divider" />

                  <div className="matches-v3__details">
                    <p>
                      <span className="material-symbols-outlined">
                        calendar_today
                      </span>
                      {match.date}
                    </p>
                    <p>
                      <span className="material-symbols-outlined">
                        schedule
                      </span>
                      {match.time}
                    </p>
                    <p>
                      <span className="material-symbols-outlined">
                        location_on
                      </span>
                      {match.venue}
                    </p>
                    <button
                      type="button"
                      className={
                        match.highlighted ? "is-primary" : "is-secondary"
                      }
                    >
                      {match.action}
                    </button>
                  </div>
                </div>

                <footer className="matches-v3__card-foot">
                  Categoria: {match.category}
                </footer>
              </article>
            ))}
          </div>
        </div>

        <aside className="matches-v3__side">
          <section className="matches-v3__calendar">
            <header>
              <h2>
                OCTUBRE <span>2024</span>
              </h2>
              <div>
                <button type="button" aria-label="Mes anterior">
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>
                <button type="button" aria-label="Mes siguiente">
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>
              </div>
            </header>

            <div className="matches-v3__weekdays">
              {"LMXJVSD".split("").map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="matches-v3__days">
              {[
                "",
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
              ].map((day, index) => {
                const hasMatch = day === 12 || day === 20 || day === 26;
                return (
                  <span
                    key={`${day}-${index}`}
                    className={hasMatch ? "is-match-day" : ""}
                  >
                    {day || ""}
                  </span>
                );
              })}
            </div>

            <div className="matches-v3__events">
              <h3>Eventos este mes</h3>
              {events.map((event) => (
                <article key={event.day}>
                  <div className="matches-v3__event-day">
                    <strong>{event.day}</strong>
                    <small>OCT</small>
                  </div>
                  <div>
                    <h4>{event.title}</h4>
                    <p>{event.meta}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
