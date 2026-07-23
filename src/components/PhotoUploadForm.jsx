import { useState } from "react";
import DropzoneUpload from "./DropzoneUpload";

const DISPLAY_TYPE_LABELS = {
  web: "Web pública",
  app: "Solo aplicación",
  cabecera: "Cabecera",
};

/**
 * Formulario reutilizable para subir fotos
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback al enviar (recibe {file, titulo, displayType})
 * @param {boolean} props.loading - Si está guardando
 * @param {string} props.error - Mensaje de error
 * @param {string} props.title - Título del formulario
 * @param {boolean} props.showTitle - Mostrar campo de título
 * @param {boolean} props.showDisplay - Mostrar opciones de visualización
 * @param {string} props.buttonText - Texto del botón (por defecto: "Subir foto")
 */
export default function PhotoUploadForm({
  onSubmit,
  loading = false,
  error = "",
  title = "Subir foto",
  showTitle = true,
  showDisplay = false,
  buttonText = "Subir foto",
  onSuccess = null,
}) {
  const [file, setFile] = useState(null);
  const [fotoTitle, setFotoTitle] = useState("");
  const [displayType, setDisplayType] = useState("web");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    try {
      await onSubmit({ file, titulo: fotoTitle, displayType });
      setFile(null);
      setFotoTitle("");
      setDisplayType("web");
      onSuccess?.();
    } catch (err) {
      // Error manejado por el parent
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "1.5rem",
        marginBottom: "1.5rem",
        maxWidth: 500,
      }}
    >
      <h3 style={{ marginBottom: "1rem", marginTop: 0 }}>{title}</h3>

      <DropzoneUpload
        onFileSelect={setFile}
        label="Arrastra una foto o haz clic para seleccionar"
        showDisplayOptions={showDisplay}
        displayType={displayType}
        onDisplayChange={setDisplayType}
      />

      {showTitle && (
        <input
          type="text"
          placeholder="Título (opcional)"
          value={fotoTitle}
          onChange={(e) => setFotoTitle(e.target.value)}
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
      )}

      {error && (
        <p
          style={{
            color: "#dc2626",
            marginTop: "0.5rem",
            fontSize: "0.9rem",
            margin: "0.5rem 0 0 0",
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!file || loading}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1.5rem",
          background: !file || loading ? "#a5b4fc" : "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: !file || loading ? "not-allowed" : "pointer",
          fontWeight: 600,
        }}
      >
        {loading ? "Subiendo…" : buttonText}
      </button>
    </form>
  );
}
