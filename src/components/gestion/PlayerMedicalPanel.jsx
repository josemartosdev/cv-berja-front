import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { gestionApi } from "../../api/gestionApi";
import { uploadFile } from "../../api/upload";
import { mediaUrl } from "../../lib/mediaUrl";

const empty = {
  temporada: "2025-26",
  aptoMedico: false,
  fechaRevision: "",
  alergias: "",
  medicacion: "",
  lesiones: "",
  observaciones: "",
};

export default function PlayerMedicalPanel({ playerId, canEdit }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const allowEdit = canEdit;

  const load = useCallback(async () => {
    if (!playerId) return;
    setLoading(true);
    try {
      setRecords(await gestionApi.medical.list(playerId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (rec) => {
    setEditingId(rec.id);
    setForm({
      temporada: rec.temporada,
      aptoMedico: !!rec.apto_medico,
      fechaRevision: rec.fecha_revision || "",
      alergias: rec.alergias || "",
      medicacion: rec.medicacion || "",
      lesiones: rec.lesiones || "",
      observaciones: rec.observaciones ?? "",
    });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await gestionApi.medical.update(playerId, editingId, form);
      } else {
        await gestionApi.medical.create(playerId, form);
      }
      setForm(empty);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar ficha médica de esta temporada?")) return;
    await gestionApi.medical.remove(playerId, id);
    await load();
  };

  const uploadCert = async (recordId, file) => {
    await uploadFile(`/gestion/players/${playerId}/medical/${recordId}/certificate`, file);
    await load();
  };

  if (!playerId) return <p className="gestion-muted">Guarda el jugador primero para añadir datos médicos.</p>;

  return (
    <div className="gestion-medical-panel">
      {loading ? (
        <p className="gestion-muted">Cargando fichas médicas…</p>
      ) : (
        <ul className="gestion-medical-list">
          {records.map((rec) => (
            <li key={rec.id} className="gestion-medical-item">
              <div className="gestion-medical-item__head">
                <strong>{rec.temporada}</strong>
                <span className={`gestion-badge${rec.apto_medico ? "" : " gestion-badge--muted"}`}>
                  {rec.apto_medico ? "Apto" : "No apto"}
                </span>
              </div>
              {rec.alergias && <p>Alergias: {rec.alergias}</p>}
              {rec.certificado_path && (
                <a href={mediaUrl(rec.certificado_path)} target="_blank" rel="noreferrer">
                  Ver certificado
                </a>
              )}
              {allowEdit && (
                <div className="gestion-medical-item__actions">
                  <button type="button" className="gestion-btn gestion-btn--ghost gestion-btn--sm" onClick={() => startEdit(rec)}>
                    Editar
                  </button>
                  <label className="gestion-btn gestion-btn--ghost gestion-btn--sm">
                    Certificado
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*,application/pdf"
                      onChange={(e) => e.target.files?.[0] && uploadCert(rec.id, e.target.files[0])}
                    />
                  </label>
                  <button type="button" className="gestion-icon-btn gestion-icon-btn--danger" onClick={() => remove(rec.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {allowEdit && (
        <form className="gestion-form gestion-form--grid" onSubmit={save}>
          <p className="gestion-field--full gestion-subtitle">
            {editingId ? "Editar temporada" : <><Plus size={16} /> Nueva ficha por temporada</>}
          </p>
          <label className="gestion-field">
            <span>Temporada</span>
            <input className="gestion-input" value={form.temporada} onChange={(e) => setForm({ ...form, temporada: e.target.value })} required disabled={!!editingId} />
          </label>
          <label className="gestion-field gestion-field--check">
            <input type="checkbox" checked={form.aptoMedico} onChange={(e) => setForm({ ...form, aptoMedico: e.target.checked })} />
            <span>Apto médico</span>
          </label>
          <label className="gestion-field">
            <span>Fecha revisión</span>
            <input type="date" className="gestion-input" value={form.fechaRevision} onChange={(e) => setForm({ ...form, fechaRevision: e.target.value })} />
          </label>
          <label className="gestion-field gestion-field--full">
            <span>Alergias</span>
            <textarea className="gestion-input gestion-textarea" rows={2} value={form.alergias} onChange={(e) => setForm({ ...form, alergias: e.target.value })} />
          </label>
          <label className="gestion-field gestion-field--full">
            <span>Medicación</span>
            <textarea className="gestion-input gestion-textarea" rows={2} value={form.medicacion} onChange={(e) => setForm({ ...form, medicacion: e.target.value })} />
          </label>
          <label className="gestion-field gestion-field--full">
            <span>Lesiones / limitaciones</span>
            <textarea className="gestion-input gestion-textarea" rows={2} value={form.lesiones} onChange={(e) => setForm({ ...form, lesiones: e.target.value })} />
          </label>
          <label className="gestion-field gestion-field--full">
            <span>Observaciones</span>
            <textarea className="gestion-input gestion-textarea" rows={2} value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} />
          </label>
          <div className="gestion-form__footer gestion-field--full">
            {editingId && (
              <button type="button" className="gestion-btn gestion-btn--ghost" onClick={() => { setEditingId(null); setForm(empty); }}>
                Cancelar edición
              </button>
            )}
            <button type="submit" className="gestion-btn gestion-btn--primary" disabled={saving}>
              {saving ? "Guardando…" : "Guardar ficha"}
            </button>
          </div>
        </form>
      )}
      {error && <p className="gestion-alert gestion-alert--error">{error}</p>}
    </div>
  );
}
