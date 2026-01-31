import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Modal, Button } from 'react-bootstrap';

// --- INTERFACES LOCALES (Para evitar errores de tipos) ---
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

  // --- ESTADOS HABITACIONES ---
  const [reservas, setReservas] = useState<ReservaExtendida[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<ReservaExtendida | null>(null);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<number | null>(null);
  const [, setNow] = useState(new Date());

  // --- ESTADOS CAJA (Para el Navbar) ---
  const [baseCaja, setBaseCaja] = useState<number>(0);
  const [totalVentas, setTotalVentas] = useState<number>(0);
  const [cuadreId, setCuadreId] = useState<number | null>(null);
  const [colaborador, setColaborador] = useState<string>('');
  const [turno, setTurno] = useState<string>('');
  const [fecha, setFecha] = useState<string>('');

  // --- LÓGICA CAJA ---
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

      // 1. Obtener Cuadre
      const resCuadre = await api.get('/cuadre');
      const cuadreActivo = resCuadre.data.find((c: Cuadre) => 
        c.colaborador === nombreUsuario && 
        c.fecha === hoy && 
        !c.turnoCerrado
      );

      if (cuadreActivo) {
        setBaseCaja(cuadreActivo.basecaja || 0);
        setCuadreId(cuadreActivo.id);
        // Si no tenemos turno del localstorage, tratamos de sacarlo de la BD
        if (!turnoActual) setTurno(cuadreActivo.turno);
      }

      // 2. Calcular Ventas
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
    if (!cuadreId) return alert("No hay turno activo.");
    
    const confirmar = window.confirm(`¿Cerrar turno?\nTotal Caja: $${(baseCaja + totalVentas).toLocaleString()}`);
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
      alert('Error al cerrar turno.');
    }
  };

  // --- LÓGICA HABITACIONES ---
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
    if (minutos <= 0) return "Tiempo finalizado";
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h}h ${m}m`;
  };

  useEffect(() => {
    fetchDatosReservas();
    fetchDatosCaja();
    const interval = setInterval(() => {
      fetchDatosReservas();
      fetchDatosCaja();
    }, 10000);
    const clock = setInterval(() => setNow(new Date()), 60000);
    return () => { clearInterval(interval); clearInterval(clock); };
  }, [fetchDatosCaja]);

  const estadoModal = reservaSeleccionada ? calcularEstadoTiempo(reservaSeleccionada.hentrada) : null;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <style>
        {`
          .glass-panel {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
          }
          .room-btn {
            background: rgba(255, 255, 255, 0.05);
            transition: all 0.2s ease;
            height: 120px;
            border-radius: 12px;
          }
          .room-btn:hover {
             background: rgba(255, 255, 255, 0.1);
             transform: translateY(-2px);
          }
          .info-label {
             font-size: 0.75rem;
             color: #9ca3af;
             text-transform: uppercase;
             font-weight: 700;
             margin-bottom: 0.25rem;
          }
          .info-value {
             font-size: 1rem;
             font-weight: 600;
             color: white;
          }
        `}
      </style>

      {/* --- NAVBAR SUPERIOR FIJO (Datos de Caja) --- */}
      <div className="fixed-top bg-gray-800 border-b border-gray-700 shadow-lg" style={{ zIndex: 1030 }}>
        <div className="px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Tira de Datos (Izquierda/Centro) */}
          <div className="flex flex-wrap gap-6 items-center justify-center md:justify-start flex-1">
             <div className="text-center md:text-left">
                <div className="info-label">Colaborador</div>
                <div className="info-value">{colaborador}</div>
             </div>
             <div className="text-center md:text-left">
                <div className="info-label">Fecha</div>
                <div className="info-value">{fecha}</div>
             </div>
             <div className="text-center md:text-left">
                <div className="info-label">Turno</div>
                <div className="info-value">{turno || '--'}</div>
             </div>
             <div className="text-center md:text-left border-l border-gray-600 pl-4">
                <div className="info-label">Base</div>
                <div className="info-value text-blue-300">${baseCaja.toLocaleString()}</div>
             </div>
             <div className="text-center md:text-left">
                <div className="info-label">Ventas</div>
                <div className="info-value text-green-400">${totalVentas.toLocaleString()}</div>
             </div>
             <div className="text-center md:text-left border-l border-gray-600 pl-4">
                <div className="info-label">Total Caja</div>
                <div className="info-value text-white font-bold">${(baseCaja + totalVentas).toLocaleString()}</div>
             </div>
          </div>

          {/* Botón Cerrar (Derecha) */}
          <button 
            onClick={cerrarTurno}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow transition-colors"
          >
            Finalizar Jornada y Cerrar Turno
          </button>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL (Habitaciones) --- */}
      {/* pt-28 compensa la altura del navbar fijo */}
      <div className="pt-32 pb-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-200">Estado de Habitaciones</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {[...Array(16)].map((_, i) => {
                const num = i + 1;
                const r = reservas.find(res => res.habitacion === num && !res.hsalida);
                const info = r ? calcularEstadoTiempo(r.hentrada) : null;
                const estado = !r ? 'libre' : info?.excedido ? 'critica' : 'ocupada';

                // Colores
                let borderColor = 'border-gray-600';
                let textColor = 'text-gray-400';
                
                if (estado === 'libre') {
                    borderColor = 'border-green-500/50';
                    textColor = 'text-green-400';
                } else if (estado === 'ocupada') {
                    borderColor = 'border-blue-500';
                    textColor = 'text-white';
                } else if (estado === 'critica') {
                    borderColor = 'border-red-500';
                    textColor = 'text-red-500 animate-pulse';
                }

                return (
                  <button 
                    key={num}
                    onClick={() => handleClickHabitacion(num)}
                    className={`room-btn relative border-2 flex flex-col items-center justify-center overflow-hidden ${borderColor}`}
                  >
                    {/* Barra de progreso sutil en el fondo */}
                    {info && (
                       <div 
                         className="absolute bottom-0 left-0 h-1.5 w-full bg-gray-700"
                       >
                         <div 
                           className="h-full transition-all duration-500"
                           style={{ 
                             width: `${info.porcentaje}%`,
                             backgroundColor: info.excedido ? '#ef4444' : '#3b82f6'
                           }}
                         />
                       </div>
                    )}
                    
                    <span className={`text-4xl font-bold ${textColor}`}>
                      {num}
                    </span>
                    
                    {r && (
                        <span className="mt-2 text-xs font-mono bg-black/40 px-2 rounded text-gray-300">
                           {r.placa}
                        </span>
                    )}

                    {info && (
                        <span className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${info.excedido ? 'bg-red-600 text-white' : 'bg-blue-900 text-blue-200'}`}>
                            {info.excedido ? '!!!' : formatoTiempoRestante(info.minutosRestantes)}
                        </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-gray-800 text-white border border-gray-700">
        <Modal.Header closeButton closeVariant="white" className="border-b border-gray-700">
          <Modal.Title>Habitación {habitacionSeleccionada}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-6 text-center">
             {reservaSeleccionada ? (
                 <div className="space-y-4">
                    <div>
                        <p className="text-gray-400 text-sm uppercase">Placa</p>
                        <p className="text-2xl font-bold font-mono text-blue-300">{reservaSeleccionada.placa}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm uppercase">Tiempo Restante</p>
                        <h2 className={`text-3xl font-bold ${estadoModal?.excedido ? 'text-red-500' : 'text-green-400'}`}>
                            {estadoModal?.excedido ? 'TIEMPO EXCEDIDO' : formatoTiempoRestante(estadoModal?.minutosRestantes || 0)}
                        </h2>
                    </div>
                 </div>
             ) : (
                 <p className="text-gray-400 text-lg">Habitación Disponible</p>
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