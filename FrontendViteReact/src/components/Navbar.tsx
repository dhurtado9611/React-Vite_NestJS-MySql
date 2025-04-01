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

  useEffect(() => {
    const storedRol = localStorage.getItem('rol');
    setRol(storedRol);
  }, []);

  const handleClick = (path: string) => {
    setActive(path);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('datosTurno');
    navigate('/login');
  };

  if (token && !rol) return null;

  return (
    <>
      {/* Navbar para escritorio */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-20 bg-white/10 backdrop-blur-md border-r border-red-800 z-50 flex-col justify-between items-center py-4 shadow-xl">
        <div className="flex flex-col items-center gap-6 mt-4 text-white text-2xl w-full">
          <img src={Logo} alt="Logo" className="w-12 h-12 rounded-full border border-white" />

          {token && rol === 'admin' && (
            <>
              <Link to="/" onClick={() => handleClick('/')} className={`hover:scale-110 transition-transform ${active === '/' ? 'text-red-500 scale-110' : ''}`} title="Inicio">
                <FaHome />
              </Link>
              <Link to="/reservas" onClick={() => handleClick('/reservas')} className={`hover:scale-110 transition-transform ${active === '/reservas' ? 'text-red-500 scale-110' : ''}`} title="Reservas">
                <FaListAlt />
              </Link>
              <Link to="/historial" onClick={() => handleClick('/historial')} className={`hover:scale-110 transition-transform ${active === '/historial' ? 'text-red-500 scale-110' : ''}`} title="Historial">
                <FaHistory />
              </Link>
            </>
          )}

          {token && rol === 'invitado' && (
            <Link to="/crear-reservas" onClick={() => handleClick('/crear-reservas')} className={`hover:scale-110 transition-transform ${active === '/crear-reservas' ? 'text-red-500 scale-110' : ''}`} title="Crear Reserva">
              <FaPlus />
            </Link>
          )}
        </div>

        <div className="text-white text-xl mb-4">
          {token ? (
            <button onClick={handleLogout} className="hover:scale-110 transition-transform" title="Cerrar sesión">
              <FaSignOutAlt />
            </button>
          ) : (
            <Link to="/login" onClick={() => handleClick('/login')} title="Iniciar sesión" className={`hover:scale-110 transition-transform ${active === '/login' ? 'text-red-500 scale-110' : ''}`}>
              <FaSignInAlt />
            </Link>
          )}
        </div>
      </aside>

      {/* Navbar para móvil */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/10 backdrop-blur-md border-t border-red-800 z-50 flex justify-around items-center px-2 py-2 shadow-xl">
        {token && rol === 'admin' && (
          <>
            <Link to="/" onClick={() => handleClick('/')} className={`flex flex-col items-center text-white text-2xl transition-transform ${active === '/' ? 'scale-110 border-t-4 border-red-600' : 'hover:scale-105'}`}>
              <FaHome />
            </Link>
            <Link to="/reservas" onClick={() => handleClick('/reservas')} className={`flex flex-col items-center text-white text-2xl transition-transform ${active === '/reservas' ? 'scale-110 border-t-4 border-red-600' : 'hover:scale-105'}`}>
              <FaListAlt />
            </Link>
          </>
        )}

        {token && rol === 'invitado' && (
          <Link to="/crear-reservas" onClick={() => handleClick('/crear-reservas')} className={`flex flex-col items-center text-white text-2xl transition-transform ${active === '/crear-reservas' ? 'scale-110 border-t-4 border-red-600' : 'hover:scale-105'}`}>
            <FaPlus />
          </Link>
        )}

        <div className="bg-black p-2 rounded-full border-4 border-white transform scale-110 shadow-md">
          <img src={Logo} alt="Logo" className="w-14 h-14 object-contain" />
        </div>

        {token && rol === 'admin' && (
          <Link to="/historial" onClick={() => handleClick('/historial')} className={`flex flex-col items-center text-white text-2xl transition-transform ${active === '/historial' ? 'scale-110 border-t-4 border-red-600' : 'hover:scale-105'}`}>
            <FaHistory />
          </Link>
        )}

        <div className="text-white text-2xl">
          {token ? (
            <button onClick={handleLogout} className="hover:scale-105 transition-transform" title="Cerrar sesión">
              <FaSignOutAlt />
            </button>
          ) : (
            <Link to="/login" onClick={() => handleClick('/login')} className={`flex flex-col items-center transition-transform ${active === '/login' ? 'scale-110 border-t-4 border-red-600' : 'hover:scale-105'}`} title="Iniciar sesión">
              <FaSignInAlt className="text-white" />
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;