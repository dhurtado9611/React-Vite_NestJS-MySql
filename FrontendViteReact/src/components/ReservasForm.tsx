import api from '../services/api';

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
  disableEditButton = false,
  disableDeleteButton = false,
}: Props) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      if (name === 'hentrada') {
        const [hours, minutes] = value.split(':').map(Number);
        const newHours = (hours + 4) % 24;
        newFormData.hsalidamax = `${newHours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}`;
      }
      return newFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        !formData.vehiculo ||
        !formData.placa ||
        !formData.habitacion ||
        !formData.valor ||
        !formData.hentrada
      ) {
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
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-6">
        <label className="form-label">Vehículo</label>
        <input
          type="text"
          name="vehiculo"
          value={formData.vehiculo || ''}
          onChange={handleInputChange}
          className="form-control"
          required
        />
      </div>

      <div className="col-md-6">
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

      <div className="col-md-6">
        <label className="form-label">Habitación</label>
        <input
          type="number"
          name="habitacion"
          value={formData.habitacion || ''}
          onChange={handleInputChange}
          className="form-control"
          required
        />
      </div>

      <div className="col-md-6">
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

      <div className="col-md-6">
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

      <div className="col-md-6">
        <label className="form-label">Hora de Salida Máxima</label>
        <input
          type="time"
          name="hsalidamax"
          value={formData.hsalidamax || ''}
          readOnly
          className="form-control"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Hora de Salida</label>
        <input
          type="time"
          name="hsalida"
          value={formData.hsalida || ''}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="col-md-12">
        <label className="form-label">Observaciones</label>
        <textarea
          name="observaciones"
          value={formData.observaciones || ''}
          onChange={handleInputChange}
          className="form-control"
          rows={2}
        ></textarea>
      </div>

      <div className="col-12 d-flex justify-content-center">
        <button type="submit" className="btn btn-primary me-2">
          {editingId ? 'Actualizar' : 'Guardar'}
        </button>
        {!disableEditButton && (
          <button
            type="button"
            className="btn btn-warning me-2"
            onClick={handleEdit}
            disabled={!selectedId}
          >
            Editar
          </button>
        )}
        {!disableDeleteButton && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={!selectedId}
          >
            Eliminar
          </button>
        )}
      </div>
    </form>
  );
};

export default ReservasForm;