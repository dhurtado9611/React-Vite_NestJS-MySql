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
  const fechaActual = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    const id = localStorage.getItem('userId');
    if (username) setColaborador(username);
    if (id) setUserId(Number(id));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseCajaNum = Number(baseCaja);
    if (!colaborador || !turno || userId === null || isNaN(baseCajaNum)) {
      alert('Por favor complete todos los campos');
      return;
    }

    try {
      await api.post('/cuadre', {
        colaborador,
        fecha: fechaActual,
        turno,
        turnoCerrado,
        basecaja: baseCajaNum,
      });

      localStorage.setItem('datosTurno', JSON.stringify({
        colaborador,
        fecha: fechaActual,
        turno,
        turnoCerrado
      }));

      alert('Turno registrado correctamente');
      onSubmit({ colaborador, turno, fecha: fechaActual });
    } catch (error) {
      console.error('Error al registrar el turno:', error);
      alert('No se pudo registrar el turno');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white/30 backdrop-blur-lg shadow-xl p-6 rounded-2xl w-full max-w-sm"
      >
        <h3 className="text-center text-xl font-semibold text-gray-800 mb-6">
          Inicio de Turno - Invitado
        </h3>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            id="colaborador"
            disabled
            value={colaborador}
            className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=" "
          />
          <label
            htmlFor="colaborador"
            className="absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Colaborador
          </label>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="time"
            id="turno"
            value={turno}
            onChange={(e) => setTurno(e.target.value)}
            required
            className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=" "
          />
          <label
            htmlFor="turno"
            className="absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Turno
          </label>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="number"
            id="baseCaja"
            value={baseCaja}
            onChange={(e) => setBaseCaja(e.target.value)}
            required
            className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=" "
          />
          <label
            htmlFor="baseCaja"
            className="absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Base de Caja
          </label>
        </div>

        <div className="relative z-0 w-full mb-6 group">
          <input
            type="date"
            id="fecha"
            value={fechaActual}
            disabled
            className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=" "
          />
          <label
            htmlFor="fecha"
            className="absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Fecha
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
        >
          Iniciar Turno
        </button>
      </form>
    </div>
  );
};

export default FormularioTurno;