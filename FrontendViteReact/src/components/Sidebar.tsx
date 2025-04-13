import { NavLink } from 'react-router-dom'
import {
  Home,
  CalendarDays,
  ListChecks,
  BarChart3,
} from 'lucide-react'
import logoSrc from '../assets/Logo-PNG.png' // Asegúrate que esté en esta ruta
import { useEffect, useState } from 'react'

const Sidebar = () => {
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    const storedUser = localStorage.getItem('username')
    if (storedUser) setUsername(storedUser)
  }, [])

  const links = [
    { to: '/', icon: <Home />, label: 'Inicio' },
    { to: '/reservas', icon: <CalendarDays />, label: 'Reservas' },
    { to: '/historial', icon: <ListChecks />, label: 'Historial' },
    { to: '/admin', icon: <BarChart3 />, label: 'Admin' },
  ]

  return (
    <div className="h-screen w-16 bg-black text-white flex flex-col justify-between items-center py-4 fixed left-0 top-0 z-50">
      {/* Logo o Inicial */}
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

      {/* Avatar inferior (solo letra si no hay imagen) */}
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-white text-black flex items-center justify-center font-bold text-sm">
        {username ? username.charAt(0).toUpperCase() : 'U'}
      </div>
    </div>
  )
}

export default Sidebar