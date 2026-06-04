import PublicLayout from "../layouts/PublicLayout";
import Categorias from "../components/Equipos/Categorias";
import PlantillaDestacada from "../components/Equipos/PlantillaDestacada";

export default function EquiposPage() {
  return (
    <PublicLayout>
      <div className="pagina-estandar pagina-equipos">
        <div className="pagina-header">
          <span className="pagina-header__eyebrow">Cantera y competición</span>
          <h1>Nuestros Equipos</h1>
          <p>
            Conoce a las plantillas que defienden nuestros colores cada fin de semana,
            desde la base hasta el primer equipo.
          </p>
        </div>
        <PlantillaDestacada />
        <Categorias />
      </div>
    </PublicLayout>
  );
}
