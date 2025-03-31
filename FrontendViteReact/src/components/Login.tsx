import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login: React.FC = () => {
  const [username, setUsername] = useState(''); // Cambiado de email a username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(username, password); // Usamos username
    if (result) {
      navigate('/reservas'); // Redirige a reservas si el login es exitoso
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <main className="form-signin w-100 m-auto">
      <form onSubmit={handleLogin}>
        <h1 className="h3 mb-3 fw-normal text-center text-white">Inicio de Sesión</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-floating mb-2">
          <input
            type="text"
            className="form-control rounded-3"
            id="floatingInput"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="floatingInput">Nombre de usuario</label>
        </div>
        <div className="form-floating mb-2">
          <input
            type="password"
            className="form-control rounded-3"
            id="floatingPassword"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="floatingPassword">Contraseña</label>
        </div>

        <button className="btn btn-primary w-100 py-2" type="submit">
          Iniciar Sesión
        </button>

        <p className="mt-5 mb-3 text-white text-center">&copy; {new Date().getFullYear()}</p>
      </form>
    </main>
  );
};

export default Login;
