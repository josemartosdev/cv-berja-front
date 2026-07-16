import { useCallback, useEffect, useState } from "react";
import { SPONSORS } from "../../data/sponsors";

export default function SponsorCarousel() {
  const [index, setIndex] = useState(0);
  const total = SPONSORS.length;

  const go = useCallback(
    (delta) => {
      setIndex((i) => (i + delta + total) % total);
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <section
      className="sponsor-swiper-section"
      aria-label="Carrusel de patrocinadores"
    >
      <div
        className="swiper"
        aria-roledescription="carousel"
        aria-live="polite"
      >
        <div
          className="swiper-wrapper"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SPONSORS.map((sponsor, i) => (
            <article
              key={sponsor.id}
              className="swiper-slide"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.12) 10%, rgba(0, 0, 0, 0.8) 100%), url(${sponsor.image})`,
              }}
            >
              <span>{sponsor.tagline}</span>
              <div className="swiper-slide__content">
                <h2>{sponsor.name}</h2>
                <p className="swiper-slide__meta">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="swiper-icon"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  Berja, Almeria · Desde {sponsor.since}
                </p>
                <p className="swiper-slide__description">
                  {sponsor.description}
                </p>
                <a
                  href={
                    sponsor.url && sponsor.url !== "#"
                      ? sponsor.url
                      : "#colaborar"
                  }
                  target={
                    sponsor.url &&
                    sponsor.url !== "#" &&
                    !sponsor.url.startsWith("mailto:")
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    sponsor.url &&
                    sponsor.url !== "#" &&
                    !sponsor.url.startsWith("mailto:")
                      ? "noreferrer noopener"
                      : undefined
                  }
                  className="swiper-slide__cta"
                >
                  Mas info
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="swiper-controls">
          <button
            type="button"
            className="swiper-nav swiper-nav--prev"
            onClick={() => go(-1)}
            aria-label="Patrocinador anterior"
          >
            &#8249;
          </button>

          <div className="swiper-pagination">
            {SPONSORS.map((sponsor, i) => (
              <button
                key={sponsor.id}
                type="button"
                aria-label={`Ir a ${sponsor.name}`}
                className={`swiper-pagination__dot${i === index ? " is-active" : ""}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className="swiper-nav swiper-nav--next"
            onClick={() => go(1)}
            aria-label="Siguiente patrocinador"
          >
            &#8250;
          </button>
        </div>
      </div>
    </section>
  );
}
