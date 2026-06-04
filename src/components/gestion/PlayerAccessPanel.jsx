import { useState } from "react";
import { gestionApi } from "../../api/gestionApi";
import GestionAlert from "./GestionAlert";

export default function PlayerAccessPanel({ player, onUpdated, canEdit }) {
  const [username, setUsername] = useState(player.username || "");
  const [password, setPassword] = useState("");
  const [portalActivo, setPortalActivo] = useState(!!player.portal_activo);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  if (!canEdit) {
    return (
      <dl className="gestion-dl">
        <div>
          <dt>Usuario portal</dt>
          <dd>{player.username || "—"}</dd>
        </div>
        <div>
          <dt>Acceso activo</dt>
          <dd>{player.portal_activo ? "Sí" : "No"}</dd>
        </div>
      </dl>
    );
  }

  const save = async (extra = {}) => {
    setSaving(true);
    setError("");
    setGeneratedPassword("");
    try {
      const res = await gestionApi.players.updateCredentials(player.id, {
        username: username.trim() || null,
        password: password || undefined,
        portalActivo,
        ...extra,
      });
      if (res.generated_password) {
        setGeneratedPassword(res.generated_password);
        setPassword("");
      }
      await onUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const suggestUsername = async () => {
    try {
      const { username: suggested } = await gestionApi.players.suggestUsername(player.id);
      setUsername(suggested);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="gestion-form">
      <p className="gestion-muted gestion-field--full">
        Las credenciales van en la ficha del jugador (no en Usuarios del admin). Ideal para cientos de
        menores: el club genera usuario y contraseña y se las entrega a la familia.
      </p>

      <label className="gestion-field gestion-field--full">
        <span>Usuario de acceso</span>
        <div className="gestion-inline-actions">
          <input
            className="gestion-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ej. lucgar42"
          />
          <button type="button" className="gestion-btn gestion-btn--ghost gestion-btn--sm" onClick={suggestUsername}>
            Sugerir
          </button>
        </div>
      </label>

      <label className="gestion-field gestion-field--full">
        <span>Nueva contraseña (opcional)</span>
        <input
          type="text"
          className="gestion-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
        />
      </label>

      <label className="gestion-field gestion-field--check gestion-field--full">
        <input
          type="checkbox"
          checked={portalActivo}
          onChange={(e) => setPortalActivo(e.target.checked)}
        />
        <span>Permitir acceso al portal del jugador</span>
      </label>

      {player.tiene_password ? (
        <p className="gestion-muted">Ya tiene contraseña configurada.</p>
      ) : (
        <p className="gestion-muted">Aún sin contraseña.</p>
      )}

      {generatedPassword && (
        <p className="gestion-alert gestion-alert--success">
          Contraseña generada (cópiala ahora): <strong>{generatedPassword}</strong>
        </p>
      )}

      <GestionAlert type="error">{error}</GestionAlert>

      <div className="gestion-form__footer">
        <button
          type="button"
          className="gestion-btn gestion-btn--ghost"
          disabled={saving}
          onClick={() => save({ generatePassword: true, generateUsername: !username.trim() })}
        >
          Generar usuario y contraseña
        </button>
        <button type="button" className="gestion-btn gestion-btn--primary" disabled={saving} onClick={() => save()}>
          {saving ? "Guardando…" : "Guardar acceso"}
        </button>
      </div>
    </div>
  );
}
