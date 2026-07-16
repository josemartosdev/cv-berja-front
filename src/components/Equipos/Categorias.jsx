const categoriasFallback = [
  {
    nombre: "Senior Femenino",
    nivel: "Primera Nacional",
    status: "Activo",
    cupo: "14 jugadoras",
  },
  {
    nombre: "Senior Masculino",
    nivel: "Primera Andaluza",
    status: "Activo",
    cupo: "12 jugadores",
  },
  {
    nombre: "Juvenil Femenino",
    nivel: "CADEBA",
    status: "En competición",
    cupo: "16 jugadoras",
  },
  {
    nombre: "Cadete Femenino",
    nivel: "Provincial",
    status: "Inscripciones abiertas",
    cupo: "Plazas disponibles",
  },
];

function statusClass(status) {
  if (status.toLowerCase().includes("inscripciones")) return "is-open";
  if (status.toLowerCase().includes("competición")) return "is-playing";
  if (status.toLowerCase().includes("inactivo")) return "is-inactive";
  return "is-active";
}

function mapTeamToCard(team) {
  return {
    nombre: team.nombre,
    nivel: team.categoria || "Categoria por definir",
    cupo: team.coach_nombre
      ? `Entrenador: ${team.coach_nombre}`
      : "Sin entrenador asignado",
    status: team.activo ? "Activo" : "Inactivo",
    temporada: team.temporada || "Temporada no definida",
  };
}

export default function Categorias({ teams = [], loading = false }) {
  const categorias =
    teams.length > 0 ? teams.map(mapTeamToCard) : categoriasFallback;

  return (
    <section className="equipos-section equipos-section--categorias">
      <div className="equipos-section__header">
        <p className="equipos-section__eyebrow">Base de datos</p>
        <h2>Listado de equipos filtrado</h2>
      </div>

      {loading && (
        <p className="equipos-muted">Actualizando datos de equipos...</p>
      )}

      {!loading && teams.length === 0 && (
        <p className="equipos-muted">
          No hay equipos que coincidan con los filtros actuales.
        </p>
      )}

      <div className="grid-categorias">
        {categorias.map((cat) => (
          <article
            key={`${cat.nombre}-${cat.nivel}`}
            className="card-categoria"
          >
            <h3>{cat.nombre}</h3>
            <p className="categoria-nivel">{cat.nivel}</p>
            <p className="categoria-cupo">{cat.cupo}</p>
            {cat.temporada && (
              <p className="categoria-temporada">{cat.temporada}</p>
            )}
            <span className={`categoria-status ${statusClass(cat.status)}`}>
              {cat.status}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
