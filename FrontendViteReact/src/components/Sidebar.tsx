import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, CalendarPlus, ListChecks, BarChart3, LogIn, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoSrc from "../assets/Logo-PNG.png";
import LoginModal from "./LoginModal";

const SidebarResponsive = () => {
  const [open, setOpen] = useState(false);
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
          { to: "/admin", icon: <BarChart3 />, label: "Admin" },
        ]
      : rol === "invitado"
      ? [
          { to: "/", icon: <Home />, label: "Inicio" },
          { to: "/crear-reservas", icon: <CalendarPlus />, label: "Crear Reserva" },
          { to: "/historial-invitado", icon: <ListChecks />, label: "Historial" },
        ]
      : [];

  return (
    <div className="relative">
      <button
        className="fixed top-4 left-4 z-40 bg-gradient-to-b from-red-900 to-black text-white p-2 rounded-full lg:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-y-0 left-0 w-20 bg-gradient-to-b from-red-900 to-black text-white shadow-lg z-40 flex flex-col justify-between items-center py-6 rounded-tr-3xl rounded-br-3xl"
          >
            <div className="flex flex-col items-center gap-6 mt-14">
              <img src={logoSrc} alt="Logo" className="w-10 h-10 rounded-full bg-white p-1" />
              <nav className="flex flex-col gap-4 items-center">
                {username &&
                  links.map((link, index) => (
                    <NavLink
                      key={index}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${isActive ? "bg-white text-red-700" : "hover:bg-red-800"}`
                      }
                      title={link.label}
                    >
                      {link.icon}
                    </NavLink>
                  ))}
                {!username && (
                  <button
                    onClick={() => setShowLogin(true)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-yellow-400 text-white"
                    title="Iniciar Sesión"
                  >
                    <LogIn />
                  </button>
                )}
                {username && (
                  <button
                    onClick={logout}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-500 text-white"
                    title="Cerrar Sesión"
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
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebar escritorio */}
      <aside className="hidden lg:flex lg:flex-col lg:w-20 bg-gradient-to-b from-red-900 to-black text-white py-6 fixed left-0 top-0 z-50 items-center justify-between h-screen rounded-tr-3xl rounded-br-3xl">
        <div className="flex flex-col items-center gap-6">
          <img src={logoSrc} alt="Logo" className="w-10 h-10 rounded-full bg-white p-1" />
          <nav className="flex flex-col gap-4 items-center">
            {username &&
              links.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.to}
                  className={({ isActive }) =>
                    `w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${isActive ? "bg-white text-red-700" : "hover:bg-red-800"}`
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