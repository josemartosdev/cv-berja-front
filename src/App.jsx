import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import EquiposPage from "./pages/EquiposPage";
import PartidosPage from "./pages/PartidosPage";
import ResultadosPage from "./pages/ResultadosPage";
import CalendarioPage from "./pages/CalendarioPage";
import EnDirectoPage from "./pages/EnDirectoPage";
import Login from "./pages/Login";
import PatrocinadoresPage from "./pages/PatrocinadoresPage";
import GestionLayout from "./layouts/GestionLayout";
import ProtectedRoute from "./components/gestion/ProtectedRoute";
import Dashboard from "./pages/gestion/Dashboard";
import JugadoresGestionPage from "./pages/gestion/JugadoresPage";
import JugadorDetallePage from "./pages/gestion/JugadorDetallePage";
import EquiposGestionPage from "./pages/gestion/EquiposPage";
import ContabilidadPage from "./pages/gestion/ContabilidadPage";
import UsuariosPage from "./pages/gestion/UsuariosPage";
import EntrenadoresPage from "./pages/gestion/EntrenadoresPage";
import EntrenadorDetallePage from "./pages/gestion/EntrenadorDetallePage";
import SuperAdminRoute from "./components/gestion/SuperAdminRoute";
import AdminRoute from "./components/gestion/AdminRoute";
import StaffRoute from "./components/gestion/StaffRoute";
import PlayerOnlyRoute from "./components/gestion/PlayerOnlyRoute";
import MiFichaPage from "./pages/gestion/MiFichaPage";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <Routes>
        {/* Web pública — sin cambios de estructura */}
        <Route path="/" element={<Home />} />
        <Route path="/historia" element={<History />} />
        <Route path="/patrocinadores" element={<PatrocinadoresPage />} />
        <Route path="/equipos" element={<EquiposPage />} />
        <Route path="/partidos" element={<PartidosPage />} />
        <Route path="/resultados" element={<ResultadosPage />} />
        <Route path="/en-directo" element={<EnDirectoPage />} />
        <Route path="/calendario" element={<CalendarioPage />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/gestion" element={<GestionLayout />}>
            <Route element={<PlayerOnlyRoute />}>
              <Route path="mi-ficha" element={<MiFichaPage />} />
            </Route>
            <Route element={<StaffRoute />}>
              <Route index element={<Dashboard />} />
              <Route path="jugadores" element={<JugadoresGestionPage />} />
              <Route path="jugadores/:id" element={<JugadorDetallePage />} />
              <Route path="equipos" element={<EquiposGestionPage />} />
              <Route path="mi-perfil" element={<EntrenadorDetallePage />} />
              <Route element={<AdminRoute />}>
                <Route path="entrenadores" element={<EntrenadoresPage />} />
                <Route
                  path="entrenadores/:id"
                  element={<EntrenadorDetallePage />}
                />
              </Route>
              <Route path="contabilidad" element={<ContabilidadPage />} />
              <Route element={<SuperAdminRoute />}>
                <Route path="usuarios" element={<UsuariosPage />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route
          path="/mi-ficha"
          element={<Navigate to="/gestion/mi-ficha" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
