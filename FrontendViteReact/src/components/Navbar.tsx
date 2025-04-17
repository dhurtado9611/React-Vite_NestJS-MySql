import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/Logo-PNG.png';

const NavbarTop = () => {
  const location = useLocation();
  const activeClass = (path: string) =>
    `px-4 py-2 rounded-md text-white transition ${
      location.pathname === path ? 'bg-red-800 font-semibold' : 'hover:bg-red-700'
    }`;

  return (
    <header className="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-md border-b border-red-800 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={Logo} alt="Logo" className="w-10 h-10 rounded-full border-2 border-white" />
          <Link to="/" className={activeClass('/')}>Inicio</Link>
          <Link to="/reservar" className={activeClass('/reservar')}>Reservar</Link>
        </div>
      </div>
    </header>
  );
};

export default NavbarTop;