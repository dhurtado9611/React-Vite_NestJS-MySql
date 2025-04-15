import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, CalendarPlus, ListChecks, BarChart3, LogIn, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoSrc from "../assets/Logo-PNG.png";
import LoginModal from "./LoginModal";

const Sidebar = () => {
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
      {/* Botón móvil */}
      <button
        className="fixed top-4 left-4 z-50 bg-black/70 text-white p-2 rounded-full lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Home />
      </button>

      {/* Drawer móvil */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white shadow-lg z-40 flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <img src={logoSrc} alt="Logo" className="w-10 h-10 rounded-full" />
                <span className="text-lg font-semibold">Menú</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-white">
                <LogOut />
              </button>
            </div>
            <nav className="space-y-4">
              {username &&
                links.map((link, index) => (
                  <NavLink
                    key={index}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 text-lg ${isActive ? "text-red-500" : "text-white"}`
                    }
                  >
                    {link.icon} {link.label}
                  </NavLink>
                ))}
              {!username && (
                <button onClick={() => setShowLogin(true)} className="flex items-center gap-2 text-yellow-400">
                  <LogIn /> Iniciar Sesión
                </button>
              )}
              {username && (
                <button onClick={logout} className="flex items-center gap-2 text-red-400">
                  <LogOut /> Cerrar Sesión
                </button>
              )}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebar escritorio */}
      <aside className="hidden lg:flex lg:flex-col lg:w-16 bg-black text-white py-4 fixed left-0 top-0 z-50 items-center justify-between h-screen">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src={logoSrc} alt="Logo" className="w-full h-full object-contain p-1" />
        </div>

        <div className="flex flex-col gap-6 mt-6">
          {username &&
            links.map((link, index) => (
              <NavLink
                key={index}
                to={link.to}
                className={({ isActive }) =>
                  `w-6 h-6 cursor-pointer ${isActive ? "text-blue-500" : "text-white"} hover:text-blue-400`
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
              className="w-6 h-6 hover:text-yellow-400"
            >
              <LogIn />
            </button>
          )}
          {username && (
            <button
              onClick={logout}
              title="Cerrar Sesión"
              className="w-6 h-6 hover:text-red-400"
            >
              <LogOut />
            </button>
          )}
        </div>

        {username && (
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-white text-black flex items-center justify-center font-bold text-sm">
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

export default Sidebar;
