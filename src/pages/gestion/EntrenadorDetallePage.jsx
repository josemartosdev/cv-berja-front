import { useCallback, useEffect, useState } from "react";
import { Link, useMatch, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Pencil } from "lucide-react";
import { gestionApi } from "../../api/gestionApi";
import { uploadFile } from "../../api/upload";
import { useAuth } from "../../context/AuthContext";
import {
  canManagePlayers,
  canManageTeams,
  isAdminRole,
} from "../../lib/gestionHelpers";
import { mediaUrl } from "../../lib/mediaUrl";
import DropzoneUpload from "../../components/DropzoneUpload";
import GestionAlert from "../../components/gestion/GestionAlert";
import GestionPageHeader from "../../components/gestion/GestionPageHeader";

const emptyTactic = {
  titulo: "",
  temporada: "2025-26",
  formacion: "",
  descripcion: "",
  notas: "",
  teamId: "",
};

export default function EntrenadorDetallePage() {
  const { id: routeId } = useParams();
  const isSelfProfile = !!useMatch("/gestion/mi-perfil");
  const { user } = useAuth();
  const isAdmin = isAdminRole(user?.role);
  const canEditCoach = isSelfProfile || canManageTeams(user?.role);
  const canEditTactics = canManagePlayers(user?.role);
  const [coach, setCoach] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [tacticForm, setTacticForm] = useState(emptyTactic);
  const [editingTactic, setEditingTactic] = useState(null);
  const [savingTactic, setSavingTactic] = useState(false);

  const coachId = coach?.id ?? routeId;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const coachData = isSelfProfile
        ? await gestionApi.coaches.me()
        : await gestionApi.coaches.get(routeId);
      const teamsData = await gestionApi.teams.list();
      setCoach(coachData);
      setTeams(teamsData.filter((t) => t.activo));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isSelfProfile, routeId]);

  useEffect(() => {
    load();
  }, [load]);

  const saveTactic = async (e) => {
    e.preventDefault();
    if (!coachId) return;
    setSavingTactic(true);
    setError("");
    try {
      const body = {
        ...tacticForm,
        teamId: tacticForm.teamId ? Number(tacticForm.teamId) : null,
      };
      if (editingTactic) {
        await gestionApi.coaches.tactics.update(
          coachId,
          editingTactic.id,
          body,
        );
      } else {
        await gestionApi.coaches.tactics.create(coachId, body);
      }
      setTacticForm(emptyTactic);
      setEditingTactic(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingTactic(false);
    }
  };

  const startEditTactic = (t) => {
    setEditingTactic(t);
    setTacticForm({
      titulo: t.titulo,
      temporada: t.temporada,
      formacion: t.formacion || "",
      descripcion: t.descripcion || "",
      notas: t.notas || "",
      teamId: t.team_id ? String(t.team_id) : "",
    });
  };

  const removeTactic = async (tacticId) => {
    if (!coachId || !confirm("¿Eliminar esta táctica?")) return;
    await gestionApi.coaches.tactics.remove(coachId, tacticId);
    await load();
  };

  const uploadDiagram = async (tacticId, file) => {
    if (!coachId) return;
    await uploadFile(
      `/gestion/coaches/${coachId}/tactics/${tacticId}/diagram`,
      file,
    );
    await load();
  };

  if (loading) return <p className="gestion-muted">Cargando perfil…</p>;
  if (!coach)
    return (
      <p className="gestion-alert gestion-alert--error">
        Entrenador no encontrado.
      </p>
    );

  const fullName = `${coach.apellidos}, ${coach.nombre}`;

  return (
    <div className="gestion-page">
      {isSelfProfile ? (
        <GestionPageHeader
          title="Mi perfil"
          description="Tu ficha de entrenador, equipos a cargo y tácticas por temporada."
        />
      ) : (
        <Link to="/gestion/entrenadores" className="gestion-back-link">
          <ArrowLeft size={16} />
          Volver a entrenadores
        </Link>
      )}

      <GestionAlert type="error">{error}</GestionAlert>

      <div className="gestion-coach-profile">
        <div className="gestion-coach-profile__main">
          {canEditCoach ? (
            <div style={{ width: "220px" }}>
              <DropzoneUpload
                label="Foto del entrenador"
                onFileSelect={async (file) => {
                  if (!file) return;
                  setUploading(true);
                  setUploadError("");
                  try {
                    const res = await uploadFile(
                      `/gestion/coaches/${coach.id}/photo`,
                      file,
                    );
                    setCoach({ ...coach, foto_path: res.foto_path });
                  } catch (err) {
                    setUploadError(err.message);
                  } finally {
                    setUploading(false);
                  }
                }}
              />
              {uploadError && (
                <p
                  style={{
                    color: "#dc2626",
                    marginTop: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  {uploadError}
                </p>
              )}
            </div>
          ) : coach.foto_path ? (
            <img
              src={mediaUrl(coach.foto_path)}
              alt=""
              className="gestion-coach-profile__photo"
            />
          ) : null}
          <div>
            <h1>{fullName}</h1>
            {isSelfProfile && user?.username && (
              <p className="gestion-muted">
                Usuario de acceso: @{user.username}
              </p>
            )}
            {coach.licencia && (
              <p className="gestion-muted">Licencia: {coach.licencia}</p>
            )}
            {coach.bio && <p>{coach.bio}</p>}
            <p className="gestion-muted">
              {coach.telefono && <span>{coach.telefono} · </span>}
              {coach.email}
            </p>
          </div>
        </div>
      </div>

      <section className="gestion-panel gestion-panel--section">
        <h2 className="gestion-subtitle">Equipos a cargo</h2>
        {coach.teams?.length ? (
          <ul className="gestion-chip-list">
            {coach.teams.map((t) => (
              <li key={t.id} className="gestion-chip">
                {t.foto_path && (
                  <img
                    src={mediaUrl(t.foto_path)}
                    alt=""
                    className="gestion-avatar gestion-avatar--xs"
                  />
                )}
                <span>
                  {t.nombre} — {t.categoria} ({t.temporada})
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="gestion-muted">
            {isSelfProfile
              ? "Aún no tienes equipos asignados. El administrador debe vincularlos desde Equipos."
              : "Sin equipos asignados. Asigna entrenador desde Equipos."}
          </p>
        )}
      </section>

      <section className="gestion-panel gestion-panel--section">
        <h2 className="gestion-subtitle">Tácticas y sistemas</h2>
        <ul className="gestion-tactics-list">
          {(coach.tactics || []).map((t) => (
            <li key={t.id} className="gestion-tactic-card">
              <div className="gestion-tactic-card__head">
                <strong>{t.titulo}</strong>
                <span className="gestion-badge">{t.temporada}</span>
              </div>
              {t.formacion && <p>Formación: {t.formacion}</p>}
              {t.team_nombre && (
                <p className="gestion-muted">Equipo: {t.team_nombre}</p>
              )}
              {t.descripcion && <p>{t.descripcion}</p>}
              {t.diagrama_path && (
                <a
                  href={mediaUrl(t.diagrama_path)}
                  target="_blank"
                  rel="noreferrer"
                  className="gestion-tactic-card__diagram"
                >
                  <img src={mediaUrl(t.diagrama_path)} alt="Diagrama táctica" />
                </a>
              )}
              {canEditTactics && (
                <div className="gestion-tactic-card__actions">
                  <button
                    type="button"
                    className="gestion-btn gestion-btn--ghost gestion-btn--sm"
                    onClick={() => startEditTactic(t)}
                  >
                    <Pencil size={14} /> Editar
                  </button>
                  <label className="gestion-btn gestion-btn--ghost gestion-btn--sm">
                    Diagrama
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        uploadDiagram(t.id, e.target.files[0])
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="gestion-icon-btn gestion-icon-btn--danger"
                    onClick={() => removeTactic(t.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>

        {canEditTactics && (
          <form
            className="gestion-form gestion-form--grid gestion-tactic-form"
            onSubmit={saveTactic}
          >
            <p className="gestion-field--full gestion-subtitle">
              {editingTactic ? (
                "Editar táctica"
              ) : (
                <>
                  <Plus size={16} /> Nueva táctica
                </>
              )}
            </p>
            <label className="gestion-field">
              <span>Título</span>
              <input
                className="gestion-input"
                value={tacticForm.titulo}
                onChange={(e) =>
                  setTacticForm({ ...tacticForm, titulo: e.target.value })
                }
                required
              />
            </label>
            <label className="gestion-field">
              <span>Temporada</span>
              <input
                className="gestion-input"
                value={tacticForm.temporada}
                onChange={(e) =>
                  setTacticForm({ ...tacticForm, temporada: e.target.value })
                }
                required
              />
            </label>
            <label className="gestion-field">
              <span>Formación</span>
              <input
                className="gestion-input"
                placeholder="4-2-3-1"
                value={tacticForm.formacion}
                onChange={(e) =>
                  setTacticForm({ ...tacticForm, formacion: e.target.value })
                }
              />
            </label>
            <label className="gestion-field">
              <span>Equipo (opcional)</span>
              <select
                className="gestion-input gestion-select"
                value={tacticForm.teamId}
                onChange={(e) =>
                  setTacticForm({ ...tacticForm, teamId: e.target.value })
                }
              >
                <option value="">General</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre} — {t.categoria}
                  </option>
                ))}
              </select>
            </label>
            <label className="gestion-field gestion-field--full">
              <span>Descripción</span>
              <textarea
                className="gestion-input gestion-textarea"
                rows={3}
                value={tacticForm.descripcion}
                onChange={(e) =>
                  setTacticForm({ ...tacticForm, descripcion: e.target.value })
                }
              />
            </label>
            <label className="gestion-field gestion-field--full">
              <span>Notas</span>
              <textarea
                className="gestion-input gestion-textarea"
                rows={2}
                value={tacticForm.notas}
                onChange={(e) =>
                  setTacticForm({ ...tacticForm, notas: e.target.value })
                }
              />
            </label>
            <div className="gestion-form__footer gestion-field--full">
              {editingTactic && (
                <button
                  type="button"
                  className="gestion-btn gestion-btn--ghost"
                  onClick={() => {
                    setEditingTactic(null);
                    setTacticForm(emptyTactic);
                  }}
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="gestion-btn gestion-btn--primary"
                disabled={savingTactic}
              >
                {savingTactic ? "Guardando…" : "Guardar táctica"}
              </button>
            </div>
          </form>
        )}
      </section>

      {!isSelfProfile && !isAdmin && (
        <p className="gestion-muted">Vista de solo lectura.</p>
      )}
    </div>
  );
}
