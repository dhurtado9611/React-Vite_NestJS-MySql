import { useEffect, useState } from 'react';
import api from '../services/api';
import ReservasForm from '../components/ReservasForm';
import TableReservas from '../components/TableReservas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

const CrearReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [formData, setFormData] = useState<Partial<Reserva>>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchReservas = async () => {
    try {
      const response = await api.get('/reservas');
      setReservas(response.data);
    } catch (error) {
      console.error('Error fetching reservas:', error);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const exportarExcel = () => {
    const datosTurno = localStorage.getItem('datosTurno');
    if (!datosTurno) return alert('No hay turno activo');

    const { colaborador, fecha } = JSON.parse(datosTurno);

    const reservasFiltradas = reservas.filter(
      (reserva) => reserva.fecha === fecha && reserva.colaborador === colaborador
    );

    const worksheet = XLSX.utils.json_to_sheet(reservasFiltradas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, `reservas_${colaborador}_${fecha}.xlsx`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Agregar Reserva - Invitado</h2>

      <ReservasForm
        fetchReservas={fetchReservas}
        formData={formData}
        setFormData={setFormData}
        editingId={null}
        setEditingId={() => {}}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        reservas={reservas}
        disableEditButton={true}
        disableDeleteButton={true}
      />

      <TableReservas
        reservas={reservas}
        fetchReservas={fetchReservas}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />

      <div className="text-center mt-4">
        <button onClick={exportarExcel} className="btn btn-success">
          Exportar reservas del turno a Excel
        </button>
      </div>
    </div>
  );
};

export default CrearReservas;