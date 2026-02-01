import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
        <div className="fixed top-6 right-6 z-[100]">
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-3 px-8 py-2 rounded-full 
                       bg-black border border-red-600/50 
                       text-white transition-all duration-300
                       hover:bg-red-600 hover:scale-105 shadow-[0_0_15px_rgba(255,0,0,0.2)]"
          >
            <LogIn className="w-[1.2rem] h-[1.2rem] text-white" />
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
      {/* ESTRUCTURA PRINCIPAL DEL SIDEBAR
         - Mobile: fixed bottom-0, w-full, h-16, flex-row
         - Desktop (md): fixed left-0 top-0, w-20, h-screen, flex-col
      */}
      <nav className="fixed z-[1000] bg-black border-white/10 shadow-2xl transition-all duration-300
                      flex justify-between items-center
                      /* MÓVIL */
                      bottom-0 left-0 w-full h-16 flex-row border-t px-2
                      /* ESCRITORIO */
                      md:top-0 md:left-0 md:w-20 md:h-screen md:flex-col md:border-t-0 md:border-r md:px-0 md:py-4">
        
        {/* 1. Logo (Solo visible en Desktop, arriba del todo) */}
        <div 
            className="hidden md:flex flex-col items-center justify-center w-full mb-8 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => navigate("/")}
        >
            <img src="/assets/Logo-PNG.png" alt="Logo" className="w-10 h-10 object-contain" />
        </div>

        {/* 2. Contenedor de Links (Centro Vertical en Desktop) */}
        <div className="flex flex-1 w-full 
                        flex-row justify-around items-center /* Móvil: Horizontal, esparcido */
                        md:flex-col md:justify-start md:gap-6 /* Desktop: Vertical, desde arriba */
                       ">
          {getLinks().map((link) => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              className={({ isActive }) => 
                `relative flex flex-col items-center justify-center transition-all duration-200 group
                /* Tamaños base */
                h-full w-full 
                md:h-16 md:w-16 md:rounded-xl md:mx-auto
                ${isActive 
                  ? 'text-white bg-white/10 shadow-[inset_0px_0px_10px_rgba(255,255,255,0.05)]' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                   {/* Indicador de Actividad (Punto Rojo) */}
                   {link.label === "Actividad" && vencidas > 0 && (
                      <span className="absolute top-2 right-2 md:top-3 md:right-3 h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse border-2 border-black z-10"></span>
                    )}
                   
                   <link.icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110 text-white' : 'scale-100 group-hover:scale-110'} transition-transform`} strokeWidth={2} />
                   
                   <span className={`text-[9px] font-medium tracking-wide uppercase ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                      {link.label}
                   </span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* 3. Sección Usuario / Logout (Abajo del todo en Desktop) */}
        <div className="flex items-center 
                        /* Móvil: Oculto o integrado (aquí simplificado para no saturar la barra inferior) */
                        md:flex-col md:w-full md:gap-4 md:mt-auto md:pb-4">
          
          {/* Inicial del Usuario */}
          <div className="hidden md:flex w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-red-900 items-center justify-center text-white font-bold text-sm border border-white/10 shadow-lg cursor-default">
            {username?.charAt(0).toUpperCase()}
          </div>

          <button 
            onClick={handleLogout} 
            className="hidden md:flex flex-col items-center justify-center w-12 h-12 text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-colors rounded-xl"
            title="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5" strokeWidth={2} />
            <span className="text-[8px] mt-1 font-medium tracking-wide uppercase">Salir</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;