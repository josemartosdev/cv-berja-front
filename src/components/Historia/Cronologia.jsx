const timelineEvents = [
  {
    era: "90s",
    title: "Los primeros pasos",
    text: "Consolidacion de las bases y los primeros equipos federados masculinos y femeninos.",
  },
  {
    era: "00s",
    title: "Expansion regional",
    text: "Presencia continua en las ligas andaluzas y crecimiento exponencial de la cantera.",
  },
  {
    era: "10s",
    title: "Consolidacion nacional",
    text: "Participacion regular en Campeonatos de Espana y formacion de entrenadores nacionales.",
  },
];

export default function Cronologia() {
  return (
    <section className="historia-v2__section historia-v2__reveal">
      <h2>Evolucion del club</h2>
      <div className="historia-v2__timeline">
        {timelineEvents.map((event, index) => (
          <article
            key={event.era}
            className={`historia-v2__timeline-item${
              index % 2 === 0 ? " historia-v2__timeline-item--left" : ""
            }`}
          >
            <div className="historia-v2__timeline-dot">{event.era}</div>
            <div className="historia-v2__timeline-content">
              <h4>{event.title}</h4>
              <p>{event.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
