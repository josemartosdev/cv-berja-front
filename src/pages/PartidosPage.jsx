import PublicLayout from "../layouts/PublicLayout";
import Cartelera from "../components/Partidos/Cartelera";
import ProximosEncuentros from "../components/Partidos/ProximosEncuentros";

export default function PartidosPage() {
  return (
    <PublicLayout>
      <div className="pagina-estandar">
        <Cartelera />
        <ProximosEncuentros />
      </div>
    </PublicLayout>
  );
}
