import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SuperAdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="gestion-loading">
        <p>Cargando…</p>
      </div>
    );
  }

  if (user?.role !== "super_admin") {
    return <Navigate to="/gestion" replace />;
  }

  return <Outlet />;
}
