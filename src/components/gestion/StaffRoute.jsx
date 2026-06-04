import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDefaultGestionPath, isStaffRole } from "../../lib/gestionHelpers";

/** Bloquea jugadores del panel de gestión del club */
export default function StaffRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="gestion-muted">Cargando…</p>;
  }

  if (!isStaffRole(user?.role)) {
    return <Navigate to={getDefaultGestionPath(user?.role)} replace />;
  }

  return <Outlet />;
}
