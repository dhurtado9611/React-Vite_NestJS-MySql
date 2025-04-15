import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import logoSrc from "../assets/Logo-PNG.png";
import { motion, AnimatePresence } from "framer-motion";
import Carousel from "../components/Carousel";
import fondo1 from "../assets/fondo1.jpg";
import Footer from "../components/Footer";
import axios from "axios";

const Logo = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setProgress(30);
        await new Promise((res) => setTimeout(res, 500));
        setProgress(60);

        const response = await axios.get("https://react-vitenestjs-mysql-production.up.railway.app/cuadre");
        if (response.status === 200) {
          setProgress(100);
          setTimeout(() => setIsAnimating(false), 500);
        }
      } catch (error) {
        console.error("Error al cargar reservas:", error);
        setProgress(100);
        setTimeout(() => setIsAnimating(false), 500);
      }
    };

    fetchReservas();
  }, []);

  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

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
              className="relative w-40 h-40 flex items-center justify-center"
              initial={{ scale: 3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#ef4444"
                  strokeWidth="6"
                  fill="transparent"
                  className="opacity-20"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#ef4444"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 0.1 }}
                />
              </svg>
              <img src={logoSrc} alt="Logo" className="w-24 h-24 object-contain z-10" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isAnimating && (
        <motion.img
          src={logoSrc}
          alt="Logo"
          className="w-14 h-14 md:w-12 md:h-12 fixed top-4 right-4 z-[50]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}
    </>
  );
};

const Home = () => {
  const location = useLocation();
  const [background, setBackground] = useState(fondo1);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (location.state?.turnoCerrado) {
      setMensaje("✅ Turno cerrado correctamente");
      setTimeout(() => setMensaje(""), 5000);
    }
  }, [location]);

  return (
    <>
      <div
        className="relative flex flex-col lg:flex-row min-h-screen text-white pt-16 overflow-hidden bg-cover bg-center pb-20"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        <Logo />

        {mensaje && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 px-6 py-3 rounded-lg shadow-lg text-white text-center z-50 text-sm md:text-base">
            {mensaje}
          </div>
        )}

        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-0 z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center lg:text-left pt-4 px-2">
            ¡Bienvenido a nuestra plataforma de reservas!
          </h1>
        </div>

        <div className="overflow-hidden w-full flex justify-center items-center z-10">
          <Carousel setBackground={setBackground} />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;