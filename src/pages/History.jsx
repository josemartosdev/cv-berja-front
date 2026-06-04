import PublicLayout from "../layouts/PublicLayout";
import HistoriaHero from "../components/Historia/HistoriaHero";
import Cronologia from "../components/Historia/Cronologia";
import HistoriaChula from "../components/Historia/HistoriaChula";
import Palmares from "../components/Historia/Palmares";
import Logros from "../components/Historia/Logros";

function History() {
  return (
    <PublicLayout className="web-public--historia">
      <div className="historia-pagina">
        <HistoriaHero />
        <div className="historia-stack">
          <Cronologia />
          <HistoriaChula />
          <Palmares />
          <Logros />
        </div>
      </div>
    </PublicLayout>
  );
}

export default History;
