import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import LogoLoader from './LogoLoader';

interface Props {
  onSubmit: (data: { colaborador: string; turno: string; fecha: string }) => void;
}

const FormularioTurno = ({ onSubmit }: Props) => {
  const [colaborador, setColaborador] = useState('');
  const [turno, setTurno] = useState('');
  const [baseCaja, setBaseCaja] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Estado inicial del inventario
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
  }, []);

  const validarCampos = () => {
    const nuevosErrores: { turno?: string; baseCaja?: string } = {};
    if (!turno) nuevosErrores.turno = 'Selecciona un turno';
    if (!baseCaja || isNaN(Number(baseCaja))) nuevosErrores.baseCaja = 'Base inválida';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      await api.post('/cuadre', {
        colaborador,
        fecha: fechaActual,
        turno,
        turnoCerrado: null,
        basecaja: Number(baseCaja),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await api.post('/inventario', {
        ...inventario,
        colaborador,
        fecha: fechaActual,
        turno,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Turno e Inventario registrados correctamente');
      onSubmit({ colaborador, turno, fecha: fechaActual });
      navigate('/');

    } catch (error: any) {
      console.error('Error al registrar:', error);
      alert(error.response?.data?.message || 'No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  const handleInventarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInventario({ ...inventario, [name]: parseInt(value) || 0 });
  };

  // Clases reutilizables para el estilo Glass
  const glassInputClass = `
    block w-full px-4 py-3 
    bg-white/40 backdrop-blur-sm 
    border border-white/50 
    rounded-xl 
    text-gray-800 placeholder-gray-500 font-medium
    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/60 
    transition-all duration-300 shadow-sm
  `;

  const labelClass = "block text-sm font-semibold text-gray-700 mb-1 ml-1";

  return (
    <>
      {loading && <LogoLoader />}
      <AnimatePresence>
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-gray-900/80 to-blue-900/80 backdrop-blur-sm" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }} 
            transition={{ type: "spring", duration: 0.5 }} 
            className="
              relative w-full max-w-4xl max-h-[90vh] overflow-y-auto 
              bg-white/30 backdrop-blur-xl 
              border border-white/40 
              rounded-3xl shadow-2xl 
              p-8 scrollbar-hide
            "
            style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
          >
            <form onSubmit={handleSubmit}>
              {/* Encabezado con efecto de brillo */}
              <div className="text-center mb-10 relative">
                <h3 className="text-3xl font-bold text-gray-800 tracking-tight drop-shadow-sm">
                  Inicio de Turno
                </h3>
                <p className="text-gray-600 font-medium text-sm mt-1">Registro de caja e inventario</p>
              </div>

              {/* Sección Datos Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className={labelClass}>Colaborador</label>
                  <input 
                    type="text" 
                    value={colaborador} 
                    disabled 
                    className={`${glassInputClass} opacity-70 cursor-not-allowed`} 
                  />
                </div>

                <div>
                  <label className={labelClass}>Fecha</label>
                  <input 
                    type="date" 
                    value={fechaActual} 
                    disabled 
                    className={`${glassInputClass} opacity-70 cursor-not-allowed`} 
                  />
                </div>

                <div>
                  <label className={labelClass}>Turno</label>
                  <div className="relative">
                    <select
                      value={turno}
                      onChange={(e) => setTurno(e.target.value)}
                      className={`${glassInputClass} appearance-none cursor-pointer ${errores.turno ? 'ring-2 ring-red-400 bg-red-50/50' : ''}`}
                      disabled={loading}
                    >
                      <option value="">-- Seleccionar --</option>
                      <option value="07:00" className="text-gray-800 bg-white">Mañana (7am - 2pm)</option>
                      <option value="14:00" className="text-gray-800 bg-white">Tarde (2pm - 9pm)</option>
                      <option value="21:00" className="text-gray-800 bg-white">Noche (9pm - 7am)</option>
                    </select>
                    {/* Icono de flecha custom para el select */}
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  {errores.turno && <p className="text-red-600 font-medium text-xs mt-1 ml-1">{errores.turno}</p>}
                </div>

                <div>
                  <label className={labelClass}>Base de Caja ($)</label>
                  <input
                    type="number"
                    value={baseCaja}
                    onChange={(e) => setBaseCaja(e.target.value)}
                    className={`${glassInputClass} ${errores.baseCaja ? 'ring-2 ring-red-400 bg-red-50/50' : ''}`}
                    placeholder="0"
                    disabled={loading}
                  />
                  {errores.baseCaja && <p className="text-red-600 font-medium text-xs mt-1 ml-1">{errores.baseCaja}</p>}
                </div>
              </div>

              {/* Separador Glass */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-400/30 to-transparent my-8"></div>

              <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-blue-600 w-2 h-6 rounded-full mr-3 shadow-lg"></span>
                Inventario Inicial
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(inventario).map(([key, value]) => (
                  <div key={key} className="group">
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1 ml-1 tracking-wide">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <input
                      type="number"
                      name={key}
                      value={value}
                      onChange={handleInventarioChange}
                      min={0}
                      className={`
                        ${glassInputClass} 
                        py-2 text-center font-bold text-blue-900
                        group-hover:bg-white/60 focus:bg-white/80
                      `}
                      disabled={loading}
                    />
                  </div>
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading} 
                className="
                  mt-10 w-full py-4 
                  bg-gradient-to-r from-blue-600 to-indigo-600 
                  text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30
                  border border-white/20 backdrop-blur-sm
                  disabled:opacity-70 disabled:cursor-not-allowed
                  transition-all
                "
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Procesando...
                  </span>
                ) : 'Registrar Turno'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default FormularioTurno;