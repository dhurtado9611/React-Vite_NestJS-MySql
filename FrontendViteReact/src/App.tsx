import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Reservas from './pages/Reservas';
import Historial from './pages/Historial';
import CrearReservas from './pages/CrearReservas';
import HistorialInvitado from './pages/HistorialInvitado';
import RutaProtegidaInvitado from './components/RutaProtegidaInvitado';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/historial" element={<Historial />} />

        {/* Protegida por datosTurno */}
        <Route
          path="/crear-reservas"
          element={
            <RutaProtegidaInvitado>
              <CrearReservas />
            </RutaProtegidaInvitado>
          }
        />

        <Route path="/historial-invitado" element={<HistorialInvitado />} />
      </Routes>
    </Router>
  );
}

export default App;