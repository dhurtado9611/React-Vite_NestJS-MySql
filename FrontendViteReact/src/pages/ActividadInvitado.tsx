import { useEffect, useState } from 'react';
import { Reserva } from '../components/types';
import api from '../services/api';
import { Modal, Button } from 'react-bootstrap';
import Caja from '../components/Caja';

type ReservaExtendida = Reserva & {
  hentradaNum: number;
  hsalidamaxNum: number;
};

const Historial = () => {
  const [reservas, setReservas] = useState<ReservaExtendida[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<ReservaExtendida | null>(null);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<number | null>(null);
  const [, setNow] = useState(new Date());

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
    
    // Calculamos el porcentaje para el círculo de progreso (0 a 100)
    const porcentaje = Math.min((minutosPasados / LIMITE_TIEMPO) * 100, 100);
    
    return {
      minutosPasados,
      minutosRestantes: LIMITE_TIEMPO - minutosPasados,
      porcentaje,
      excedido: minutosPasados >= LIMITE_TIEMPO
    };
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
    const dataInterval = setInterval(fetchDatosReservas, 10000);
    const clockInterval = setInterval(() => setNow(new Date()), 60000);
    return () => { clearInterval(dataInterval); clearInterval(clockInterval); };
  }, []);

  const estadoModal = reservaSeleccionada ? calcularEstadoTiempo(reservaSeleccionada.hentrada) : null;

  return (
    <div className="min-h-screen pt-16 pb-20 px-4 lg:pl-24 bg-transparent text-white">
      <style>
        {`
          .glass-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          }
          .room-btn {
            position: relative;
            height: 100px;
            border-radius: 20px;
            border: none;
            transition: all 0.3s ease;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .progress-ring {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
          }
          @keyframes parpadeo-critico {
            0%, 100% { box-shadow: 0 0 10px #ff4b2b; background: rgba(255, 75, 43, 0.3); }
            50% { box-shadow: 0 0 30px #ff416c; background: rgba(255, 65, 108, 0.6); }
          }
          .modal-glass .modal-content {
            background: rgba(20, 20, 20, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 30px;
            color: white;
          }
        `}
      </style>

      <div className="container-fluid">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="glass-card p-4">
              <h2 className="text-center mb-5 fw-bold text-uppercase tracking-widest">Panel de Habitaciones</h2>
              <div className="row g-3">
                {[...Array(16)].map((_, i) => {
                  const num = i + 1;
                  const r = reservas.find(res => res.habitacion === num && !res.hsalida);
                  const info = r ? calcularEstadoTiempo(r.hentrada) : null;
                  const estado = !r ? 'libre' : info?.excedido ? 'critica' : 'ocupada';

                  return (
                    <div key={num} className="col-4 col-md-3">
                      <button 
                        onClick={() => handleClickHabitacion(num)}
                        className="room-btn w-100"
                        style={{
                          border: `1px solid ${estado === 'libre' ? 'rgba(0,255,127,0.3)' : 'rgba(255,255,255,0.1)'}`,
                          animation: estado === 'critica' ? 'parpadeo-critico 1.5s infinite' : 'none'
                        }}
                      >
                        {/* Indicador de Progreso Circular (SVG) */}
                        {info && (
                          <svg className="progress-ring" viewBox="0 0 100 100">
                            <circle
                              cx="50" cy="50" r="45"
                              fill="none"
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="5"
                            />
                            <circle
                              cx="50" cy="50" r="45"
                              fill="none"
                              stroke={info.excedido ? "#ff416c" : "#00f2fe"}
                              strokeWidth="5"
                              strokeDasharray="283"
                              strokeDashoffset={283 - (283 * info.porcentaje) / 100}
                              strokeLinecap="round"
                              style={{ transition: 'stroke-dashoffset 1s ease' }}
                            />
                          </svg>
                        )}
                        <span className="fs-2 fw-bold z-10">{num}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="glass-card p-5 h-100 d-flex flex-column align-items-center justify-content-center">
                <p className="text-muted text-uppercase mb-2">Resumen Operativo</p>
                <Caja />
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="modal-glass">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Habitación {habitacionSeleccionada}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reservaSeleccionada && estadoModal ? (
            <div className="p-2">
              <div className="d-flex justify-content-between mb-4">
                <div>
                  <small className="d-block text-muted">PLACA</small>
                  <span className="fs-4 fw-bold">{reservaSeleccionada.placa}</span>
                </div>
                <div className="text-end">
                  <small className="d-block text-muted">TIPO</small>
                  <span className="badge bg-info">{reservaSeleccionada.vehiculo}</span>
                </div>
              </div>
              
              <div className={`p-4 rounded-4 text-center ${estadoModal.excedido ? 'bg-danger/20' : 'bg-primary/20'}`} 
                   style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>
                <p className="mb-1">{estadoModal.excedido ? 'EXCESO' : 'TIEMPO RESTANTE'}</p>
                <h1 className="display-5 fw-bold m-0">
                  {formatoTiempoRestante(Math.abs(estadoModal.minutosRestantes))}
                </h1>
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <h3 className="text-success">Disponible</h3>
              <p className="text-muted">Lista para recibir un nuevo ingreso.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-light" className="rounded-pill px-4" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Historial;