// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './Layouts/MainLayout'
import Home from './pages/Home'
import ReservarCliente from './pages/ReservarCliente'
import LoginModal from './components/LoginModal'

import AdminDashboard from './admin/AdminDashboard'
import CrearReservasAdmin from './pages/CrearReservasAdmin'
import ActividadAdmin from './pages/ActividadAdmin'
import CrearReservasInvitado from './pages/CrearReservasInvitado'
import ActividadInvitado from './pages/ActividadInvitado'
import Marketplace from './pages/Marketplace'
import MarketplaceInvitado from './pages/MarketplaceInvitado'


import RutaProtegidaInvitado from './components/RutaProtegidaInvitado'
import RutaProtegidaAdmin from './components/RutaProtegidaAdmin'

function App() {
  const handleCloseModal = () => {
    console.log('Modal cerrado')
  }

  return (
    <>
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
              path="/Marketplace" 
              element={
                <RutaProtegidaAdmin>
                  <Marketplace />
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

            <Route 
              path="/MarketplaceInvitado" 
              element={
                <RutaProtegidaInvitado>
                  <MarketplaceInvitado />
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