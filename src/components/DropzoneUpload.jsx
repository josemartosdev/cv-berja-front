import { useRef, useState } from "react";
import { X } from "lucide-react";

export default function DropzoneUpload({
  onFileSelect,
  accept = "image/*",
  label = "Arrastra una foto o haz clic",
  showDisplayOptions = false,
  onDisplayChange,
  displayType = "web",
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [display, setDisplay] = useState(displayType);

  const handleFile = (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const handleDisplayChange = (tipo) => {
    setDisplay(tipo);
    onDisplayChange?.(tipo);
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        style={{
          border: `2px dashed ${dragging ? "#4f46e5" : "#ccc"}`,
          borderRadius: 8,
          padding: 32,
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "#eef2ff" : "#fafafa",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {preview ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <img
              src={preview}
              alt="preview"
              style={{ maxHeight: 200, borderRadius: 6 }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearPreview();
              }}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "0.25rem 0.75rem",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <X size={16} /> Cambiar foto
            </button>
          </div>
        ) : (
          <p style={{ color: "#888" }}>{label}</p>
        )}
      </div>

      {showDisplayOptions && (
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="display"
              value="web"
              checked={display === "web"}
              onChange={(e) => handleDisplayChange(e.target.value)}
            />
            <span>Web pública</span>
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="display"
              value="app"
              checked={display === "app"}
              onChange={(e) => handleDisplayChange(e.target.value)}
            />
            <span>Solo aplicación</span>
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="display"
              value="cabecera"
              checked={display === "cabecera"}
              onChange={(e) => handleDisplayChange(e.target.value)}
            />
            <span>Cabecera</span>
          </label>
        </div>
      )}
    </div>
  );
}
