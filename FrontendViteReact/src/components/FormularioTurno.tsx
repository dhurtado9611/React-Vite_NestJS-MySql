import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Props {
  onSubmit: (data: { colaborador: string; turno: string; fecha: string }) => void;
}

const FormularioTurno = ({ onSubmit }: Props) => {
  const [colaborador, setColaborador] = useState('');
  const [turno, setTurno] = useState('');
  const [turnoCerrado, setTurnoCerrado] = useState(0);
  const [baseCaja, setBaseCaja] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [turnoActivo, setTurnoActivo] = useState<string | null>(null);
  const fechaActual = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    const id = localStorage.getItem('userId');
    if (username) setColaborador(username);
    if (id) setUserId(Number(id));

    const datosTurno = localStorage.getItem('datosTurno');
    if (datosTurno) {
      const { turno, fecha } = JSON.parse(datosTurno);
      const ahora = new Date();
      const turnoDate = new Date(`${fecha}T${turno}`);
      const diferenciaHoras = (ahora.getTime() - turnoDate.getTime()) / (1000 * 60 * 60);

      if (diferenciaHoras < 8) {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate('/');
        }, 3000);
        return;
      } else {
        localStorage.removeItem('datosTurno');
      }
    }

    // Verifica si ya hay un turno activo hoy
    const verificarTurno = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/cuadre', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const turnoHoy = response.data.find(
          (item: any) => item.fecha === fechaActual && item.turnoCerrado === null
        );

        if (turnoHoy) {
          setTurnoActivo(turnoHoy.colaborador);
          setShowAlert(true);
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error) {
        console.error('Error al verificar turno activo:', error);
      }
    };

    verificarTurno();
  }, [navigate, fechaActual]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseCajaNum = Number(baseCaja);
    if (!colaborador || !turno || userId === null || isNaN(baseCajaNum)) {
      alert('Por favor complete todos los campos');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await api.post('/cuadre', {
        colaborador,
        fecha: fechaActual,
        turno,
        turnoCerrado,
        basecaja: baseCajaNum,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.setItem('datosTurno', JSON.stringify({
        colaborador,
        fecha: fechaActual,
        turno,
        turnoCerrado
      }));

      alert('Turno registrado correctamente');
      onSubmit({ colaborador, turno, fecha: fechaActual });
    } catch (error: any) {
      console.error('Error al registrar el turno:', error);
      if (error.response?.status === 400 && error.response.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('No se pudo registrar el turno');
      }
    }    
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-slide-up">
        {showAlert && turnoActivo && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50 text-lg text-center">
            Ya hay un turno abierto por <strong>{turnoActivo}</strong>. No puedes iniciar uno nuevo hasta que finalice el actual.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h3 className="text-center text-2xl font-bold text-gray-800 mb-8">
            Inicio de Turno - Invitado
          </h3>

          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              id="colaborador"
              disabled
              value={colaborador}
              className="block py-3 px-0 w-full text-base text-gray-700 bg-transparent border-0 border-b border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=" "
            />
            <label htmlFor="colaborador" className="absolute text-base text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]">
              Colaborador
            </label>
          </div>

          <div className="relative z-0 w-full mb-6 group">
            <input
              type="time"
              id="turno"
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              required
              step="1"
              className="block py-3 px-0 w-full text-base text-gray-700 bg-transparent border-0 border-b border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=" "
            />
            <label htmlFor="turno" className="absolute text-base text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]">
              Turno (24 horas)
            </label>
          </div>

          <div className="relative z-0 w-full mb-6 group">
            <input
              type="number"
              id="baseCaja"
              value={baseCaja}
              onChange={(e) => setBaseCaja(e.target.value)}
              required
              className="block py-3 px-3 w-full text-base text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder=" "
            />
            <label htmlFor="baseCaja" className="absolute left-3 top-2 text-base text-gray-600 duration-300 transform -translate-y-3 scale-75 origin-[0]">
              Base de Caja
            </label>
          </div>

          <div className="relative z-0 w-full mb-8 group">
            <input
              type="date"
              id="fecha"
              value={fechaActual}
              disabled
              className="block py-3 px-0 w-full text-base text-gray-700 bg-transparent border-0 border-b border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=" "
            />
            <label htmlFor="fecha" className="absolute text-base text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]">
              Fecha
            </label>
          </div>

          <button
            type="submit"
            disabled={!!turnoActivo}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold py-3 px-4 rounded-lg shadow-md transition-colors"
          >
            Iniciar Turno
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioTurno;