import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FormularioTurno from './FormularioTurno';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<string | null>(null);
  const [turnoIniciado, setTurnoIniciado] = useState(false);
  const [datosTurno, setDatosTurno] = useState<null | {
    colaborador: string;
    turno: string;
    fecha: string;
  }>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      const { access_token, rol, usernamee } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('rol', rol);
      localStorage.setItem('username', usernamee);

      setRol(rol);
    } catch (error) {
      console.error(error);
      setError('Usuario o contraseña incorrectos');
    }
  };

  const handleTurnoSubmit = (data: { colaborador: string; turno: string; fecha: string }) => {
    localStorage.setItem('datosTurno', JSON.stringify(data));
    setDatosTurno(data);
    setTurnoIniciado(true);
  };

  useEffect(() => {
    const turnoGuardado = localStorage.getItem('datosTurno');
    if (rol === 'invitado' && turnoGuardado) {
      setTurnoIniciado(true);
      setDatosTurno(JSON.parse(turnoGuardado));
    }
  }, [rol]);

  if (rol === 'invitado' && !turnoIniciado) {
    return <FormularioTurno onSubmit={handleTurnoSubmit} />;
  }

  if (rol === 'admin') {
    navigate('/reservas');
    return null;
  }

  if (rol === 'invitado' && turnoIniciado) {
    navigate('/crear-reservas');
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md border border-red-700 p-8 rounded-2xl shadow-xl w-full max-w-sm text-white">
        <h1 className="text-2xl font-semibold text-center mb-6 text-red-500">Inicio de Sesión</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-600 text-white px-4 py-2 rounded-md text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm mb-1 text-white">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 bg-black border border-red-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="nombreusuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1 text-white">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-black border border-red-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition-colors"
          >
            Iniciar Sesión
          </button>

          <p className="text-center text-xs text-white mt-4">
            &copy; {new Date().getFullYear()} Reservas App
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;