import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import logoSrc from "../assets/Logo-PNG.png";

const LogoLoader = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProgress(30);
        await new Promise((res) => setTimeout(res, 500));
        setProgress(60);
        await axios.get("https://react-vitenestjs-mysql-production.up.railway.app/reservas");
        setProgress(100);
        setTimeout(() => setIsAnimating(false), 500);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setProgress(100);
        setTimeout(() => setIsAnimating(false), 500);
      }
    };

    fetchData();
  }, []);

  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
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
  );
};

export default LogoLoader;