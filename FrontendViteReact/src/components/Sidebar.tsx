import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  CalendarPlus,
  Clock,
  ShoppingCart,
  BarChart3,
  LogIn,
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
        <div className="fixed top-6 right-6 z-[100]">
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-3 px-6 py-2 rounded-full bg-black border border-red-600 text-white transition-all duration-300 hover:bg-red-600 active:scale-95"
          >
            <LogIn className="w-5 h-5 text-white" />
            <span className="text-xs font-bold tracking-widest uppercase">Ingresar</span>
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
    <nav className="fixed z-[1000] bg-black transition-all duration-300
                    /* MÓVIL: Barra Inferior */
                    bottom-0 left-0 w-full h-16 border-t border-white/10 flex items-center justify-around px-4
                    /* ESCRITORIO */
                    md:top-0 md:left-0 md:w-[90px] md:h-screen md:border-r md:border-t-0 md:flex-col md:justify-start md:py-8 md:px-0"
    >
      
      {/* LOGO: Solo Desktop */}
      <div className="hidden md:flex flex-col items-center justify-center w-full mb-10">
         <div 
            className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center p-2 hover:border-red-600 transition-colors duration-500 cursor-pointer" 
            onClick={() => navigate("/")}
         >
             <img src="/assets/Logo-PNG.png" alt="Logo" className="w-full h-full object-contain" />
         </div>
      </div>

      {/* LINKS DE NAVEGACIÓN */}
      <div className="flex flex-1 w-full items-center justify-around md:flex-col md:justify-start md:gap-6">
        {getLinks().map((link) => {
           const isActive = location.pathname === link.to;
           return (
          <NavLink 
            key={link.to} 
            to={link.to}
            className={`group relative flex items-center justify-center transition-all duration-300
              /* Tamaños */
              h-12 w-12 md:h-14 md:w-full
              ${isActive ? 'text-red-600' : 'text-white/40 hover:text-white'}
            `}
          >
             {/* Indicador Rojo (Solo Desktop) */}
             <span className={`absolute left-0 top-0 h-full bg-red-600 transition-all duration-300
                              hidden md:block rounded-r-md
                              ${isActive ? 'w-[3px]' : 'w-0 group-hover:w-[3px]'}
                            `}>
             </span>

             <div className="relative flex items-center justify-center">
                 {/* Alerta de Actividad */}
                 {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-600 animate-pulse z-10"></span>
                  )}
                 
                 <link.icon 
                    className="w-6 h-6 md:w-7 md:h-7 transition-colors duration-300" 
                    strokeWidth={isActive ? 2 : 1.5} 
                 />
             </div>
          </NavLink>
        )})}
      </div>

      {/* SECCIÓN USUARIO: Solo Desktop */}
      <div className="hidden md:flex flex-col w-full items-center justify-center pb-8 mt-auto">
        <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white border border-white/10 relative group cursor-pointer hover:border-red-600 transition-colors">
           <span className="text-xs font-bold uppercase">{username?.charAt(0)}</span>
           
           {/* Tooltip con nombre */}
           <span className="absolute left-full ml-4 px-3 py-1 bg-stone-900 border border-white/10 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none tracking-widest uppercase">
              {username}
           </span>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;