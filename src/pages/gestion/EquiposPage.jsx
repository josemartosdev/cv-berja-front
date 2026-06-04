import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ConfirmDialog from "../../components/gestion/ConfirmDialog";
import { gestionApi } from "../../api/gestionApi";
import { useAuth } from "../../context/AuthContext";
import { canManageTeams, isCoachRole } from "../../lib/gestionHelpers";
import GestionPageHeader from "../../components/gestion/GestionPageHeader";
import GestionModal from "../../components/gestion/GestionModal";
import GestionAlert from "../../components/gestion/GestionAlert";
import PhotoUpload from "../../components/gestion/PhotoUpload";
import { uploadFile } from "../../api/upload";
import { mediaUrl } from "../../lib/mediaUrl";

const emptyForm = { nombre: "", categoria: "", temporada: "2025-26", coachId: "", activo: true };

export default function EquiposPage() {
  const { user } = useAuth();
  const isCoach = isCoachRole(user?.role);
  const canEdit = canManageTeams(user?.role);
  const canManageAll = canEdit;
  const [teams, setTeams] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [modalTab, setModalTab] = useState("datos");
  const [fotoPath, setFotoPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [teamsData, coachesData] = await Promise.all([
        gestionApi.teams.list(),
        gestionApi.coaches.list(),
      ]);
      setTeams(teamsData);
      setCoaches(coachesData.filter((c) => c.activo));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalTab("datos");
    setFotoPath(null);
    setModalOpen(true);
  };

  const openEdit = (team) => {
    setEditing(team);
    setFotoPath(team.foto_path || null);
    setModalTab(isCoach ? "foto" : "datos");
    setForm({
      nombre: team.nombre,
      categoria: team.categoria,
      temporada: team.temporada,
      coachId: team.coach_id ? String(team.coach_id) : "",
      activo: !!team.activo,
    });
    setModalOpen(true);
  };

  const buildPayload = () => ({
    nombre: form.nombre,
    categoria: form.categoria,
    temporada: form.temporada,
    coachId: form.coachId ? Number(form.coachId) : null,
    activo: form.activo,
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    try {
      await gestionApi.teams.remove(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = buildPayload();
      const wasNew = !editing;
      let saved;
      if (editing) {
        saved = await gestionApi.teams.update(editing.id, body);
      } else {
        saved = await gestionApi.teams.create(body);
      }
      setEditing(saved);
      setFotoPath(saved.foto_path || null);
      await load();
      if (wasNew) setModalTab("foto");
      else if (modalTab === "datos") setModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="gestion-page">
      <GestionPageHeader
        title={isCoach ? "Mis equipos" : "Equipos"}
        description={
          isCoach
            ? "Equipos que tienes asignados como entrenador."
            : "Equipos, entrenador asignado y foto de plantilla."
        }
        action={
          canManageAll && (
            <button type="button" className="gestion-btn gestion-btn--primary" onClick={openCreate}>
              <Plus size={18} />
              Nuevo equipo
            </button>
          )
        }
      />

      <GestionAlert type="error">{error}</GestionAlert>

      <div className="gestion-panel">
        {loading ? (
          <p className="gestion-muted">Cargando equipos…</p>
        ) : teams.length === 0 ? (
          <p className="gestion-muted">No hay equipos. Crea el primero.</p>
        ) : (
          <div className="gestion-table-wrap">
            <table className="gestion-table">
              <thead>
                <tr>
                  <th>Equipo</th>
                  <th>Categoría</th>
                  <th>Entrenador</th>
                  <th>Temporada</th>
                  <th>Estado</th>
                  {canManageAll && <th />}
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td>
                      <div className="gestion-table__person">
                        {team.foto_path ? (
                          <img src={mediaUrl(team.foto_path)} alt="" className="gestion-avatar gestion-avatar--sm" />
                        ) : (
                          <span className="gestion-avatar gestion-avatar--sm gestion-avatar--empty" />
                        )}
                        <strong>{team.nombre}</strong>
                      </div>
                    </td>
                    <td>{team.categoria}</td>
                    <td>{team.coach_nombre || <span className="gestion-muted">—</span>}</td>
                    <td>{team.temporada}</td>
                    <td>
                      <span
                        className={`gestion-badge${team.activo ? "" : " gestion-badge--muted"}`}
                      >
                        {team.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    {(canManageAll || isCoach) && (
                      <td className="gestion-table__actions">
                        <button
                          type="button"
                          className="gestion-icon-btn"
                          onClick={() => openEdit(team)}
                          aria-label={isCoach ? "Ver / foto" : "Editar"}
                        >
                          <Pencil size={16} />
                        </button>
                        {canManageAll && (
                          <button
                            type="button"
                            className="gestion-icon-btn gestion-icon-btn--danger"
                            onClick={() =>
                              setDeleteTarget({
                                id: team.id,
                                message: `¿Eliminar "${team.nombre}"? Los jugadores quedarán sin equipo.`,
                              })
                            }
                            aria-label="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <GestionModal
        title={editing ? "Editar equipo" : "Nuevo equipo"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        wide
      >
        <div className="gestion-tabs">
          {(isCoach ? ["foto"] : ["datos", "foto"]).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`gestion-tabs__btn${modalTab === tab ? " gestion-tabs__btn--active" : ""}`}
              onClick={() => setModalTab(tab)}
            >
              {tab === "datos" ? "Datos" : "Foto"}
            </button>
          ))}
        </div>

        {modalTab === "datos" && (
        <form className="gestion-form gestion-form--grid" onSubmit={handleSubmit}>
          <label className="gestion-field">
            <span>Nombre</span>
            <input
              className="gestion-input"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </label>
          <label className="gestion-field">
            <span>Categoría</span>
            <input
              className="gestion-input"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              placeholder="Cadete, Juvenil…"
              required
            />
          </label>
          <label className="gestion-field">
            <span>Temporada</span>
            <input
              className="gestion-input"
              value={form.temporada}
              onChange={(e) => setForm({ ...form, temporada: e.target.value })}
              required
            />
          </label>
          {canManageAll && (
            <label className="gestion-field gestion-field--full">
              <span>Entrenador</span>
              <select
                className="gestion-input gestion-select"
                value={form.coachId}
                onChange={(e) => setForm({ ...form, coachId: e.target.value })}
              >
                <option value="">Sin asignar</option>
                {coaches.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.apellidos}, {c.nombre}
                  </option>
                ))}
              </select>
            </label>
          )}
          {editing && (
            <label className="gestion-field gestion-field--check">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={(e) => setForm({ ...form, activo: e.target.checked })}
              />
              <span>Equipo activo</span>
            </label>
          )}
          <div className="gestion-form__footer gestion-field--full">
            <button type="button" className="gestion-btn gestion-btn--ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="gestion-btn gestion-btn--primary" disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
        )}

        {modalTab === "foto" && (
          <div className="gestion-form">
            {editing ? (
              <PhotoUpload
                label="Foto del equipo"
                currentPath={fotoPath}
                onUpload={async (file) => {
                  const res = await uploadFile(`/api/gestion/teams/${editing.id}/photo`, file);
                  setFotoPath(res.foto_path);
                  await load();
                }}
              />
            ) : (
              <p className="gestion-muted">Guarda el equipo primero para subir la foto.</p>
            )}
          </div>
        )}
      </GestionModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        message={deleteTarget?.message ?? ""}
        loading={deleting}
      />
    </div>
  );
}
