import { Handshake } from "lucide-react";
import { SPONSOR_STATS } from "../../data/sponsors";

export default function PatrocinadoresHero() {
  return (
    <section className="patro-hero patro-hero--fullscreen patro-hero--compact">
      <div className="patro-hero__backdrop" />
      <div className="patro-hero__shell">
        <span className="patro-hero__eyebrow">
          <Handshake size={14} aria-hidden />
          Patrocinadores CV Berja
        </span>
        <h1>
          Aliados del <em>club</em>
        </h1>
        <p className="patro-hero__lead">
          Empresas y comercios de Berja que apoyan la cantera y la competición.
        </p>
        <a href="#colaborar" className="patro-btn patro-btn--primary">
          Quiero colaborar
        </a>
        <div className="patro-hero__stats">
          {SPONSOR_STATS.map((item) => (
            <article key={item.label} className="patro-stat">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
