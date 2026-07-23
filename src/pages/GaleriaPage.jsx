import { useCallback, useEffect, useState } from "react";
import PublicLayout from "../layouts/PublicLayout";
import { galeriaApi } from "../api/galeriaApi";

const TIPO_LABEL = { galeria: "Galería", jugador: "Jugador", post: "Noticia" };
const TIPO_COLOR = { galeria: "#4f46e5", jugador: "#059669", post: "#d97706" };

export default function GaleriaPage() {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroDisplay, setFiltroDisplay] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [ordenamiento, setOrdenamiento] = useState("recientes");
  const [paginaActual, setPaginaActual] = useState(1);
  const [lightbox, setLightbox] = useState(null);
  const FOTOS_POR_PAGINA = 9;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await galeriaApi.listPublic();
      // Filtrar solo fotos configuradas para web pública
      const fotosWeb = data.filter((f) => f.displayType !== "app");
      setFotos(fotosWeb);
    } catch {
      setFotos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  let fotosFiltradas = fotos;

  // Filtrar por tipo
  if (filtroTipo !== "todos") {
    fotosFiltradas = fotosFiltradas.filter((f) => f.tipo === filtroTipo);
  }

  // Filtrar por display type
  if (filtroDisplay !== "todos") {
    fotosFiltradas = fotosFiltradas.filter(
      (f) => f.displayType === filtroDisplay,
    );
  }

  // Filtrar por búsqueda
  if (busqueda) {
    const q = busqueda.toLowerCase();
    fotosFiltradas = fotosFiltradas.filter(
      (f) =>
        f.titulo?.toLowerCase().includes(q) ||
        TIPO_LABEL[f.tipo]?.toLowerCase().includes(q),
    );
  }

  // Aplicar ordenamiento
  if (ordenamiento === "recientes") {
    fotosFiltradas = [...fotosFiltradas].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  } else if (ordenamiento === "antiguos") {
    fotosFiltradas = [...fotosFiltradas].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );
  } else if (ordenamiento === "nombre") {
    fotosFiltradas = [...fotosFiltradas].sort((a, b) =>
      (a.titulo || "").localeCompare(b.titulo || ""),
    );
  }

  // Resetear a primera página al cambiar filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [filtroTipo, filtroDisplay, busqueda, ordenamiento]);

  // Calcular paginación
  const totalPaginas = Math.ceil(fotosFiltradas.length / FOTOS_POR_PAGINA);
  const inicio = (paginaActual - 1) * FOTOS_POR_PAGINA;
  const fotosPage = fotosFiltradas.slice(inicio, inicio + FOTOS_POR_PAGINA);

  return (
    <PublicLayout>
      <section
        style={{ padding: "2rem 1rem", maxWidth: 1200, margin: "0 auto" }}
      >
        <h1 style={{ marginBottom: "0.5rem" }}>Galería</h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          Fotos del club, jugadores y noticias
        </p>

        {/* Búsqueda */}
        <div style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            placeholder="Buscar por título..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "0.5rem 0.75rem",
              border: "1px solid #ddd",
              borderRadius: 6,
              fontSize: "0.95rem",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Filtros por tipo */}
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.9rem",
              color: "#666",
              marginBottom: "0.5rem",
            }}
          >
            Tipo de foto:
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            {["todos", "galeria", "jugador", "post"].map((t) => (
              <button
                key={t}
                onClick={() => setFiltroTipo(t)}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: 20,
                  border:
                    filtroTipo === t ? "2px solid #4f46e5" : "1px solid #ddd",
                  cursor: "pointer",
                  background: filtroTipo === t ? "#4f46e5" : "#fff",
                  color: filtroTipo === t ? "#fff" : "#333",
                  fontWeight: filtroTipo === t ? 600 : 400,
                  transition: "all 0.2s",
                }}
              >
                {t === "todos" ? "Todos" : TIPO_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Filtros por visualización */}
        <div
          style={{
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.9rem",
              color: "#666",
              marginBottom: "0.5rem",
            }}
          >
            Mostrar en:
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            {["todos", "web", "cabecera"].map((d) => (
              <button
                key={d}
                onClick={() => setFiltroDisplay(d)}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: 20,
                  border:
                    filtroDisplay === d
                      ? "2px solid #059669"
                      : "1px solid #ddd",
                  cursor: "pointer",
                  background: filtroDisplay === d ? "#059669" : "#fff",
                  color: filtroDisplay === d ? "#fff" : "#333",
                  fontWeight: filtroDisplay === d ? 600 : 400,
                  transition: "all 0.2s",
                }}
              >
                {d === "todos"
                  ? "Todas"
                  : d === "web"
                    ? "Web pública"
                    : "Cabeceras"}
              </button>
            ))}
          </div>
        </div>

        {/* Ordenamiento */}
        <div
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <select
            value={ordenamiento}
            onChange={(e) => setOrdenamiento(e.target.value)}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: 6,
              border: "1px solid #ddd",
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
            <option value="nombre">Por nombre (A-Z)</option>
          </select>
          <p
            style={{
              color: "#666",
              fontSize: "0.9rem",
              margin: 0,
            }}
          >
            {fotosFiltradas.length} foto{fotosFiltradas.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <p style={{ color: "#888" }}>Cargando galería…</p>
        ) : fotosFiltradas.length === 0 ? (
          <p style={{ color: "#888" }}>No hay fotos disponibles.</p>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              {fotosPage.map((foto, i) => (
              <div
                key={i}
                onClick={() => setLightbox(foto)}
                style={{
                  cursor: "pointer",
                  borderRadius: 8,
                  overflow: "hidden",
                  position: "relative",
                  aspectRatio: "1 / 1",
                  background: "#f3f4f6",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <img
                  src={foto.url}
                  alt={foto.titulo || ""}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
                {/* Badges de tipo */}
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      background: TIPO_COLOR[foto.tipo] || "#888",
                      color: "#fff",
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 10,
                      fontWeight: 600,
                    }}
                  >
                    {TIPO_LABEL[foto.tipo] || foto.tipo}
                  </span>
                  {foto.displayType === "cabecera" && (
                    <span
                      style={{
                        background: "#f59e0b",
                        color: "#fff",
                        fontSize: 10,
                        padding: "2px 6px",
                        borderRadius: 10,
                        fontWeight: 600,
                      }}
                    >
                      Cabecera
                    </span>
                  )}
                </div>
                {/* Overlay con título */}
                {foto.titulo && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                      color: "#fff",
                      padding: "1rem 0.75rem 0.5rem",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {foto.titulo}
                  </div>
                )}
              </div>
            ))}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginTop: "2rem",
                  flexWrap: "wrap",
                }}
              >
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      onClick={() => setPaginaActual(num)}
                      style={{
                        padding: "0.5rem 0.75rem",
                        borderRadius: 6,
                        border:
                          paginaActual === num
                            ? "2px solid #4f46e5"
                            : "1px solid #ddd",
                        background:
                          paginaActual === num ? "#4f46e5" : "#fff",
                        color:
                          paginaActual === num ? "#fff" : "#333",
                        cursor: "pointer",
                        fontWeight:
                          paginaActual === num ? 600 : 400,
                        transition: "all 0.2s",
                      }}
                    >
                      {num}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <img
            src={lightbox.url}
            alt={lightbox.titulo || ""}
            style={{
              maxWidth: "90vw",
              maxHeight: "70vh",
              borderRadius: 8,
              objectFit: "contain",
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <div
            style={{
              color: "#fff",
              marginTop: "1rem",
              textAlign: "center",
              maxWidth: "600px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.titulo && (
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>
                {lightbox.titulo}
              </h3>
            )}
            <p
              style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#ddd" }}
            >
              <strong>{TIPO_LABEL[lightbox.tipo] || lightbox.tipo}</strong>
              {lightbox.displayType === "cabecera" && (
                <>
                  {" "}
                  • <span style={{ color: "#f59e0b" }}>Cabecera</span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={() => setLightbox(null)}
            style={{
              marginTop: "1.5rem",
              background: "none",
              border: "1px solid #fff",
              color: "#fff",
              padding: "0.5rem 1.5rem",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            Cerrar (ESC)
          </button>
        </div>
      )}
    </PublicLayout>
  );
}
