import { useEffect, useState } from 'react';
import api from '../services/api';
import ReservasForm from '../components/CrearReservas/ReservasForm';
import TableReservas from '../components/CrearReservas/TableCrearReservasInvitado';

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

const Reservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [formData, setFormData] = useState<Partial<Reserva>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
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

  return (
    <div className="relative text-white w-screen p-8 min-h-screen sm:p-8 lg:p-8 pt-16 pb-20 lg:pl-24">
      <h2 className="text-2xl font-bold mb-4">
        Bienvenido, {username || 'Invitado'}, ¡aquí puedes hacer tus registros, modificarlos o eliminarlos!
      </h2>
      <h2 className="mb-4">{editingId ? 'Editar Reserva' : 'Agregar Reserva'}</h2>
      <ReservasForm
        fetchReservas={fetchReservas}
        formData={formData}
        setFormData={setFormData}
        editingId={editingId}
        setEditingId={setEditingId}
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
    </div>
  );
};

export default Reservas;