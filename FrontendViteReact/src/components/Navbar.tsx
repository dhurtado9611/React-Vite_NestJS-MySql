import { Link, useLocation } from 'react-router-dom';
import { FaClock, FaListAlt, FaPlusCircle, FaPowerOff, FaSignInAlt, FaUser } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [rol, setRol] = useState('');

  useEffect(() => {
    const storedRol = localStorage.getItem('rol');
    if (storedRol) setRol(storedRol);
  }, []);

  const linkClass = (path: string) =>
    `text-white text-xl ${location.pathname === path ? 'text-yellow-300' : ''}`;

  return (
    <nav className="bg-gray-800 px-4 py-2 flex justify-between items-center">
      <div className="hidden md:flex gap-6">
        {rol === 'admin' && (
          <>
            <Link to="/admin" className={linkClass('/admin')} title="Dashboard">
              <FaListAlt />
            </Link>
          </>
        )}
        <Link to="/reservas" className={linkClass('/reservas')} title="Crear Reserva">
          <FaPlusCircle />
        </Link>
        <Link to="/historial" className={linkClass('/historial')} title="Historial">
          <FaClock />
        </Link>
        <Link to="/turno" className={linkClass('/turno')} title="Turno">
          <FaUser />
        </Link>
        <Link to="/login" className={linkClass('/login')} title="Login">
          <FaSignInAlt />
        </Link>
        <Link to="/logout" className={linkClass('/logout')} title="Salir">
          <FaPowerOff />
        </Link>
      </div>
      <div className="md:hidden flex gap-4">
        {rol === 'admin' && (
          <Link to="/admin" className={linkClass('/admin')} title="Dashboard">
            <FaListAlt className="text-lg" />
          </Link>
        )}
        <Link to="/reservas" className={linkClass('/reservas')} title="Crear">
          <FaPlusCircle className="text-lg" />
        </Link>
        <Link to="/historial" className={linkClass('/historial')} title="Historial">
          <FaClock className="text-lg" />
        </Link>
        <Link to="/turno" className={linkClass('/turno')} title="Turno">
          <FaUser className="text-lg" />
        </Link>
        <Link to="/login" className={linkClass('/login')} title="Login">
          <FaSignInAlt className="text-lg" />
        </Link>
        <Link to="/logout" className={linkClass('/logout')} title="Salir">
          <FaPowerOff className="text-lg" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;