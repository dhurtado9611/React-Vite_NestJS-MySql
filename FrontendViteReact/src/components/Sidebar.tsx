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
// Importamos la función de logout centralizada (opcional, pero recomendada)
import { logout as apiLogout } from "../services/api"; 

const Sidebar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [vencidas, setVencidas] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar sesión al montar
    const checkSession = () => {
      const storedUser = localStorage.getItem("username");
      const storedRol = localStorage.getItem("rol");
      const token = localStorage.getItem("token");
      
      // Si no hay token, no debería haber usuario (limpieza de seguridad)
      if (!token && storedUser) {
        handleLogout();
      } else {
        setUsername(storedUser);
        setRol(storedRol);
      }
    };

    checkSession();

    // Sistema de alertas
    const leerAlertas = () => {
      const cantidad = localStorage.getItem("alertasHabitaciones");
      setVencidas(cantidad ? parseInt(cantidad) : 0);
    };

    leerAlertas();
    const interval = setInterval(leerAlertas, 5000);

    return () => clearInterval(interval);
  }, []);

  // --- FUNCIÓN DE LOGOUT CORREGIDA ---
  const handleLogout = () => {
    // Opción A: Usar la función centralizada de api.ts (Recomendado)
    // apiLogout(); 

    // Opción B: Lógica manual robusta (Por si no has actualizado api.ts aún)
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("rol");
    localStorage.removeItem("alertasHabitaciones");
    
    // Limpiamos estado local inmediatamente para feedback visual
    setUsername(null);
    setRol(null);

    // IMPORTANTE: Usamos window.location en lugar de navigate para forzar
    // la recarga de la página y limpiar cualquier estado en memoria (Contexts, variables, etc.)
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

  // --- LOGIN BUTTON (Renderizado condicional) ---
  if (!username) {
    return (
      <>
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-3 px-6 py-3 rounded-full 
                       bg-white/5 backdrop-blur-2xl border border-white/10 
                       text-white transition-all duration-300
                       hover:bg-white/10 group shadow-lg hover:shadow-cyan-500/20"
          >
            <LogIn className="w-[1.2rem] h-[1.2rem] !text-white opacity-80 group-hover:opacity-100" />
            <span className="text-xs font-bold tracking-widest text-white opacity-80 group-hover:opacity-100">INGRESAR</span>
          </button>
        </div>
        {showLogin && (
          <LoginModal
            onClose={() => {
              setShowLogin(false);
              // Recargamos datos tras el login exitoso
              setUsername(localStorage.getItem("username"));
              setRol(localStorage.getItem("rol"));
            }}
          />
        )}
      </>
    );
  }

  // --- ESTILOS DE ENLACE ---
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 group
    ${
      isActive
        ? "bg-white/20 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
        : "hover:bg-white/5 border border-transparent"
    }`;

  const iconClass = (isActive: boolean) => 
    `w-[1.4rem] h-[1.4rem] transition-all duration-300 !text-white ${isActive ? 'opacity-100 scale-105' : 'opacity-50 group-hover:opacity-100'}`;

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col items-center py-6 px-3 gap-8
                        bg-black/20 backdrop-blur-[50px]
                        border border-white/10 rounded-full shadow-2xl">
        
        {/* Logo */}
        <div 
            className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity p-2 hover:scale-110 duration-300"
            onClick={() => navigate("/")}
        >
            <img src="/assets/Logo-PNG.png" alt="Logo" className="w-8 h-8 object-contain" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          {getLinks().map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {({ isActive }) => (
                <>
                  {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>
                  )}
                  {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>
                  )}
                  
                  <link.icon className={iconClass(isActive)} strokeWidth={1.5} />
                  
                  {/* Tooltip */}
                  <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0">
                    <span className="bg-black/60 backdrop-blur-xl text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/10 whitespace-nowrap shadow-xl">
                      {link.label}
                    </span>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Separador */}
        <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        {/* Footer Actions */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 text-white font-bold text-sm shadow-inner">
            {username?.charAt(0).toUpperCase()}
          </div>
          
          <button
            onClick={handleLogout} // Usamos la nueva función
            className="p-3 rounded-full hover:bg-red-500/20 hover:border-red-500/30 border border-transparent transition-all duration-300 group"
            title="Cerrar Sesión"
          >
            <LogOut className="w-[1.2rem] h-[1.2rem] !text-white opacity-50 group-hover:opacity-100 group-hover:text-red-200" strokeWidth={1.5} />
          </button>
        </div>
      </aside>

      {/* ================= MOBILE NAV ================= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-40"></div>

      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-20 z-50 rounded-full px-4
                      flex items-center justify-between
                      bg-black/40 backdrop-blur-[40px] border border-white/10 shadow-2xl">
        
        {getLinks().map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => 
            `relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
            ${isActive ? 'bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)]' : ''}`
          }>
            {({ isActive }) => (
              <>
                 {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                  )}
                 <link.icon className={iconClass(isActive)} strokeWidth={1.5} />
              </>
            )}
          </NavLink>
        ))}

        <button 
          onClick={handleLogout} // Usamos la nueva función aquí también
          className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-red-500/20 transition-colors border border-transparent hover:border-red-500/30"
        >
          <LogOut className="w-[1.4rem] h-[1.4rem] !text-white opacity-50" strokeWidth={1.5} />
        </button>
      </nav>
    </>
  );
};

export default Sidebar;