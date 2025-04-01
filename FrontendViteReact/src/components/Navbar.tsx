
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaListAlt,
  FaHistory,
  FaSignOutAlt,
  FaSignInAlt,
  FaPlus,
  FaBars,
} from 'react-icons/fa';
import { getToken, logout } from '../services/authService';
import Logo from '../assets/Logo-PNG.png';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const token = getToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [rol, setRol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedRol = localStorage.getItem('rol');
    setRol(storedRol);
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

  const linkClass = (path: string) =>
    `hover:scale-110 transition-all ${
      active === path
        ? 'text-red-500 scale-125 bg-black/30 p-2 rounded-xl'
        : 'bg-black/20 p-2 rounded-xl'
    }`;

  if (loading) return null;

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 text-white text-3xl bg-black/40 p-2 rounded-full backdrop-blur-lg md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="fixed top-0 left-0 h-full w-64 bg-black/60 backdrop-blur-md border-r border-red-700 z-50 flex flex-col items-center pt-8 text-white text-2xl space-y-6 shadow-xl"
          >
            <img src={Logo} alt="Logo" className="w-16 h-16 rounded-full border border-white" />

            {token && rol === 'admin' && (
              <>
                <Link to="/" onClick={() => setIsOpen(false)} className={linkClass("/")}>
                  <FaHome />
                </Link>
                <Link to="/reservas" onClick={() => setIsOpen(false)} className={linkClass("/reservas")}>
                  <FaListAlt />
                </Link>
                <Link to="/historial" onClick={() => setIsOpen(false)} className={linkClass("/historial")}>
                  <FaHistory />
                </Link>
              </>
            )}

            {token && rol === 'invitado' && (
              <Link to="/crear-reservas" onClick={() => setIsOpen(false)} className={linkClass("/crear-reservas")}>
                <FaPlus />
              </Link>
            )}

            {token ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-red-500 bg-black/30 p-2 rounded-xl hover:scale-105 transition-transform"
              >
                <FaSignOutAlt />
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className={linkClass("/login")}>
                <FaSignInAlt />
              </Link>
            )}
          </motion.nav>
        )}
      </AnimatePresence>

      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-20 bg-white/10 backdrop-blur-md border-r border-red-800 z-50 flex-col justify-between items-center py-4 shadow-xl">
        <div className="flex flex-col items-center gap-6 mt-4 text-white text-2xl w-full">
          <img src={Logo} alt="Logo" className="w-12 h-12 rounded-full border border-white" />

          {token && rol === 'admin' && (
            <>
              <Link to="/" className={linkClass("/")} title="Inicio">
                <FaHome />
              </Link>
              <Link to="/reservas" className={linkClass("/reservas")} title="Reservas">
                <FaListAlt />
              </Link>
              <Link to="/historial" className={linkClass("/historial")} title="Historial">
                <FaHistory />
              </Link>
            </>
          )}

          {token && rol === 'invitado' && (
            <Link to="/crear-reservas" className={linkClass("/crear-reservas")} title="Crear Reserva">
              <FaPlus />
            </Link>
          )}
        </div>

        <div className="text-white text-xl mb-4">
          {token ? (
            <button onClick={handleLogout} className="hover:scale-110 transition-transform text-red-500 bg-black/30 p-2 rounded-xl">
              <FaSignOutAlt />
            </button>
          ) : (
            <Link to="/login" className={linkClass("/login")} title="Iniciar sesión">
              <FaSignInAlt />
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
