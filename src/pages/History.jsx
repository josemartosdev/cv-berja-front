import { useEffect } from "react";
import PublicLayout from "../layouts/PublicLayout";
import Cronologia from "../components/Historia/Cronologia";
import HistoriaHero from "../components/Historia/HistoriaHero";
import HistoriaResumen from "../components/Historia/HistoriaResumen";
import Palmares from "../components/Historia/Palmares";

function History() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll(".historia-v2__reveal"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <PublicLayout className="web-public--historia">
      <main className="historia-v2">
        <HistoriaHero />
        <HistoriaResumen />
        <Cronologia />
        <Palmares />
      </main>
    </PublicLayout>
  );
}

export default History;
