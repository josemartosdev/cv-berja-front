import { Handshake } from "lucide-react";
import { SPONSOR_STATS } from "../../data/sponsors";

export default function PatrocinadoresHero() {
  return (
    <section className="patro-hero patro-hero--fullscreen patro-hero--compact">
      <div className="patro-hero__backdrop" />
      <div className="patro-hero__shell">
        <div className="patro-hero__grid">
          <div className="patro-hero__intro">
            <span className="patro-hero__eyebrow">
              <Handshake size={14} aria-hidden />
              Patrocinadores CV Berja
            </span>
            <h1>
              Aliados del <em>club</em>
            </h1>
            <p className="patro-hero__lead">
              Empresas y comercios de Berja que impulsan la cantera y la
              competicion cada temporada.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
