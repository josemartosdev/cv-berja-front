import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCircle,
  HeartPulse,
  ShieldCheck,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { portalApi } from "../../api/portalApi";
import { useAuth } from "../../context/AuthContext";
import { mediaUrl } from "../../lib/mediaUrl";
import { formatDate } from "../../lib/gestionHelpers";
import GestionAlert from "../../components/gestion/GestionAlert";

function calcAge(birthDate) {
  if (!birthDate) return null;
  const d = new Date(birthDate);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
}

export default function MiFichaPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await portalApi.me());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const profile = data?.profile;
  const team = data?.team;
  const coach = data?.coach;
  const medical = data?.medical ?? [];
  const guardians = data?.guardians ?? [];
  const stats = data?.stats ?? {};
  const age = useMemo(() => calcAge(profile?.fecha_nacimiento), [profile?.fecha_nacimiento]);

  const changePassword = async (e) => {
    e.preventDefault();
    if (!password) return;
    setSaving(true);
    try {
      await portalApi.updateMe({ password });
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="gestion-page">
        <p className="gestion-muted">Cargando tu ficha…</p>
      </div>
    );
  }

  const kpis = [
    {
      icon: Users,
      label: "Mi equipo",
      value: team?.nombre || "Sin equipo",
      hint: team ? `${team.categoria} · ${team.temporada}` : "Pendiente de asignación",
      tone: "dark",
    },
    {
      icon: UserCircle,
      label: "Entrenador/a",
      value: coach?.nombre_completo || "—",
      hint: coach?.licencia ? `Lic. ${coach.licencia}` : "Sin asignar",
      tone: "red",
    },
    {
      icon: HeartPulse,
      label: "Fichas médicas",
      value: stats.temporadas_medico ?? 0,
      hint: stats.apto_actual ? "Apto en última temporada" : "Revisión pendiente",
      tone: "green",
    },
    {
      icon: ShieldCheck,
      label: "Tutores",
      value: stats.tutores ?? 0,
      hint: "Contactos de familia",
      tone: "amber",
    },
  ];

  return (
    <div className="gestion-page gestion-page--dashboard">
      <div className="gestion-dashboard-hero">
        <div className="gestion-dashboard-hero__profile">
          {profile?.foto_path ? (
            <img src={mediaUrl(profile.foto_path)} alt="" className="gestion-dashboard-hero__avatar" />
          ) : (
            <span className="gestion-dashboard-hero__avatar gestion-dashboard-hero__avatar--empty">
              {(profile?.nombre?.[0] || "") + (profile?.apellidos?.[0] || "")}
            </span>
          )}
          <div>
            <p className="gestion-page__kicker">Portal del jugador</p>
            <h1>
              {profile ? `${profile.nombre} ${profile.apellidos}` : user?.nombre}
            </h1>
            <p>
              @{profile?.username || user?.username}
              {age !== null && <> · {age} años</>}
              {team && (
                <>
                  {" "}
                  · {team.nombre} ({team.categoria})
                </>
              )}
            </p>
            <div className="gestion-dashboard-hero__tags">
              <span className={`gestion-badge${profile?.activo ? "" : " gestion-badge--muted"}`}>
                {profile?.activo ? "Ficha activa" : "Baja"}
              </span>
              {stats.apto_actual !== null && stats.apto_actual !== undefined && (
                <span className={`gestion-badge${stats.apto_actual ? "" : " gestion-badge--muted"}`}>
                  {stats.apto_actual ? "Apto médico" : "No apto"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <GestionAlert type="error">
        {error && (
          <>
            <AlertCircle size={16} /> {error}
          </>
        )}
      </GestionAlert>

      <div className="gestion-kpi-grid">
        {kpis.map(({ icon: Icon, label, value, hint, tone }) => (
          <div key={label} className={`gestion-kpi gestion-kpi--${tone} gestion-kpi--static`}>
            <span className="gestion-kpi__icon">
              <Icon size={22} />
            </span>
            <div>
              <span className="gestion-kpi__label">{label}</span>
              <strong>{value}</strong>
              <span className="gestion-kpi__hint">{hint}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="gestion-subtitle gestion-subtitle--section">Tu red en el club</h2>
      <div className="gestion-relations-grid">
        <div className="gestion-panel gestion-panel--card">
          <h3 className="gestion-panel__title">
            <Users size={18} /> Mi equipo
          </h3>
          {team ? (
            <>
              <div className="gestion-table__person">
                {team.foto_path ? (
                  <img src={mediaUrl(team.foto_path)} alt="" className="gestion-avatar gestion-avatar--sm" />
                ) : (
                  <span className="gestion-avatar gestion-avatar--sm gestion-avatar--empty" />
                )}
                <div>
                  <strong>{team.nombre}</strong>
                  <span className="gestion-table__sub">
                    {team.categoria} · {team.temporada}
                  </span>
                </div>
              </div>
              <p className="gestion-muted gestion-panel__foot">
                Estás vinculado a esta plantilla. El club gestiona tu acceso y la ficha médica.
              </p>
            </>
          ) : (
            <p className="gestion-muted">Aún no tienes equipo asignado.</p>
          )}
        </div>

        <div className="gestion-panel gestion-panel--card">
          <h3 className="gestion-panel__title">
            <UserCircle size={18} /> Mi entrenador/a
          </h3>
          {coach ? (
            <>
              <div className="gestion-table__person">
                {coach.foto_path ? (
                  <img src={mediaUrl(coach.foto_path)} alt="" className="gestion-avatar gestion-avatar--sm" />
                ) : (
                  <span className="gestion-avatar gestion-avatar--sm gestion-avatar--empty" />
                )}
                <div>
                  <strong>{coach.nombre_completo}</strong>
                  {coach.licencia && <span className="gestion-table__sub">Lic. {coach.licencia}</span>}
                </div>
              </div>
              <ul className="gestion-contact-mini">
                {coach.telefono && (
                  <li>
                    <Phone size={14} /> {coach.telefono}
                  </li>
                )}
                {coach.email && (
                  <li>
                    <Mail size={14} /> {coach.email}
                  </li>
                )}
              </ul>
            </>
          ) : (
            <p className="gestion-muted">Tu equipo aún no tiene entrenador asignado.</p>
          )}
        </div>

        <div className="gestion-panel gestion-panel--card gestion-panel--wide">
          <h3 className="gestion-panel__title">
            <ShieldCheck size={18} /> Tutores y contactos
          </h3>
          {guardians.length > 0 ? (
            <div className="gestion-guardian-grid">
              {guardians.map((g) => (
                <div key={g.id} className="gestion-guardian-card">
                  <strong>{g.nombre}</strong>
                  <span className="gestion-badge gestion-badge--soft">{g.relacion || "Contacto"}</span>
                  {g.telefono && (
                    <span className="gestion-guardian-card__line">
                      <Phone size={12} /> {g.telefono}
                    </span>
                  )}
                  {g.email && (
                    <span className="gestion-guardian-card__line">
                      <Mail size={12} /> {g.email}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="gestion-muted">
              No hay tutores registrados. Para menores, la familia puede pedir al club que los añada.
            </p>
          )}
        </div>
      </div>

      <div className="gestion-charts-grid gestion-charts-grid--single">
        <div className="gestion-panel">
          <h2 className="gestion-subtitle">
            <Calendar size={18} /> Datos personales
          </h2>
          <dl className="gestion-dl gestion-dl--grid">
            <div>
              <dt>Nacimiento</dt>
              <dd>
                {formatDate(profile?.fecha_nacimiento)}
                {age !== null && ` (${age} años)`}
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{profile?.email || "—"}</dd>
            </div>
            <div>
              <dt>Teléfono</dt>
              <dd>{profile?.telefono || "—"}</dd>
            </div>
            {profile?.dni && (
              <div>
                <dt>DNI / NIE</dt>
                <dd>{profile.dni}</dd>
              </div>
            )}
            {profile?.notas && (
              <div className="gestion-dl--full">
                <dt>Notas del club</dt>
                <dd>{profile.notas}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="gestion-panel">
        <h2 className="gestion-subtitle">
          <HeartPulse size={18} /> Ficha médica por temporada
        </h2>
        {medical.length === 0 ? (
          <p className="gestion-muted">El club aún no ha registrado revisiones médicas.</p>
        ) : (
          <ul className="gestion-medical-list">
            {medical.map((rec) => (
              <li key={rec.id} className="gestion-medical-item">
                <div className="gestion-medical-item__head">
                  <strong>{rec.temporada}</strong>
                  <span className={`gestion-badge${rec.apto_medico ? "" : " gestion-badge--muted"}`}>
                    {rec.apto_medico ? "Apto" : "No apto"}
                  </span>
                </div>
                {rec.fecha_revision && <p>Revisión: {formatDate(rec.fecha_revision)}</p>}
                {rec.alergias && <p>Alergias: {rec.alergias}</p>}
                {rec.medicacion && <p>Medicación: {rec.medicacion}</p>}
                {rec.lesiones && <p>Lesiones: {rec.lesiones}</p>}
                {rec.observaciones && <p>Observaciones: {rec.observaciones}</p>}
                {rec.certificado_path && (
                  <a href={mediaUrl(rec.certificado_path)} target="_blank" rel="noreferrer" className="gestion-link">
                    Ver certificado
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="gestion-panel">
        <h2 className="gestion-subtitle">Seguridad de la cuenta</h2>
        <p className="gestion-muted">Cambia la contraseña que te dio el club. No la compartas con otras personas.</p>
        <form className="gestion-form gestion-form--inline" onSubmit={changePassword}>
          <label className="gestion-field">
            <span>Nueva contraseña</span>
            <input
              type="password"
              className="gestion-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </label>
          <button type="submit" className="gestion-btn gestion-btn--primary" disabled={saving}>
            {saving ? "Guardando…" : "Actualizar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
