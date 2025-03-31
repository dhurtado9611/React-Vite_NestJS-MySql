import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaListAlt, FaHistory, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { getToken, logout } from '../services/authService';

const Navbar = () => {
  const token = getToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-16 bg-black/60 backdrop-blur-md border-r border-red-800 z-50 flex flex-col justify-between items-center py-4 shadow-lg">
      {/* Menú superior */}
      <div className="flex flex-col items-center gap-6 mt-6 text-white text-lg">
        {token && (
          <>
            <Link to="/" className="hover:text-red-500 transition" title="Inicio">
              <FaHome />
            </Link>
            <Link to="/reservas" className="hover:text-red-500 transition" title="Reservas">
              <FaListAlt />
            </Link>
            <Link to="/historial" className="hover:text-red-500 transition" title="Historial">
              <FaHistory />
            </Link>
          </>
        )}
        {!token && (
          <Link
            to="/login"
            className="hover:text-red-500 transition"
            title="Iniciar sesión"
          >
            <FaSignInAlt />
          </Link>
        )}
      </div>

      {/* Cerrar sesión si hay token */}
      {token && (
        <div className="mb-6 text-white">
          <button
            onClick={handleLogout}
            className="hover:text-red-500 transition text-lg"
            title="Cerrar sesión"
          >
            <FaSignOutAlt />
          </button>
        </div>
      )}
    </aside>
  );
};

export default Navbar;