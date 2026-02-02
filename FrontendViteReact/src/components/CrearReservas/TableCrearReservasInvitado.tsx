import { useState } from 'react';
import api from '../../services/api';

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

const TableCrearReservas = ({ reservas }: Props) => {
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

  return (
    <div className="mt-5">
      

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
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableCrearReservas;