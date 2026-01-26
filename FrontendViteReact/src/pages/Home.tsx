import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import Carousel from "../components/Home/Carousel";
// ❌ ELIMINADO: import fondo1 from "/assets/fondo1.jpg";
import Footer from "../components/Home/Footer";
// ReservarCliente no se usa en el render, pero si lo necesitas déjalo, si no, bórralo.
// ❌ ELIMINADO: import Logo from "/assets/Logo-PNG.png";

const Home = () => {
  const location = useLocation();
  
  // ✅ CORREGIDO: Usamos la ruta como texto directo (string)
  const [background, setBackground] = useState("/assets/fondo1.jpg");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (location.state?.turnoCerrado) {
      setMensaje("✅ Turno cerrado correctamente");
      setTimeout(() => setMensaje(""), 5000);
    }
  }, [location]);

  const handleScrollToReserva = () => {
    const target = document.getElementById("reserva-cliente-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div
        className="relative w-screen h-screen text-white bg-cover bg-center flex flex-col items-center justify-center text-center gap-6"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        {mensaje && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 px-6 py-3 rounded-lg shadow-lg text-white text-center z-50 text-sm md:text-base">
            {mensaje}
          </div>
        )}

        <div className="z-10">
          {/* ✅ CORREGIDO: src apunta directo a la carpeta public */}
          <img
            src="/assets/Logo-PNG.png"
            alt="Logo principal"
            className="w-40 sm:w-56 md:w-64 lg:w-72 xl:w-80 mb-4 drop-shadow-xl"
          />
        </div>

        <div className="w-full z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold pt-2 px-2">
            ¡Bienvenido a nuestra plataforma de reservas!
          </h1>
        </div>

        <div className="col">
          <div className="w-screen max-w-4xl z-10">
            <Carousel setBackground={setBackground} />
          </div>
        </div>

        <div className="col">
          <button
            onClick={handleScrollToReserva}
            className="z-10 mt-6 px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg shadow-md transition flex items-center gap-2 animate-bounce"
          >
            <FaCalendarAlt className="text-lg" /> Reservar ahora
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;