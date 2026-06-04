import PublicLayout from "../layouts/PublicLayout";
import Clasificacion from "../components/Resultados/Clasificacion";
import HistorialPartidos from "../components/Resultados/HistorialPartidos";

export default function ResultadosPage() {
  return (
    <PublicLayout>
      <div className="pagina-estandar pagina-resultados">
        <div className="pagina-header">
          <span className="pagina-header__eyebrow">Temporada 2025-26</span>
          <h1>Resultados y Clasificación</h1>
          <p>Sigue de cerca nuestra trayectoria en la presente temporada.</p>
        </div>
        <div className="resultados-layout">
          <Clasificacion />
          <HistorialPartidos />
        </div>
      </div>
    </PublicLayout>
  );
}
