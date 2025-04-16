// Sidebar unificado moderno con fondo traslúcido oscuro y bordes redondeados
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  CalendarPlus,
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

  const links =
    rol === "admin"
      ? [
          { to: "/", icon: <Home />, label: "Inicio" },
          { to: "/reservas", icon: <CalendarPlus />, label: "Reservas" },
          { to: "/historial", icon: <ListChecks />, label: "Historial" },
          { to: "/admin", icon: <BarChart3 />, label: "Admin" }
        ]
      : rol === "invitado"
      ? [
          { to: "/", icon: <Home />, label: "Inicio" },
          { to: "/crear-reservas", icon: <CalendarPlus />, label: "Crear Reserva" },
          { to: "/historial-invitado", icon: <ListChecks />, label: "Historial" }
        ]
      : [];

  return (
    <div className="relative">
      {/* Sidebar escritorio */}
      <aside className="hidden lg:flex lg:flex-col lg:w-20 bg-black/60 backdrop-blur-md text-white py-6 fixed left-4 top-4 z-50 items-center justify-between h-[90vh] rounded-3xl">
        <div className="flex flex-col items-center gap-6">
          <img src={logoSrc} alt="Logo" className="w-10 h-10 rounded-full bg-white p-1" />
          <nav className="flex flex-col gap-4 items-center">
            {username &&
              links.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.to}
                  className={({ isActive }) =>
                    `w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                      isActive ? "bg-white text-black" : "hover:bg-gray-700"
                    }`
                  }
                  title={link.label}
                >
                  {link.icon}
                </NavLink>
              ))}
            {!username && (
              <button
                onClick={() => setShowLogin(true)}
                title="Iniciar Sesión"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-yellow-400 text-white"
              >
                <LogIn />
              </button>
            )}
            {username && (
              <button
                onClick={logout}
                title="Cerrar Sesión"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-500 text-white"
              >
                <LogOut />
              </button>
            )}
          </nav>
        </div>
        {username && (
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
      </aside>

      {/* Móvil: barra inferior tipo app */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 h-20 bg-black/60 backdrop-blur-md text-white flex justify-around items-center z-50 rounded-3xl shadow-lg">
        {username &&
          links.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              className={({ isActive }) =>
                `text-2xl transition-colors duration-300 ${
                  isActive ? "text-yellow-300" : "hover:text-red-400"
                }`
              }
              title={link.label}
            >
              {link.icon}
            </NavLink>
          ))}
        {!username && (
          <button
            onClick={() => setShowLogin(true)}
            title="Iniciar Sesión"
            className="text-white text-2xl hover:text-yellow-400"
          >
            <LogIn />
          </button>
        )}
        {username && (
          <button
            onClick={logout}
            title="Cerrar Sesión"
            className="text-white text-2xl hover:text-red-400"
          >
            <LogOut />
          </button>
        )}
      </div>

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