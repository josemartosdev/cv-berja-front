import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/logo.jpg";

const links = [
  { to: "/", label: "Inicio", end: true },
  { to: "/equipos", label: "Equipos" },
  { to: "/partidos", label: "Partidos" },
  { to: "/en-directo", label: "En Directo" },
  { to: "/historia", label: "Historia" },
  { to: "/patrocinadores", label: "Patrocinadores" },
  { to: "/resultados", label: "Resultados" },
];

function Cabecera() {
  const [open, setOpen] = useState(false);

  return (
    <header className="cabecera">
      <div className="cabecera__inner">
        <Link to="/" className="cabecera__brand">
          <div className="cabecera__badge">
            <img src={logo} alt="Club Voleibol Berja" />
          </div>
          <div className="cabecera__brand-text">
            <span className="cabecera__title">CV Berja</span>
            <span className="cabecera__tagline">Voleibol virgitano</span>
          </div>
        </Link>

        <nav className={`cabecera__nav${open ? " cabecera__nav--open" : ""}`}>
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? "nav__btn nav__btn--active" : "nav__btn"
              }
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/login"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "nav__btn nav__btn--active nav__btn--login"
                : "nav__btn nav__btn--login"
            }
          >
            Iniciar sesión
          </NavLink>
        </nav>

        <div className="cabecera__actions">
          <Link to="/login" className="cabecera__cta">
            Iniciar sesión
          </Link>
          <button
            className="cabecera__hamburger"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <div className="cabecera__overlay" onClick={() => setOpen(false)} />
      )}
    </header>
  );
}

export default Cabecera;
