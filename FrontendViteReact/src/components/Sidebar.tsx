import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  CalendarPlus,
  Clock,
  ShoppingCart,
  BarChart3,
  LogIn,
  LogOut,
  User
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
            className="flex items-center gap-2 px-6 py-2 rounded-full 
                       bg-black border border-red-600 
                       text-white text-xs font-bold tracking-widest uppercase
                       hover:bg-red-600 transition-colors duration-300"
          >
            <LogIn className="w-4 h-4" />
            Ingresar
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
      {/* ESTRUCTURA DEL SIDEBAR 
        - Mobile: fixed bottom-0, w-full, h-16 (Horizontal)
        - Desktop (md): fixed top-0 left-0, w-24, h-screen (Vertical)
      */}
      <nav className="fixed z-[1500] bg-black border-t md:border-t-0 md:border-r border-white/10
                      /* MOVIL */
                      bottom-0 left-0 w-full h-16 flex flex-row items-center justify-around px-2
                      /* DESKTOP */
                      md:top-0 md:left-0 md:w-24 md:h-[100dvh] md:flex-col md:justify-between md:py-8 md:px-0">
        
        {/* LOGO (Solo visible en Desktop) */}
        <div className="hidden md:flex flex-col items-center justify-center w-full mb-8 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center overflow-hidden group-hover:border-red-600 transition-colors">
                 <img src="/assets/Logo-PNG.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>
        </div>

        {/* LINKS (Vertical en PC, Horizontal en Móvil) */}
        <div className="flex flex-1 w-full 
                        flex-row items-center justify-around /* Móvil */
                        md:flex-col md:justify-start md:gap-6 /* Desktop */
                       ">
          {getLinks().map((link) => {
             const isActive = location.pathname === link.to;
             return (
              <NavLink 
                key={link.to} 
                to={link.to}
                className="relative group flex flex-col items-center justify-center w-full md:w-full"
              >
                 {/* Barra lateral roja activa (Solo Desktop) */}
                 {isActive && (
                    <span className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-red-600 rounded-r-full shadow-[0_0_10px_#dc2626]"></span>
                 )}

                 {/* Contenedor del Icono */}
                 <div className={`p-2 rounded-xl transition-all duration-300 
                                  ${isActive ? 'text-white' : 'text-gray-500 hover:text-white'}
                                  md:group-hover:bg-white/5
                                `}>
                     
                     {/* Punto de notificación */}
                     {link.label === "Actividad" && vencidas > 0 && (
                        <span className="absolute top-2 right-1/4 md:top-0 md:right-5 h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse border border-black z-10"></span>
                      )}
                     
                     <link.icon 
                        strokeWidth={1.5} 
                        className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
                     />
                 </div>

                 {/* Texto (Visible abajo en móvil, pequeño en desktop) */}
                 <span className={`text-[9px] font-bold uppercase tracking-wider mt-1 transition-colors
                                   ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}
                                  `}>
                    {link.label}
                 </span>
              </NavLink>
          )})}
        </div>

        {/* USUARIO (Solo visible en Desktop) */}
        <div className="hidden md:flex flex-col items-center gap-4 w-full mt-auto">
           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {username?.charAt(0).toUpperCase()}
           </div>
           
           <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500 transition-colors flex flex-col items-center gap-1"
              title="Cerrar Sesión"
           >
              <LogOut className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-[8px] uppercase font-bold tracking-widest">Salir</span>
           </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;