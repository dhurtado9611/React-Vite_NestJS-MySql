import { useEffect, useState } from 'react';
import api from '../services/api';

const Logo = ({ cargando }: { cargando: boolean }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!cargando) {
      setProgress(100);
      return;
    }

    let start = 0;
    const interval = setInterval(() => {
      start += 5;
      if (start >= 95) return;
      setProgress(start);
    }, 100);

    return () => clearInterval(interval);
  }, [cargando]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="relative w-48 h-48">
        <svg className="absolute top-0 left-0 w-full h-full transform rotate-[-90deg]" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#1f2937"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#38bdf8"
            strokeWidth="10"
            fill="none"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="w-20 h-20" />
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await api.get('/reservas');
        // puedes cargar más datos aquí si es necesario
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  return <Logo cargando={cargando} />;
};

export default Home;