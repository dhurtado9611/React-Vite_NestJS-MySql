import { FaFacebookF, FaInstagram, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="pb-20 w-full bg-gradient-to-r from-black via-gray-900 to-black text-white py-6 shadow-inner border-t border-red-700">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300 text-center md:text-left">
          © {new Date().getFullYear()} <span className="text-red-500 font-semibold">Reservas App</span>. Todos los derechos reservados.
        </p>
        <div className="flex space-x-6 text-2xl">
          <a
            href="https://www.facebook.com/elescondite1199"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400 transition duration-300"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/cabanas_elescondite/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400 transition duration-300"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://wa.link/cqi7jj"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400 transition duration-300"
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://maps.app.goo.gl/AjWYS9xYyRBrYSY96"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-400 transition duration-300"
            aria-label="Google Maps"
          >
            <FaMapMarkerAlt />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;