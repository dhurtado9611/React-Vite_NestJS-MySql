import { useEffect, useState } from 'react';
import GraficaReservas from './GraficaReservas';
import { Reserva } from './types';
import api from '../services/api';

const Historial = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      const response = await api.get('/reservas');
      setReservas(response.data);
    } catch (error) {
      console.error('Error al obtener las reservas:', error);
    }
  };

  const getEstadoHabitacion = (habitacion: number) => {
    const reservaActiva = reservas.find(
      (reserva) => reserva.habitacion === habitacion && !reserva.hsalida
    );
    return reservaActiva ? 'ocupada' : 'libre';
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Estado de las Habitaciones</h2>
      <div className="row">
        {[...Array(16)].map((_, i) => {
          const estado = getEstadoHabitacion(i + 1);
          return (
            <div key={i} className="col-3 mb-3">
              <button
                className={`btn btn-lg w-100 ${
                  estado === 'ocupada' ? 'btn-danger' : 'btn-success'
                }`}
              >
                Habitación {i + 1}
              </button>
            </div>
          );
        })}
      </div>

      <div className="container mt-5">
        <GraficaReservas />
        <h1 className="text-center">Historial de Reservas</h1>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehículo</th>
              <th>Placa</th>
              <th>Habitación</th>
              <th>Valor</th>
              <th>Hora Entrada</th>
              <th>Hora Salida Máxima</th>
              <th>Hora Salida</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.id}</td>
                <td>{reserva.vehiculo}</td>
                <td>{reserva.placa}</td>
                <td>{reserva.habitacion}</td>
                <td>{reserva.valor}</td>
                <td>{reserva.hentrada}</td>
                <td>{reserva.hsalidamax}</td>
                <td>{reserva.hsalida}</td>
                <td>{reserva.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Historial;
