import { useEffect, useState } from 'react';
import { Reserva } from '../components/types';
import api from '../services/api';
import { Modal, Button } from 'react-bootstrap';

// ✅ Extender el tipo Reserva para incluir valores convertidos
type ReservaExtendida = Reserva & {
  hentradaNum: number;
  hsalidamaxNum: number;
};

const Historial = () => {
  const [reservas, setReservas] = useState<ReservaExtendida[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<ReservaExtendida | null>(null);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<number | null>(null);

  // ✅ Obtener datos desde la API
  const fetchDatosReservas = async () => {
    try {
      const response = await api.get('/reservas');
      const reservasConvertidas = response.data.map((reserva: Reserva) => ({
        ...reserva,
        hsalida: reserva.hsalida ?? '',
        hentradaNum: convertirHoraANumero(reserva.hentrada),
        hsalidamaxNum: convertirHoraANumero(reserva.hsalidamax)
      }));
      setReservas(reservasConvertidas);
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
    }
  };

  const convertirHoraANumero = (hora: string): number => {
    if (!hora) return 0;
    const [h, m] = hora.split(':').map(Number);
    return h * 1000 + m;
  };

  const getEstadoHabitacion = (habitacion: number) => {
    const reservaActiva = reservas.find(
      (reserva) => reserva.habitacion === habitacion && !reserva.hsalida
    );
  
    if (reservaActiva) {
      const { hentradaNum } = reservaActiva;
      // Obtenemos la hora actual en formato "HH:mm"
      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTimeString = `${currentHour}:${currentMinute}`;
      const currentTimeNum = Math.abs(convertirHoraANumero(currentTimeString));
  
      // Si la diferencia entre la hora actual y la hora de entrada es >= 400, la habitación se marca como 'critica'
      const diferencia = currentTimeNum - hentradaNum;
      console.log(`Diferencia entre la hora actual y la hora de entrada: ${currentTimeNum}-${hentradaNum}=${diferencia}`);
      return diferencia >= 400 ? 'critica' : 'ocupada';
    }
  
    return 'libre';
  };

  const handleClickHabitacion = async (habitacion: number) => {
    setHabitacionSeleccionada(habitacion);
    try {
      const response = await api.get(`/reservas`);
      const reservasHabitacion = response.data.filter(
        (reserva: Reserva) => reserva.habitacion === habitacion && !reserva.hsalida
      );
      if (reservasHabitacion.length > 0) {
        const reservaActiva = reservasHabitacion[reservasHabitacion.length - 1];
        setReservaSeleccionada({
          ...reservaActiva,
          hentradaNum: convertirHoraANumero(reservaActiva.hentrada),
          hsalidamaxNum: convertirHoraANumero(reservaActiva.hsalidamax)
        });
      } else {
        setReservaSeleccionada(null);
      }
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      setReservaSeleccionada(null);
    }
    setShowModal(true);
  };

  useEffect(() => {
    fetchDatosReservas();
    const updateInterval = setInterval(fetchDatosReservas, 10000);
    return () => clearInterval(updateInterval);
  }, []);

  return (
    <div className="pb-20 container mt-4">
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
                        ? 'btn-warning'
                        : ''
                    }`}
                    style={{
                      animation:
                        estado === 'critica' ? 'parpadeo 1s infinite' : 'none',
                      color: estado === 'critica' ? '#000' : undefined,
                      border: estado === 'critica' ? '1px solid #ff6347' : undefined
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
      </div>

      <style>
        {`
          @keyframes parpadeo {
            0% { background-color: #ffc107; border-color: #ff6347; }
            50% { background-color: #ff6347; border-color: #ffc107; }
            100% { background-color: #ffc107; border-color: #ff6347; }
          }
        `}
      </style>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Habitación {habitacionSeleccionada}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reservaSeleccionada ? (
            <>
              <p><strong>Fecha:</strong> {reservaSeleccionada.fecha}</p>
              <p><strong>Vehículo:</strong> {reservaSeleccionada.vehiculo}</p>
              <p><strong>Placa:</strong> {reservaSeleccionada.placa}</p>
              <p><strong>Hora Entrada:</strong> {reservaSeleccionada.hentrada}</p>
              <p><strong>Hora Salida Máxima:</strong> {reservaSeleccionada.hsalidamax}</p>
              <p><strong>Hora Salida:</strong> {reservaSeleccionada.hsalida || '---'}</p>
              <p><strong>Valor:</strong> ${reservaSeleccionada.valor}</p>
              <p><strong>Observaciones:</strong> {reservaSeleccionada.observaciones || 'Sin observaciones'}</p>
            </>
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
    </div>
  );
};

export default Historial;