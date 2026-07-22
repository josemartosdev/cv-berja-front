import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shield,
  Wallet,
  UserCircle,
  ClipboardList,
  Newspaper,
  Tag,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getGestionNavItems, ROLE_LABELS } from "../lib/gestionHelpers";
import logo from "../assets/logo.jpg";

const ICONS = {
  LayoutDashboard,
  Users,
  Shield,
  Wallet,
  UserCircle,
  ClipboardList,
  Newspaper,
  Tag,
};

export default function GestionLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items = getGestionNavItems(user?.role).map((item) => ({
    ...item,
    icon: ICONS[item.icon] ?? LayoutDashboard,
  }));

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="gestion-shell">
      <button
        type="button"
        className="gestion-sidebar-toggle"
        aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={sidebarOpen}
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        <span>{sidebarOpen ? "Cerrar menú" : "Menú"}</span>
      </button>

      <aside
        className={`gestion-sidebar${sidebarOpen ? " gestion-sidebar--open" : ""}`}
      >
        <div className="gestion-sidebar__brand">
          <img src={logo} alt="" className="gestion-sidebar__logo" />
          <div>
            <span className="gestion-sidebar__eyebrow">CV Berja</span>
            <strong>
              {user?.role === "jugador"
                ? "Portal jugador"
                : user?.role === "entrenador"
                  ? "Panel entrenador"
                  : "Gestión interna"}
            </strong>
          </div>
        </div>
        <nav className="gestion-nav">
          {items.map(({ to, label, end, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "gestion-nav__link gestion-nav__link--active"
                  : "gestion-nav__link"
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="gestion-sidebar__footer">
          <p className="gestion-user">
            <strong>{user?.nombre}</strong>
            <span>@{user?.username}</span>
            <span className="gestion-user__role">
              {ROLE_LABELS?.[user?.role] ?? user?.role}
            </span>
          </p>
          <button
            type="button"
            className="gestion-sidebar__btn"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
          <a href="/" className="gestion-sidebar__link">
            <ExternalLink size={14} />
            Web pública
          </a>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="gestion-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="gestion-main">
        <Outlet />
      </main>
    </div>
  );
}
