import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { gestionApi } from "../../api/gestionApi";
import { uploadFile } from "../../api/upload";
import { useAuth } from "../../context/AuthContext";
import {
  canManagePlayers,
  canManageTeams,
  formatDate,
  playerFullName,
} from "../../lib/gestionHelpers";
import { mediaUrl } from "../../lib/mediaUrl";
import PhotoUpload from "../../components/gestion/PhotoUpload";
import PlayerMedicalPanel from "../../components/gestion/PlayerMedicalPanel";
import GestionAlert from "../../components/gestion/GestionAlert";
import PlayerAccessPanel from "../../components/gestion/PlayerAccessPanel";

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

export default function JugadorDetallePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const canEdit = canManagePlayers(user?.role);
  const [player, setPlayer] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("datos");
  const [form, setForm] = useState(emptyForm);
  const [fotoPath, setFotoPath] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [playerData, teamsData] = await Promise.all([
        gestionApi.players.get(id),
        gestionApi.teams.list(),
      ]);
      setPlayer(playerData);
      setFotoPath(playerData.foto_path || null);
      setForm({
        nombre: playerData.nombre,
        apellidos: playerData.apellidos,
        teamId: playerData.team_id ? String(playerData.team_id) : "",
        dni: playerData.dni || "",
        fechaNacimiento: playerData.fecha_nacimiento || "",
        email: playerData.email || "",
        telefono: playerData.telefono || "",
        notas: playerData.notas || "",
        activo: !!playerData.activo,
      });
      setTeams(teamsData.filter((t) => t.activo));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = {
        nombre: form.nombre,
        apellidos: form.apellidos,
        teamId: form.teamId ? Number(form.teamId) : null,
        dni: form.dni || null,
        fechaNacimiento: form.fechaNacimiento || null,
        email: form.email || null,
        telefono: form.telefono || null,
        notas: form.notas || null,
        activo: form.activo,
      };
      const updated = await gestionApi.players.update(id, body);
      setPlayer(updated);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="gestion-muted">Cargando ficha del jugador…</p>;
  if (!player) return <p className="gestion-alert gestion-alert--error">Jugador no encontrado.</p>;

  const canChangeTeam = canManageTeams(user?.role);

  return (
    <div className="gestion-page">
      <Link to="/gestion/jugadores" className="gestion-back-link">
        <ArrowLeft size={16} />
        Volver a jugadores
      </Link>

      <GestionAlert type="error">{error}</GestionAlert>

      <div className="gestion-player-profile">
        <div className="gestion-player-profile__hero">
          {fotoPath ? (
            <img src={mediaUrl(fotoPath)} alt="" className="gestion-player-profile__photo" />
          ) : (
            <span className="gestion-avatar gestion-avatar--empty gestion-player-profile__photo" />
          )}
          <div>
            <h1>{playerFullName(player)}</h1>
            <p className="gestion-muted">
              {player.team_nombre ? (
                <>
                  {player.team_nombre} · {player.team_categoria}
                </>
              ) : (
                "Sin equipo"
              )}
              {player.coach_nombre && <> · Entrenador: {player.coach_nombre}</>}
            </p>
            <span className={`gestion-badge${player.activo ? "" : " gestion-badge--muted"}`}>
              {player.activo ? "Activo" : "Baja"}
            </span>
          </div>
        </div>
      </div>

      <div className="gestion-tabs">
        {["datos", "medico", "foto", "acceso"].map((t) => (
          <button
            key={t}
            type="button"
            className={`gestion-tabs__btn${tab === t ? " gestion-tabs__btn--active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "datos" ? "Datos" : t === "medico" ? "Médico" : t === "foto" ? "Foto" : "Acceso portal"}
          </button>
        ))}
      </div>

      <div className="gestion-panel">
        {tab === "datos" && (
          canEdit ? (
            <form className="gestion-form gestion-form--grid" onSubmit={save}>
              <label className="gestion-field">
                <span>Nombre</span>
                <input className="gestion-input" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
              </label>
              <label className="gestion-field">
                <span>Apellidos</span>
                <input className="gestion-input" value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} required />
              </label>
              <label className="gestion-field">
                <span>Equipo</span>
                <select
                  className="gestion-input gestion-select"
                  value={form.teamId}
                  onChange={(e) => setForm({ ...form, teamId: e.target.value })}
                  disabled={!canChangeTeam}
                >
                  <option value="">Sin asignar</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre} — {t.categoria}
                    </option>
                  ))}
                </select>
                {!canChangeTeam && (
                  <span className="gestion-field-hint">Solo administración puede cambiar de equipo.</span>
                )}
              </label>
              <label className="gestion-field">
                <span>DNI / NIE</span>
                <input className="gestion-input" value={form.dni} onChange={(e) => setForm({ ...form, dni: e.target.value })} />
              </label>
              <label className="gestion-field">
                <span>Fecha de nacimiento</span>
                <input type="date" className="gestion-input" value={form.fechaNacimiento} onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })} />
              </label>
              <label className="gestion-field">
                <span>Teléfono</span>
                <input className="gestion-input" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
              </label>
              <label className="gestion-field">
                <span>Email</span>
                <input type="email" className="gestion-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="gestion-field gestion-field--full">
                <span>Notas</span>
                <textarea className="gestion-input gestion-textarea" rows={3} value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
              </label>
              <label className="gestion-field gestion-field--check gestion-field--full">
                <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} />
                <span>Jugador activo</span>
              </label>
              <div className="gestion-form__footer gestion-field--full">
                <button type="submit" className="gestion-btn gestion-btn--primary" disabled={saving}>
                  {saving ? "Guardando…" : "Guardar datos"}
                </button>
              </div>
            </form>
          ) : (
            <dl className="gestion-dl">
              <div><dt>DNI</dt><dd>{player.dni || "—"}</dd></div>
              <div><dt>Nacimiento</dt><dd>{formatDate(player.fecha_nacimiento)}</dd></div>
              <div><dt>Teléfono</dt><dd>{player.telefono || "—"}</dd></div>
              <div><dt>Email</dt><dd>{player.email || "—"}</dd></div>
              <div><dt>Notas</dt><dd>{player.notas || "—"}</dd></div>
            </dl>
          )
        )}

        {tab === "medico" && <PlayerMedicalPanel playerId={player.id} canEdit={canEdit} />}

        {tab === "foto" && (
          <PhotoUpload
            label="Foto del jugador"
            currentPath={fotoPath}
            disabled={!canEdit}
            onUpload={async (file) => {
              const res = await uploadFile(`/gestion/players/${id}/photo`, file);
              setFotoPath(res.foto_path);
              await load();
            }}
          />
        )}

        {tab === "acceso" && (
          <PlayerAccessPanel player={player} canEdit={canEdit} onUpdated={load} />
        )}
      </div>
    </div>
  );
}
