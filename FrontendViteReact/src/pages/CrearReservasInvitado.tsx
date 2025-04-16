import { useEffect, useState } from 'react';
import api from '../services/api';
import ReservasForm from '../components/CrearReservas/ReservasForm';
import TableCrearReservas from '../components/CrearReservas/TableCrearReservasInvitado';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Caja from '../components/Caja';

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
  colaborador: string;
}

const CrearReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [formData, setFormData] = useState<Partial<Reserva>>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []);

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
    <div className="relative w-full min-h-screen px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-white lg:pl-24">
      <h2 className="text-2xl font-bold mb-4">
        Bienvenido {username || 'Invitado'} ¡aquí puedes hacer tus registros!
      </h2>

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

      <TableCrearReservas
        reservas={reservas}
        fetchReservas={fetchReservas}
      />

      <Caja/>

      <div className="text-center mt-4">
        <button onClick={exportarExcel} className="btn btn-success">
          Exportar reservas del turno a Excel
        </button>
      </div>

    </div>
  );
};

export default CrearReservas;