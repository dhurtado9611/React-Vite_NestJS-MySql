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
  const [inventario, setInventario] = useState({
    AGUARDIENTE: 0,
    RON: 0,
    POKER: 0,
    ENERGIZANTE: 0,
    JUGOS_HIT: 0,
    AGUA: 0,
    GASEOSA: 0,
    PAPEL_HIGIENICO: 0,
    ALKA_SELTZER: 0,
    SHAMPOO: 0,
    TOALLA_HIGIENICA: 0,
    CONDONES: 0,
    BONOS: 0,
  });

  const [errores, setErrores] = useState<{ turno?: string; baseCaja?: string }>({});

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
          const confirmacion = window.confirm(
            `Ya hay un turno abierto por ${turnoHoy.colaborador} iniciado a las ${turnoHoy.turno}.\n\n¿Deseas cerrarlo y abrir uno nuevo?`
          );
          if (confirmacion) {
            await api.patch(`/cuadre/cerrar/${turnoHoy.id}`, {}, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } else {
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error al verificar turno activo:', error);
      }
    };

    verificarTurno();
  }, [navigate, fechaActual]);

  const validarCampos = () => {
    const nuevosErrores: { turno?: string; baseCaja?: string } = {};
    if (!turno) nuevosErrores.turno = 'Selecciona un turno';
    if (!baseCaja || isNaN(Number(baseCaja))) nuevosErrores.baseCaja = 'Base de caja inválida';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      const token = localStorage.getItem('token');
      await api.post('/cuadre', {
        colaborador,
        fecha: fechaActual,
        turno,
        turnoCerrado: null,
        basecaja: Number(baseCaja),
        ...inventario
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Turno e Inventario registrados correctamente');
      onSubmit({ colaborador, turno, fecha: fechaActual });
      navigate('/');

    } catch (error: any) {
      console.error('Error al registrar turno e inventario:', error);
      alert(error.response?.data?.message || 'No se pudo registrar');
    }
  };

  const handleInventarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInventario({ ...inventario, [name]: parseInt(value) || 0 });
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl relative overflow-y-auto max-h-screen">
          <form onSubmit={handleSubmit}>
            <h3 className="text-center text-2xl font-bold text-gray-900 mb-8">Inicio de Turno + Inventario</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Colaborador</label>
                <input type="text" value={colaborador} disabled className="block w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-md" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                <select
                  value={turno}
                  onChange={(e) => setTurno(e.target.value)}
                  className={`block w-full px-4 py-2 text-gray-800 bg-white border ${errores.turno ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                >
                  <option value="">-- Selecciona turno --</option>
                  <option value="07:00">Mañana (7am - 2pm)</option>
                  <option value="14:00">Tarde (2pm - 9pm)</option>
                  <option value="21:00">Noche (9pm - 7am)</option>
                </select>
                {errores.turno && <p className="text-red-500 text-sm mt-1">{errores.turno}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base de Caja</label>
                <input
                  type="number"
                  value={baseCaja}
                  onChange={(e) => setBaseCaja(e.target.value)}
                  className={`block w-full px-4 py-2 text-gray-800 bg-white border ${errores.baseCaja ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  placeholder="Monto en efectivo"
                />
                {errores.baseCaja && <p className="text-red-500 text-sm mt-1">{errores.baseCaja}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input type="date" value={fechaActual} disabled className="block w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-md" />
              </div>
            </div>

            <h4 className="text-xl font-semibold mt-8 mb-4">Inventario</h4>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(inventario).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{key.replace(/_/g, ' ')}</label>
                  <input
                    type="number"
                    name={key}
                    value={value}
                    onChange={handleInventarioChange}
                    min={0}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 bg-white"
                  />
                </div>
              ))}
            </div>

            <button type="submit" className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-lg">
              Registrar Turno e Inventario
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FormularioTurno;