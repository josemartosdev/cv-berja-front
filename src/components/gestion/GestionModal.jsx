import { useEffect } from "react";
import { X } from "lucide-react";

export default function GestionModal({ title, open, onClose, children, wide }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="gestion-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`gestion-modal${wide ? " gestion-modal--wide" : ""}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gestion-modal-title"
      >
        <div className="gestion-modal__head">
          <h2 id="gestion-modal-title">{title}</h2>
          <button type="button" className="gestion-icon-btn" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <div className="gestion-modal__body">{children}</div>
      </div>
    </div>
  );
}
