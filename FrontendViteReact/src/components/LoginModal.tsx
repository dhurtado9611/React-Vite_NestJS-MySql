import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import FormularioTurno from './FormularioTurno';

const LoginModal = ({ onClose }: { onClose: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mostrarModalTurno, setMostrarModalTurno] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      const {
        access_token,
        user: { rol, username: nombreUsuario, id }
      } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('rol', rol);
      localStorage.setItem('username', nombreUsuario);
      localStorage.setItem('userId', id.toString());

      if (rol === 'invitado') {
        const token = access_token;
        const fechaHoy = new Date().toISOString().split('T')[0];

        try {
          const cuadreResponse = await api.get('/cuadre', {
            headers: { Authorization: `Bearer ${token}` }
          });

          const turnoAbierto = cuadreResponse.data.find(
            (item: any) =>
              item.colaborador === nombreUsuario &&
              item.turnoCerrado === null &&
              item.fecha === fechaHoy
          );

          if (turnoAbierto) {
            localStorage.setItem(
              'datosTurno',
              JSON.stringify({
                colaborador: turnoAbierto.colaborador,
                turno: turnoAbierto.turno,
                fecha: turnoAbierto.fecha,
                basecaja: turnoAbierto.basecaja,
                idCuadre: turnoAbierto.id
              })
            );

            onClose();
            navigate('/CrearReservasInvitado');
            return;
          }
        } catch (error) {
          console.error('Error validando sesión de turno:', error);
        }

        setMostrarModalTurno(true);
      } else {
        onClose();
        navigate('/reservas');
      }
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  const handleTurnoSubmit = (data: { colaborador: string; turno: string; fecha: string }) => {
    localStorage.setItem('datosTurno', JSON.stringify(data));
    setMostrarModalTurno(false);
    onClose();
    navigate('/CrearReservasInvitado');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {!mostrarModalTurno ? (
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl w-[350px] border border-red-600 shadow-xl relative text-white">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-red-400"
          >
            <FaTimes />
          </button>

          <h2 className="text-xl font-semibold mb-4 text-center text-red-500">Inicio de Sesión</h2>

          {error && (
            <div className="bg-red-600 text-white px-4 py-2 rounded-md text-sm text-center mb-3">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-black/70 border border-red-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Tu usuario"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-black/70 border border-red-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      ) : (
        <FormularioTurno onSubmit={handleTurnoSubmit} />
      )}
    </div>
  );
};

export default LoginModal;