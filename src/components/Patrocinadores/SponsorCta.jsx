import { useState } from "react";
import { Mail, Phone } from "lucide-react";

export default function SponsorCta() {
  const [showPhoneCard, setShowPhoneCard] = useState(false);
  const phoneHref = "tel:+34900000000";
  const phoneLabel = "+34 900 000 000";

  return (
    <section className="patro-cta" id="colaborar">
      <div className="patro-cta__glow" aria-hidden />
      <div className="patro-cta__inner">
        <div className="patro-cta__copy">
          <span className="patro-cta__eyebrow">Hazte patrocinador</span>
          <h2>Lleva tu marca al lado del club</h2>
          <p>
            Cuéntanos tu idea y te enviamos información sobre visibilidad,
            eventos y colaboración con el club esta temporada.
          </p>
        </div>
        <div className="patro-cta__actions">
          <a
            href="mailto:info@cvberja.es?subject=Patrocinio%20CV%20Berja"
            className="patro-btn patro-btn--primary patro-btn--wide"
          >
            <Mail size={18} aria-hidden />
            info@cvberja.es
          </a>
          <button
            type="button"
            className="patro-btn patro-btn--outline patro-btn--wide patro-btn--call"
            onClick={() => setShowPhoneCard((v) => !v)}
            aria-expanded={showPhoneCard}
            aria-controls="patro-phone-card"
          >
            <Phone size={18} aria-hidden />
            Llamar
          </button>

          {showPhoneCard && (
            <div
              className="patro-phone-card"
              id="patro-phone-card"
              role="status"
              aria-live="polite"
            >
              <span>Telefono de patrocinio</span>
              <a href={phoneHref}>{phoneLabel}</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
