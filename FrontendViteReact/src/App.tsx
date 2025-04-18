// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CrearReservasAdmin from './pages/CrearReservasAdmin'
import ActividadAdmin from './pages/ActividadAdmin'
import ReservarCliente from './pages/ReservarCliente'
import CrearReservasInvitado from './pages/CrearReservasInvitado'
import ActividadInvitado from './pages/ActividadInvitado'
import RutaProtegidaInvitado from './components/RutaProtegidaInvitado'
import AdminDashboard from './admin/AdminDashboard'
import RutaProtegidaAdmin from './components/RutaProtegidaAdmin'
import MainLayout from './Layouts/MainLayout'
import LoginModal from './components/LoginModal'
import LogoLoader from './components/LogoLoader'

function App() {
  const handleCloseModal = () => {
    console.log('Modal cerrado')
  }

  return (
    <>
      <LogoLoader />
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/ReservarCliente" element={<ReservarCliente />} />

            <Route
              path="/LoginModal"
              element={
              <LoginModal onClose={handleCloseModal} />
              }
            />

            <Route
              path="/AdminDashboard"
              element={
                <RutaProtegidaAdmin>
                  <AdminDashboard />
                </RutaProtegidaAdmin>
              }
            />

            <Route 
              path="/CrearReservasAdmin"
              element={
                <RutaProtegidaAdmin>
                  <CrearReservasAdmin />
                </RutaProtegidaAdmin>
              }
            />

            <Route 
              path="/ActividadAdmin" 
              element={
                <RutaProtegidaAdmin>
                  <ActividadAdmin />
                </RutaProtegidaAdmin>
              }
            />

            <Route
              path="/CrearReservasInvitado"
              element={
                <RutaProtegidaInvitado>
                  <CrearReservasInvitado />
                </RutaProtegidaInvitado>
              }
            />

            <Route 
              path="/ActividadInvitado"
              element={
                <RutaProtegidaInvitado>
                  <ActividadInvitado />
                </RutaProtegidaInvitado>
              }
            />

          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App