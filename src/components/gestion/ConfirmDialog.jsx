import GestionModal from "./GestionModal";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "¿Confirmar?",
  message,
  confirmLabel = "Eliminar",
  loading = false,
}) {
  return (
    <GestionModal title={title} open={open} onClose={onClose}>
      <p className="gestion-confirm-text">{message}</p>
      <div className="gestion-form__footer">
        <button type="button" className="gestion-btn gestion-btn--ghost" onClick={onClose}>
          Cancelar
        </button>
        <button
          type="button"
          className="gestion-btn gestion-btn--danger"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Eliminando…" : confirmLabel}
        </button>
      </div>
    </GestionModal>
  );
}
