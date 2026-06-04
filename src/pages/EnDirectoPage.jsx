import PublicLayout from "../layouts/PublicLayout";
import ReproductorDirecto from "../components/EnDirecto/ReproductorDirecto";
import ProximosDirectos from "../components/EnDirecto/ProximosDirectos";

export default function EnDirectoPage() {
  return (
    <PublicLayout>
      <div className="pagina-estandar pagina-directo">
        <div className="pagina-header">
          <span className="pagina-header__eyebrow">Streaming oficial</span>
          <h1>En Directo</h1>
          <p>
            Sigue los partidos del club en YouTube y consulta la agenda de próximas emisiones.
          </p>
        </div>

        <div className="directo-layout">
          <ReproductorDirecto />
          <ProximosDirectos />
        </div>
      </div>
    </PublicLayout>
  );
}
