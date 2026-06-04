import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { SPONSORS } from "../../data/sponsors";

function SponsorImage({ sponsor }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="patro-carousel__fallback" aria-hidden>
        <span>{sponsor.initials}</span>
      </div>
    );
  }

  return (
    <img
      src={sponsor.image}
      alt={sponsor.name}
      className="patro-carousel__img"
      onError={() => setFailed(true)}
    />
  );
}

export default function SponsorCarousel() {
  const [index, setIndex] = useState(0);
  const total = SPONSORS.length;
  const sponsor = SPONSORS[index];

  const go = useCallback(
    (delta) => {
      setIndex((i) => (i + delta + total) % total);
    },
    [total],
  );

  useEffect(() => {
    const timer = setInterval(() => go(1), 7000);
    return () => clearInterval(timer);
  }, [go]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const linkProps =
    sponsor.url === "#"
      ? { href: "#", onClick: (e) => e.preventDefault() }
      : sponsor.url?.startsWith("mailto")
        ? { href: sponsor.url }
        : { href: sponsor.url, target: "_blank", rel: "noreferrer noopener" };

  return (
    <section className="patro-carousel" aria-label="Carrusel de patrocinadores" aria-roledescription="carousel">
      <div className="patro-carousel__viewport">
        <article
          key={sponsor.id}
          className="patro-carousel__slide"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="patro-carousel__media">
            <SponsorImage sponsor={sponsor} />
            <div className="patro-carousel__media-shade" aria-hidden />
          </div>

          <div className="patro-carousel__content">
            <p className="patro-carousel__count">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <h2>{sponsor.name}</h2>
            <p className="patro-carousel__tagline">{sponsor.tagline}</p>
            <p className="patro-carousel__desc">{sponsor.description}</p>
            <div className="patro-carousel__meta">
              <span>Colaborador desde {sponsor.since}</span>
              {sponsor.url !== "#" && (
                <a className="patro-carousel__link" {...linkProps}>
                  Visitar web
                  <ExternalLink size={16} aria-hidden />
                </a>
              )}
            </div>
          </div>
        </article>
      </div>

      <button
        type="button"
        className="patro-carousel__nav patro-carousel__nav--prev"
        onClick={() => go(-1)}
        aria-label="Patrocinador anterior"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        type="button"
        className="patro-carousel__nav patro-carousel__nav--next"
        onClick={() => go(1)}
        aria-label="Siguiente patrocinador"
      >
        <ChevronRight size={28} />
      </button>

      <div className="patro-carousel__dots" role="tablist" aria-label="Seleccionar patrocinador">
        {SPONSORS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={s.name}
            className={`patro-carousel__dot${i === index ? " patro-carousel__dot--active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      <div className="patro-carousel__thumbs">
        {SPONSORS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`patro-carousel__thumb${i === index ? " patro-carousel__thumb--active" : ""}`}
            onClick={() => setIndex(i)}
            tabIndex={-1}
          >
            {s.name}
          </button>
        ))}
      </div>
    </section>
  );
}
