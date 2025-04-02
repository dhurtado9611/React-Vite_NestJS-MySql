import { useEffect, useState } from 'react';
import api from '../services/api';

interface Reserva {
  vehiculo: string;
  placa: string;
  habitacion: number;
  valor: number;
  hentrada: string;
  hsalidamax: string;
  hsalida: string;
  observaciones: string;
}

interface Props {
  fetchReservas: () => void;
  formData: Partial<Reserva>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Reserva>>>;
  editingId: number | null;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  selectedId: number | null;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
  reservas: Reserva[];
  disableEditButton?: boolean;
  disableDeleteButton?: boolean;
}

const ReservasForm = ({
  fetchReservas,
  formData,
  setFormData,
  editingId,
  setEditingId,
  selectedId,
  setSelectedId,
  reservas,
  disableEditButton,
  disableDeleteButton,
}: Props) => {
  const fechaActual = new Date().toISOString().split('T')[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const datosTurno = JSON.parse(localStorage.getItem('datosTurno') || '{}');
      const dataToSend = {
        ...formData,
        fecha: fechaActual,
        colaborador: datosTurno.colaborador || 'Invitado',
      };

      if (editingId) {
        await api.put(`/reservas/${editingId}`, dataToSend);
        setEditingId(null);
      } else {
        await api.post('/reservas', dataToSend);
      }

      setFormData({});
      fetchReservas();
    } catch (error) {
      console.error('Error al guardar reserva:', error);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setEditingId(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 text-white p-4 rounded shadow-md border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="vehiculo" value={formData.vehiculo || ''} onChange={handleChange} className="form-control" placeholder="Vehículo" required />
        <input name="placa" value={formData.placa || ''} onChange={handleChange} className="form-control" placeholder="Placa" required />
        <input name="habitacion" type="number" value={formData.habitacion || ''} onChange={handleChange} className="form-control" placeholder="Habitación" required />
        <input name="valor" type="number" value={formData.valor || ''} onChange={handleChange} className="form-control" placeholder="Valor" required />
        <input name="hentrada" type="time" value={formData.hentrada || ''} onChange={handleChange} className="form-control" placeholder="Hora Entrada" required />
        <input name="hsalidamax" type="time" value={formData.hsalidamax || ''} onChange={handleChange} className="form-control" placeholder="Hora Salida Máxima" required />
        <input name="hsalida" type="time" value={formData.hsalida || ''} onChange={handleChange} className="form-control" placeholder="Hora Salida" />
        <textarea name="observaciones" value={formData.observaciones || ''} onChange={handleChange} className="form-control" placeholder="Observaciones" rows={2} />
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button type="submit" className="btn btn-success">
          {editingId ? 'Actualizar' : 'Guardar'}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancel} className="btn btn-secondary">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default ReservasForm;