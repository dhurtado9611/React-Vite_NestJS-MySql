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

  const handleLinkClick = () => {
    setIsExpanded(false);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen ${
        isExpanded ? 'w-48' : 'w-16'
      } bg-white/10 backdrop-blur-md border-r border-red-800 z-50 flex flex-col justify-between items-center py-4 shadow-xl transition-all duration-300`}
    >
      {/* Logo (siempre visible, despliega menú si hay sesión) */}
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

      {/* Navegación (solo con sesión activa y expandido) */}
      {token && isExpanded && (
        <div className="flex flex-col items-start gap-3 px-4 w-full">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="flex items-center gap-2 px-2 py-1 rounded-md bg-black/40 text-white text-sm hover:text-red-500 transition"
          >
            <FaHome /> <span>Inicio</span>
          </Link>
          <Link
            to="/reservas"
            onClick={handleLinkClick}
            className="flex items-center gap-2 px-2 py-1 rounded-md bg-black/40 text-white text-sm hover:text-red-500 transition"
          >
            <FaListAlt /> <span>Reservas</span>
          </Link>
          <Link
            to="/historial"
            onClick={handleLinkClick}
            className="flex items-center gap-2 px-2 py-1 rounded-md bg-black/40 text-white text-sm hover:text-red-500 transition"
          >
            <FaHistory /> <span>Historial</span>
          </Link>
        </div>
      )}

      {/* Iniciar o cerrar sesión (siempre visible) */}
      <div className="mb-4 text-white">
        {token ? (
          isExpanded ? (
            <button
              onClick={() => {
                handleLogout();
                setIsExpanded(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition"
              title="Cerrar sesión"
            >
              Cerrar sesión
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="hover:text-red-500 transition text-lg"
              title="Cerrar sesión"
            >
              <FaSignOutAlt />
            </button>
          )
        ) : (
          <Link
            to="/login"
            className="hover:text-red-500 transition text-lg"
            title="Iniciar sesión"
          >
            <FaSignInAlt />
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Navbar;