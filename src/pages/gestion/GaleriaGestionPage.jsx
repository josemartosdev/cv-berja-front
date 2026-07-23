import { useCallback, useEffect, useState } from "react";
import DropzoneUpload from "../../components/DropzoneUpload";
import { galeriaApi } from "../../api/galeriaApi";

export default function GaleriaGestionPage() {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await galeriaApi.listPublic();
      setFotos(data.filter((f) => f.tipo === "galeria"));
    } catch {
      setFotos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setSaving(true);
    setError("");
    try {
      await galeriaApi.upload(file, titulo);
      setFile(null);
      setTitulo("");
      await load();
    } catch (err) {
      setError(err.message || "Error al subir la foto");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta foto?")) return;
    try {
      await galeriaApi.remove(id);
      setFotos((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert(err.message || "Error al eliminar");
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Galería del club</h2>

      {/* Formulario de subida */}
      <form
        onSubmit={handleUpload}
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "1.5rem",
          marginBottom: "2rem",
          maxWidth: 500,
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>Subir nueva foto</h3>
        <DropzoneUpload
          onFileSelect={setFile}
          label="Arrastra una foto o haz clic para seleccionar"
        />
        <input
          type="text"
          placeholder="Título (opcional)"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            marginTop: "0.75rem",
            padding: "0.5rem 0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            fontSize: "0.95rem",
            boxSizing: "border-box",
          }}
        />
        {error && (
          <p
            style={{
              color: "#dc2626",
              marginTop: "0.5rem",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={!file || saving}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1.5rem",
            background: !file || saving ? "#a5b4fc" : "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: !file || saving ? "not-allowed" : "pointer",
            fontWeight: 600,
          }}
        >
          {saving ? "Subiendo…" : "Subir foto"}
        </button>
      </form>

      {/* Grid de fotos existentes */}
      <h3 style={{ marginBottom: "1rem" }}>Fotos subidas ({fotos.length})</h3>
      {loading ? (
        <p style={{ color: "#888" }}>Cargando…</p>
      ) : fotos.length === 0 ? (
        <p style={{ color: "#888" }}>Todavía no hay fotos en la galería.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {fotos.map((foto) => (
            <div
              key={foto.id}
              style={{
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                background: "#fff",
              }}
            >
              <img
                src={foto.url}
                alt={foto.titulo || ""}
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  objectFit: "cover",
                  display: "block",
                }}
                loading="lazy"
              />
              <div style={{ padding: "0.5rem" }}>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#374151",
                    margin: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {foto.titulo || "Sin título"}
                </p>
                <button
                  onClick={() => handleDelete(foto.id)}
                  style={{
                    marginTop: "0.4rem",
                    background: "none",
                    border: "none",
                    color: "#dc2626",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    padding: 0,
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
