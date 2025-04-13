import { NavLink } from 'react-router-dom'
import {
  Home,
  CalendarPlus,
  ListChecks,
  BarChart3
} from 'lucide-react'
import logoSrc from '../assets/Logo-PNG.png'
import { useEffect, useState } from 'react'

const Sidebar = () => {
  const [username, setUsername] = useState<string>('')
  const [rol, setRol] = useState<string>('')

  useEffect(() => {
    const storedUser = localStorage.getItem('username')
    const storedRol = localStorage.getItem('rol') // 🔑 El rol debe estar en localStorage
    if (storedUser) setUsername(storedUser)
    if (storedRol) setRol(storedRol)
  }, [])

  // 🧭 Rutas por rol
  const links = rol === 'admin'
    ? [
        { to: '/', icon: <Home />, label: 'Inicio' },
        { to: '/reservas', icon: <CalendarPlus />, label: 'Reservas' },
        { to: '/historial', icon: <ListChecks />, label: 'Historial' },
        { to: '/admin', icon: <BarChart3 />, label: 'Admin' },
      ]
    : rol === 'invitado'
    ? [
        { to: '/', icon: <Home />, label: 'Inicio' },
        { to: '/crear-reservas', icon: <CalendarPlus />, label: 'Crear Reserva' },
        { to: '/historial-invitado', icon: <ListChecks />, label: 'Historial' },
      ]
    : [] // Si no hay rol definido

  return (
    <div className="h-screen w-16 bg-black text-white flex flex-col justify-between items-center py-4 fixed left-0 top-0 z-50">
      {/* Logo superior */}
      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
        <img
          src={logoSrc}
          alt="Logo"
          className="w-full h-full object-contain p-1"
        />
      </div>

      {/* Navegación */}
      <div className="flex flex-col gap-6 mt-6">
        {links.map((link, index) => (
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
      </div>

      {/* Avatar inferior */}
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-white text-black flex items-center justify-center font-bold text-sm">
        {username ? username.charAt(0).toUpperCase() : 'U'}
      </div>
    </div>
  )
}

export default Sidebar