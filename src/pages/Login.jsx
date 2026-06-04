import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getDefaultGestionPath } from "../lib/gestionHelpers";
import logo from "../assets/logo.jpg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate(getDefaultGestionPath(user.role), { replace: true });
    }
  }, [loading, user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const sessionUser = await login(username.trim(), password);
      navigate(getDefaultGestionPath(sessionUser.role), { replace: true });
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-shell">
        <section className="login-card">
          <Link to="/" className="login-back">
            <ArrowLeft size={16} aria-hidden />
            Volver
          </Link>

          <header className="login-brand">
            <img src={logo} alt="" className="login-brand__logo" />
            <div>
              <h1>CV Berja</h1>
              <p>Acceso al panel</p>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="login-form-body">
            <div className="login-field">
              <label className="login-label" htmlFor="username">
                Usuario
              </label>
              <div className="login-input-wrap">
                <User size={18} className="login-input-icon" aria-hidden />
                <input
                  id="username"
                  type="text"
                  className="login-input"
                  placeholder="Tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="password">
                Contraseña
              </label>
              <div className="login-input-wrap">
                <Lock size={18} className="login-input-icon" aria-hidden />
                <input
                  id="password"
                  type="password"
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="login-submit-button" disabled={submitting}>
              {submitting ? "Entrando…" : "Entrar"}
            </button>

            <p className="login-demo">
              Prueba: usuario <strong>admin</strong> · contraseña{" "}
              <strong>ChangeMe123!</strong>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Login;
