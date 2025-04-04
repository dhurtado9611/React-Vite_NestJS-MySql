import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Reservas from './pages/Reservas';
import Historial from './pages/Historial';
import CrearReservas from './pages/CrearReservas';
import HistorialInvitado from './pages/HistorialInvitado';
import RutaProtegidaInvitado from './components/RutaProtegidaInvitado';
import AdminDashboard from './pages/AdminDashboard';
import RutaProtegidaAdmin from './components/RutaProtegidaAdmin';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Reservas y navegación general */}
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/historial" element={<Historial />} />

        {/* Rutas protegidas por turno */}
        <Route
          path="/crear-reservas"
          element={
            <RutaProtegidaInvitado>
              <CrearReservas />
            </RutaProtegidaInvitado>
          }
        />
        <Route path="/historial-invitado" element={<HistorialInvitado />} />

        {/* Ruta protegida para administradores */}
        <Route
          path="/admin"
          element={
            <RutaProtegidaAdmin>
              <AdminDashboard />
            </RutaProtegidaAdmin>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;