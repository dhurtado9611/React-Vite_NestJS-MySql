import { useEffect, useState } from 'react';
import api from '../services/api';
import ReservasForm from '../components/ReservasForm';
import TableReservas from '../components/TableReservas';

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

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Agregar Reserva - Invitado</h2>

      <ReservasForm
        fetchReservas={fetchReservas}
        formData={formData}
        setFormData={setFormData}
        editingId={null} // no se permite editar
        setEditingId={() => {}} // función vacía
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

export default CrearReservas;