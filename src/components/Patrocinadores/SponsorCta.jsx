import { Mail, Phone } from "lucide-react";

export default function SponsorCta() {
  return (
    <section className="patro-cta" id="colaborar">
      <div className="patro-cta__glow" aria-hidden />
      <div className="patro-cta__inner">
        <div className="patro-cta__copy">
          <span className="patro-cta__eyebrow">Hazte patrocinador</span>
          <h2>Lleva tu marca al lado del club</h2>
          <p>
            Cuéntanos tu idea y te enviamos información sobre visibilidad, eventos y colaboración
            con el club esta temporada.
          </p>
        </div>
        <div className="patro-cta__actions">
          <a href="mailto:info@cvberja.es?subject=Patrocinio%20CV%20Berja" className="patro-btn patro-btn--primary patro-btn--wide">
            <Mail size={18} aria-hidden />
            info@cvberja.es
          </a>
          <a href="tel:+34900000000" className="patro-btn patro-btn--outline patro-btn--wide">
            <Phone size={18} aria-hidden />
            Solicitar dossier
          </a>
        </div>
      </div>
    </section>
  );
}
