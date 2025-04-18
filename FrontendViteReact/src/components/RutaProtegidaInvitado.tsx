import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

const RutaProtegidaInvitado = ({ children }: { children: ReactNode }) => {
  const datosTurno = localStorage.getItem('datosTurno');

  if (!datosTurno) {
    alert('Debes iniciar un turno antes de acceder.');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RutaProtegidaInvitado;