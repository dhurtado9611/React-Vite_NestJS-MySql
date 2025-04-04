import { Navigate } from 'react-router-dom';

const RutaProtegidaAdmin = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  // Si no hay token o el rol no es admin, redirige a login
  if (!token || rol !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutaProtegidaAdmin;