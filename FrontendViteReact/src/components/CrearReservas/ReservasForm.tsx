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
  colaborador: string;
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
  const habitacionesOcupadas = reservas
    .filter((r) => !r.hsalida || r.hsalida.toLowerCase() === 'pendiente')
    .map((r) => r.habitacion);

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
      const datosTurno = JSON.parse(localStorage.getItem('datosTurno') || '{}');
      const dataToSend = {
        ...formData,
        fecha: fechaActual,
        colaborador: datosTurno.colaborador || 'Invitado',
      };
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
    <form onSubmit={handleSubmit} className="row row-cols-1 row-cols-md-4 g-3">
      <div className="col">
        <label className="form-label">Vehículo</label>
        <select
          name="vehiculo"
          value={formData.vehiculo || ''}
          onChange={handleInputChange}
          className="form-control"
          required
        >
          <option value="">Seleccione</option>
          <option value="Carro">Carro</option>
          <option value="Moto">Moto</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div className="col">
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

      <div className="col">
        <label className="form-label">Habitación</label>
        <select
          name="habitacion"
          value={formData.habitacion || ''}
          onChange={handleInputChange}
          className="form-control"
          required
        >
          <option value="">Seleccione</option>
          {Array.from({ length: 16 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num} disabled={habitacionesOcupadas.includes(num)}>
              Habitación {num} {habitacionesOcupadas.includes(num) ? '(Ocupada)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="col">
        <label className="form-label">Valor</label>
        <input
          type="text"
          name="valor"
          value={formData.valor || ''}
          onChange={handleInputChange}
          className="form-control"
          placeholder="$0.00"
          pattern="^\$?\d+(,\d{3})*(\.\d{0,2})?$"
          required
        />
      </div>

      <div className="col">
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

      <div className="col">
        <label className="form-label">Hora de Salida Máxima</label>
        <input
          type="time"
          name="hsalidamax"
          value={formData.hsalidamax || ''}
          readOnly
          className="form-control"
        />
      </div>

      <div className="col">
        <label className="form-label">Hora de Salida</label>
        <input
          type="time"
          name="hsalida"
          value={formData.hsalida || ''}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="col-12">
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