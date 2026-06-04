import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "../../components/gestion/ConfirmDialog";
import { gestionApi } from "../../api/gestionApi";
import GestionPageHeader from "../../components/gestion/GestionPageHeader";
import GestionModal from "../../components/gestion/GestionModal";
import GestionAlert from "../../components/gestion/GestionAlert";
import { ROLE_LABELS } from "../../lib/gestionHelpers";

const emptyCreate = {
  username: "",
  email: "",
  password: "",
  nombre: "",
  role: "admin",
};

export default function UsuariosPage() {
  const { user: sessionUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [createForm, setCreateForm] = useState(emptyCreate);
  const [editForm, setEditForm] = useState({ nombre: "", role: "admin", active: true });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setUsers(await gestionApi.users.list());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openEdit = (u) => {
    setEditing(u);
    setEditForm({
      nombre: u.nombre,
      role: u.role,
      active: !!u.active,
    });
    setEditOpen(true);
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await gestionApi.users.create({
        ...createForm,
        username: createForm.username.trim().toLowerCase(),
        email: createForm.email.trim().toLowerCase(),
      });
      setCreateOpen(false);
      setCreateForm(emptyCreate);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    try {
      await gestionApi.users.remove(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await gestionApi.users.update(editing.id, editForm);
      setEditOpen(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="gestion-page">
      <GestionPageHeader
        title="Usuarios del panel"
        description="Solo super_admin puede crear y editar accesos."
        action={
          <button
            type="button"
            className="gestion-btn gestion-btn--primary"
            onClick={() => setCreateOpen(true)}
          >
            <Plus size={18} />
            Nuevo usuario
          </button>
        }
      />

      <GestionAlert type="error">{error}</GestionAlert>

      <div className="gestion-panel">
        {loading ? (
          <p className="gestion-muted">Cargando usuarios…</p>
        ) : (
          <div className="gestion-table-wrap">
            <table className="gestion-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>@{u.username}</strong>
                    </td>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="gestion-badge gestion-badge--role">
                        {ROLE_LABELS[u.role] ?? u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`gestion-badge${u.active ? "" : " gestion-badge--muted"}`}>
                        {u.active ? "Activo" : "Desactivado"}
                      </span>
                    </td>
                    <td className="gestion-table__actions">
                      <button
                        type="button"
                        className="gestion-icon-btn"
                        onClick={() => openEdit(u)}
                        aria-label="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      {sessionUser?.id !== u.id && (
                        <button
                          type="button"
                          className="gestion-icon-btn gestion-icon-btn--danger"
                          onClick={() =>
                            setDeleteTarget({
                              id: u.id,
                              message: `¿Eliminar al usuario @${u.username}?`,
                            })
                          }
                          aria-label="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <GestionModal title="Nuevo usuario" open={createOpen} onClose={() => setCreateOpen(false)} wide>
        <form className="gestion-form gestion-form--grid" onSubmit={submitCreate}>
          <label className="gestion-field">
            <span>Usuario</span>
            <input
              className="gestion-input"
              value={createForm.username}
              onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
              required
            />
          </label>
          <label className="gestion-field">
            <span>Email</span>
            <input
              type="email"
              className="gestion-input"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              required
            />
          </label>
          <label className="gestion-field">
            <span>Nombre completo</span>
            <input
              className="gestion-input"
              value={createForm.nombre}
              onChange={(e) => setCreateForm({ ...createForm, nombre: e.target.value })}
              required
            />
          </label>
          <label className="gestion-field">
            <span>Contraseña</span>
            <input
              type="password"
              className="gestion-input"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              required
            />
          </label>
          <label className="gestion-field">
            <span>Rol</span>
            <select
              className="gestion-input gestion-select"
              value={createForm.role}
              onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
            >
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <div className="gestion-form__footer gestion-field--full">
            <button type="button" className="gestion-btn gestion-btn--ghost" onClick={() => setCreateOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="gestion-btn gestion-btn--primary" disabled={saving}>
              {saving ? "Creando…" : "Crear usuario"}
            </button>
          </div>
        </form>
      </GestionModal>

      <GestionModal title="Editar usuario" open={editOpen} onClose={() => setEditOpen(false)}>
        <form className="gestion-form" onSubmit={submitEdit}>
          <p className="gestion-muted gestion-modal__user">@{editing?.username}</p>
          <label className="gestion-field">
            <span>Nombre</span>
            <input
              className="gestion-input"
              value={editForm.nombre}
              onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
              required
            />
          </label>
          <label className="gestion-field">
            <span>Rol</span>
            <select
              className="gestion-input gestion-select"
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            >
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="gestion-field gestion-field--check">
            <input
              type="checkbox"
              checked={editForm.active}
              onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
            />
            <span>Usuario activo</span>
          </label>
          <div className="gestion-form__footer">
            <button type="button" className="gestion-btn gestion-btn--ghost" onClick={() => setEditOpen(false)}>
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
        message={deleteTarget?.message ?? ""}
        loading={deleting}
      />
    </div>
  );
}
