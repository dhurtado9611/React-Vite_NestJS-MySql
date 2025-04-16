// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Reservas from './pages/Reservas'
import Historial from './pages/Historial'
import CrearReservas from './pages/CrearReservas'
import HistorialInvitado from './pages/HistorialInvitado'
import RutaProtegidaInvitado from './components/RutaProtegidaInvitado'
import AdminDashboard from './admin/AdminDashboard'
import RutaProtegidaAdmin from './components/RutaProtegidaAdmin'
import MainLayout from './Layouts/MainLayout' // Nuevo layout con Sidebar
import LoginModal from './components/LoginModal'
import LogoLoader from "./components/LogoLoader";

function App() {
  // Función para manejar el cierre del modal
  const handleCloseModal = () => {
    console.log('Modal cerrado')
  }

  return (
    <Router>
      <Routes>
        {/* Layout principal con Sidebar y Navbar */}
        <Route element={<MainLayout />}>
        <LogoLoader />
          <Route path="/" element={<Home />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/historial" element={<Historial />} />
          <Route
            path="/crear-reservas"
            element={
              <RutaProtegidaInvitado>
                <CrearReservas />
              </RutaProtegidaInvitado>
            }
          />
          <Route path="/historial-invitado" element={<HistorialInvitado />} />
          <Route
            path="/admin"
            element={
              <RutaProtegidaAdmin>
                <AdminDashboard />
              </RutaProtegidaAdmin>
            }
          />
        </Route>

        {/* Login fuera del layout para que no muestre Sidebar */}
        <Route
          path="/login-modal"
          element={<LoginModal onClose={handleCloseModal} />}
        />
      </Routes>
    </Router>
  )
}

export default App