import { MARQUEE_SPONSORS } from "../../data/sponsors";

function SponsorsCarousel() {
  const items = [...MARQUEE_SPONSORS, ...MARQUEE_SPONSORS];

  return (
    <div className="sponsors-marquee">
      <div className="sponsors-track">
        {items.map((name, i) => (
          <div className="sponsor-pill" key={`${name}-${i}`}>
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SponsorsCarousel;
