import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaListAlt,
  FaHistory,
  FaSignOutAlt,
  FaSignInAlt,
  FaPlus,
} from 'react-icons/fa';
import { getToken, logout } from '../services/authService';
import Logo from '../assets/Logo-PNG.png';

const Navbar = () => {
  const token = getToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [rol, setRol] = useState<string | null>(null);
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRol = localStorage.getItem('rol');
    const storedNombre = localStorage.getItem('nombre');
    if (storedRol) {
      setRol(storedRol);
    }
    if (storedNombre) {
      setNombreUsuario(storedNombre);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('datosTurno');
    navigate('/login');
  };

  if (loading || !rol) return null;

  const linkClass = (path: string) =>
    `hover:scale-110 transition-transform p-2 rounded-lg bg-white/20 backdrop-blur-sm ${active === path ? 'text-red-500 scale-125' : 'text-white'}`;

  return (
    <>
      {/* Navbar para escritorio */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-20 bg-white/10 backdrop-blur-md border-r border-red-800 z-50 flex-col justify-between items-center py-4 shadow-xl">
        <div className="flex flex-col items-center gap-6 mt-4 text-white text-2xl w-full">
          <img src={Logo} alt="Logo" className="w-12 h-12 rounded-full border border-white" />
          {nombreUsuario && <span className="text-xs text-center text-white px-1">{nombreUsuario}</span>}

          {token && rol === 'admin' && (
            <>
              <Link to="/" className={linkClass('/')} title="Inicio">
                <FaHome />
              </Link>
              <Link to="/reservas" className={linkClass('/reservas')} title="Reservas">
                <FaListAlt />
              </Link>
              <Link to="/historial" className={linkClass('/historial')} title="Historial">
                <FaHistory />
              </Link>
            </>
          )}

          {token && rol === 'invitado' && !['admin'].includes(rol) && (
            <Link to="/crear-reservas" className={linkClass('/crear-reservas')} title="Crear Reserva">
              <FaPlus />
            </Link>
          )}
        </div>

        <div className="text-white text-xl mb-4">
          {token ? (
            <button onClick={handleLogout} className="hover:scale-110 transition-transform bg-white/20 backdrop-blur-sm p-2 rounded-lg" title="Cerrar sesión">
              <FaSignOutAlt />
            </button>
          ) : (
            <Link to="/login" className={linkClass('/login')} title="Iniciar sesión">
              <FaSignInAlt />
            </Link>
          )}
        </div>
      </aside>

      {/* Navbar para móvil */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/10 backdrop-blur-md border-t border-red-800 z-50 flex justify-around items-center px-2 py-2 shadow-xl">
        {token && rol === 'admin' && (
          <>
            <Link to="/" className={linkClass('/')} title="Inicio">
              <FaHome />
            </Link>
            <Link to="/reservas" className={linkClass('/reservas')} title="Reservas">
              <FaListAlt />
            </Link>
          </>
        )}

        {token && rol === 'invitado' && !['admin'].includes(rol) && (
          <Link to="/crear-reservas" className={linkClass('/crear-reservas')} title="Crear Reserva">
            <FaPlus />
          </Link>
        )}

        <div className="flex flex-col items-center">
          <div className="bg-black p-2 rounded-full border-4 border-white transform scale-110 shadow-md">
            <img src={Logo} alt="Logo" className="w-14 h-14 object-contain" />
          </div>
          {nombreUsuario && <span className="text-xs text-white mt-1 text-center">{nombreUsuario}</span>}
        </div>

        {token && rol === 'admin' && (
          <Link to="/historial" className={linkClass('/historial')} title="Historial">
            <FaHistory />
          </Link>
        )}

        <div className="text-white text-2xl">
          {token ? (
            <button onClick={handleLogout} className="hover:scale-105 transition-transform bg-white/20 backdrop-blur-sm p-2 rounded-lg" title="Cerrar sesión">
              <FaSignOutAlt />
            </button>
          ) : (
            <Link to="/login" className={linkClass('/login')} title="Iniciar sesión">
              <FaSignInAlt className="text-white" />
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;