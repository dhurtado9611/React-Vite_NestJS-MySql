import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, logout } from '../services/authService';

const Navbar = () => {
  const token = getToken();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isOpen, setIsOpen] = useState(false);

  // Actualiza la hora cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark shadow">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand text-white fw-bold" to="/">
          Reservas App
        </Link>

        {/* Hora */}
        <span className="text-white ms-3 fw-light d-none d-md-block">
          {currentTime}
        </span>

        {/* Botón para colapsar en pantallas pequeñas */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        >
          <i className="bi bi-list text-white fs-2"></i>
        </button>

        {/* Opciones de navegación */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {!token ? (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/login">
                  Iniciar Sesión
                </Link>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/reservas">
                    Reservas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/historial">
                    Historial
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <button
                    className="btn btn-outline-light px-3 py-1 rounded-pill"
                    onClick={handleLogout}
                    style={{
                      transition: 'background-color 0.3s ease, transform 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;