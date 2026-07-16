import { useEffect, useMemo, useState } from "react";
import PublicLayout from "../layouts/PublicLayout";
import { gestionApi } from "../api/gestionApi";
import { mediaUrl } from "../lib/mediaUrl";

const FAMILY_FILTERS = [
  { key: "all", label: "Todos" },
  { key: "senior", label: "Senior" },
  { key: "juvenil", label: "Juvenil" },
  { key: "cadete", label: "Cadete" },
  { key: "infantil", label: "Infantil" },
];

const fallbackTeams = [
  {
    id: "fallback-1",
    nombre: "CV Berja Pro",
    categoria: "Senior",
    temporada: "2026-27",
    coach_nombre: "Staff CV Berja",
    activo: true,
  },
  {
    id: "fallback-2",
    nombre: "Academia Berja",
    categoria: "Juvenil",
    temporada: "2026-27",
    coach_nombre: "Escuela CV Berja",
    activo: true,
  },
  {
    id: "fallback-3",
    nombre: "Promesas Berja",
    categoria: "Cadete",
    temporada: "2026-27",
    coach_nombre: "Tecnificacion CV Berja",
    activo: true,
  },
];

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function teamFamily(team) {
  const haystack = normalize(`${team?.categoria || ""} ${team?.nombre || ""}`);
  if (haystack.includes("senior")) return "senior";
  if (haystack.includes("juvenil")) return "juvenil";
  if (haystack.includes("cadete")) return "cadete";
  if (haystack.includes("infantil")) return "infantil";
  return "all";
}

export default function EquiposPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [familyFilter, setFamilyFilter] = useState("all");

  useEffect(() => {
    let mounted = true;

    async function loadTeams() {
      setLoading(true);
      setError("");
      try {
        const data = await gestionApi.teams.list();
        if (!mounted) return;
        setTeams(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "No se pudieron cargar los equipos.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadTeams();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredTeams = useMemo(() => {
    const q = normalize(search.trim());

    return teams.filter((team) => {
      const matchesSearch =
        q.length === 0 ||
        normalize(team.nombre).includes(q) ||
        normalize(team.categoria).includes(q) ||
        normalize(team.coach_nombre).includes(q) ||
        normalize(team.temporada).includes(q);

      const matchesFamily =
        familyFilter === "all" || teamFamily(team) === familyFilter;

      return matchesSearch && matchesFamily;
    });
  }, [teams, search, familyFilter]);

  const teamsToRender =
    filteredTeams.length > 0 ? filteredTeams : fallbackTeams;

  const resetFilters = () => {
    setSearch("");
    setFamilyFilter("all");
  };

  return (
    <PublicLayout>
      <div className="pagina-estandar pagina-equipos">
        <div className="pagina-header">
          <span className="pagina-header__eyebrow">Cantera y competición</span>
          <h1>Nuestros Equipos</h1>
          <p>
            La excelencia se construye desde la base. Descubre a los equipos que
            defienden el escudo del CV Berja en cada categoria.
          </p>
        </div>

        <section className="equipos-showcase">
          <div className="equipos-showcase__tools">
            <nav className="equipos-filter-pills" aria-label="Filtrar equipos">
              {FAMILY_FILTERS.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  className={`equipos-filter-pill${familyFilter === filter.key ? " is-active" : ""}`}
                  onClick={() => setFamilyFilter(filter.key)}
                >
                  {filter.label}
                </button>
              ))}
            </nav>

            <label className="equipos-search">
              <span>Buscar equipo</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nombre, categoria, temporada o entrenador"
              />
            </label>

            <button
              type="button"
              className="equipos-filter-reset"
              onClick={resetFilters}
            >
              Limpiar
            </button>
          </div>

          <p className="equipos-filter-summary">
            {loading
              ? "Cargando equipos desde base de datos..."
              : `Mostrando ${filteredTeams.length} de ${teams.length} equipos`}
          </p>
          {!!error && <p className="equipos-filter-error">{error}</p>}

          <div className="equipos-showcase__grid">
            {teamsToRender.map((team) => (
              <article
                key={team.id || team.nombre}
                className="team-card-pro"
                data-category={teamFamily(team)}
              >
                <div
                  className="team-card-pro__media"
                  style={{
                    backgroundImage: team.foto_path
                      ? `linear-gradient(180deg, rgba(0, 0, 0, 0.08) 20%, rgba(0, 0, 0, 0.85) 100%), url(${mediaUrl(team.foto_path)})`
                      : undefined,
                  }}
                >
                  <span className="team-card-pro__badge">
                    {team.categoria || "Categoria"}
                  </span>
                </div>

                <div className="team-card-pro__content">
                  <div className="team-card-pro__head">
                    <h3>{team.nombre}</h3>
                    <span
                      className={`team-card-pro__status${team.activo ? " is-active" : " is-inactive"}`}
                    >
                      {team.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  <div className="team-card-pro__meta">
                    <div>
                      <span>Temporada</span>
                      <strong>{team.temporada || "No definida"}</strong>
                    </div>
                    <div>
                      <span>Entrenador</span>
                      <strong>{team.coach_nombre || "Pendiente"}</strong>
                    </div>
                  </div>

                  <button type="button" className="team-card-pro__cta">
                    Ver plantilla
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
