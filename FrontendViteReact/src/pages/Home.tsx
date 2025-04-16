import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Carousel from "../components/Carousel";
import fondo1 from "../assets/fondo1.jpg";
import Footer from "../components/Footer";

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
        className="relative flex flex-col min-h-screen text-white pt-16 overflow-hidden bg-cover bg-center pb-20 px-4 sm:px-6"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        {mensaje && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 px-6 py-3 rounded-lg shadow-lg text-white text-center z-50 text-sm md:text-base">
            {mensaje}
          </div>
        )}

        <div className="w-full flex flex-col items-center justify-center text-center z-10 gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold pt-4 px-2">
            ¡Bienvenido a nuestra plataforma de reservas!
          </h1>
          <div className="w-full max-w-4xl">
            <Carousel setBackground={setBackground} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;