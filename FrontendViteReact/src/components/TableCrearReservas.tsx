import api from '../services/api';
import { useState } from 'react';

interface Reserva {
  id: number;
  vehiculo: string;
  placa: string;
  habitacion: number;
  valor: number;
  hentrada: string;
  hsalidamax: string;
  hsalida: string;
  observaciones: string;
  fecha: string;
  colaborador?: string;
}

interface Props {
  reservas: Reserva[];
  fetchReservas: () => void;
}

const TableCrearReservas = ({ reservas, fetchReservas }: Props) => {
  const [estadoSalida, setEstadoSalida] = useState<{ [id: number]: 'normal' | 'lista' | 'liberado' }>({});

  const handleDarSalida = async (id: number) => {
    setEstadoSalida((prev) => ({ ...prev, [id]: 'lista' }));
  };

  const confirmarSalida = async (id: number) => {
    try {
      const horaActual = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });
      await api.put(`/reservas/${id}`, { hsalida: horaActual });
      setEstadoSalida((prev) => ({ ...prev, [id]: 'liberado' }));
      fetchReservas();
    } catch (error) {
      console.error('Error al registrar la hora de salida:', error);
    }
  };

  // Filtrar reservas por el turno actual
  const datosTurno = localStorage.getItem('datosTurno');
  let reservasFiltradas = reservas;
  if (datosTurno) {
    try {
      const { colaborador, fecha } = JSON.parse(datosTurno);
      reservasFiltradas = reservas.filter(
        (reserva) => reserva.fecha === fecha && reserva.colaborador === colaborador
      );
    } catch (error) {
      console.error('Error al parsear datosTurno:', error);
    }
  }

  const habitacionesOcupadas = reservas.filter((r) => !r.hsalida);

  return (
    <div className="mt-5">
      {/* Habitaciones Ocupadas */}
      {habitacionesOcupadas.length > 0 && (
        <>
          <h2>Habitaciones Ocupadas</h2>
          <div className="table-responsive overflow-auto" style={{ maxHeight: '400px' }}>
            <table className="table table-striped text-center">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vehículo</th>
                  <th>Placa</th>
                  <th>Habitación</th>
                  <th>Hora Entrada</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {habitacionesOcupadas.map((reserva) => (
                  <tr key={reserva.id}>
                    <td>{reserva.id}</td>
                    <td>{reserva.vehiculo}</td>
                    <td>{reserva.placa}</td>
                    <td>{reserva.habitacion}</td>
                    <td>{reserva.hentrada}</td>
                    <td>
                      {estadoSalida[reserva.id] === 'lista' ? (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => confirmarSalida(reserva.id)}
                        >
                          Lista
                        </button>
                      ) : estadoSalida[reserva.id] === 'liberado' ? (
                        <span className="text-success fw-bold">Disponible</span>
                      ) : (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleDarSalida(reserva.id)}
                        >
                          Dar salida
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Lista de Reservas */}
      <h2 className="mt-5">Lista de Reservas</h2>
      <div className="table-responsive overflow-auto" style={{ maxHeight: '400px' }}>
        <table className="table table-striped text-center">
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
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.id}</td>
                <td>{reserva.vehiculo}</td>
                <td>{reserva.placa}</td>
                <td>{reserva.habitacion}</td>
                <td>{reserva.valor}</td>
                <td>{reserva.hentrada}</td>
                <td>{reserva.hsalidamax}</td>
                <td>{reserva.hsalida || 'Pendiente'}</td>
                <td>{reserva.observaciones}</td>
                <td>{reserva.fecha || 'Sin fecha'}</td>
                <td>
                  {!reserva.hsalida && estadoSalida[reserva.id] !== 'liberado' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleDarSalida(reserva.id)}
                    >
                      Dar salida
                    </button>
                  )}
                  {estadoSalida[reserva.id] === 'lista' && (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => confirmarSalida(reserva.id)}
                    >
                      Lista
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableCrearReservas;