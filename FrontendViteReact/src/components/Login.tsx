import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      console.log('Resultado:', result);
      alert('Inicio de sesión exitoso');
      navigate('/reservas');
    } catch (error) {
      console.error('Error en login:', error);
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg border-0 rounded-4" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body p-4">
          <h2 className="text-center mb-4 fw-bold text-primary">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            {/* ✅ Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Correo electrónico</label>
              <input
                type="email"
                className="form-control rounded-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Ingresa tu correo"
                style={{
                  transition: 'border-color 0.2s ease-in-out',
                  border: '1px solid #ced4da',
                  boxShadow: 'none',
                }}
              />
            </div>

            {/* ✅ Contraseña */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Contraseña</label>
              <input
                type="password"
                className="form-control rounded-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
                style={{
                  transition: 'border-color 0.2s ease-in-out',
                  border: '1px solid #ced4da',
                  boxShadow: 'none',
                }}
              />
            </div>

            {/* ✅ Botón */}
            <button
              type="submit"
              className="btn btn-primary w-100 rounded-3 fw-semibold"
              style={{
                transition: 'background-color 0.3s ease-in-out, transform 0.2s ease',
                backgroundColor: '#0d6efd',
                borderColor: '#0d6efd',
                padding: '12px',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;