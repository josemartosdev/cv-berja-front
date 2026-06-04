import PublicLayout from "../layouts/PublicLayout";
import AgendaMes from "../components/Calendario/AgendaMes";
import EventosEspeciales from "../components/Calendario/EventosEspeciales";

export default function CalendarioPage() {
  return (
    <PublicLayout>
      <div className="pagina-estandar">
        <div className="pagina-header">
          <h1>Nuestro Calendario</h1>
          <p>Fechas clave, entrenamientos, competiciones y eventos especiales del club.</p>
        </div>
        <div className="calendario-layout">
          <AgendaMes />
          <EventosEspeciales />
        </div>
      </div>
    </PublicLayout>
  );
}
