import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaListAlt,
  FaHistory,
  FaSignInAlt,
  FaSignOutAlt,
} from 'react-icons/fa';
import { getToken, logout } from '../services/authService';
import Logo from '../assets/Logo-PNG.png';

const Navbar = () => {
  const token = getToken();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    if (token) setIsExpanded(!isExpanded);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen ${
        isExpanded ? 'w-48' : 'w-16'
      } bg-white/10 backdrop-blur-md border-r border-red-800 z-50 flex flex-col justify-between items-center py-4 shadow-xl transition-all duration-300`}
    >
      {/* Logo (siempre visible, actúa como botón de expansión si hay sesión) */}
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={toggleMenu}
      >
        <img
          src={Logo}
          alt="Logo"
          className="w-10 h-10 rounded-full border border-white mb-4 hover:scale-105 transition"
          title={token ? 'Menú' : ''}
        />
      </div>

      {/* Navegación (solo si hay sesión y está expandido) */}
      {token && isExpanded && (
        <div className="flex flex-col items-start text-white text-sm gap-5 px-4 w-full">
          <Link to="/" className="flex items-center gap-2 hover:text-red-500 transition">
            <FaHome /> <span>Inicio</span>
          </Link>
          <Link to="/reservas" className="flex items-center gap-2 hover:text-red-500 transition">
            <FaListAlt /> <span>Reservas</span>
          </Link>
          <Link to="/historial" className="flex items-center gap-2 hover:text-red-500 transition">
            <FaHistory /> <span>Historial</span>
          </Link>
        </div>
      )}

      {/* Iniciar o cerrar sesión (siempre visible) */}
      <div className="mb-4 text-white">
        {token ? (
          <button
            onClick={handleLogout}
            className="hover:text-red-500 transition text-lg"
            title="Cerrar sesión"
          >
            <FaSignOutAlt />
          </button>
        ) : (
          <Link to="/login" className="hover:text-red-500 transition text-lg" title="Iniciar sesión">
            <FaSignInAlt />
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Navbar;