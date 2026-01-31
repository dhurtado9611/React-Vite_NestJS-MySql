import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Modal, Button } from 'react-bootstrap';
import { FaBars, FaTimes, FaClock } from 'react-icons/fa';

// --- INTERFACES ---
interface Reserva {
  id: number;
  habitacion: number;
  placa: string;
  vehiculo: string;
  hentrada: string;
  hsalidamax: string;
  hsalida?: string;
  valor: number;
  colaborador: string;
  fecha: string;
  observaciones?: string;
}

type ReservaExtendida = Reserva & {
  hentradaNum?: number;
  hsalidamaxNum?: number;
};

interface Cuadre {
  id: number;
  basecaja: number;
  colaborador: string;
  fecha: string;
  turno: string;
  turnoCerrado?: string | null;
}

const Historial = () => {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [reservas, setReservas] = useState<ReservaExtendida[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<ReservaExtendida | null>(null);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<number | null>(null);
  const [, setNow] = useState(new Date());
  
  // Estado menú móvil
  const [menuAbierto, setMenuAbierto] = useState(false);

  // --- ESTADOS CAJA ---
  const [baseCaja, setBaseCaja] = useState<number>(0);
  const [totalVentas, setTotalVentas] = useState<number>(0);
  const [cuadreId, setCuadreId] = useState<number | null>(null);
  const [colaborador, setColaborador] = useState<string>('');
  const [turno, setTurno] = useState<string>('');
  const [fecha, setFecha] = useState<string>('');

  // --- LÓGICA ---
  const fetchDatosCaja = useCallback(async () => {
    try {
      const datosTurno = localStorage.getItem('datosTurno');
      const rol = localStorage.getItem('rol');
      let nombreUsuario = '';
      let turnoActual = '';

      if (rol === 'invitado' && datosTurno) {
        const parsed = JSON.parse(datosTurno);
        nombreUsuario = parsed.colaborador;
        turnoActual = parsed.turno;
        setColaborador(nombreUsuario);
        setTurno(turnoActual);
      } else if (rol === 'admin') {
        nombreUsuario = localStorage.getItem('username') || 'Admin';
        setColaborador(nombreUsuario);
      }

      if (!nombreUsuario) return;

      const hoy = new Date().toISOString().split('T')[0];
      setFecha(hoy);

      const resCuadre = await api.get('/cuadre');
      const cuadreActivo = resCuadre.data.find((c: Cuadre) => 
        c.colaborador === nombreUsuario && 
        c.fecha === hoy && 
        !c.turnoCerrado
      );

      if (cuadreActivo) {
        setBaseCaja(cuadreActivo.basecaja || 0);
        setCuadreId(cuadreActivo.id);
        if (!turnoActual) setTurno(cuadreActivo.turno);
      }

      const resReservas = await api.get('/reservas');
      const total = resReservas.data
        .filter((r: Reserva) => r.colaborador === nombreUsuario && r.fecha === hoy)
        .reduce((sum: number, r: Reserva) => sum + r.valor, 0);
      
      setTotalVentas(total);

    } catch (error) {
      console.error('Error cargando caja:', error);
    }
  }, []);

  const cerrarTurno = async () => {
    // Validación inicial
    if (!cuadreId) {
        // INTENTO DE RECUPERACIÓN: Si no hay ID en estado, intenta leerlo de la base de datos primero
        alert("No se detectó un ID de turno activo. Recargando para verificar...");
        window.location.reload(); 
        return;
    }
    
    const confirmar = window.confirm(`¿Cerrar turno?\nTotal Caja: $${(baseCaja + totalVentas).toLocaleString()}`);
    if (!confirmar) return;

    const horaActual = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    try {
      const token = localStorage.getItem('token');
      
      // Intentamos cerrar en el servidor
      await api.patch(`/cuadre/${cuadreId}`, {
        turnoCerrado: horaActual,
        totalEntregado: totalVentas, 
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Éxito normal
      localStorage.removeItem('datosTurno');
      navigate('/', { state: { turnoCerrado: true } });

    } catch (error: any) {
      console.error('Error al cerrar turno:', error);

      // --- CORRECCIÓN CLAVE ---
      // Si el servidor responde 404 (No encontrado), significa que el ID en memoria
      // no existe en la BD. Forzamos el cierre local para no quedarnos atrapados.
      if (error.response && error.response.status === 404) {
         alert("El turno ya no existe en el servidor (posiblemente fue borrado). Se cerrará la sesión localmente.");
         localStorage.removeItem('datosTurno');
         navigate('/', { state: { turnoCerrado: true } });
      } else {
         alert('Error de conexión. Verifica tu internet e intenta de nuevo.');
      }
    }
  };

  const fetchDatosReservas = async () => {
    try {
      const response = await api.get('/reservas');
      setReservas(response.data);
    } catch (error) {
      console.error('Error fetching reservas:', error);
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
    if (minutos <= 0) return "Fin";
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h}h ${m}m`;
  };

  useEffect(() => {
    fetchDatosReservas();
    fetchDatosCaja();
    const interval = setInterval(() => { fetchDatosReservas(); fetchDatosCaja(); }, 10000);
    const clock = setInterval(() => setNow(new Date()), 60000);
    return () => { clearInterval(interval); clearInterval(clock); };
  }, [fetchDatosCaja]);

  const estadoModal = reservaSeleccionada ? calcularEstadoTiempo(reservaSeleccionada.hentrada) : null;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500 selection:text-white">
      <style>
        {`
          .room-sphere {
            aspect-ratio: 1 / 1;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.4));
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 
              inset -2px -2px 6px rgba(0,0,0,0.5),
              inset 2px 2px 6px rgba(255,255,255,0.1),
              0 4px 10px rgba(0,0,0,0.5);
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }
          .room-sphere:active { transform: scale(0.95); }
          .status-ring-free { box-shadow: 0 0 10px rgba(74, 222, 128, 0.3), inset 0 0 10px rgba(74, 222, 128, 0.1); border: 2px solid rgba(74, 222, 128, 0.5); }
          .status-ring-occupied { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), inset 0 0 10px rgba(59, 130, 246, 0.2); border: 2px solid #3b82f6; }
          .status-ring-critical { box-shadow: 0 0 20px rgba(239, 68, 68, 0.6), inset 0 0 15px rgba(239, 68, 68, 0.3); border: 2px solid #ef4444; animation: pulse-red 1.5s infinite; }
          @keyframes pulse-red {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
        `}
      </style>

      {/* --- NAVBAR IGUALADO AL MARKETPLACE (p-4) --- */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-40 shadow-lg flex justify-between items-center">
        
        {/* Logo / Título */}
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <FaClock className="text-white text-lg" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-wide text-white block leading-none">CONTROL</span>
            <span className="text-xs text-gray-400 block mt-1 leading-none">{colaborador || 'Invitado'}</span>
          </div>
        </div>

        {/* Botón Hamburger (Solo Móvil) */}
        <div className="md:hidden">
          <button 
            onClick={() => setMenuAbierto(!menuAbierto)} 
            className="text-gray-300 hover:text-white p-2 focus:outline-none transition-transform active:scale-90"
          >
            {menuAbierto ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Datos Desktop (Oculto en Móvil) */}
        <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex flex-col items-center"><span className="text-gray-500 text-xs font-bold">FECHA</span><span className="leading-none">{fecha}</span></div>
            <div className="flex flex-col items-center"><span className="text-gray-500 text-xs font-bold">TURNO</span><span className="leading-none">{turno}</span></div>
            <div className="h-8 w-px bg-gray-700"></div>
            <div className="flex flex-col items-center"><span className="text-gray-500 text-xs font-bold">BASE</span><span className="text-blue-300 leading-none">${baseCaja.toLocaleString()}</span></div>
            <div className="flex flex-col items-center"><span className="text-gray-500 text-xs font-bold">VENTAS</span><span className="text-green-400 font-bold leading-none">+${totalVentas.toLocaleString()}</span></div>
            <div className="flex flex-col items-center bg-gray-700/50 px-3 py-1 rounded-lg border border-gray-600">
                <span className="text-gray-400 text-[10px] font-bold">TOTAL</span>
                <span className="text-white font-bold text-base leading-none">${(baseCaja + totalVentas).toLocaleString()}</span>
            </div>
            <button onClick={cerrarTurno} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-lg shadow-red-900/20 transition-all hover:scale-105">
              CERRAR TURNO
            </button>
        </div>
      </div>

      {/* Menú Desplegable (Móvil) */}
      <div className={`md:hidden fixed top-[72px] left-0 w-full bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out z-30 ${menuAbierto ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">
                <span className="text-gray-400 text-xs block mb-1 font-bold">BASE CAJA</span>
                <span className="text-blue-300 font-mono text-lg">${baseCaja.toLocaleString()}</span>
              </div>
              <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">
                <span className="text-gray-400 text-xs block mb-1 font-bold">VENTAS</span>
                <span className="text-green-400 font-mono text-lg">+${totalVentas.toLocaleString()}</span>
              </div>
          </div>
          <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl border border-gray-600">
              <span className="text-gray-300 font-bold text-sm">TOTAL EN CAJA</span>
              <span className="text-white font-bold text-2xl">${(baseCaja + totalVentas).toLocaleString()}</span>
          </div>
          <button 
            onClick={cerrarTurno} 
            className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg active:bg-red-700 transition-colors"
          >
            FINALIZAR JORNADA
          </button>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="pt-8 pb-20 px-3 md:px-8 min-h-[calc(100vh-80px)] flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-6 justify-items-center">
            {[...Array(16)].map((_, i) => {
              const num = i + 1;
              const r = reservas.find(res => res.habitacion === num && !res.hsalida);
              const info = r ? calcularEstadoTiempo(r.hentrada) : null;
              const estado = !r ? 'libre' : info?.excedido ? 'critica' : 'ocupada';

              // Clases dinámicas
              const ringClass = estado === 'libre' ? 'status-ring-free' : estado === 'ocupada' ? 'status-ring-occupied' : 'status-ring-critical';
              const textClass = estado === 'libre' ? 'text-gray-400' : 'text-white';
              
              return (
                <button 
                  key={num}
                  onClick={() => handleClickHabitacion(num)}
                  className={`room-sphere w-full max-w-[85px] sm:max-w-[100px] ${ringClass}`}
                >
                  <span className={`text-2xl md:text-3xl font-black z-10 drop-shadow-md ${textClass}`}>
                    {num}
                  </span>
                  {r && (
                     <div className="absolute bottom-2 flex flex-col items-center w-full px-1">
                        {info && (
                          <span className={`text-[9px] md:text-[10px] font-bold px-1.5 rounded-full mb-0.5 ${info.excedido ? 'bg-red-600 text-white' : 'bg-blue-600/80 text-white'}`}>
                             {info.excedido ? '!!!' : formatoTiempoRestante(info.minutosRestantes)}
                          </span>
                        )}
                        <span className="text-[8px] text-gray-300 font-mono opacity-90 truncate w-full text-center">
                           {r.placa}
                        </span>
                     </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- MODAL CORREGIDO (Fondo Oscuro + Texto Blanco) --- */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered 
        // ¡IMPORTANTE! Las clases con ! forzan el estilo sobre Bootstrap
        contentClassName="!bg-gray-800 !text-white !border !border-gray-600 !shadow-2xl"
      >
        <Modal.Header closeButton closeVariant="white" className="border-b border-gray-700 !bg-gray-800">
          <Modal.Title className="font-bold">Habitación {habitacionSeleccionada}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-6 text-center !bg-gray-800">
             {reservaSeleccionada ? (
                 <div className="space-y-6">
                    <div className="bg-gray-700/50 p-4 rounded-2xl border border-gray-600">
                        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">Vehículo en sitio</p>
                        <p className="text-4xl font-black font-mono text-white tracking-wider">{reservaSeleccionada.placa}</p>
                    </div>
                    
                    <div>
                         {estadoModal?.excedido ? (
                            <div className="inline-block bg-red-500/10 text-red-500 border border-red-500/50 px-6 py-3 rounded-xl animate-pulse">
                                <span className="block text-xs font-bold uppercase">Estado Crítico</span>
                                <span className="text-2xl font-bold">TIEMPO EXCEDIDO</span>
                            </div>
                         ) : (
                            <div className="inline-block">
                                <span className="text-gray-400 text-xs uppercase block mb-1">Tiempo Restante</span>
                                <span className="text-5xl font-bold text-green-400 font-mono">
                                  {formatoTiempoRestante(estadoModal?.minutosRestantes || 0)}
                                </span>
                            </div>
                         )}
                    </div>
                 </div>
             ) : (
                 <div className="py-8 opacity-50">
                    <p className="text-xl">Disponible para asignar</p>
                 </div>
             )}
        </Modal.Body>
        <Modal.Footer className="border-t border-gray-700 !bg-gray-800">
          <Button variant="secondary" onClick={() => setShowModal(false)} className="w-full bg-gray-600 hover:bg-gray-500 border-none">
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Historial;