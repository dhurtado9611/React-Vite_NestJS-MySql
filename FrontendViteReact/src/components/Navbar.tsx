import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, logout } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const token = getToken();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isOpen, setIsOpen] = useState(false);

  // Actualiza la hora cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Botón para abrir menú */}
      <button
        className="fixed top-4 left-4 z-50 bg-gray-800 text-white px-3 py-2 rounded-md shadow-lg hover:bg-gray-700 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Fondo para cerrar menú */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Menú lateral */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="fixed top-0 left-0 w-64 h-full bg-gray-900 text-white z-100 shadow-2xl flex flex-col justify-start p-6"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            {/* Hora */}
            <div className="text-3xl font-bold mb-8">
              <h2>Hora</h2>
              <h4>Actual</h4>
              {currentTime}
            </div>

            {/* Logo */}
            <Link
              to="/"
              className="text-xl font-semibold mb-6 hover:text-gray-400 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Reservas App
            </Link>

            {/* Links */}
            <ul className="flex flex-col gap-6">
              {!token ? (
                <li>
                  <Link
                    to="/login"
                    className="block text-lg hover:text-gray-400 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      to="/reservas"
                      className="block text-lg hover:text-gray-400 transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      Reservas
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/historial"
                      className="block text-lg hover:text-gray-400 transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      Historial
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-all"
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </>
              )}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
