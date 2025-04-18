import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onSubmit: (data: { colaborador: string; turno: string; fecha: string }) => void;
}

const FormularioTurno = ({ onSubmit }: Props) => {
  const [colaborador, setColaborador] = useState('');
  const [turno, setTurno] = useState('');
  const [baseCaja, setBaseCaja] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [turnoActivo, setTurnoActivo] = useState<{
    colaborador: string;
    turno: string;
    turnoCerrado?: string;
  } | null>(null);
  const fechaActual = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    const id = localStorage.getItem('userId');
    if (username) setColaborador(username);
    if (id) setUserId(Number(id));

    const verificarTurno = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/cuadre', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const turnoHoy = response.data.find(
          (item: any) => item.fecha === fechaActual && item.turnoCerrado === null
        );

        if (turnoHoy) {
          setTurnoActivo({
            colaborador: turnoHoy.colaborador,
            turno: turnoHoy.turno,
            turnoCerrado: turnoHoy.turnoCerrado,
          });
          setShowAlert(true);
          setTimeout(() => navigate('/'), 3000); // ✅ Redirige a Home tras 3 segundos
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
      await api.post(
        '/cuadre',
        {
          colaborador,
          fecha: fechaActual,
          turno,
          turnoCerrado: null,
          basecaja: baseCajaNum,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.setItem(
        'datosTurno',
        JSON.stringify({ colaborador, fecha: fechaActual, turno, turnoCerrado: null })
      );

      alert('Turno registrado correctamente');
      onSubmit({ colaborador, turno, fecha: fechaActual });
    } catch (error: any) {
      console.error('Error al registrar el turno:', error);
      if (error.response?.data?.message) {
        alert(`No se pudo registrar el turno: ${error.response.data.message}`);
      } else {
        alert('No se pudo registrar el turno');
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
        >
          {showAlert && turnoActivo && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded shadow-lg z-50 text-base text-center">
              Ya hay un turno abierto<br />
              por <strong>{turnoActivo.colaborador}</strong><br />
              Iniciado a las <strong>{turnoActivo.turno}</strong>{' '}
              {turnoActivo.turnoCerrado && (
                <>
                  y termina a las <strong>{turnoActivo.turnoCerrado}</strong>
                </>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h3 className="text-center text-2xl font-bold text-gray-900 mb-8">
              Inicio de Turno - Invitado
            </h3>

            <div className="mb-6">
              <label htmlFor="colaborador" className="block text-sm font-medium text-gray-700 mb-1">
                Colaborador
              </label>
              <input
                type="text"
                id="colaborador"
                disabled
                value={colaborador}
                className="block w-full px-4 py-2 text-base text-gray-800 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="turno" className="block text-sm font-medium text-gray-700 mb-1">
                Selecciona Turno
              </label>
              <select
                id="turno"
                value={turno}
                onChange={(e) => setTurno(e.target.value)}
                required
                className="block w-full px-4 py-2 text-base text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
              >
                <option value="">-- Selecciona un turno --</option>
                <option value="07:00">Mañana (7am - 2pm)</option>
                <option value="14:00">Tarde (2pm - 9pm)</option>
                <option value="21:00">Noche (9pm - 7am)</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="baseCaja" className="block text-sm font-medium text-gray-700 mb-1">
                Base de Caja
              </label>
              <input
                type="number"
                id="baseCaja"
                value={baseCaja}
                onChange={(e) => setBaseCaja(e.target.value)}
                required
                className="block w-full px-4 py-2 text-base text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
                placeholder="Monto en efectivo"
              />
            </div>

            <div className="mb-8">
              <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                id="fecha"
                value={fechaActual}
                disabled
                className="block w-full px-4 py-2 text-base text-gray-800 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={!!turnoActivo}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-4 rounded-md shadow-md transition-colors"
            >
              Iniciar Turno
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FormularioTurno;