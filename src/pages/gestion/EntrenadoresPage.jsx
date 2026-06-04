import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, ClipboardList } from "lucide-react";
import ConfirmDialog from "../../components/gestion/ConfirmDialog";
import { gestionApi } from "../../api/gestionApi";
import { useAuth } from "../../context/AuthContext";
import { canManageTeams } from "../../lib/gestionHelpers";
import { mediaUrl } from "../../lib/mediaUrl";
import GestionPageHeader from "../../components/gestion/GestionPageHeader";
import GestionModal from "../../components/gestion/GestionModal";
import GestionAlert from "../../components/gestion/GestionAlert";

const emptyForm = {
  nombre: "",
  apellidos: "",
  email: "",
  telefono: "",
  licencia: "",
  bio: "",
  activo: true,
};

export default function EntrenadoresPage() {
  const { user } = useAuth();
  const canEdit = canManageTeams(user?.role);
  const [coaches, setCoaches] = useState([]);
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
      setCoaches(await gestionApi.coaches.list());
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
    setModalOpen(true);
  };

  const openEdit = (coach) => {
    setEditing(coach);
    setForm({
      nombre: coach.nombre,
      apellidos: coach.apellidos,
      email: coach.email || "",
      telefono: coach.telefono || "",
      licencia: coach.licencia || "",
      bio: coach.bio || "",
      activo: !!coach.activo,
    });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await gestionApi.coaches.remove(deleteTarget.id);
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
      if (editing) {
        await gestionApi.coaches.update(editing.id, form);
      } else {
        await gestionApi.coaches.create(form);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const fullName = (c) => `${c.apellidos}, ${c.nombre}`;

  return (
    <div className="gestion-page">
      <GestionPageHeader
        title="Entrenadores"
        description="Fichas deportivas de entrenadores (distintas de los usuarios de login). Al crear un usuario con rol entrenador, aquí se genera su ficha al primer acceso."
        action={
          canEdit && (
            <button type="button" className="gestion-btn gestion-btn--primary" onClick={openCreate}>
              <Plus size={18} />
              Nuevo entrenador
            </button>
          )
        }
      />

      <GestionAlert type="error">{error}</GestionAlert>

      <div className="gestion-panel">
        {loading ? (
          <p className="gestion-muted">Cargando entrenadores…</p>
        ) : coaches.length === 0 ? (
          <p className="gestion-muted">
            No hay fichas en la tabla de entrenadores. Si ya existe un usuario con rol «entrenador»,
            su ficha se crea automáticamente cuando inicia sesión y entra en Mi perfil.
          </p>
        ) : (
          <div className="gestion-table-wrap">
            <table className="gestion-table">
              <thead>
                <tr>
                  <th>Entrenador</th>
                  <th>Contacto</th>
                  <th>Equipos</th>
                  <th>Estado</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {coaches.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="gestion-table__person">
                        {c.foto_path ? (
                          <img src={mediaUrl(c.foto_path)} alt="" className="gestion-avatar gestion-avatar--sm" />
                        ) : (
                          <span className="gestion-avatar gestion-avatar--sm gestion-avatar--empty" />
                        )}
                        <div>
                          <strong>{fullName(c)}</strong>
                          {c.licencia && <span className="gestion-table__sub">Lic. {c.licencia}</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      {c.telefono || "—"}
                      {c.email && <span className="gestion-table__sub">{c.email}</span>}
                    </td>
                    <td>{c.teams_count ?? 0}</td>
                    <td>
                      <span className={`gestion-badge${c.activo ? "" : " gestion-badge--muted"}`}>
                        {c.activo ? "Activo" : "Baja"}
                      </span>
                    </td>
                    <td className="gestion-table__actions">
                      <Link
                        to={`/gestion/entrenadores/${c.id}`}
                        className="gestion-icon-btn"
                        aria-label="Ver perfil"
                        title="Perfil y tácticas"
                      >
                        <ClipboardList size={16} />
                      </Link>
                      {canEdit && (
                        <>
                          <button type="button" className="gestion-icon-btn" onClick={() => openEdit(c)} aria-label="Editar">
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="gestion-icon-btn gestion-icon-btn--danger"
                            onClick={() =>
                              setDeleteTarget({
                                id: c.id,
                                message: `¿Eliminar a ${fullName(c)}? Los equipos quedarán sin entrenador.`,
                              })
                            }
                            aria-label="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <GestionModal title={editing ? "Editar entrenador" : "Nuevo entrenador"} open={modalOpen} onClose={() => setModalOpen(false)}>
        <form className="gestion-form" onSubmit={handleSubmit}>
          <label className="gestion-field">
            <span>Nombre</span>
            <input className="gestion-input" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          </label>
          <label className="gestion-field">
            <span>Apellidos</span>
            <input className="gestion-input" value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} required />
          </label>
          <label className="gestion-field">
            <span>Email</span>
            <input type="email" className="gestion-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="gestion-field">
            <span>Teléfono</span>
            <input className="gestion-input" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          </label>
          <label className="gestion-field">
            <span>Licencia</span>
            <input className="gestion-input" value={form.licencia} onChange={(e) => setForm({ ...form, licencia: e.target.value })} />
          </label>
          <label className="gestion-field">
            <span>Bio</span>
            <textarea className="gestion-input gestion-textarea" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </label>
          {editing && (
            <label className="gestion-field gestion-field--check">
              <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} />
              <span>Activo</span>
            </label>
          )}
          <div className="gestion-form__footer">
            <button type="button" className="gestion-btn gestion-btn--ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="gestion-btn gestion-btn--primary" disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </GestionModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        message={deleteTarget?.message}
        loading={deleting}
      />
    </div>
  );
}
