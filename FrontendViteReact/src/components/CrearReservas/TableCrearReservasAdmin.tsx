// Código actualizado de TableReservas.tsx con filtros por rango de fechas y colaborador
import { useState } from 'react';
import * as XLSX from 'xlsx';
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
  selectedId: number | null;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
}

const TableReservas = ({ reservas, fetchReservas, selectedId, setSelectedId }: Props) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [colaborador, setColaborador] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 20;

  const exportToExcel = () => {
    const filteredData = filteredReservas;
    if (filteredData.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map(({ id, vehiculo, placa, habitacion, valor, hentrada, hsalidamax, hsalida, observaciones, fecha, colaborador }) => ({
        ID: id,
        Vehículo: vehiculo,
        Placa: placa,
        Habitación: habitacion,
        Valor: valor,
        'Hora Entrada': hentrada,
        'Hora Salida Máxima': hsalidamax,
        'Hora Salida': hsalida || 'Pendiente',
        Observaciones: observaciones,
        Fecha: fecha || 'Sin fecha',
        Colaborador: colaborador || 'Sin colaborador'
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');
    XLSX.writeFile(workbook, `Reservas_${startDate || 'inicio'}_${endDate || 'fin'}.xlsx`);
  };

  const handleSelect = (id: number) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleDarSalida = async (id: number) => {
    try {
      const horaActual = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });
      await api.put(`/reservas/${id}`, { hsalida: horaActual });
      fetchReservas();
    } catch (error) {
      console.error('Error al registrar la hora de salida:', error);
    }
  };

  const filteredReservas = reservas.filter((r) => {
    const fechaOK = (!startDate || r.fecha >= startDate) && (!endDate || r.fecha <= endDate);
    const colaboradorOK = !colaborador || r.colaborador?.toLowerCase().includes(colaborador.toLowerCase());
    return fechaOK && colaboradorOK;
  });

  const totalPages = Math.ceil(filteredReservas.length / rowsPerPage);

  return (
    <div className="mt-5">
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
              <th>Dar Salida</th>
            </tr>
          </thead>
          <tbody>
            {reservas.filter((r) => !r.hsalida).map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.id}</td>
                <td>{reserva.vehiculo}</td>
                <td>{reserva.placa}</td>
                <td>{reserva.habitacion}</td>
                <td>{reserva.hentrada}</td>
                <td>
                  <button className="btn btn-success btn-sm" onClick={() => handleDarSalida(reserva.id)}>
                    Dar salida
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="row mt-5 align-items-end">
        <div className="col">
          <h2>Lista de Reservas</h2>
        </div>
        <div className="col">
          <label>Desde</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-control" />
        </div>
        <div className="col">
          <label>Hasta</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-control" />
        </div>
        <div className="col">
          <label>Colaborador</label>
          <input type="text" value={colaborador} onChange={(e) => setColaborador(e.target.value)} className="form-control" placeholder="Buscar colaborador..." />
        </div>
        <div className="col-auto">
          <button className="btn btn-success" onClick={exportToExcel}>
            Exportar a Excel
          </button>
        </div>
      </div>

      <div className="table-responsive overflow-auto mt-4" style={{ maxHeight: '400px' }}>
        <table className="table table-striped text-center">
          <thead>
            <tr>
              <th></th>
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
              <th>Colaborador</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>
                  <input type="checkbox" checked={selectedId === reserva.id} onChange={() => handleSelect(reserva.id)} />
                </td>
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
                <td>{reserva.colaborador || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-secondary me-2"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >Anterior</button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          className="btn btn-secondary ms-2"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >Siguiente</button>
      </div>
    </div>
  );
};

export default TableReservas;