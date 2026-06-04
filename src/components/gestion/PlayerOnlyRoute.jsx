import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDefaultGestionPath, isPlayerRole } from "../../lib/gestionHelpers";

export default function PlayerOnlyRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="gestion-muted">Cargando…</p>;
  }

  if (!isPlayerRole(user?.role)) {
    return <Navigate to="/gestion" replace />;
  }

  return <Outlet />;
}
