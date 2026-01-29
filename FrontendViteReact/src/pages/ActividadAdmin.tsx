import { useEffect, useState } from 'react';
import GraficaReservas from '../components/CrearReservas/GraficaReservas';
import { Reserva } from '../components/types';
import api from '../services/api';
import { Modal, Button } from 'react-bootstrap';

type ReservaExtendida = Reserva & {
  hentradaNum: number;
  hsalidamaxNum: number;
};

const Historial = () => {
  const [reservas, setReservas] = useState<ReservaExtendida[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<ReservaExtendida | null>(null);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<number | null>(null);

  // Mantenemos una variable de "ahora" para forzar re-renderizado del tiempo cada minuto
  const [now, setNow] = useState(new Date());

  const fetchDatosReservas = async () => {
    try {
      const response = await api.get('/reservas');
      // No necesitamos conversiones complejas aquí, usaremos la función de cálculo dinámica
      setReservas(response.data);
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
    }
  };

  // ✅ NUEVA LÓGICA: Calcula diferencia real en minutos usando fechas
  const calcularEstadoTiempo = (horaEntrada: string) => {
    if (!horaEntrada) return { minutosPasados: 0, minutosRestantes: 240, excedido: false };

    const fechaActual = new Date();
    const [h, m] = horaEntrada.split(':').map(Number);
    
    // Crear fecha de entrada basada en el día de hoy
    const fechaEntrada = new Date();
    fechaEntrada.setHours(h, m, 0, 0);

    // Si la hora de entrada es mayor a la actual, asumimos que fue ayer (ej. entró 11pm, ahora es 1am)
    if (fechaEntrada > fechaActual) {
      fechaEntrada.setDate(fechaEntrada.getDate() - 1);
    }

    const diferenciaMs = fechaActual.getTime() - fechaEntrada.getTime();
    const minutosPasados = Math.floor(diferenciaMs / 60000);
    const LIMITE_TIEMPO = 240; // 4 horas * 60 minutos
    
    return {
      minutosPasados,
      minutosRestantes: LIMITE_TIEMPO - minutosPasados,
      excedido: minutosPasados >= LIMITE_TIEMPO
    };
  };

  const getEstadoHabitacion = (habitacion: number) => {
    const reservaActiva = reservas.find(
      (reserva) => reserva.habitacion === habitacion && !reserva.hsalida
    );
  
    if (reservaActiva) {
      const { excedido } = calcularEstadoTiempo(reservaActiva.hentrada);
      // Si se pasó de 4 horas, devuelve 'critica' (parpadeo), si no 'ocupada' (rojo)
      return excedido ? 'critica' : 'ocupada';
    }
  
    return 'libre';
  };

  const handleClickHabitacion = async (habitacion: number) => {
    setHabitacionSeleccionada(habitacion);
    try {
        // Optimización: Usamos los datos que ya tenemos en memoria si es posible
        const reservaActiva = reservas.find(
            (reserva) => reserva.habitacion === habitacion && !reserva.hsalida
        );

        if (reservaActiva) {
            setReservaSeleccionada(reservaActiva as ReservaExtendida);
        } else {
            setReservaSeleccionada(null);
        }
    } catch (error) {
      console.error('Error al seleccionar habitación:', error);
      setReservaSeleccionada(null);
    }
    setShowModal(true);
  };

  // Formatea los minutos restantes a formato legible (ej: "1h 30m")
  const formatoTiempoRestante = (minutos: number) => {
    if (minutos <= 0) return "Tiempo finalizado";
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h}h ${m}m`;
  };

  useEffect(() => {
    fetchDatosReservas();
    
    // Actualizar datos cada 10 segundos
    const dataInterval = setInterval(fetchDatosReservas, 10000);
    
    // Actualizar el reloj interno cada minuto para refrescar cálculos de tiempo restante
    const clockInterval = setInterval(() => setNow(new Date()), 60000);

    return () => {
        clearInterval(dataInterval);
        clearInterval(clockInterval);
    };
  }, []);

  // Calculamos el estado actual para el modal
  const estadoModal = reservaSeleccionada 
    ? calcularEstadoTiempo(reservaSeleccionada.hentrada) 
    : null;

  return (
    <div className="relative w-full min-h-screen px-10 sm:px-6 lg:px-8 pt-16 pb-20 lg:pl-24">
      <div className="row">
        <div className="col-md-6">
          <h2 className="mb-4 text-center">Estado de las Habitaciones</h2>
          <div className="row justify-content-center">
            {[...Array(16)].map((_, i) => {
              const estado = getEstadoHabitacion(i + 1);
              return (
                <div key={`${i}-${estado}`} className="col-4 mb-3">
                  <button
                    className={`btn btn-lg w-100 shadow ${
                      estado === 'libre'
                        ? 'btn-success'
                        : estado === 'ocupada'
                        ? 'btn-danger'
                        : estado === 'critica'
                        ? 'btn-warning' // Base amarilla, pero la animación cambiará los colores
                        : ''
                    }`}
                    style={{
                      animation:
                        estado === 'critica' ? 'parpadeo 1s infinite' : 'none',
                      color: estado === 'critica' ? '#000' : '#fff',
                      fontWeight: 'bold',
                      border: estado === 'critica' ? '2px solid red' : undefined
                    }}
                    onClick={() => handleClickHabitacion(i + 1)}
                  >
                    {i + 1}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      <style>
        {`
          @keyframes parpadeo {
            0% { background-color: #dc3545; color: white; transform: scale(1); } /* Rojo */
            50% { background-color: #ffc107; color: black; transform: scale(1.05); } /* Amarillo */
            100% { background-color: #dc3545; color: white; transform: scale(1); } /* Rojo */
          }
        `}
      </style>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className={estadoModal?.excedido ? 'bg-danger text-white' : 'bg-primary text-white'}>
          <Modal.Title>
            Habitación {habitacionSeleccionada} 
            {estadoModal?.excedido && " (TIEMPO EXCEDIDO)"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reservaSeleccionada && estadoModal ? (
            <div className="fs-5">
              <p><strong>Fecha:</strong> {reservaSeleccionada.fecha}</p>
              <p><strong>Vehículo:</strong> {reservaSeleccionada.vehiculo} - <strong>Placa:</strong> {reservaSeleccionada.placa}</p>
              <hr />
              <div className="row text-center">
                  <div className="col-6">
                      <small className="text-muted">Hora Entrada</small>
                      <h3>{reservaSeleccionada.hentrada}</h3>
                  </div>
                  <div className="col-6">
                      <small className="text-muted">Salida Máxima</small>
                      <h3>{reservaSeleccionada.hsalidamax}</h3>
                  </div>
              </div>
              
              <div className={`alert mt-3 text-center ${estadoModal.excedido ? 'alert-danger' : 'alert-success'}`}>
                  <strong>
                      {estadoModal.excedido ? 'TIEMPO EXCEDIDO POR:' : 'TIEMPO RESTANTE:'}
                  </strong>
                  <h2 className="display-4 fw-bold">
                      {estadoModal.excedido 
                        ? formatoTiempoRestante(Math.abs(estadoModal.minutosRestantes)) 
                        : formatoTiempoRestante(estadoModal.minutosRestantes)
                      }
                  </h2>
              </div>

              <p><strong>Valor:</strong> ${reservaSeleccionada.valor}</p>
              <p><strong>Observaciones:</strong> {reservaSeleccionada.observaciones || 'Sin observaciones'}</p>
            </div>
          ) : (
            <p>La habitación está libre.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="col-md-6">
          <h2 className="mb-4 text-center">Estadísticas</h2>
          <div className="card shadow p-3">
            <GraficaReservas reservas={reservas} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historial;