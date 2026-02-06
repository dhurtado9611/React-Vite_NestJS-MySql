import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  CalendarPlus,
  Clock,
  ShoppingCart,
  BarChart3,
  LogIn,
  LogOut,
} from "lucide-react";
import LoginModal from "./LoginModal";

const Sidebar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [vencidas, setVencidas] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();

  // --- LÓGICA DE SESIÓN Y ALERTAS ---
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
    <nav className="fixed z-[1000] transition-all duration-300
                    /* MÓVIL: Estilo Cápsula Flotante (como la imagen) */
                    bottom-4 left-4 right-4 h-20 bg-white rounded-[30px] flex items-center justify-around px-2 shadow-2xl
                    /* ESCRITORIO: Barra Lateral Vertical Negra */
                    md:top-0 md:left-0 md:bottom-auto md:right-auto md:w-[90px] md:h-screen md:bg-black md:rounded-none md:border-r md:border-white/10 md:flex-col md:justify-between md:py-6 md:px-0"
    >
      
      {/* 1. LOGO (Solo Desktop) */}
      <div className="hidden md:flex flex-col items-center justify-center w-full mb-6">
         <div className="w-14 h-14 rounded-full bg-black border border-white/10 flex items-center justify-center p-2 overflow-hidden hover:border-red-600/50 transition-colors duration-500 cursor-pointer" onClick={() => navigate("/")}>
             <img src="/assets/Logo-PNG.png" alt="Logo" className="w-full h-full object-contain relative z-10" />
         </div>
      </div>

      {/* 2. LINKS DE NAVEGACIÓN */}
      <div className="flex flex-1 w-full items-center justify-around md:flex-col md:justify-start md:gap-3">
        {getLinks().map((link) => {
           const isActive = location.pathname === link.to;
           return (
          <NavLink 
            key={link.to} 
            to={link.to}
            className={`group relative flex items-center justify-center transition-all duration-500
              /* Tamaños Móvil: Círculo cuando está activo */
              h-14 w-14 rounded-full
              /* Tamaños Desktop */
              md:h-14 md:w-full md:rounded-none
              ${isActive ? 'md:bg-black' : 'hover:md:bg-red-600'}
            `}
          >
             {/* INDICADOR BURBUJA (Móvil) */}
             <span className={`absolute inset-0 bg-gray-100 rounded-full transition-transform duration-500 md:hidden
                              ${isActive ? 'scale-100' : 'scale-0'}`}>
             </span>

             {/* INDICADOR BARRA (Desktop) */}
             <span className={`absolute left-0 top-0 h-full bg-red-600 transition-all duration-300
                              hidden md:block rounded-r-md
                              ${isActive ? 'w-[4px]' : 'w-0 group-hover:w-[4px]'}`}>
             </span>

             <div className={`relative flex flex-col items-center transition-all duration-300 z-10
                              ${isActive ? 'md:translate-x-2' : 'md:group-hover:translate-x-2'}`}>
                 
                 {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse"></span>
                  )}
                 
                 <link.icon 
                    className={`w-6 h-6 transition-colors duration-300
                               ${isActive 
                                  ? 'text-red-600 md:text-red-500' 
                                  : 'text-gray-400 md:text-white/40 group-hover:md:text-white'}`} 
                    strokeWidth={isActive ? 2.5 : 1.5} 
                 />

                 <span className={`text-[9px] font-bold uppercase mt-1 transition-colors duration-300 md:hidden
                                   ${isActive ? 'text-red-600' : 'text-gray-400'}`}>
                    {link.label}
                 </span>
             </div>
          </NavLink>
        )})}
      </div>

      {/* 3. SECCIÓN INFERIOR (Solo Desktop) */}
      <div className="hidden md:flex flex-col w-full items-center justify-center gap-4 mt-auto">
        <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center text-white font-bold text-sm border border-red-900 cursor-default relative group">
           {username?.charAt(0).toUpperCase()}
           <span className="absolute left-full ml-2 px-2 py-1 bg-black border border-white/10 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {username}
           </span>
        </div>

        <button 
          onClick={handleLogout} 
          className="group relative flex flex-col items-center justify-center w-full h-14 text-white/30 hover:text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
          <span className="text-[8px] mt-1 font-medium tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1">Salir</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;