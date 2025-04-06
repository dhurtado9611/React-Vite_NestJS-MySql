// Código actualizado para mantener el logo visible y mostrar el botón de login si no hay sesión
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
import * as XLSX from 'xlsx';
import axios from 'axios';

const Navbar = () => {
  const token = getToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [rol, setRol] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      setRol(localStorage.getItem('rol'));
      setUsername(localStorage.getItem('username'));
    }
  }, [token]);

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const cerrarCaja = async () => {
    try {
      const rol = localStorage.getItem('rol');
      const datosTurno = localStorage.getItem('datosTurno');

      if (rol !== 'invitado' || !datosTurno) {
        return alert('No hay datos del turno o el usuario no es invitado.');
      }

      const { colaborador, fecha } = JSON.parse(datosTurno);
      const response = await axios.get('https://react-vitenestjs-mysql-production.up.railway.app/cuadre');
      const reservasFiltradas = response.data.filter(
        (r: any) => r.colaborador === colaborador && r.fecha === fecha
      );

      const worksheet = XLSX.utils.json_to_sheet(reservasFiltradas);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      const file = new File([blob], `resumen_turno_${colaborador}_${fecha}.xlsx`);

      const horaActual = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const ultimoCuadre = response.data[response.data.length - 1];
      if (ultimoCuadre?.id) {
        await axios.put(`https://react-vitenestjs-mysql-production.up.railway.app/cuadre/${ultimoCuadre.id}`, {
          turnoCerrado: horaActual
        });
      }

      logout();
      localStorage.clear();
      navigate('/');
    } catch (error: any) {
      console.error('Error al cerrar caja:', error);
      logout();
      localStorage.clear();
      navigate('/login');
    }
  };

  const handleLogout = () => {
    if (rol === 'invitado') {
      cerrarCaja();
    } else {
      logout();
      localStorage.clear();
      navigate('/');
    }
  };

  const linkClass = (path: string) =>
    `hover:scale-110 transition-transform p-2 md:p-3 rounded-full bg-black/40 backdrop-blur-sm ${active === path ? 'text-red-500 scale-125' : 'text-white'}`;

  return (
    <>
      {/* Navbar para escritorio */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-20 bg-white/10 backdrop-blur-md border-r border-red-800 z-50 flex-col justify-between items-center py-4 shadow-xl">
        <div className="flex flex-col items-center gap-6 mt-4 text-white text-2xl w-full">
          <img src={Logo} alt="Logo" className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-md" />

          {token && rol === 'admin' && (
            <>
              <Link to="/" className={linkClass('/')} title="Inicio"><FaHome /></Link>
              <Link to="/reservas" className={linkClass('/reservas')} title="Reservas"><FaListAlt /></Link>
              <Link to="/historial" className={linkClass('/historial')} title="Historial"><FaHistory /></Link>
              <Link to="/admin" className={linkClass('/admin')} title="Dashboard"><FaListAlt /></Link>
            </>
          )}

          {token && rol === 'invitado' && (
            <>
              <Link to="/crear-reservas" className={linkClass('/crear-reservas')} title="Crear Reserva"><FaPlus /></Link>
              <Link to="/historial-invitado" className={linkClass('/historial-invitado')} title="Historial"><FaHistory /></Link>
            </>
          )}
        </div>

        <div className="text-center text-xs text-white px-2 mb-3">
          {username && <span className="block opacity-80">Usuario: {username}</span>}
        </div>

        <div className="text-white text-xl mb-4">
          {token ? (
            <button onClick={handleLogout} className="hover:scale-110 transition-transform bg-black/40 backdrop-blur-sm p-3 rounded-full" title="Cerrar sesión">
              <FaSignOutAlt />
            </button>
          ) : (
            <Link to="/login" className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:scale-110 transition-transform" title="Iniciar sesión">
              <FaSignInAlt className="text-white" />
            </Link>
          )}
        </div>
      </aside>

      {/* Navbar para móvil */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/10 backdrop-blur-md border-t border-red-800 z-50 flex justify-around items-center px-2 py-2 shadow-xl">
        <div className="flex flex-col items-center">
          <div className="bg-black p-1 rounded-full border-4 border-white transform scale-105 shadow-md">
            <img src={Logo} alt="Logo" className="w-10 h-10 object-cover rounded-full" />
          </div>
          {username && <span className="text-xs text-white mt-1">{username}</span>}
        </div>

        {token && rol === 'admin' && (
          <>
            <Link to="/" className={linkClass('/')} title="Inicio"><FaHome className="text-lg" /></Link>
            <Link to="/reservas" className={linkClass('/reservas')} title="Reservas"><FaListAlt className="text-lg" /></Link>
            <Link to="/historial" className={linkClass('/historial')} title="Historial"><FaHistory /></Link>
            <Link to="/admin" className={linkClass('/admin')} title="Dashboard"><FaListAlt className="text-lg" /></Link>
          </>
        )}

        {token && rol === 'invitado' && (
          <>
            <Link to="/crear-reservas" className={linkClass('/crear-reservas')} title="Crear Reserva"><FaPlus className="text-lg" /></Link>
            <Link to="/historial-invitado" className={linkClass('/historial-invitado')} title="Historial"><FaHistory className="text-lg" /></Link>
          </>
        )}

        <div className="text-white text-lg">
          {token ? (
            <button onClick={handleLogout} className="hover:scale-105 transition-transform bg-black/40 backdrop-blur-sm p-2 rounded-full" title="Cerrar sesión">
              <FaSignOutAlt />
            </button>
          ) : (
            <Link to="/login" className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:scale-110 transition-transform" title="Iniciar sesión">
              <FaSignInAlt className="text-white text-lg" />
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;