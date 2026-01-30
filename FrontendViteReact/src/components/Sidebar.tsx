import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  CalendarPlus,
  Home,
  Clock,
  ShoppingCart,
  BarChart3,
  LogIn,
  LogOut,
  UserCircle
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

  // Enlaces según el rol
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

  // Renderizado condicional estricto: Si no hay usuario, el sidebar principal no se monta.
  // Pero necesitamos renderizar el Modal y un botón de acceso.
  if (!username) {
    return (
      <>
        {/* Botón flotante minimalista para Login cuando no hay sesión */}
        <div className="fixed top-5 right-5 z-50">
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 group"
          >
            <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Ingresar</span>
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

  // Estilos dinámicos para los enlaces
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group
    ${
      isActive
        ? "bg-neutral-800 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] scale-105" // Efecto Neón Rojo Activo
        : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
    }`;

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-24 bg-[#0a0a0a] border-r border-neutral-900 shadow-2xl z-50 flex-col justify-between py-8 items-center">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-2 bg-white/5 rounded-full mb-4">
             {/* Asegura que el logo tenga fondo transparente o se vea bien sobre negro */}
            <img src="/assets/Logo-PNG.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
          </div>
          <div className="h-[1px] w-10 bg-neutral-800"></div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-6 w-full items-center">
          {getLinks().map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass} title={link.label}>
              {({ isActive }) => (
                <>
                  {/* Notificación (Punto rojo o número) */}
                  {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] text-white font-bold animate-pulse ring-2 ring-[#0a0a0a]">
                      {vencidas}
                    </span>
                  )}
                  
                  <link.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  
                  {/* Tooltip Hover (Opcional, para mantenerlo limpio) */}
                  <span className={`absolute left-14 bg-neutral-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-neutral-800 pointer-events-none`}>
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions (Perfil + Logout) */}
        <div className="flex flex-col items-center gap-4">
           {/* Avatar minimalista */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 text-white flex items-center justify-center font-bold text-sm border border-neutral-700 shadow-inner">
            {username.charAt(0).toUpperCase()}
          </div>
          
          <button
            onClick={logout}
            className="group flex items-center justify-center w-10 h-10 text-neutral-500 hover:text-red-500 transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </aside>

      {/* ================= MOBILE NAV (Glassmorphism) ================= */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-black/80 backdrop-blur-md border border-neutral-800 rounded-2xl flex items-center justify-between px-6 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        
        {getLinks().map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => 
            `flex flex-col items-center justify-center gap-1 transition-all ${isActive ? 'text-red-500 -translate-y-1' : 'text-neutral-400'}`
          }>
            {({ isActive }) => (
              <div className="relative">
                 {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
                  )}
                <link.icon size={20} />
                {isActive && <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></span>}
              </div>
            )}
          </NavLink>
        ))}

        <button onClick={logout} className="text-neutral-500 hover:text-red-500">
          <LogOut size={20} />
        </button>
      </nav>
    </>
  );
};

export default SidebarActividadContador;