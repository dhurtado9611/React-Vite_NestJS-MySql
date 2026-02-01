import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  CalendarPlus,
  Clock,
  ShoppingCart,
  BarChart3,
  LogIn,
  LogOut
} from "lucide-react";
import LoginModal from "./LoginModal";

const Sidebar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [vencidas, setVencidas] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = () => {
      const storedUser = localStorage.getItem("username");
      const storedRol = localStorage.getItem("rol");
      const token = localStorage.getItem("token");
      
      if (!token && storedUser) {
        handleLogout();
      } else {
        setUsername(storedUser);
        setRol(storedRol);
      }
    };
    checkSession();
    const leerAlertas = () => {
      const cantidad = localStorage.getItem("alertasHabitaciones");
      setVencidas(cantidad ? parseInt(cantidad) : 0);
    };
    leerAlertas();
    const interval = setInterval(leerAlertas, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("rol");
    localStorage.removeItem("alertasHabitaciones");
    setUsername(null);
    setRol(null);
    window.location.href = "/";
  };

  const getLinks = () => {
    if (rol === "admin") {
      return [
        { to: "/CrearReservasAdmin", icon: CalendarPlus, label: "Reservas" },
        { to: "/ActividadAdmin", icon: Clock, label: "Actividad" },
        { to: "/Marketplace", icon: ShoppingCart, label: "Tienda" },
        { to: "/AdminDashboard", icon: BarChart3, label: "Admin" }
      ];
    } else if (rol === "invitado") {
      return [
        { to: "/CrearReservasInvitado", icon: CalendarPlus, label: "Reservas" },
        { to: "/ActividadInvitado", icon: Clock, label: "Actividad" },
        { to: "/MarketplaceInvitado", icon: ShoppingCart, label: "Tienda" },
      ];
    }
    return [];
  };

  if (!username) {
    return (
      <>
        <div className="fixed top-6 right-6 z-[2000]">
          <button
            onClick={() => setShowLogin(true)}
            className="group flex items-center gap-3 px-8 py-2 rounded-full 
                       bg-black border border-red-600/50 
                       text-white transition-all duration-300
                       hover:bg-red-600 hover:scale-105 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
          >
            <LogIn className="w-4 h-4 text-white group-hover:animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-white">INGRESAR</span>
          </button>
        </div>
        {showLogin && (
          <LoginModal
            onClose={() => {
              setShowLogin(false);
              setUsername(localStorage.getItem("username"));
              setRol(localStorage.getItem("rol"));
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      {/* SIDEBAR: Estilo "Gamer/SaaS" con corrección técnica (!flex-col) 
         - Fondo negro sólido
         - Borde sutil
      */}
      <nav className="fixed z-[1500] bg-black border-t md:border-t-0 md:border-r border-white/10 shadow-2xl
                      /* MOVIL */
                      bottom-0 left-0 w-full h-16 flex items-center justify-around px-2
                      /* DESKTOP */
                      md:top-0 md:left-0 md:w-24 md:h-[100dvh] md:!flex-col md:justify-between md:py-8 md:px-0">
        
        {/* LOGO (Solo Desktop) - Con efecto Hover de Escala */}
        <div 
            className="hidden md:flex flex-col items-center justify-center w-full mb-8 cursor-pointer hover:scale-110 transition-transform duration-300"
            onClick={() => navigate("/")}
        >
            <div className="p-2 rounded-full border border-white/5 bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
               <img src="/assets/Logo-PNG.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" />
            </div>
        </div>

        {/* LINKS DE NAVEGACIÓN */}
        <div className="flex flex-1 w-full 
                        items-center justify-around /* Móvil */
                        md:!flex-col md:justify-start md:gap-8 /* Desktop */
                       ">
          {getLinks().map((link) => {
             const isActive = location.pathname === link.to;
             return (
              <NavLink 
                key={link.to} 
                to={link.to} 
                className={({ isActive }) => 
                  `relative flex flex-col items-center justify-center transition-all duration-300 group
                  /* Dimensiones */
                  h-full w-full md:h-16 md:w-16 md:rounded-2xl
                  ${isActive 
                    ? 'text-white' // Texto blanco puro al estar activo
                    : 'text-white/40 hover:text-white' // Texto grisáceo y hover blanco
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                     {/* FONDO ACTIVO (Glow Rojo y Fondo sutil) - Solo visible si está activo */}
                     {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent rounded-2xl border border-red-500/30 shadow-[0_0_20px_rgba(220,38,38,0.2)] md:block hidden"></div>
                     )}

                     {/* INDICADOR MÓVIL (Barra superior) */}
                     {isActive && <div className="absolute top-0 w-8 h-1 bg-red-600 rounded-b-full shadow-[0_0_10px_#ef4444] md:hidden"></div>}

                     {/* PUNTO DE ALERTA (Notificación) */}
                     {link.label === "Actividad" && vencidas > 0 && (
                        <span className="absolute top-3 right-1/3 h-3 w-3 rounded-full bg-red-600 animate-pulse border-2 border-black z-20 shadow-[0_0_10px_#ef4444]"></span>
                      )}
                     
                     {/* ICONO CON ANIMACIÓN */}
                     <div className={`relative z-10 p-2 rounded-xl transition-transform duration-300 
                                      ${isActive ? 'scale-110' : 'group-hover:scale-125 group-hover:-translate-y-1'}
                                    `}>
                        <link.icon 
                            className={`w-6 h-6 ${isActive ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'group-hover:text-red-400'}`} 
                            strokeWidth={isActive ? 2.5 : 2} 
                        />
                     </div>
                     
                     {/* TEXTO (Etiqueta) */}
                     <span className={`relative z-10 text-[9px] font-bold tracking-widest uppercase mt-1 transition-all duration-300
                                       ${isActive ? 'text-white translate-y-0 opacity-100' : 'opacity-70 group-hover:text-red-400 group-hover:translate-y-0.5'}
                                      `}>
                        {link.label}
                     </span>
                  </>
                )}
              </NavLink>
          )})}
        </div>

        {/* SECCIÓN USUARIO / SALIR */}
        <div className="hidden md:flex flex-col items-center justify-center w-full pb-6 gap-4">
          
          {/* Inicial del Usuario (Estilo botón arcade) */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-700 to-black border border-red-500/30 shadow-[0_0_10px_rgba(220,38,38,0.3)] flex items-center justify-center text-white font-bold text-sm">
            {username?.charAt(0).toUpperCase()}
          </div>

          <button 
            onClick={handleLogout} 
            className="group flex flex-col items-center justify-center text-white/30 hover:text-red-500 transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" strokeWidth={2} />
            <span className="text-[8px] mt-1 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Salir</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;