import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, ClipboardList } from "lucide-react";
import ConfirmDialog from "../../components/gestion/ConfirmDialog";
import { gestionApi } from "../../api/gestionApi";
import { useAuth } from "../../context/AuthContext";
import {
  canManagePlayers,
  canManageTeams,
  formatDate,
  isCoachRole,
  playerFullName,
} from "../../lib/gestionHelpers";
import GestionPageHeader from "../../components/gestion/GestionPageHeader";
import GestionModal from "../../components/gestion/GestionModal";
import GestionAlert from "../../components/gestion/GestionAlert";
import PhotoUpload from "../../components/gestion/PhotoUpload";
import PlayerMedicalPanel from "../../components/gestion/PlayerMedicalPanel";
import { uploadFile } from "../../api/upload";
import { mediaUrl } from "../../lib/mediaUrl";

const emptyForm = {
  nombre: "",
  apellidos: "",
  teamId: "",
  dni: "",
  fechaNacimiento: "",
  email: "",
  telefono: "",
  notas: "",
  activo: true,
};

export default function JugadoresPage() {
  const { user } = useAuth();
  const isCoach = isCoachRole(user?.role);
  const canEdit = canManagePlayers(user?.role);
  const canDelete = canManageTeams(user?.role);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filterTeam, setFilterTeam] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [modalTab, setModalTab] = useState("datos");
  const [fotoPath, setFotoPath] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [playersData, teamsData] = await Promise.all([
        gestionApi.players.list(filterTeam || undefined),
        gestionApi.teams.list(),
      ]);
      setPlayers(playersData);
      setTeams(teamsData.filter((t) => t.activo));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterTeam]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, teamId: filterTeam || "" });
    setModalTab("datos");
    setFotoPath(null);
    setModalOpen(true);
  };

  const openEdit = (player) => {
    setEditing(player);
    setFotoPath(player.foto_path || null);
    setModalTab("datos");
    setForm({
      nombre: player.nombre,
      apellidos: player.apellidos,
      teamId: player.team_id ? String(player.team_id) : "",
      dni: player.dni || "",
      fechaNacimiento: player.fecha_nacimiento || "",
      email: player.email || "",
      telefono: player.telefono || "",
      notas: player.notas || "",
      activo: !!player.activo,
    });
    setModalOpen(true);
  };

  const buildPayload = () => ({
    nombre: form.nombre,
    apellidos: form.apellidos,
    teamId: form.teamId ? Number(form.teamId) : null,
    dni: form.dni || null,
    fechaNacimiento: form.fechaNacimiento || null,
    email: form.email || null,
    telefono: form.telefono || null,
    notas: form.notas || null,
    activo: form.activo,
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    try {
      await gestionApi.players.remove(deleteTarget.id);
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
        saved = await gestionApi.players.update(editing.id, body);
      } else {
        saved = await gestionApi.players.create(body);
      }
      setEditing(saved);
      setFotoPath(saved.foto_path || null);
      await load();
      if (wasNew) {
        setModalTab("medico");
      } else if (modalTab === "datos") {
        setModalOpen(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="gestion-page">
      <GestionPageHeader
        title={isCoach ? "Mis jugadores" : "Jugadores"}
        description={
          isCoach
            ? "Jugadores de tus equipos: datos, ficha médica por temporada y fotos."
            : "Fichas, datos médicos por temporada, fotos y vínculo con equipo y entrenador."
        }
        action={
          canEdit && (
            <button type="button" className="gestion-btn gestion-btn--primary" onClick={openCreate}>
              <Plus size={18} />
              Nuevo jugador
            </button>
          )
        }
      />

      <div className="gestion-toolbar">
        <label className="gestion-field gestion-field--inline">
          <span>Filtrar por equipo</span>
          <select
            className="gestion-input gestion-select"
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
          >
            <option value="">Todos</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre} ({t.categoria})
              </option>
            ))}
          </select>
        </label>
      </div>

      <GestionAlert type="error">{error}</GestionAlert>

      <div className="gestion-panel">
        {loading ? (
          <p className="gestion-muted">Cargando jugadores…</p>
        ) : players.length === 0 ? (
          <p className="gestion-muted">No hay jugadores con este filtro.</p>
        ) : (
          <div className="gestion-table-wrap">
            <table className="gestion-table">
              <thead>
                <tr>
                  <th>Jugador</th>
                  <th>Equipo</th>
                  <th>Entrenador</th>
                  <th>Teléfono</th>
                  <th>Nacimiento</th>
                  <th>Estado</th>
                  {(canEdit || canDelete) && <th />}
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="gestion-table__person">
                        {p.foto_path ? (
                          <img src={mediaUrl(p.foto_path)} alt="" className="gestion-avatar gestion-avatar--sm" />
                        ) : (
                          <span className="gestion-avatar gestion-avatar--sm gestion-avatar--empty" />
                        )}
                        <div>
                          <strong>{playerFullName(p)}</strong>
                          {p.dni && <span className="gestion-table__sub">{p.dni}</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      {p.team_nombre ? (
                        <>
                          {p.team_nombre}
                          <span className="gestion-table__sub">{p.team_categoria}</span>
                        </>
                      ) : (
                        <span className="gestion-muted">Sin equipo</span>
                      )}
                    </td>
                    <td>{p.coach_nombre || <span className="gestion-muted">—</span>}</td>
                    <td>{p.telefono || "—"}</td>
                    <td>{formatDate(p.fecha_nacimiento)}</td>
                    <td>
                      <span className={`gestion-badge${p.activo ? "" : " gestion-badge--muted"}`}>
                        {p.activo ? "Activo" : "Baja"}
                      </span>
                    </td>
                    {(canEdit || canDelete) && (
                      <td className="gestion-table__actions">
                        <Link
                          to={`/gestion/jugadores/${p.id}`}
                          className="gestion-icon-btn"
                          aria-label="Ver ficha"
                          title="Perfil del jugador"
                        >
                          <ClipboardList size={16} />
                        </Link>
                        {canEdit && (
                          <button
                            type="button"
                            className="gestion-icon-btn"
                            onClick={() => openEdit(p)}
                            aria-label="Editar rápido"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            type="button"
                            className="gestion-icon-btn gestion-icon-btn--danger"
                            onClick={() =>
                              setDeleteTarget({
                                id: p.id,
                                message: `¿Eliminar a ${playerFullName(p)} y sus pagos asociados?`,
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
        title={editing ? "Editar jugador" : "Nuevo jugador"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        wide
      >
        <div className="gestion-tabs">
          {["datos", "medico", "foto"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`gestion-tabs__btn${modalTab === tab ? " gestion-tabs__btn--active" : ""}`}
              onClick={() => setModalTab(tab)}
            >
              {tab === "datos" ? "Datos" : tab === "medico" ? "Médico" : "Foto"}
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
            <span>Apellidos</span>
            <input
              className="gestion-input"
              value={form.apellidos}
              onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
              required
            />
          </label>
          <label className="gestion-field">
            <span>Equipo</span>
            <select
              className="gestion-input gestion-select"
              value={form.teamId}
              onChange={(e) => setForm({ ...form, teamId: e.target.value })}
            >
              <option value="">Sin asignar</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} — {t.categoria}
                </option>
              ))}
            </select>
          </label>
          <label className="gestion-field">
            <span>DNI / NIE</span>
            <input
              className="gestion-input"
              value={form.dni}
              onChange={(e) => setForm({ ...form, dni: e.target.value })}
            />
          </label>
          <label className="gestion-field">
            <span>Fecha de nacimiento</span>
            <input
              type="date"
              className="gestion-input"
              value={form.fechaNacimiento}
              onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
            />
          </label>
          <label className="gestion-field">
            <span>Teléfono</span>
            <input
              className="gestion-input"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
          </label>
          <label className="gestion-field">
            <span>Email</span>
            <input
              type="email"
              className="gestion-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label className="gestion-field gestion-field--full">
            <span>Notas</span>
            <textarea
              className="gestion-input gestion-textarea"
              rows={3}
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
            />
          </label>
          {editing && (
            <label className="gestion-field gestion-field--check gestion-field--full">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={(e) => setForm({ ...form, activo: e.target.checked })}
              />
              <span>Jugador activo</span>
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

        {modalTab === "medico" && (
          <PlayerMedicalPanel playerId={editing?.id} canEdit={canEdit} />
        )}

        {modalTab === "foto" && (
          <div className="gestion-form">
            {editing ? (
              <PhotoUpload
                label="Foto del jugador"
                currentPath={fotoPath}
                disabled={!canEdit}
                onUpload={async (file) => {
                  const res = await uploadFile(`/api/gestion/players/${editing.id}/photo`, file);
                  setFotoPath(res.foto_path);
                  await load();
                }}
              />
            ) : (
              <p className="gestion-muted">Guarda los datos básicos primero para subir la foto.</p>
            )}
          </div>
        )}
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
