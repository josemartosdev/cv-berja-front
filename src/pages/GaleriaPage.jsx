import { useCallback, useEffect, useState } from "react";
import PublicLayout from "../layouts/PublicLayout";
import { galeriaApi } from "../api/galeriaApi";

const TIPO_LABEL = { galeria: "Galería", jugador: "Jugador", post: "Noticia" };
const TIPO_COLOR = { galeria: "#4f46e5", jugador: "#059669", post: "#d97706" };

export default function GaleriaPage() {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [lightbox, setLightbox] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await galeriaApi.listPublic();
      setFotos(data);
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

  const fotosFiltradas =
    filtro === "todos" ? fotos : fotos.filter((f) => f.tipo === filtro);

  return (
    <PublicLayout>
      <section
        style={{ padding: "2rem 1rem", maxWidth: 1200, margin: "0 auto" }}
      >
        <h1 style={{ marginBottom: "0.5rem" }}>Galería</h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          Fotos del club, jugadores y noticias
        </p>

        {/* Filtros */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          {["todos", "galeria", "jugador", "post"].map((t) => (
            <button
              key={t}
              onClick={() => setFiltro(t)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: 20,
                border: "1px solid #ddd",
                cursor: "pointer",
                background: filtro === t ? "#4f46e5" : "#fff",
                color: filtro === t ? "#fff" : "#333",
                fontWeight: filtro === t ? 600 : 400,
              }}
            >
              {t === "todos" ? "Todos" : TIPO_LABEL[t]}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: "#888" }}>Cargando galería…</p>
        ) : fotosFiltradas.length === 0 ? (
          <p style={{ color: "#888" }}>No hay fotos disponibles.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {fotosFiltradas.map((foto, i) => (
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
                }}
              >
                <img
                  src={foto.url}
                  alt={foto.titulo || ""}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
                <span
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    background: TIPO_COLOR[foto.tipo] || "#888",
                    color: "#fff",
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 10,
                    fontWeight: 600,
                  }}
                >
                  {TIPO_LABEL[foto.tipo] || foto.tipo}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
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
              maxHeight: "80vh",
              borderRadius: 8,
              objectFit: "contain",
            }}
            onClick={(e) => e.stopPropagation()}
          />
          {lightbox.titulo && (
            <p style={{ color: "#fff", marginTop: "1rem", fontSize: "1.1rem" }}>
              {lightbox.titulo}
            </p>
          )}
          <button
            onClick={() => setLightbox(null)}
            style={{
              marginTop: "1rem",
              background: "none",
              border: "1px solid #fff",
              color: "#fff",
              padding: "0.4rem 1.2rem",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>
        </div>
      )}
    </PublicLayout>
  );
}
