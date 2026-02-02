import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBed, FaWineGlass, FaCalendarCheck, FaMapMarkerAlt } from 'react-icons/fa';

const panels = [
  {
    id: 1,
    title: "RESERVAS",
    subtitle: "Agenda tu visita",
    icon: <FaCalendarCheck />,
    image: "/assets/fondo1.jpg",
    action: "scroll-to-reserva",
    description: "Planifica tu estadía con nosotros en simples pasos."
  },
  {
    id: 2,
    title: "HABITACIONES",
    subtitle: "Confort y descanso",
    icon: <FaBed />,
    image: "/assets/habPremium1.jpg",
    action: "/habitaciones",
    description: "Espacios diseñados para tu máximo confort y privacidad."
  },
  {
    id: 3,
    title: "CABAÑAS",
    subtitle: "Bebidas y Snacks",
    icon: <FaWineGlass />,
    image: "/assets/habSen1.jpg",
    action: "/servicios",
    description: "Disfruta de nuestra selección de licores y bebidas refrescantes."
  },
  {
    id: 4,
    title: "UBICACIÓN",
    subtitle: "Encuéntranos",
    icon: <FaMapMarkerAlt />,
    image: "/assets/popa.jpg",
    action: "/ubicacion",
    description: "Ubicados estratégicamente para tu fácil acceso."
  }
];

interface Props {
  onReserveClick: () => void;
}

const DiagonalHero = ({ onReserveClick }: Props) => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleCardClick = (panel: typeof panels[0]) => {
    if (panel.action === 'scroll-to-reserva') {
      onReserveClick();
    } else {
      console.log("Navegar a:", panel.action);
    }
  };

  return (
    <div className="w-full h-[85vh] flex flex-col md:flex-row overflow-hidden bg-black">
      {panels.map((panel) => (
        <div
          key={panel.id}
          className={`
            relative flex-1 transition-all duration-700 ease-in-out cursor-pointer group
            border-b md:border-b-0 md:border-r border-white/20
            ${activeId === panel.id ? 'md:grow-[3] grow-[2]' : 'grow-[1]'}
            md:transform md:-skew-x-12 md:mx-[-20px] 
          `}
          onMouseEnter={() => setActiveId(panel.id)}
          onMouseLeave={() => setActiveId(null)}
          onClick={() => handleCardClick(panel)}
        >
          <div className="absolute inset-0 md:transform md:skew-x-12 overflow-hidden bg-gray-900">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110 opacity-60 group-hover:opacity-100"
              style={{ backgroundImage: `url(${panel.image})` }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />

            <div className="absolute inset-0 flex flex-col justify-end p-8 pb-16 md:pb-24 items-center md:items-start text-center md:text-left z-10">
              <div className="transform transition-all duration-500 translate-y-0 group-hover:-translate-y-4">
                <div className="text-4xl text-yellow-500 mb-2 md:mb-4 flex justify-center md:justify-start">
                  {panel.icon}
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-widest uppercase font-serif">
                  {panel.title}
                </h2>
                <h3 className="text-sm md:text-lg text-gray-300 font-light tracking-[0.2em] mt-2 uppercase border-b border-yellow-500/50 pb-2 inline-block">
                  {panel.subtitle}
                </h3>
              </div>

              <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-700 ease-in-out overflow-hidden mt-2">
                <p className="text-gray-200 text-sm md:text-base max-w-xs leading-relaxed">
                  {panel.description}
                </p>
                <span className="mt-4 inline-block text-yellow-400 text-xs font-bold tracking-widest border border-yellow-400 px-4 py-2 rounded hover:bg-yellow-400 hover:text-black transition-colors">
                  EXPLORAR
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiagonalHero;