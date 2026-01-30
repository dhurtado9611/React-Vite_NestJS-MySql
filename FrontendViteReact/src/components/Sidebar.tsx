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

  // --- LOGIN BUTTON (Sin cambios lógicos, solo estéticos si se requiere) ---
  if (!username) {
    return (
      <>
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-3 px-5 py-2.5 rounded-full 
                       bg-white/5 backdrop-blur-2xl border border-white/10 
                       shadow-[0_4px_24px_-1px_rgba(0,0,0,0.2)]
                       text-white transition-all duration-500
                       hover:bg-white/10 hover:border-white/20 group"
          >
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

  // --- ESTILOS ICONOS: BLANCO PURO + CONTROL DE OPACIDAD ---
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-500 group
    ${
      isActive
        ? "bg-white/10 backdrop-blur-md border border-white/10 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]" // Activo: Vidrio Iluminado
        : "text-white/50 hover:text-white border border-transparent hover:bg-white/5" // Inactivo: Transparente y atenuado (Blanco al 50%)
    }`;

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 z-50 flex-col py-8 items-center
                        bg-black/20 backdrop-blur-[40px]
                        border-r border-white/5 shadow-[5px_0_30px_-10px_rgba(0,0,0,0.5)]
      ">
        
        {/* GRUPO SUPERIOR: LOGO + NAV */}
        <div className="flex flex-col items-center w-full gap-8">
            
            {/* Logo */}
            <div className="opacity-90 hover:opacity-100 transition-opacity duration-500 cursor-pointer" onClick={() => navigate("/")}>
                <img src="/assets/Logo-PNG.png" alt="Logo" className="w-9 h-9 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]" />
            </div>

            {/* Navigation (Justo debajo del logo) */}
            <nav className="flex flex-col gap-3 w-full px-3">
            {getLinks().map((link) => (
                <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {({ isActive }) => (
                    <>
                    {/* Punto de notificación */}
                    {link.label === "Actividad" && vencidas > 0 && (
                        <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(220,38,38,1)] animate-pulse"></span>
                    )}
                    
                    <link.icon className={`w-[1.4rem] h-[1.4rem] transition-transform duration-500 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'scale-100'}`} strokeWidth={1.5} />
                    
                    {/* Tooltip */}
                    <div className="absolute left-14 pl-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
                        <span className="bg-black/80 backdrop-blur-md text-white/90 text-[10px] uppercase tracking-wider px-2 py-1 rounded border border-white/10 whitespace-nowrap">
                        {link.label}
                        </span>
                    </div>
                    </>
                )}
                </NavLink>
            ))}
            </nav>
        </div>

        {/* GRUPO INFERIOR: PERFIL (Empujado al fondo con mt-auto) */}
        <div className="mt-auto flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs text-white border border-white/10 font-light tracking-tighter shadow-inner">
            {username?.charAt(0).toUpperCase()}
          </div>
          
          <button
            onClick={logout}
            className="text-white/40 hover:text-white transition-colors duration-300 pb-2"
            title="Salir"
          >
            <LogOut className="w-[1.2rem] h-[1.2rem]" strokeWidth={1.5} />
          </button>
        </div>
      </aside>


      {/* ================= MOBILE VERSION ================= */}
      
      {/* 1. Fondo Gradiente "Dock" (Efecto de suelo) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-40"></div>

      {/* 2. Barra Flotante */}
      <nav className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 z-50 rounded-[2rem] px-6
                      flex items-center justify-between
                      bg-white/5 backdrop-blur-[30px] /* Vidrio muy transparente */
                      border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]
      ">
        
        {getLinks().map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => 
            `relative flex items-center justify-center p-2 rounded-xl transition-all duration-300
            ${isActive ? 'text-white' : 'text-white/50'}` 
          }>
            {({ isActive }) => (
              <>
               {/* Luz de fondo solo si está activo */}
               {isActive && (
                  <div className="absolute inset-0 bg-white/10 blur-md rounded-full"></div>
               )}

               <div className="relative z-10">
                 {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(220,38,38,1)]"></span>
                  )}
                 <link.icon className={`w-[1.5rem] h-[1.5rem] ${isActive ? 'drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : ''}`} strokeWidth={1.5} />
               </div>
              </>
            )}
          </NavLink>
        ))}

        <button onClick={logout} className="text-white/50 hover:text-white transition-colors">
          <LogOut className="w-[1.4rem] h-[1.4rem]" strokeWidth={1.5} />
        </button>
      </nav>
    </>
  );
};

export default Sidebar;