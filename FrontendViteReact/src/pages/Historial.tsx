import { useEffect, useState } from 'react';
import GraficaReservas from '../components/GraficaReservas';
import { Reserva } from '../components/types';
import api from '../services/api';
import { Modal, Button } from 'react-bootstrap';

const Historial = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<number | null>(null);

  // ✅ Función para pedir los datos (se reutiliza para botones y gráfica)
  const fetchDatosReservas = async () => {
    try {
      const response = await api.get('/reservas');
      setReservas(response.data);
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
    }
  };

  useEffect(() => {
    fetchDatosReservas();
  }, []);

  // ✅ Función para determinar el estado de una habitación
  const getEstadoHabitacion = (habitacion: number) => {
    const reservaActiva = reservas.find(
      (reserva) => reserva.habitacion === habitacion && !reserva.hsalida
    );
    return reservaActiva ? 'ocupada' : 'libre';
  };

  // ✅ Función para manejar el clic en una habitación
  const handleClickHabitacion = (habitacion: number) => {
    setHabitacionSeleccionada(habitacion);
    const reservaActiva = reservas.find(
      (reserva) => reserva.habitacion === habitacion && !reserva.hsalida
    );
    setReservaSeleccionada(reservaActiva || null);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* ✅ Primera Columna: Estado de las Habitaciones */}
        <div className="col-md-6">
          <h2 className="mb-4 text-center">Estado de las Habitaciones</h2>
          <div className="row justify-content-center">
            {[...Array(16)].map((_, i) => {
              const estado = getEstadoHabitacion(i + 1);
              return (
                <div key={i} className="col-4 mb-3">
                  <button
                    className={`btn btn-lg w-100 shadow ${
                      estado === 'ocupada' ? 'btn-danger' : 'btn-success'
                    }`}
                    style={{
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    onClick={() => handleClickHabitacion(i + 1)}
                  >
                    {i + 1}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ✅ Segunda Columna: Gráfica de Resultados */}
        <div className="col-md-6">
          <h2 className="mb-4 text-center">Estadísticas</h2>
          <div className="card shadow p-3">
            {/* ✅ Pasar los datos a la gráfica */}
            <GraficaReservas reservas={reservas} />
          </div>
        </div>
      </div>

      {/* ✅ Modal de Información */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Habitación {habitacionSeleccionada}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reservaSeleccionada ? (
            <>
              <p><strong>Fecha:</strong> {reservaSeleccionada.fecha}</p> {/* ✅ Nueva propiedad */}
              <p><strong>Vehículo:</strong> {reservaSeleccionada.vehiculo}</p>
              <p><strong>Placa:</strong> {reservaSeleccionada.placa}</p>
              <p><strong>Hora Entrada:</strong> {reservaSeleccionada.hentrada}</p>
              <p><strong>Hora Salida Máxima:</strong> {reservaSeleccionada.hsalidamax}</p>
              <p><strong>Hora Salida:</strong> {reservaSeleccionada.hsalida || '---'}</p>
              <p><strong>Valor:</strong> ${reservaSeleccionada.valor}</p>
              <p><strong>Observaciones:</strong> {reservaSeleccionada.observaciones || 'Sin observaciones'}</p>
            </>
          ) : (
            <p className="text-center text-success">La habitación está disponible.</p>
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