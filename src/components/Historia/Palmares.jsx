const achievements = [
  {
    icon: "emoji_events",
    title: "Campeones de liga",
    text: "Multiples titulos en ligas regionales senior y juvenil.",
    tags: ["2012", "2015", "2021"],
  },
  {
    icon: "military_tech",
    title: "Copa de Almeria",
    text: "Referente indiscutible en las competiciones provinciales.",
    tags: ["8 titulos"],
  },
  {
    icon: "workspace_premium",
    title: "Exito nacional",
    text: "13 participaciones en fases finales de Campeonatos de Espana.",
    tags: ["Top 5 nacional"],
  },
];

export default function Palmares() {
  return (
    <section className="historia-v2__section historia-v2__reveal historia-v2__section--achievements">
      <div className="historia-v2__section-head">
        <h2>Palmares y logros</h2>
        <p>Tres decadas de exitos en el voleibol andaluz y nacional.</p>
      </div>

      <div className="historia-v2__achievement-grid">
        {achievements.map((item) => (
          <article key={item.title} className="historia-v2__achievement-card">
            <div className="historia-v2__achievement-icon" aria-hidden="true">
              <span className="material-symbols-outlined">{item.icon}</span>
            </div>
            <h4>{item.title}</h4>
            <p>{item.text}</p>
            <div className="historia-v2__tags">
              {item.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
