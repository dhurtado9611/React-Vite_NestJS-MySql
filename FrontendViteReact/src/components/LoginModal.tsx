import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import FormularioTurno from './FormularioTurno';

const LoginModal = ({ onClose }: { onClose: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mostrarModalTurno, setMostrarModalTurno] = useState(false);
  const [rol, setRol] = useState<string | null>(null);
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

      setRol(rol);

      if (rol === 'invitado') {
        const datosTurno = localStorage.getItem('datosTurno');
        const token = access_token;

        if (datosTurno) {
          const { colaborador, turno, fecha, basecaja } = JSON.parse(datosTurno);
          try {
            const cuadreResponse = await api.get('/cuadre', {
              headers: { Authorization: `Bearer ${token}` }
            });

            const turnoActivo = cuadreResponse.data.find(
              (item: any) =>
                item.colaborador === colaborador &&
                item.turno === turno &&
                item.fecha === fecha &&
                item.basecaja === basecaja &&
                item.turnoCerrado === null
            );

            if (turnoActivo) {
              onClose();
              navigate('/crear-reservas');
              return;
            }
          } catch (error) {
            console.error('Error validando sesión previa de invitado:', error);
          }
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
    navigate('/crear-reservas');
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