import { mediaUrl } from "../../lib/mediaUrl";

const fallbackTeams = [
  {
    id: 1,
    nombre: "Senior Femenino",
    categoria: "Primera Nacional",
    coach_nombre: "Staff CV Berja",
    temporada: "2026-27",
  },
  {
    id: 2,
    nombre: "Senior Masculino",
    categoria: "Primera Andaluza",
    coach_nombre: "Staff CV Berja",
    temporada: "2026-27",
  },
  {
    id: 3,
    nombre: "Juvenil Femenino",
    categoria: "CADEBA",
    coach_nombre: "Escuela CV Berja",
    temporada: "2026-27",
  },
  {
    id: 4,
    nombre: "Cadete Femenino",
    categoria: "Provincial",
    coach_nombre: "Escuela CV Berja",
    temporada: "2026-27",
  },
];

function initials(name) {
  return String(name || "CV")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function PlantillaDestacada({ teams = [], loading = false }) {
  const featuredTeams = teams.length > 0 ? teams : fallbackTeams;

  return (
    <section className="equipos-section equipos-section--plantilla">
      <div className="equipos-section__header">
        <p className="equipos-section__eyebrow">Destacados</p>
        <h2>Equipos con mas actividad</h2>
      </div>

      {loading && <p className="equipos-muted">Cargando destacados...</p>}

      <div className="grid-jugadores">
        {featuredTeams.map((team) => (
          <article
            key={team.id || team.nombre}
            className="card-jugador card-jugador--team"
          >
            {team.foto_path ? (
              <img
                src={mediaUrl(team.foto_path)}
                alt={`Equipo ${team.nombre}`}
                className="card-jugador__photo"
              />
            ) : null}
            <div className="jugador-top">
              <span className="jugador-avatar">{initials(team.nombre)}</span>
              <span className="jugador-dorsal">
                {team.temporada || "Temporada"}
              </span>
            </div>
            <h3 className="jugador-nombre">{team.nombre}</h3>
            <p className="jugador-posicion">{team.categoria || "Categoria"}</p>
            <p className="jugador-posicion jugador-posicion--coach">
              {team.coach_nombre || "Entrenador pendiente"}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
