import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Modal, Button } from 'react-bootstrap';
import { 
  FaBars, 
  FaTimes, 
  FaClock, 
  FaCar, 
  FaMoneyBillWave, 
  FaCalendarCheck, 
  FaStickyNote,
  FaSignOutAlt
} from 'react-icons/fa';

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
  
  // Estado para el botón de carga
  const [procesandoSalida, setProcesandoSalida] = useState(false);
  
  // Estado menú móvil
  const [menuAbierto, setMenuAbierto] = useState(false);

  // --- ESTADOS CAJA ---
  const [baseCaja, setBaseCaja] = useState<number>(0);
  const [totalVentas, setTotalVentas] = useState<number>(0);
  const [, setCuadreId] = useState<number | null>(null);
  const [colaborador, setColaborador] = useState<string>('');
  const [turno, setTurno] = useState<string>('');
  const [fecha, setFecha] = useState<string>('');

  // Control de notificaciones
  const habitacionesNotificadas = useRef<Set<number>>(new Set());

  // --- LÓGICA DE NOTIFICACIONES ---
  const solicitarPermisoNotificacion = () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  const enviarNotificacion = (habitacion: number, placa: string) => {
    if (Notification.permission === "granted") {
      new Notification(`¡TIEMPO AGOTADO!`, {
        body: `La habitación ${habitacion} (Placa: ${placa}) ha excedido su tiempo.`,
        icon: '/assets/Logo-PNG.png'
      });
    }
  };

  // --- LÓGICA DE DATOS ---
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
      
      const misReservasHoy = resReservas.data.filter((r: Reserva) => r.colaborador === nombreUsuario && r.fecha === hoy);
      
      const total = misReservasHoy.reduce((sum: number, r: Reserva) => sum + r.valor, 0);
      setTotalVentas(total);

    } catch (error) {
      console.error('Error cargando caja:', error);
    }
  }, []);

  const fetchDatosReservas = async () => {
    try {
      const response = await api.get('/reservas');
      const reservasData = response.data;
      setReservas(reservasData);
      
      // Revisar notificaciones
      reservasData.forEach((r: Reserva) => {
        if (!r.hsalida) { 
            const estado = calcularEstadoTiempo(r.hentrada);
            if (estado.excedido) {
                if (!habitacionesNotificadas.current.has(r.habitacion)) {
                    enviarNotificacion(r.habitacion, r.placa);
                    habitacionesNotificadas.current.add(r.habitacion);
                }
            } else {
                habitacionesNotificadas.current.delete(r.habitacion);
            }
        }
      });

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
    if (fechaEntrada > fechaActual && (fechaEntrada.getTime() - fechaActual.getTime() > 12 * 60 * 60 * 1000)) {
        fechaEntrada.setDate(fechaEntrada.getDate() - 1);
    }
    
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

  const cerrarTurno = async () => {
    const confirmar = window.confirm(`¿Seguro deseas cerrar turno?\nTotal Caja: $${(baseCaja + totalVentas).toLocaleString()}`);
    if (!confirmar) return;

    try {
      const usuarioActual = colaborador || JSON.parse(localStorage.getItem('datosTurno') || '{}').colaborador;
      if (!usuarioActual) { alert("Error: Usuario no identificado."); return; }

      const res = await api.get('/cuadre');
      const turnoReal = res.data.find((c: any) => c.colaborador === usuarioActual && !c.turnoCerrado);

      if (!turnoReal) {
         alert("⚠️ No se encontró ningún turno abierto.");
         localStorage.removeItem('datosTurno');
         navigate('/', { state: { turnoCerrado: true } });
         return;
      }

      const horaActual = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
      const token = localStorage.getItem('token');

      await api.patch(`/cuadre/${turnoReal.id}`, {
        turnoCerrado: horaActual,
        totalEntregado: totalVentas, 
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem('datosTurno');
      navigate('/', { state: { turnoCerrado: true } });

    } catch (error) {
      console.error('Error al cerrar:', error);
      alert('Error de conexión.');
    }
  };

  // --- FUNCIÓN CORREGIDA: DAR SALIDA DESDE MODAL ---
  const handleFinalizarReserva = async () => {
    if (!reservaSeleccionada) return;

    const confirmar = window.confirm(`¿Deseas dar salida a la Habitación ${reservaSeleccionada.habitacion}?\nPlaca: ${reservaSeleccionada.placa}`);
    if (!confirmar) return;

    setProcesandoSalida(true); // Bloqueamos el botón para evitar doble clic

    try {
        // Obtenemos hora en formato HH:mm (formato 24h) compatible con backend
        const now = new Date();
        const horaSalida = now.toLocaleTimeString('es-CO', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        }); // Ejemplo: "14:30"
        
        // Hacemos el PATCH al ID específico de la reserva
        await api.patch(`/reservas/${reservaSeleccionada.id}`, {
            hsalida: horaSalida
        });

        // IMPORTANTE: Recargamos los datos inmediatamente para actualizar la vista
        await Promise.all([
            fetchDatosReservas(),
            fetchDatosCaja()
        ]);

        // Cerramos modal y limpiamos selección
        setShowModal(false);
        setReservaSeleccionada(null);
        habitacionesNotificadas.current.delete(reservaSeleccionada.habitacion);
        
        // Pequeño feedback visual (opcional)
        // alert("Salida registrada correctamente"); 

    } catch (error) {
        console.error("Error finalizando reserva:", error);
        alert("Ocurrió un error al intentar dar salida. Por favor revisa la conexión.");
    } finally {
        setProcesandoSalida(false);
    }
  };

  const formatoTiempoRestante = (minutos: number) => {
    if (minutos <= 0) return "0h 0m";
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h}h ${m}m`;
  };

  useEffect(() => {
    solicitarPermisoNotificacion();
    fetchDatosReservas();
    fetchDatosCaja();
    const interval = setInterval(() => { fetchDatosReservas(); fetchDatosCaja(); }, 10000);
    const clock = setInterval(() => setNow(new Date()), 60000);
    return () => { clearInterval(interval); clearInterval(clock); };
  }, [fetchDatosCaja]);

  const estadoModal = reservaSeleccionada ? calcularEstadoTiempo(reservaSeleccionada.hentrada) : null;

  return (
    <div className="min-h-screen text-white font-sans selection:bg-indigo-500 selection:text-white md:pl-24 md:pr-24 pb-20 md:pb-0">
      <style>
        {`
          .room-sphere {
            aspect-ratio: 1 / 1;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.4));
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: inset -2px -2px 6px rgba(0,0,0,0.5), inset 2px 2px 6px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.5);
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden;
          }
          .room-sphere:active { transform: scale(0.95); }
          .status-ring-free { box-shadow: 0 0 10px rgba(74, 222, 128, 0.3), inset 0 0 10px rgba(74, 222, 128, 0.1); border: 2px solid rgba(74, 222, 128, 0.5); }
          .status-ring-occupied { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), inset 0 0 10px rgba(59, 130, 246, 0.2); border: 2px solid #3b82f6; }
          .status-ring-critical { box-shadow: 0 0 20px rgba(239, 68, 68, 0.6), inset 0 0 15px rgba(239, 68, 68, 0.3); border: 2px solid #ef4444; animation: pulse-red 1.5s infinite; }
          @keyframes pulse-red { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
        `}
      </style>

      {/* --- NAVBAR --- */}
      <div className="fixed top-0 left-0 w-full bg-black border-b border-white/10 z-50 px-4 py-3 shadow-lg flex justify-between items-center">
        <div className="text-sm md:text-lg font-bold truncate pr-2 md:pl-24 flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <FaClock className="text-white text-lg" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-wide text-white block leading-none">CONTROL</span>
            <span className="text-xs text-gray-400 block mt-1 leading-none">{colaborador || 'Invitado'}</span>
          </div>
        </div>
        <div className="md:hidden">
          <button onClick={() => setMenuAbierto(!menuAbierto)} className="text-gray-300 hover:text-white p-2">
            {menuAbierto ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
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

      {/* Menú Móvil */}
      <div className={`md:hidden fixed top-[72px] left-0 w-full bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl overflow-hidden transition-all duration-300 z-30 ${menuAbierto ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">
                <span className="text-gray-400 text-xs block mb-1 font-bold">BASE</span>
                <span className="text-blue-300 font-mono text-lg">${baseCaja.toLocaleString()}</span>
              </div>
              <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">
                <span className="text-gray-400 text-xs block mb-1 font-bold">VENTAS</span>
                <span className="text-green-400 font-mono text-lg">+${totalVentas.toLocaleString()}</span>
              </div>
          </div>
          <button onClick={cerrarTurno} className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl">FINALIZAR JORNADA</button>
        </div>
      </div>

      {/* --- GRID DE HABITACIONES --- */}
      <div className="pt-8 pb-20 px-3 md:px-8 min-h-[calc(100vh-80px)] flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-6 justify-items-center">
            {[...Array(16)].map((_, i) => {
              const num = i + 1;
              const r = reservas.find(res => res.habitacion === num && !res.hsalida);
              const info = r ? calcularEstadoTiempo(r.hentrada) : null;
              const estado = !r ? 'libre' : info?.excedido ? 'critica' : 'ocupada';

              return (
                <button 
                  key={num}
                  onClick={() => handleClickHabitacion(num)}
                  className={`room-sphere w-full max-w-[85px] sm:max-w-[100px] ${
                    estado === 'libre' ? 'status-ring-free' : estado === 'ocupada' ? 'status-ring-occupied' : 'status-ring-critical'
                  }`}
                >
                  <span className={`text-2xl md:text-3xl font-black z-10 drop-shadow-md ${estado === 'libre' ? 'text-gray-400' : 'text-white'}`}>
                    {num}
                  </span>
                  {r && (
                     <div className="absolute bottom-2 flex flex-col items-center w-full px-1">
                        {info && (
                          <span className={`text-[9px] md:text-[10px] font-bold px-1.5 rounded-full mb-0.5 ${info.excedido ? 'bg-red-600 text-white' : 'bg-blue-600/80 text-white'}`}>
                             {info.excedido ? '!!!' : formatoTiempoRestante(info.minutosRestantes)}
                          </span>
                        )}
                        <span className="text-[8px] text-gray-300 font-mono opacity-90 truncate w-full text-center">{r.placa}</span>
                     </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- MODAL DETALLADO --- */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered 
        contentClassName="!bg-gray-800 !text-white !border !border-gray-600 !shadow-2xl !rounded-2xl"
      >
        <Modal.Header closeButton closeVariant="white" className="border-b border-gray-700 !bg-gray-800 rounded-t-2xl">
          <Modal.Title className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold shadow-lg">
                {habitacionSeleccionada}
             </div>
             <span className="font-bold tracking-wide text-sm uppercase">Detalle Habitación</span>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-0 !bg-gray-900">
             {reservaSeleccionada ? (
                 <div className="flex flex-col">
                    <div className={`p-6 text-center ${estadoModal?.excedido ? 'bg-red-900/30' : 'bg-indigo-900/20'} border-b border-gray-700`}>
                        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">Tiempo Restante</div>
                        {estadoModal?.excedido ? (
                            <div className="text-red-500 font-black text-4xl animate-pulse">TIEMPO AGOTADO</div>
                        ) : (
                            <div className="text-green-400 font-mono font-bold text-5xl">
                                {formatoTiempoRestante(estadoModal?.minutosRestantes || 0)}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-px bg-gray-700">
                        <div className="bg-gray-800 p-4 flex flex-col items-center justify-center gap-1">
                            <FaCar className="text-gray-500 mb-1" />
                            <span className="text-[10px] text-gray-400 uppercase">Vehículo</span>
                            <span className="font-bold text-lg text-white">{reservaSeleccionada.vehiculo || "N/A"}</span>
                        </div>
                        <div className="bg-gray-800 p-4 flex flex-col items-center justify-center gap-1">
                            <span className="text-[10px] text-gray-400 uppercase border border-gray-600 px-1 rounded">PLACA</span>
                            <span className="font-black text-xl text-yellow-400 font-mono tracking-wider">{reservaSeleccionada.placa}</span>
                        </div>
                        <div className="bg-gray-800 p-4 flex flex-col items-center justify-center gap-1">
                            <FaClock className="text-gray-500 mb-1" />
                            <span className="text-[10px] text-gray-400 uppercase">Hora Entrada</span>
                            <span className="font-bold text-white">{reservaSeleccionada.hentrada}</span>
                        </div>
                        <div className="bg-gray-800 p-4 flex flex-col items-center justify-center gap-1">
                            <FaMoneyBillWave className="text-green-600 mb-1" />
                            <span className="text-[10px] text-gray-400 uppercase">Valor Pagado</span>
                            <span className="font-bold text-green-400 text-lg">${reservaSeleccionada.valor.toLocaleString()}</span>
                        </div>
                    </div>

                    {reservaSeleccionada.observaciones && (
                        <div className="bg-gray-800 p-4 border-t border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                                <FaStickyNote className="text-yellow-600" />
                                <span className="text-xs font-bold text-gray-400">OBSERVACIONES</span>
                            </div>
                            <p className="text-sm text-gray-300 italic bg-black/20 p-2 rounded border border-gray-700/50">
                                "{reservaSeleccionada.observaciones}"
                            </p>
                        </div>
                    )}
                    
                    <div className="p-4 bg-gray-800 border-t border-gray-700">
                        <button 
                            onClick={handleFinalizarReserva}
                            disabled={procesandoSalida}
                            className={`w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl transition-all shadow-lg 
                                ${procesandoSalida 
                                    ? 'bg-gray-600 cursor-not-allowed' 
                                    : 'bg-red-600 hover:bg-red-500 active:scale-95'}`}
                        >
                            <FaSignOutAlt />
                            {procesandoSalida ? 'PROCESANDO...' : 'DAR SALIDA Y LIBERAR'}
                        </button>
                    </div>

                 </div>
             ) : (
                 <div className="py-12 flex flex-col items-center justify-center text-gray-500 !bg-gray-800">
                    <FaCalendarCheck className="text-4xl mb-3 opacity-20" />
                    <p className="text-sm font-medium">Habitación Disponible</p>
                    <p className="text-xs opacity-50">Lista para nueva reserva</p>
                 </div>
             )}
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default Historial;