// src/components/Sidebar.tsx
import { NavLink } from 'react-router-dom'
import {
  Home,
  CalendarDays,
  ListChecks,
  BarChart3,
  Bell,
  UserCircle
} from 'lucide-react'

const Sidebar = () => {
  const links = [
    { to: '/', icon: <Home />, label: 'Inicio' },
    { to: '/reservas', icon: <CalendarDays />, label: 'Reservas' },
    { to: '/historial', icon: <ListChecks />, label: 'Historial' },
    { to: '/admin', icon: <BarChart3 />, label: 'Admin' },
  ]

  return (
    <div className="h-screen w-16 bg-black text-white flex flex-col justify-between items-center py-4 fixed left-0 top-0 z-50">
      {/* Iconos de navegación */}
      <div className="flex flex-col gap-6">
        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-xl font-bold">
          S
        </div>
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            className={({ isActive }) =>
              `w-6 h-6 cursor-pointer ${
                isActive ? 'text-yellow-400' : 'text-white'
              } hover:text-yellow-400`
            }
            title={link.label}
          >
            {link.icon}
          </NavLink>
        ))}

        <div className="relative">
          <Bell className="w-6 h-6 hover:text-yellow-400 cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </div>
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
        <img
          src="https://i.pravatar.cc/40"
          alt="user"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

export default Sidebar