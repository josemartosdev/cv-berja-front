import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { mediaUrl } from "../../lib/mediaUrl";

export default function PhotoUpload({ label, currentPath, onUpload, disabled }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;
    setError("");
    setUploading(true);
    try {
      await onUpload(file);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const src = mediaUrl(currentPath);

  return (
    <div className="gestion-photo-upload">
      <span className="gestion-label">{label}</span>
      <div className="gestion-photo-upload__box">
        {src ? (
          <img src={src} alt="" className="gestion-photo-upload__img" />
        ) : (
          <div className="gestion-photo-upload__placeholder">
            <Upload size={28} />
            <span>Sin foto</span>
          </div>
        )}
      </div>
      <button
        type="button"
        className="gestion-btn gestion-btn--ghost gestion-btn--sm"
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? "Subiendo…" : "Elegir archivo"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={handleFile}
      />
      {error && <p className="gestion-field-error">{error}</p>}
    </div>
  );
}
