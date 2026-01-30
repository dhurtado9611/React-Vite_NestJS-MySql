import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  CalendarPlus,
  Home,
  Clock,
  ShoppingCart,
  BarChart3,
  LogIn,
  LogOut
} from "lucide-react";
import LoginModal from "./LoginModal";

const SidebarActividadContador = () => {
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
        { to: "/", icon: Home, label: "Inicio" },
        { to: "/CrearReservasAdmin", icon: CalendarPlus, label: "Reservas" },
        { to: "/ActividadAdmin", icon: Clock, label: "Actividad" },
        { to: "/Marketplace", icon: ShoppingCart, label: "Tienda" },
        { to: "/AdminDashboard", icon: BarChart3, label: "Admin" }
      ];
    } else if (rol === "invitado") {
      return [
        { to: "/", icon: Home, label: "Inicio" },
        { to: "/CrearReservasInvitado", icon: CalendarPlus, label: "Reservas" },
        { to: "/ActividadInvitado", icon: Clock, label: "Actividad" },
        { to: "/MarketplaceInvitado", icon: ShoppingCart, label: "Tienda" },
      ];
    }
    return [];
  };

  // --- LÓGICA: SI NO HAY USUARIO, SOLO MUESTRA BOTÓN DE LOGIN FLOTANTE ESTILO GLASS ---
  if (!username) {
    return (
      <>
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={() => setShowLogin(true)}
            // Botón estilo vidrio líquido oscuro
            className="flex items-center gap-3 px-6 py-3 rounded-full 
                       bg-black/40 backdrop-blur-xl border border-white/10 
                       shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                       text-white transition-all duration-500
                       hover:bg-red-600/80 hover:shadow-[0_8px_32px_rgba(220,38,38,0.5)] hover:border-red-400/30 group"
          >
            <LogIn size={20} className="text-neutral-300 group-hover:text-white transition-colors" />
            <span className="text-sm font-semibold tracking-wide">INGRESAR</span>
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

  // --- ESTILOS DE LOS ENLACES (LIQUID GLASS BUTTONS) ---
  const navLinkClassDesktop = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500 ease-out group overflow-hidden
    ${
      isActive
        ? "bg-gradient-to-br from-red-500/90 to-red-900/60 backdrop-blur-md text-white shadow-[0_10px_20px_-5px_rgba(220,38,38,0.6),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-red-400/20 scale-105" // Efecto Gota Roja Activa
        : "bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5 hover:border-white/20 backdrop-blur-sm" // Efecto Vidrio Inactivo
    }`;

  return (
    <>
      {/* ================= DESKTOP SIDEBAR (LIQUID GLASS) ================= */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-28 z-50 flex-col justify-between py-10 items-center transition-all
                        bg-black/30 backdrop-blur-2xl /* Fondo de vidrio oscuro y muy borroso */
                        border-r border-white/10 /* Borde de luz sutil */
                        shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] /* Sombra profunda para levantar la barra */
                        supports-[backdrop-filter]:bg-black/20
      ">
        
        {/* Logo Section con efecto de brillo */}
        <div className="relative p-3 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 shadow-inner">
          <img src="/assets/Logo-PNG.png" alt="Logo" className="w-12 h-12 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" />
          {/* Destello de luz decorativo */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/20 blur-3xl rounded-full pointer-events-none mix-blend-overlay"></div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-5 w-full items-center">
          {getLinks().map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClassDesktop}>
              {({ isActive }) => (
                <>
                  {/* Notificación "Líquida" */}
                  {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute top-2 right-2 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                    </span>
                  )}
                  
                  <link.icon size={24} strokeWidth={isActive ? 2.5 : 2} className="z-10 drop-shadow-sm" />

                   {/* Tooltip Glass */}
                   <span className="absolute left-16 px-3 py-2 bg-black/60 backdrop-blur-xl text-white text-xs font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 border border-white/10 shadow-xl pointer-events-none whitespace-nowrap z-20">
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions (Avatar Glass) */}
        <div className="flex flex-col items-center gap-6">
           {/* Avatar estilo esfera de cristal */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-neutral-900 to-neutral-700 flex items-center justify-center font-bold text-base text-white border-2 border-white/10 shadow-[0_8px_16px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.1)]">
            {username.charAt(0).toUpperCase()}
          </div>
          
          <button
            onClick={logout}
            className="group flex items-center justify-center w-12 h-12 rounded-full bg-white/5 hover:bg-red-600/20 border border-white/5 hover:border-red-500/30 text-neutral-400 hover:text-red-500 transition-all duration-300 backdrop-blur-sm"
            title="Cerrar Sesión"
          >
            <LogOut size={22} />
          </button>
        </div>
      </aside>

      {/* ================= MOBILE NAV (LIQUID ISLAND) ================= */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 z-50 flex items-center justify-around px-4 rounded-[2rem]
                      bg-black/50 backdrop-blur-2xl /* Vidrio muy borroso */
                      border border-white/10 /* Borde de luz */
                      shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] /* Sombra de elevación */
      ">
        
        {getLinks().map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => 
            `relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-500 ${isActive ? '' : 'text-neutral-500'}`
          }>
            {({ isActive }) => (
              <>
               {/* Fondo activo líquido para móvil */}
               {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-red-400 rounded-2xl rotate-3 opacity-80 blur-md scale-110 transition-transform"></div>
               )}
               <div className={`relative z-10 flex items-center justify-center w-full h-full rounded-2xl transition-all ${isActive ? 'bg-gradient-to-br from-red-500 to-red-800 text-white shadow-lg border border-red-400/30 scale-110' : 'hover:bg-white/10'}`}>
                  {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-white animate-pulse shadow-[0_0_5px_rgba(255,255,255,0.8)]"></span>
                  )}
                 <link.icon size={24} />
               </div>
              </>
            )}
          </NavLink>
        ))}

        <button onClick={logout} className="flex items-center justify-center w-14 h-14 rounded-2xl text-neutral-500 hover:text-red-500 hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
          <LogOut size={24} />
        </button>
      </nav>
    </>
  );
};

export default SidebarActividadContador;