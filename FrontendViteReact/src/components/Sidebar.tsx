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

  // --- LOGIN BUTTON ---
  if (!username) {
    return (
      <>
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-3 px-6 py-3 rounded-full 
                       bg-white/5 backdrop-blur-2xl border border-white/10 
                       text-white transition-all duration-300
                       hover:bg-white/10 group"
          >
            <LogIn className="w-[1.2rem] h-[1.2rem] !text-white opacity-80 group-hover:opacity-100" />
            <span className="text-xs font-bold tracking-widest text-white opacity-80 group-hover:opacity-100">INGRESAR</span>
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

  // --- ESTILOS DE ENLACE: Círculos Perfectos y Blanco Puro ---
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 group
    ${
      isActive
        ? "bg-white/20 backdrop-blur-md border border-white/10" // Activo: Círculo de vidrio iluminado
        : "hover:bg-white/5 border border-transparent" // Inactivo: Transparente
    }`;

  // Clase común para el icono para asegurar color BLANCO siempre
  const iconClass = (isActive: boolean) => 
    `w-[1.4rem] h-[1.4rem] transition-all duration-300 !text-white ${isActive ? 'opacity-100 scale-105' : 'opacity-50 group-hover:opacity-100'}`;

  return (
    <>
      {/* ================= DESKTOP SIDEBAR (CÁPSULA FLOTANTE) ================= */}
      <aside className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col items-center py-6 px-3 gap-8
                        bg-black/20 backdrop-blur-[50px] /* Blur Extremo sin color sólido */
                        border border-white/10 rounded-full /* Cápsula redonda */
                        /* Sin shadows box-shadow eliminados */
      ">
        
        {/* Logo Clickable */}
        <div 
            className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity p-2"
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
                  {/* Punto de notificación dentro del botón circular */}
                  {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                  )}
                  
                  {/* Icono forzado a blanco con !text-white */}
                  <link.icon className={iconClass(isActive)} strokeWidth={1.5} />
                  
                  {/* Tooltip Flotante a la derecha */}
                  <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-2 group-hover:translate-x-0">
                    <span className="bg-black/40 backdrop-blur-md text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/10 whitespace-nowrap">
                      {link.label}
                    </span>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Separador sutil */}
        <div className="w-8 h-[1px] bg-white/10"></div>

        {/* Footer Actions */}
        <div className="flex flex-col items-center gap-4">
          {/* Avatar Circular */}
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white font-light text-sm">
            {username?.charAt(0).toUpperCase()}
          </div>
          
          <button
            onClick={logout}
            className="p-3 rounded-full hover:bg-white/5 transition-colors group"
            title="Salir"
          >
            <LogOut className="w-[1.2rem] h-[1.2rem] !text-white opacity-50 group-hover:opacity-100" strokeWidth={1.5} />
          </button>
        </div>
      </aside>


      {/* ================= MOBILE NAV (ISLA FLOTANTE NATURAL) ================= */}
      
      {/* Fondo Gradiente Suave para legibilidad (sin bordes duros) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-40"></div>

      {/* Barra de Navegación Móvil */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-sm h-18 z-50 rounded-full px-2
                      flex items-center justify-between
                      bg-black/30 backdrop-blur-[40px] /* Vidrio oscuro natural */
                      border border-white/10 
                      /* Sin shadows pesadas */
      ">
        
        {getLinks().map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => 
            `relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 mx-1
            ${isActive ? 'bg-white/15' : ''}` // Fondo circular sutil al estar activo
          }>
            {({ isActive }) => (
              <>
                 {/* Indicador Actividad */}
                 {link.label === "Actividad" && vencidas > 0 && (
                    <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                  )}
                 
                 {/* Icono Blanco Puro */}
                 <link.icon className={iconClass(isActive)} strokeWidth={1.5} />
              </>
            )}
          </NavLink>
        ))}

        {/* Botón Logout Móvil */}
        <button onClick={logout} className="flex items-center justify-center w-14 h-14 rounded-full hover:bg-white/5 transition-colors">
          <LogOut className="w-[1.4rem] h-[1.4rem] !text-white opacity-50" strokeWidth={1.5} />
        </button>
      </nav>
    </>
  );
};

export default Sidebar;