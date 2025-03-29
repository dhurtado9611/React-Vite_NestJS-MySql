import { Link } from 'react-router-dom';
import { FaHome, FaBookOpen, FaHistory, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      className="fixed bottom-0 left-0 w-full bg-red-900 text-white py-6 z-30"
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Texto de copyright */}
        <p className="text-sm text-gray-200">&copy; {new Date().getFullYear()} Reservas App. Todos los derechos reservados.</p>

        {/* Enlaces rápidos */}
        <div className="flex gap-6 text-sm items-center">
          <Link to="/" className="flex items-center gap-1 hover:text-gray-300 transition-colors">
            <FaHome /> Inicio
          </Link>
          <Link to="/reservas" className="flex items-center gap-1 hover:text-gray-300 transition-colors">
            <FaBookOpen /> Reservas
          </Link>
          <Link to="/historial" className="flex items-center gap-1 hover:text-gray-300 transition-colors">
            <FaHistory /> Historial
          </Link>
          <a
            href="https://github.com/dhurtado9611"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-gray-300 transition-colors"
          >
            <FaGithub /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;