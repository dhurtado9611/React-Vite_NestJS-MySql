// src/components/RutaProtegidaInvitado.tsx
import { Navigate } from 'react-router-dom';

const RutaProtegidaInvitado = ({ children }: { children: JSX.Element }) => {
  const datosTurno = localStorage.getItem('datosTurno');

  if (!datosTurno) {
    alert('Debes iniciar un turno antes de acceder.');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutaProtegidaInvitado;