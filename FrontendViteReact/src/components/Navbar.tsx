import { Link, useNavigate } from 'react-router-dom';
import { getToken, logout } from '../services/authService';

const Navbar = () => {
  const token = getToken(); // Si hay token => Usuario autenticado
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Elimina el token del localStorage
    navigate('/login'); // Redirige a la página de login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Reservas App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!token ? (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Iniciar Sesión
                </Link>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/reservas">
                    Reservas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/historial">
                    Historial
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger" onClick={handleLogout}>
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
