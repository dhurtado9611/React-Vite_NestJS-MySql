import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DiagonalHero from "../components/Home/DiagonalHero";
import Footer from "../components/Home/Footer";
// Puedes dejar Logo si lo usas en un header flotante, si no, se puede quitar.

const Home = () => {
  const location = useLocation();
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (location.state?.turnoCerrado) {
      setMensaje("✅ Turno cerrado correctamente");
      setTimeout(() => setMensaje(""), 5000);
    }
  }, [location]);

  const handleScrollToReserva = () => {
    // Asumimos que el formulario de reserva está más abajo o en otra página.
    // Si está en esta misma página, asegúrate de tener un <div id="reserva-cliente-section"> abajo.
    const target = document.getElementById("reserva-cliente-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      console.log("Sección de reserva no encontrada o redirigir a /reservar");
    }
  };

  return (
    <div className="bg-neutral-900 min-h-screen flex flex-col">
      {/* Mensaje Flotante (Toast) */}
      {mensaje && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-2xl text-white text-center z-50 animate-fade-in-down border border-green-400">
          <span className="font-semibold">{mensaje}</span>
        </div>
      )}

      {/* Header / Logo Flotante (Opcional, para mantener la marca visible) */}
      <div className="absolute top-0 left-0 w-full p-6 z-50 pointer-events-none flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <img
          src="/assets/Logo-PNG.png"
          alt="Logo"
          className="h-12 md:h-16 drop-shadow-lg opacity-90"
        />
        {/* Aquí podrías poner un botón de Login pequeño si quisieras */}
      </div>

      {/* NUEVO HERO SECTION TIPO NAIPE */}
      <section className="relative z-10">
        <DiagonalHero onReserveClick={handleScrollToReserva} />
      </section>

      {/* Sección inferior (Donde iría el formulario de reserva si es una Single Page) */}
      <div id="reserva-cliente-section" className="bg-neutral-900">
        {/* Aquí puedes renderizar tu componente ReservasCliente o lo que uses */}
      </div>

      <Footer />
    </div>
  );
};

export default Home;