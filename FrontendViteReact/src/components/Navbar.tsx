import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, logout } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const token = getToken();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isOpen, setIsOpen] = useState(false);

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
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
            className="fixed top-0 left-0 w-64 h-full bg-gray-800/90 backdrop-blur-lg text-white z-50 shadow-2xl flex flex-col justify-between p-6"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <div>
              {/* Hora */}
              <div className="mb-10 text-center border-b border-gray-700 pb-4">
                <h2 className="text-2xl font-bold">Hora Actual</h2>
                <p className="text-lg mt-1 text-gray-300">{currentTime}</p>
              </div>

              {/* Logo y enlaces */}
              <div className="space-y-4">
                <Link
                  to="/"
                  className="block text-xl font-semibold hover:text-gray-400 transition-all text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Reservas App
                </Link>

                <ul className="flex flex-col gap-4 mt-6">
                  {!token ? (
                    <li>
                      <Link
                        to="/login"
                        className="block text-lg text-center hover:text-gray-400 transition-all"
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
                          className="block text-lg text-center hover:text-gray-400 transition-all"
                          onClick={() => setIsOpen(false)}
                        >
                          Reservas
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/historial"
                          className="block text-lg text-center hover:text-gray-400 transition-all"
                          onClick={() => setIsOpen(false)}
                        >
                          Historial
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Botón cerrar sesión */}
            {token && (
              <div className="mt-6">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-all"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
