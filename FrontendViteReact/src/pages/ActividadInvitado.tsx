import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Modal, Button } from 'react-bootstrap';
import { FaClock, FaSignOutAlt, FaExclamationTriangle } from 'react-icons/fa';

// 1. DEFINICIÓN LOCAL DE TIPOS (Para evitar conflictos de importación)
interface Reserva {
  id: number;
  habitacion: number;
  placa: string;
  vehiculo: string;
  hentrada: string;
  hsalidamax: string;
  hsalida?: string; // Opcional porque puede no tener salida aun
  valor: number;
  colaborador: string; // ✅ AHORA SÍ EXISTE
  fecha: string;
  observaciones?: string;
}

// Extendemos para los cálculos de tiempo
type ReservaExtendida = Reserva & {
  hentradaNum?: number;
  hsalidamaxNum?: number;
};

interface Cuadre {
  id: number;
  basecaja: number;
  colaborador: string;
  fecha: string;
  turnoCerrado?: string | null;
}

const Historial = () => {
  const navigate = useNavigate();
  
  // Estados de Habitaciones
  const [reservas, setReservas] = useState<ReservaExtendida[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<ReservaExtendida | null>(null);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<number | null>(null);
  const [, setNow] = useState(new Date());

  // Estados de Caja
  const [baseCaja, setBaseCaja] = useState<number>(0);
  const [totalVentas, setTotalVentas] = useState<number>(0);
  const [cuadreId, setCuadreId] = useState<number | null>(null);
  const [colaborador, setColaborador] = useState<string>('');

  // --- LÓGICA DE CAJA (Resumen Financiero) ---
  const fetchDatosCaja = useCallback(async () => {
    try {
      const datosTurno = localStorage.getItem('datosTurno');
      const rol = localStorage.getItem('rol');
      let nombreUsuario = '';

      if (rol === 'invitado' && datosTurno) {
        const { colaborador } = JSON.parse(datosTurno);
        nombreUsuario = colaborador;
        setColaborador(colaborador);
      } else if (rol === 'admin') {
        nombreUsuario = localStorage.getItem('username') || '';
        setColaborador(nombreUsuario);
      }

      if (!nombreUsuario) return;

      const hoy = new Date().toISOString().split('T')[0];
      
      // 1. Obtener Base y ID del Cuadre
      const resCuadre = await api.get('/cuadre');
      const cuadreActivo = resCuadre.data.find((c: Cuadre) => 
        c.colaborador === nombreUsuario && 
        c.fecha === hoy && 
        !c.turnoCerrado
      );

      if (cuadreActivo) {
        setBaseCaja(cuadreActivo.basecaja || 0);
        setCuadreId(cuadreActivo.id);
      }

      // 2. Calcular Total Ventas
      const resReservas = await api.get('/reservas');
      // Ahora TypeScript sabe que 'r' tiene 'colaborador' gracias a la interfaz local
      const total = resReservas.data
        .filter((r: Reserva) => r.colaborador === nombreUsuario && r.fecha === hoy)
        .reduce((sum: number, r: Reserva) => sum + r.valor, 0);
      
      setTotalVentas(total);

    } catch (error) {
      console.error('Error cargando datos de caja:', error);
    }
  }, []);

  const cerrarTurno = async () => {
    if (!cuadreId) return alert("No hay turno activo para cerrar.");
    
    const confirmar = window.confirm(`¿Estás seguro de cerrar turno?\n\nTotal a entregar: $${(baseCaja + totalVentas).toLocaleString()}`);
    if (!confirmar) return;

    const horaActual = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/cuadre/${cuadreId}`, {
        turnoCerrado: horaActual,
        totalEntregado: totalVentas,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      localStorage.removeItem('datosTurno');
      navigate('/', { state: { turnoCerrado: true } });
    } catch (error) {
      alert('Error al cerrar turno. Intente nuevamente.');
    }
  };

  // --- LÓGICA DE HABITACIONES ---
  const fetchDatosReservas = async () => {
      try {
        const response = await api.get('/reservas');
        setReservas(response.data);
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
      }
  };
  
  const calcularEstadoTiempo = (horaEntrada: string) => {
    if (!horaEntrada) return { minutosPasados: 0, minutosRestantes: 240, porcentaje: 0, excedido: false };
    const fechaActual = new Date();
    const [h, m] = horaEntrada.split(':').map(Number);
    const fechaEntrada = new Date();
    fechaEntrada.setHours(h, m, 0, 0);
    if (fechaEntrada > fechaActual) fechaEntrada.setDate(fechaEntrada.getDate() - 1);
    const diferenciaMs = fechaActual.getTime() - fechaEntrada.getTime();
    const minutosPasados = Math.floor(diferenciaMs / 60000);
    const LIMITE_TIEMPO = 240; 
    const porcentaje = Math.min((minutosPasados / LIMITE_TIEMPO) * 100, 100);
    return { minutosPasados, minutosRestantes: LIMITE_TIEMPO - minutosPasados, porcentaje, excedido: minutosPasados >= LIMITE_TIEMPO };
  };

  const handleClickHabitacion = (habitacion: number) => {
    setHabitacionSeleccionada(habitacion);
    const activa = reservas.find(r => r.habitacion === habitacion && !r.hsalida);
    setReservaSeleccionada(activa || null);
    setShowModal(true);
  };

  const formatoTiempoRestante = (minutos: number) => {
    if (minutos <= 0) return "Tiempo finalizado";
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h}h ${m}m`;
  };

  useEffect(() => {
    fetchDatosReservas();
    fetchDatosCaja();
    
    const intervalId = setInterval(() => {
      fetchDatosReservas();
      fetchDatosCaja();
    }, 10000); 

    const clockInterval = setInterval(() => setNow(new Date()), 60000);
    
    return () => { 
      clearInterval(intervalId); 
      clearInterval(clockInterval); 
    };
  }, [fetchDatosCaja]);

  const estadoModal = reservaSeleccionada ? calcularEstadoTiempo(reservaSeleccionada.hentrada) : null;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      <style>
        {`
          .glass-card {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .room-btn {
            background: rgba(255, 255, 255, 0.05);
            transition: all 0.2s ease;
          }
          .room-btn:hover {
             background: rgba(255, 255, 255, 0.1);
             transform: translateY(-2px);
          }
        `}
      </style>

      {/* --- NAVBAR SUPERIOR --- */}
      <div className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 shadow-lg px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <FaClock className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Control de Habitaciones</h1>
              <p className="text-xs text-gray-400 m-0">Colaborador: {colaborador || 'Invitado'}</p>
            </div>
          </div>

          {/* Métricas Financieras */}
          <div className="flex items-center bg-gray-900 rounded-xl px-4 py-2 border border-gray-700 gap-6 shadow-inner">
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 uppercase font-bold">Base</span>
              <span className="text-gray-300 font-mono">${baseCaja.toLocaleString()}</span>
            </div>
            <div className="w-px h-8 bg-gray-700"></div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 uppercase font-bold">Ventas</span>
              <span className="text-green-400 font-bold font-mono">+${totalVentas.toLocaleString()}</span>
            </div>
            <div className="w-px h-8 bg-gray-700"></div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 uppercase font-bold">Total Caja</span>
              <span className="text-white font-bold text-lg font-mono">${(baseCaja + totalVentas).toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={cerrarTurno}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition shadow-md hover:shadow-red-500/30 text-sm md:text-base w-full md:w-auto justify-center"
          >
            <FaSignOutAlt />
            <span>Cerrar Turno</span>
          </button>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="glass-card p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(16)].map((_, i) => {
                const num = i + 1;
                const r = reservas.find(res => res.habitacion === num && !res.hsalida);
                const info = r ? calcularEstadoTiempo(r.hentrada) : null;
                const estado = !r ? 'libre' : info?.excedido ? 'critica' : 'ocupada';

                let borderColor = 'border-gray-600';
                let textColor = 'text-gray-400';
                let shadow = '';
                
                if (estado === 'libre') {
                    borderColor = 'border-green-500/50';
                    textColor = 'text-green-400';
                } else if (estado === 'ocupada') {
                    borderColor = 'border-blue-500';
                    textColor = 'text-white';
                    shadow = 'shadow-[0_0_15px_rgba(59,130,246,0.3)]';
                } else if (estado === 'critica') {
                    borderColor = 'border-red-500';
                    textColor = 'text-red-500 animate-pulse';
                    shadow = 'shadow-[0_0_20px_rgba(239,68,68,0.5)]';
                }

                return (
                  <button 
                    key={num}
                    onClick={() => handleClickHabitacion(num)}
                    className={`relative room-btn h-32 rounded-2xl border-2 flex flex-col items-center justify-center overflow-hidden ${borderColor} ${shadow}`}
                  >
                    {info && (
                       <div 
                         className="absolute bottom-0 left-0 h-1 bg-current w-full opacity-50"
                         style={{ 
                           width: `${info.porcentaje}%`,
                           backgroundColor: info.excedido ? '#ef4444' : '#3b82f6'
                         }}
                       />
                    )}
                    
                    <span className={`text-3xl font-bold z-10 ${textColor}`}>
                      {num}
                    </span>
                    
                    {r && (
                        <div className="mt-2 text-xs font-mono text-gray-300 z-10 bg-black/50 px-2 py-0.5 rounded">
                            {r.placa}
                        </div>
                    )}

                    {info && (
                        <span className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${info.excedido ? 'bg-red-500 text-white' : 'bg-blue-500/20 text-blue-300'}`}>
                            {info.excedido ? 'EXCEDIDO' : formatoTiempoRestante(info.minutosRestantes)}
                        </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* --- MODAL DETALLES --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-gray-800 text-white border border-gray-700">
        <Modal.Header closeButton closeVariant="white" className="border-b border-gray-700">
          <Modal.Title className="flex items-center gap-2">
              <span>Habitación {habitacionSeleccionada}</span>
              {estadoModal?.excedido && <FaExclamationTriangle className="text-red-500" />}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-6 text-center">
             {reservaSeleccionada ? (
                 <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl inline-block w-full">
                        <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Vehículo / Placa</p>
                        <p className="text-2xl font-bold font-mono text-blue-300">{reservaSeleccionada.placa}</p>
                    </div>

                    <div className="py-4">
                        <p className="text-gray-400 text-sm mb-2">Tiempo Restante</p>
                        <h2 className={`text-4xl font-bold ${estadoModal?.excedido ? 'text-red-500' : 'text-green-400'}`}>
                            {estadoModal?.excedido ? 'TIEMPO EXCEDIDO' : formatoTiempoRestante(estadoModal?.minutosRestantes || 0)}
                        </h2>
                    </div>
                 </div>
             ) : (
                 <div className="py-8">
                     <p className="text-gray-400 text-lg">Esta habitación está disponible.</p>
                 </div>
             )}
        </Modal.Body>
        <Modal.Footer className="border-t border-gray-700">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Historial;