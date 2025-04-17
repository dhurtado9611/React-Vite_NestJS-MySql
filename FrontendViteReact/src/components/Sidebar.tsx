import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  CalendarPlus,
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

  return (
    <div className="relative">
      {/* Sidebar escritorio */}
      <aside className="hidden md:flex fixed top-0 bottom-0 w-20 bg-white text-black z-50 flex-col justify-between items-center py-6 border-r border-black shadow-xl">
        <div className="flex flex-col items-center gap-6">
          <img
            src={logoSrc}
            alt="Logo"
            className="w-16 h-16 rounded-full bg-white p-[2px] shadow"
          />
          <nav className="flex flex-col gap-2 items-center text-xs">
            {!username && (
              <NavLink
                to="/ReservarCliente"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 w-10 h-10 justify-center rounded-full transform transition-all duration-300 ${
                    isActive ? "bg-black text-white scale-110" : "hover:scale-105 hover:bg-gray-200 text-black"
                  }`
                }
                title="Reservar"
              >
                {({ isActive }) => (
                  <>
                    <CalendarPlus className={isActive ? "text-white" : "text-black"} />
                    <span className="text-[10px]">Reservar</span>
                  </>
                )}
              </NavLink>
            )}
            {!username && (
              <button
                onClick={() => setShowLogin(true)}
                title="Iniciar Sesión"
                className="flex flex-col items-center gap-1 w-10 h-10 justify-center rounded-full transform transition-all hover:scale-105 hover:bg-yellow-300 text-black"
              >
                <LogIn className="text-black" />
                <span className="text-[10px]">Login</span>
              </button>
            )}
            {username && (
              <button
                onClick={logout}
                title="Cerrar Sesión"
                className="flex flex-col items-center gap-1 w-10 h-10 justify-center rounded-full transform transition-all hover:scale-105 hover:bg-red-100 text-black"
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
        <div className="flex flex-col items-center gap-1">
          <img
            src={logoSrc}
            alt="Logo"
            className="w-10 h-10 rounded-full bg-white p-[2px] shadow"
          />
        </div>
        <NavLink
          to="/ReservarCliente"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 w-10 h-10 justify-center rounded-full transform transition duration-200 ${
              isActive ? "bg-black text-white scale-110" : "hover:scale-105 hover:bg-gray-200 text-black"
            }`
          }
          title="Reservar"
        >
          {({ isActive }) => (
            <>
              <CalendarPlus className={isActive ? "text-white" : "text-black"} />
              <span className="text-[10px]">Reservar</span>
            </>
          )}
        </NavLink>
        <button
          onClick={() => setShowLogin(true)}
          title="Iniciar Sesión"
          className="flex flex-col items-center gap-1 w-10 h-10 justify-center rounded-full transform transition-all hover:scale-105 hover:bg-yellow-300 text-black"
        >
          <LogIn className="text-black" />
          <span className="text-[10px]">Login</span>
        </button>
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