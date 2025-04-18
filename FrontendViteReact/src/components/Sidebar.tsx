import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  CalendarPlus,
  Home,
  ListChecks,
  BarChart3,
  LogIn,
  LogOut
} from "lucide-react";
import logoSrc from "../assets/Logo-PNG.png";
import LoginModal from "./LoginModal";

const SidebarResponsive = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    const storedRol = localStorage.getItem("rol");
    setUsername(storedUser);
    setRol(storedRol);
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
        { to: "/reservas", icon: CalendarPlus, label: "Reservas" },
        { to: "/historial", icon: ListChecks, label: "Historial" },
        { to: "/admin", icon: BarChart3, label: "Admin" }
      ];
    } else if (rol === "invitado") {
      return [
        { to: "/", icon: Home, label: "Inicio" },
        { to: "/crear-reservas", icon: CalendarPlus, label: "Crear" },
        { to: "/historial-invitado", icon: ListChecks, label: "Historial" }
      ];
    }
    return [];
  };

  const commonLinkStyle = (isActive: boolean) =>
    `flex flex-col items-center gap-1 w-16 h-16 justify-center transform transition-all duration-300 text-xs ${
      isActive ? "text-red-600 scale-110" : "hover:scale-105 text-black"
    }`;

  return (
    <div className="relative">
      {/* Sidebar escritorio */}
      <aside className="hidden md:flex fixed top-0 bottom-0 w-20 bg-white text-black z-50 flex-col justify-between items-center py-10 gap-8 border-r border-black shadow-xl">
        <div className="flex flex-col items-center gap-10">
          <img
            src={logoSrc}
            alt="Logo"
            className="w-16 h-16 object-contain"
          />
          <nav className="flex flex-col gap-4 items-center text-xs">
            {username &&
              getLinks().map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => commonLinkStyle(isActive)}
                  title={link.label}
                >
                  {({ isActive }) => (
                    <>
                      <link.icon className={isActive ? "text-red-600" : "text-black"} />
                      <span className="text-[10px] text-red-600 ">{link.label}</span>
                    </>
                  )}
                </NavLink>
              ))}

            {!username && (
              <NavLink
                to="/ReservarCliente"
                className={({ isActive }) => commonLinkStyle(isActive)}
                title="Reservar"
              >
                {({ isActive }) => (
                  <>
                    <CalendarPlus className={isActive ? "text-red-600" : "text-black"} />
                    <span className="text-[10px]">Reservar</span>
                  </>
                )}
              </NavLink>
            )}

            {!username && (
              <button
                onClick={() => setShowLogin(true)}
                title="Iniciar Sesión"
                className="flex flex-col items-center gap-1 w-16 h-16 justify-center transform transition-all hover:scale-105 text-black"
              >
                <LogIn className="text-black" />
                <span className="text-[10px]">Login</span>
              </button>
            )}
            {username && (
              <button
                onClick={logout}
                title="Cerrar Sesión"
                className="flex flex-col items-center gap-1 w-16 h-16 justify-center transform transition-all hover:scale-105 text-black"
              >
                <LogOut className="text-black" />
                <span className="text-[10px]">Salir</span>
              </button>
            )}
          </nav>
        </div>
        {username && (
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
      </aside>

      {/* Sidebar móvil inferior */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-black flex items-center justify-around z-50 shadow-inner text-xs">
        <img
          src={logoSrc}
          alt="Logo"
          className="w-10 h-10 object-contain"
        />

        {username &&
          getLinks().map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => commonLinkStyle(isActive)}
              title={link.label}
            >
              {({ isActive }) => (
                <>
                  <link.icon className={isActive ? "text-red-600" : "text-black"} />
                  <span className="text-[10px]">{link.label}</span>
                </>
              )}
            </NavLink>
          ))}

        {!username && (
          <NavLink
            to="/ReservarCliente"
            className={({ isActive }) => commonLinkStyle(isActive)}
            title="Reservar"
          >
            {({ isActive }) => (
              <>
                <CalendarPlus className={isActive ? "text-red-600" : "text-black"} />
                <span className="text-[10px]">Reservar</span>
              </>
            )}
          </NavLink>
        )}

        {!username && (
          <button
            onClick={() => setShowLogin(true)}
            title="Iniciar Sesión"
            className="flex flex-col items-center gap-1 w-16 h-16 justify-center transform transition-all hover:scale-105 text-black"
          >
            <LogIn className="text-black" />
            <span className="text-[10px]">Login</span>
          </button>
        )}

        {username && (
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
      </nav>

      {showLogin && (
        <LoginModal
          onClose={() => {
            setShowLogin(false);
            const storedUser = localStorage.getItem("username");
            const storedRol = localStorage.getItem("rol");
            setUsername(storedUser);
            setRol(storedRol);
          }}
        />
      )}
    </div>
  );
};

export default SidebarResponsive;