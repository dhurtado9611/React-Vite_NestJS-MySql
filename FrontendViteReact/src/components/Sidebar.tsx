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
    // 1. Verificación de sesión al cargar
    const checkSession = () => {
      const storedUser = localStorage.getItem("username");
      const storedRol = localStorage.getItem("rol");
      const token = localStorage.getItem("token");
      
      // Seguridad: Si hay usuario pero no token, forzamos salida
      if (!token && storedUser) {
        handleLogout();
      } else {
        setUsername(storedUser);
        setRol(storedRol);
      }
    };

    checkSession();

    // 2. Sistema de alertas (Polling cada 5s)
    const leerAlertas = () => {
      const cantidad = localStorage.getItem("alertasHabitaciones");
      setVencidas(cantidad ? parseInt(cantidad) : 0);
    };

    leerAlertas();
    const interval = setInterval(leerAlertas, 5000);

    return () => clearInterval(interval);
  }, []);

  // --- FUNCIÓN DE LOGOUT SEGURA ---
  const handleLogout = () => {
    // Limpieza profunda de almacenamiento
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("rol");
    localStorage.removeItem("alertasHabitaciones");
    
    // Limpieza de estado local
    setUsername(null);
    setRol(null);

    // Recarga forzada para limpiar memoria y caché de React
    window.location.href = "/";
  };

  // Definición de enlaces según rol
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

  // --- BOTÓN DE LOGIN (Si no hay usuario) ---
  if (!username) {
    return (
      <>
        <div className="fixed top-6 right-6 z-[100]">
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-3 px-8 py-2 rounded-full 
                       bg-white/10 backdrop-blur-md border border-white/20 
                       text-white transition-all duration-300
                       hover:bg-white/20 hover:scale-105 shadow-[0_0_15px_rgba(0,0,0,0.3)]"
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

  // Clases dinámicas para los enlaces (Efecto Glow)
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 group mb-3
    ${
      isActive
        ? "bg-white/20 backdrop-blur-md border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.3)] text-white scale-110" 
        : "text-white/50 hover:text-white hover:bg-white/10 border border-transparent"
    }`;

  return (
    <>
      {/* ================= DESKTOP SIDEBAR (Izquierda) ================= */}
      <aside className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-[100] flex-col items-center py-8 px-3
                        bg-black/30 backdrop-blur-xl
                        border border-white/10 rounded-full shadow-2xl">
        
        {/* Logo */}
        <div 
            className="cursor-pointer mb-8 hover:scale-110 transition-transform duration-300 p-1"
            onClick={() => navigate("/")}
        >
            <img src="/assets/Logo-PNG.png" alt="Logo" className="w-8 h-8 object-contain opacity-90" />
        </div>

        {/* Links de Navegación */}
        <nav className="flex flex-col gap-2">
          {getLinks().map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {({ isActive }) => (
                <>
                  {/* Indicador de Alerta (Punto Rojo) */}
                  {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 animate-ping shadow-[0_0_10px_red]"></span>
                  )}
                  {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500"></span>
                  )}
                  
                  <link.icon className="w-[1.4rem] h-[1.4rem]" strokeWidth={1.5} />
                  
                  {/* Tooltip Lateral (Aparece al pasar el mouse) */}
                  <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-[-10px] group-hover:translate-x-0">
                    <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10 whitespace-nowrap shadow-xl">
                      {link.label}
                    </span>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Separador Decorativo */}
        <div className="w-6 h-[1px] bg-white/20 my-6"></div>

        {/* Footer (Avatar + Logout) */}
        <div className="flex flex-col items-center gap-5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg border border-white/20">
            {username?.charAt(0).toUpperCase()}
          </div>
          
          <button
            onClick={handleLogout}
            className="p-3 rounded-full text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
            title="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </aside>

      {/* ================= MOBILE NAV (Inferior) ================= */}
      {/* Fondo degradado para mejorar lectura en el borde inferior */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-[90]"></div>

      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] z-[100] h-16 rounded-full px-6
                      flex items-center justify-between
                      bg-black/60 backdrop-blur-[20px] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        
        {getLinks().map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => 
            `relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
            ${isActive ? 'bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-white/50'}`
          }>
            {({ isActive }) => (
              <>
                 {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                  )}
                 <link.icon className="w-5 h-5" strokeWidth={1.5} />
              </>
            )}
          </NavLink>
        ))}

        <button 
          onClick={handleLogout} 
          className="flex items-center justify-center w-10 h-10 rounded-full text-white/50 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </nav>
    </>
  );
};

export default Sidebar;