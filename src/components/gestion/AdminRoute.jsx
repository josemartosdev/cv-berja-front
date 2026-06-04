import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isAdminRole } from "../../lib/gestionHelpers";

/** Solo super_admin y admin */
export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="gestion-muted">Cargando…</p>;
  }

  if (!isAdminRole(user?.role)) {
    return <Navigate to="/gestion" replace />;
  }

  return <Outlet />;
}
