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
    const storedUser = localStorage.getItem("username");
    const storedRol = localStorage.getItem("rol");
    setUsername(storedUser);
    setRol(storedRol);

    const leerAlertas = () => {
      const cantidad = localStorage.getItem("alertasHabitaciones");
      setVencidas(cantidad ? parseInt(cantidad) : 0);
    };

    leerAlertas();
    const interval = setInterval(leerAlertas, 5000);

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.clear();
    setUsername(null);
    setRol(null);
    navigate("/");
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

  // --- LOGIN BUTTON: Vidrio Flotante Puro ---
  if (!username) {
    return (
      <>
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-3 px-5 py-2.5 rounded-full 
                       bg-white/5 backdrop-blur-2xl border border-white/10 
                       shadow-[0_4px_24px_-1px_rgba(0,0,0,0.2)]
                       text-neutral-300 hover:text-white transition-all duration-500
                       hover:bg-white/10 hover:border-white/20 group"
          >
            {/* Icono escalado al texto */}
            <LogIn className="w-[1.2rem] h-[1.2rem] opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs font-medium tracking-widest opacity-80 group-hover:opacity-100">INGRESAR</span>
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

  // --- ESTILOS DE ENLACE: Pure Liquid Glass (Sin Color) ---
  // Se usa 'w-[1.5rem]' para que el icono escale exactamente con el texto base.
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group
    ${
      isActive
        ? "bg-white/10 backdrop-blur-3xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-white/10 text-white" // Estado Activo: Vidrio Iluminado
        : "text-neutral-500 hover:text-neutral-200 hover:bg-white/5 border border-transparent" // Estado Inactivo: Casi invisible
    }`;

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 z-50 flex-col justify-between py-8 items-center
                        bg-black/20 backdrop-blur-[40px] /* Blur extremo estilo iOS */
                        border-r border-white/5
      ">
        
        {/* Logo: Sutil y monocromático */}
        <div className="mb-6 opacity-80 hover:opacity-100 transition-opacity duration-500">
           <img src="/assets/Logo-PNG.png" alt="Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 w-full px-3">
          {getLinks().map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {({ isActive }) => (
                <>
                  {/* Indicador de notificación: Único elemento con color (funcional) */}
                  {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse"></span>
                  )}
                  
                  {/* Icono: Tamaño relativo a la fuente (rem) */}
                  <link.icon className={`w-[1.4rem] h-[1.4rem] transition-transform duration-500 ${isActive ? 'scale-110 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]' : 'scale-100'}`} strokeWidth={1.5} />
                  
                  {/* Tooltip ultra minimalista */}
                  <div className="absolute left-14 pl-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0 pointer-events-none">
                    <span className="bg-black/60 backdrop-blur-md text-neutral-200 text-[10px] uppercase tracking-wider px-2 py-1 rounded border border-white/5 whitespace-nowrap">
                      {link.label}
                    </span>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs text-neutral-300 border border-white/5 font-light tracking-tighter">
            {username.charAt(0).toUpperCase()}
          </div>
          
          <button
            onClick={logout}
            className="text-neutral-600 hover:text-white transition-colors duration-300"
            title="Salir"
          >
            <LogOut className="w-[1.2rem] h-[1.2rem]" strokeWidth={1.5} />
          </button>
        </div>
      </aside>

      {/* ================= MOBILE NAV (ISLA FLOTANTE DE CRISTAL) ================= */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 z-50 rounded-[2rem] px-6
                      flex items-center justify-between
                      bg-neutral-900/40 backdrop-blur-[30px] /* Efecto Vidrio Profundo */
                      border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]
      ">
        
        {getLinks().map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => 
            `relative flex items-center justify-center p-2 rounded-xl transition-all duration-500 
            ${isActive ? 'text-white' : 'text-neutral-500'}`
          }>
            {({ isActive }) => (
              <>
               {/* Fondo activo sutil (destello de luz) */}
               {isActive && (
                  <div className="absolute inset-0 bg-white/10 blur-lg rounded-full"></div>
               )}

               <div className="relative z-10">
                 {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                  )}
                 <link.icon className="w-[1.4rem] h-[1.4rem]" strokeWidth={1.5} />
               </div>
              </>
            )}
          </NavLink>
        ))}

        <button onClick={logout} className="text-neutral-600 hover:text-white transition-colors">
          <LogOut className="w-[1.2rem] h-[1.2rem]" strokeWidth={1.5} />
        </button>
      </nav>
    </>
  );
};

export default Sidebar;