import { FaFacebookF, FaInstagram, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-white/10 backdrop-blur-md text-white py-4 shadow-inner mt-10">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <p className="text-xs text-gray-300 mb-2 md:mb-0">
          © {new Date().getFullYear()} Reservas App. Todos los derechos reservados.
        </p>
        <div className="flex space-x-6 text-lg">
          <a
            href="https://www.facebook.com/elescondite1199"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/cabanas_elescondite/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://wa.link/cqi7jj"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition"
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://maps.app.goo.gl/AjWYS9xYyRBrYSY96"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-200 transition"
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