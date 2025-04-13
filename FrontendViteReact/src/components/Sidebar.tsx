import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home,
  CalendarPlus,
  ListChecks,
  BarChart3,
  LogIn
} from 'lucide-react'
import logoSrc from '../assets/Logo-PNG.png'
import { useEffect, useState } from 'react'

const Sidebar = () => {
  const [username, setUsername] = useState<string | null>(null)
  const [rol, setRol] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('username')
    const storedRol = localStorage.getItem('rol')
    setUsername(storedUser)
    setRol(storedRol)
  }, [])

  const links =
    rol === 'admin'
      ? [
          { to: '/', icon: <Home />, label: 'Inicio' },
          { to: '/reservas', icon: <CalendarPlus />, label: 'Reservas' },
          { to: '/historial', icon: <ListChecks />, label: 'Historial' },
          { to: '/admin', icon: <BarChart3 />, label: 'Admin' }
        ]
      : rol === 'invitado'
      ? [
          { to: '/', icon: <Home />, label: 'Inicio' },
          { to: '/crear-reservas', icon: <CalendarPlus />, label: 'Crear Reserva' },
          { to: '/historial-invitado', icon: <ListChecks />, label: 'Historial' }
        ]
      : []

  return (
    <div className="h-screen w-16 bg-black text-white flex flex-col justify-between items-center py-4 fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
        <img
          src={logoSrc}
          alt="Logo"
          className="w-full h-full object-contain p-1"
        />
      </div>

      {/* Navegación (solo si hay sesión) */}
      <div className="flex flex-col gap-6 mt-6">
        {username &&
          links.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              className={({ isActive }) =>
                `w-6 h-6 cursor-pointer ${
                  isActive ? 'text-blue-500' : 'text-white'
                } hover:text-blue-400`
              }
              title={link.label}
            >
              {link.icon}
            </NavLink>
          ))}

        {/* Botón de login si no hay sesión */}
        {!username && (
          <button
            onClick={() => navigate('/login')}
            title="Iniciar Sesión"
            className="w-6 h-6 hover:text-yellow-400"
          >
            <LogIn />
          </button>
        )}
      </div>

      {/* Avatar inferior si hay sesión */}
      {username && (
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-white text-black flex items-center justify-center font-bold text-sm">
          {username.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}

export default Sidebar