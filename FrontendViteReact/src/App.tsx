// App.tsx
import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './Layouts/MainLayout'
import Home from './pages/Home'
import ReservarCliente from './pages/ReservarCliente'
import LoginModal from './components/LoginModal'

// Rutas de admin/invitado cargadas de forma perezosa: sacan del bundle
// inicial recharts, xlsx y el código de los paneles, que un visitante
// anónimo de la Home pública nunca necesita descargar.
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'))
const CrearReservasAdmin = lazy(() => import('./pages/CrearReservasAdmin'))
const ActividadAdmin = lazy(() => import('./pages/ActividadAdmin'))
const CrearReservasInvitado = lazy(() => import('./pages/CrearReservasInvitado'))
const ActividadInvitado = lazy(() => import('./pages/ActividadInvitado'))
const Marketplace = lazy(() => import('./pages/MarketplaceAdmin'))
const MarketplaceInvitado = lazy(() => import('./pages/MarketplaceInvitado'))

import RutaProtegidaInvitado from './components/RutaProtegidaInvitado'
import RutaProtegidaAdmin from './components/RutaProtegidaAdmin'

const RouteFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    Cargando...
  </div>
)

function App() {
  const handleCloseModal = () => {
    console.log('Modal cerrado')
  }

  return (
    <>
      <Router>
        <Suspense fallback={<RouteFallback />}>
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
        </Suspense>
      </Router>
    </>
  )
}

export default App