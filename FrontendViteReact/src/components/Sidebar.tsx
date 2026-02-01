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
      {/* ================= SIDEBAR UNIFICADO (PC Izquierda / Móvil Abajo) ================= */}
      <nav className="fixed z-[1000] bg-black border-white/10 shadow-2xl transition-all duration-300
                      /* Móvil: Inferior */
                      bottom-0 left-0 w-full h-16 flex flex-row border-t
                      /* Desktop: Lateral Izquierdo */
                      md:top-0 md:left-0 md:w-20 md:h-full md:flex-col md:border-t-0 md:border-r">
        
        {/* Logo (Solo visible en Desktop) */}
        <div 
            className="hidden md:flex items-center justify-center h-20 w-full cursor-pointer hover:scale-110 transition-transform"
            onClick={() => navigate("/")}
        >
            <img src="/assets/Logo-PNG.png" alt="Logo" className="w-10 h-10 object-contain" />
        </div>

        {/* Links de Navegación */}
        <div className="flex flex-1 flex-row md:flex-col items-center justify-around md:justify-start md:pt-4 md:gap-4">
          {getLinks().map((link) => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              className={({ isActive }) => 
                `relative flex flex-col items-center justify-center h-full w-full md:h-16 md:w-16 md:rounded-xl transition-all duration-200
                ${isActive 
                  ? 'text-white bg-white/10 shadow-[inset_0px_0px_10px_rgba(255,255,255,0.05)]' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                   {/* Alerta Roja (Notificación) */}
                   {link.label === "Actividad" && vencidas > 0 && (
                      <span className="absolute top-3 right-1/3 h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse border-2 border-black"></span>
                    )}
                   
                   <link.icon className={`w-6 h-6 ${isActive ? 'scale-110' : 'scale-100'} transition-transform`} strokeWidth={2} />
                   <span className="text-[9px] mt-1 font-medium tracking-wide uppercase">{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Sección de Usuario / Salir (Parte inferior en Desktop) */}
        <div className="flex flex-row md:flex-col items-center justify-center md:pb-6 md:gap-4 px-4 md:px-0">
          
          {/* Inicial del Usuario (Solo Desktop) */}
          <div className="hidden md:flex w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-red-800 items-center justify-center text-white font-bold text-sm border border-white/10 shadow-lg">
            {username?.charAt(0).toUpperCase()}
          </div>

          <button 
            onClick={handleLogout} 
            className="flex flex-col items-center justify-center h-full w-16 md:h-16 md:w-16 text-white/50 hover:text-red-500 hover:bg-red-500/10 transition-colors md:rounded-xl"
            title="Cerrar Sesión"
          >
            <LogOut className="w-6 h-6" strokeWidth={2} />
            <span className="text-[9px] mt-1 font-medium tracking-wide uppercase">Salir</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;