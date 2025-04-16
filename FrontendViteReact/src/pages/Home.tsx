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
    <div className="ml-0 flex-1 p-0">
      <div
        className="ml-0 p-0 w-full min-h-screen px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-white bg-cover bg-center flex flex-col items-center justify-center text-center gap-6 relative"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        {mensaje && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 px-6 py-3 rounded-lg shadow-lg text-white text-center z-50 text-sm md:text-base">
            {mensaje}
          </div>
        )}

        <div className="w-full z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold pt-4 px-2">
            ¡Bienvenido a nuestra plataforma de reservas!
          </h1>
        </div>

        <div className="w-full max-w-4xl z-10">
          <Carousel setBackground={setBackground} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;