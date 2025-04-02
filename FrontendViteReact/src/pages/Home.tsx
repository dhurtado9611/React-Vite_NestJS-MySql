import { useEffect, useState } from "react";
import logoSrc from "../assets/Logo-PNG.png"; // Asegúrate de tener un logo en esta ruta
import { motion, AnimatePresence } from "framer-motion";
import Carousel from "../components/Carousel";
import fondo1 from "../assets/fondo1.jpg";
import Footer from "../components/Footer";

const Logo = () => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsAnimating(false), 2500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="p-8 rounded-full border-4 border-red-600 shadow-2xl"
              initial={{ scale: 3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <img
                src={logoSrc}
                alt="Logo"
                className="w-32 h-32 md:w-40 md:h-40 object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isAnimating && (
        <motion.img
          src={logoSrc}
          alt="Logo"
          className="w-16 h-16 md:w-12 md:h-12 fixed top-4 right-4 z-[50]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}
    </>
  );
};

const Home = () => {
  return (
    <>
      <div
        className="relative flex flex-col md:flex-row min-h-screen text-white pt-16 overflow-hidden bg-cover bg-center pb-20"
        style={{ backgroundImage: `url(${fondo1})` }}
      >
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        {/* Logo animado */}
        <Logo />

        {/* Saludo */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left pt-4">
            ¡Bienvenido a nuestra plataforma de reservas!
          </h1>
        </div>

        {/* Carrusel */}
        <div className="overflow-hidden w-full flex justify-center items-center z-10">
          <Carousel />
        </div>
      </div>

      {/* Footer FUERA del flex-row */}
      <Footer />
    </>
  );
};

export default Home;