import { useState, useEffect } from 'react';
import api from '../services/api';
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

const Reservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [formData, setFormData] = useState<Partial<Reserva>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      if (name === 'hentrada') {
        const [hours, minutes] = value.split(':').map(Number);
        const newHours = (hours + 4) % 24;
        newFormData.hsalidamax = `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      return newFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.vehiculo || !formData.placa || !formData.habitacion || !formData.valor || !formData.hentrada) {
        alert('Por favor completa todos los campos requeridos.');
        return;
      }
      const fechaActual = new Date().toISOString().split('T')[0];
      const dataToSend = { ...formData, fecha: fechaActual };
      if (editingId !== null) {
        await api.put(`/reservas/${editingId}`, dataToSend);
      } else {
        await api.post('/reservas', dataToSend);
      }
      fetchReservas();
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error saving reserva:', error);
    }
  };

  const handleEdit = () => {
    if (selectedId !== null) {
      const reserva = reservas.find((r) => r.id === selectedId);
      if (reserva) {
        setFormData(reserva);
        setEditingId(reserva.id);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedId !== null && window.confirm('¿Seguro que deseas eliminar esta reserva?')) {
      try {
        await api.delete(`/reservas/${selectedId}`);
        fetchReservas();
        setSelectedId(null);
      } catch (error) {
        console.error('Error deleting reserva:', error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="row g-2">
        <div className="col-md-4">
          <label className="form-label">Vehículo</label>
          <select
            name="vehiculo"
            value={formData.vehiculo || ''}
            onChange={handleInputChange}
            className="form-control"
            required
          >
            <option value="">Seleccione...</option>
            <option value="Carro">Carro</option>
            <option value="Moto">Moto</option>
            <option value="Sin especificar">Sin especificar</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Placa</label>
          <input
            type="text"
            name="placa"
            value={formData.placa || ''}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Habitación</label>
          <select
            name="habitacion"
            value={formData.habitacion || ''}
            onChange={handleInputChange}
            className="form-control"
            required
          >
            <option value="">Seleccione...</option>
            {[...Array(16)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Valor</label>
          <input
            type="number"
            name="valor"
            value={formData.valor || ''}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Hora de Entrada</label>
          <input
            type="time"
            name="hentrada"
            value={formData.hentrada || ''}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Hora de Salida</label>
          <input
            type="time"
            name="hsalida"
            value={formData.hsalida || ''}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Observaciones</label>
          <input
            type="text"
            name="observaciones"
            value={formData.observaciones || ''}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="col-md-12 mt-3 d-flex justify-content-center">
          <button type="submit" className="btn btn-primary me-2">
            {editingId ? 'Actualizar' : 'Guardar'}
          </button>
          <button
            type="button"
            className="btn btn-warning me-2"
            onClick={handleEdit}
            disabled={!selectedId}
          >Editar</button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={!selectedId}
          >Eliminar</button>
        </div>
      </form>

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