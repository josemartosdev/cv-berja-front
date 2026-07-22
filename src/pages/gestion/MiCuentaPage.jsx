import { useEffect, useState } from "react";
import { gestionApi } from "../../api/gestionApi";
import GestionPageHeader from "../../components/gestion/GestionPageHeader";
import GestionAlert from "../../components/gestion/GestionAlert";
import { useAuth } from "../../context/AuthContext";

const emptyForm = {
  nombre: "",
  username: "",
  email: "",
  password: "",
  currentPassword: "",
};

export default function MiCuentaPage() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await gestionApi.users.me();
        const current = data?.user ?? data;
        if (!active || !current) return;
        setForm((prev) => ({
          ...prev,
          nombre: current.nombre || "",
          username: current.username || "",
          email: current.email || "",
        }));
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const body = {
        nombre: form.nombre.trim(),
        username: form.username.trim().toLowerCase(),
        email: form.email.trim().toLowerCase(),
      };
      if (form.password.trim()) {
        body.password = form.password;
      }
      if (form.currentPassword.trim()) {
        body.currentPassword = form.currentPassword;
      }

      await gestionApi.users.updateMe(body, user?.id);
      await refresh();
      setForm((prev) => ({ ...prev, password: "", currentPassword: "" }));
      setSuccess("Perfil actualizado correctamente.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="gestion-page">
      <GestionPageHeader
        title="Mi cuenta"
        description="Actualiza los datos de acceso de tu perfil de administración."
      />

      <GestionAlert type="error">{error}</GestionAlert>
      <GestionAlert type="success">{success}</GestionAlert>

      <div className="gestion-panel">
        {loading ? (
          <p className="gestion-muted">Cargando perfil…</p>
        ) : (
          <form className="gestion-form gestion-form--grid" onSubmit={submit}>
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
              <span>Usuario</span>
              <input
                className="gestion-input"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </label>

            <label className="gestion-field gestion-field--full">
              <span>Email</span>
              <input
                type="email"
                className="gestion-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>

            <label className="gestion-field">
              <span>Nueva contraseña</span>
              <input
                type="password"
                autoComplete="new-password"
                className="gestion-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Opcional"
              />
            </label>

            <label className="gestion-field">
              <span>Contraseña actual</span>
              <input
                type="password"
                autoComplete="current-password"
                className="gestion-input"
                value={form.currentPassword}
                onChange={(e) =>
                  setForm({ ...form, currentPassword: e.target.value })
                }
                placeholder="Recomendada para confirmar cambios"
              />
            </label>

            <div className="gestion-form__footer gestion-field--full">
              <button
                type="submit"
                className="gestion-btn gestion-btn--primary"
                disabled={saving}
              >
                {saving ? "Guardando…" : "Guardar perfil"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
