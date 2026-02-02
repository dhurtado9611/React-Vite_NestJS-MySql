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

/**
 * Componente de formulario para la gestión de reservas.
 * Incluye lógica de cálculo automático de horas y validación de campos.
 */
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
  // Filtra las habitaciones que actualmente tienen un estado activo o pendiente
  const habitacionesOcupadas = reservas
    .filter((r) => !r.hsalida || r.hsalida.toLowerCase() === 'pendiente')
    .map((r) => r.habitacion);

  /**
   * Maneja los cambios en los inputs del formulario.
   * Calcula automáticamente la hora de salida máxima basada en la hora de entrada (+4 horas).
   */
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

  /**
   * Envía los datos del formulario al backend (POST o PUT según el estado de edición).
   */
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

  /**
   * Carga los datos de una reserva seleccionada en el formulario para su edición.
   */
  const handleEdit = () => {
    if (selectedId !== null) {
      const reserva = reservas.find((r) => r.id === selectedId);
      if (reserva) {
        setFormData(reserva);
        setEditingId(reserva.id);
      }
    }
  };

  /**
   * Elimina la reserva seleccionada previa confirmación del usuario.
   */
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
    // Contenedor principal con estilo Glassmorphism (fondo traslúcido y bordes sutiles)
    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl mb-6">
      <form onSubmit={handleSubmit} className="row row-cols-1 row-cols-md-4 g-4">
        
        {/* Sección de Campos del Formulario */}
        <div className="col">
          <label className="form-label text-white fw-semibold">Vehículo</label>
          <select
            name="vehiculo"
            value={formData.vehiculo || ''}
            onChange={handleInputChange}
            className="form-control bg-light border-0 shadow-sm"
            required
          >
            <option value="">Seleccione</option>
            <option value="Carro">Carro</option>
            <option value="Moto">Moto</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div className="col">
          <label className="form-label text-white fw-semibold">Placa</label>
          <input
            type="text"
            name="placa"
            value={formData.placa || ''}
            onChange={handleInputChange}
            className="form-control bg-light border-0 shadow-sm"
            required
          />
        </div>

        <div className="col">
          <label className="form-label text-white fw-semibold">Habitación</label>
          <select
            name="habitacion"
            value={formData.habitacion || ''}
            onChange={handleInputChange}
            className="form-control bg-light border-0 shadow-sm"
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
          <label className="form-label text-white fw-semibold">Valor</label>
          <input
            type="text"
            name="valor"
            value={formData.valor || ''}
            onChange={handleInputChange}
            className="form-control bg-light border-0 shadow-sm"
            placeholder="$0.00"
            pattern="^\$?\d+(,\d{3})*(\.\d{0,2})?$"
            required
          />
        </div>

        <div className="col">
          <label className="form-label text-white fw-semibold">Hora de Entrada</label>
          <input
            type="time"
            name="hentrada"
            value={formData.hentrada || ''}
            onChange={handleInputChange}
            className="form-control bg-light border-0 shadow-sm"
            required
          />
        </div>

        <div className="col">
          <label className="form-label text-white fw-semibold">Salida Máxima</label>
          <input
            type="time"
            name="hsalidamax"
            value={formData.hsalidamax || ''}
            readOnly
            className="form-control bg-secondary text-white border-0 shadow-sm opacity-75"
            disabled
          />
        </div>

        <div className="col">
          <label className="form-label text-white fw-semibold">Hora de Salida</label>
          <input
            type="time"
            name="hsalida"
            value={formData.hsalida || ''}
            onChange={handleInputChange}
            className="form-control bg-light border-0 shadow-sm"
            disabled
          />
        </div>

        <div className="col-12">
          <label className="form-label text-white fw-semibold">Observaciones</label>
          <textarea
            name="observaciones"
            value={formData.observaciones || ''}
            onChange={handleInputChange}
            className="form-control bg-light border-0 shadow-sm"
            rows={2}
          ></textarea>
        </div>

        {/* Sección de Botones: Separación entre acciones de gestión y acción principal */}
        <div className="col-12 d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-white/10">
          
          {/* Grupo Izquierdo: Acciones de Gestión (Editar/Eliminar) */}
          <div className="d-flex gap-2">
            {!disableEditButton && (
              <button
                type="button"
                className="btn btn-outline-warning text-white border-warning fw-bold px-4"
                onClick={handleEdit}
                disabled={!selectedId}
                style={{ backdropFilter: 'blur(4px)' }}
              >
                <i className="bi bi-pencil-square me-2"></i>Editar
              </button>
            )}
            {!disableDeleteButton && (
              <button
                type="button"
                className="btn btn-outline-danger text-white border-danger fw-bold px-4"
                onClick={handleDelete}
                disabled={!selectedId}
                style={{ backdropFilter: 'blur(4px)' }}
              >
                <i className="bi bi-trash me-2"></i>Eliminar
              </button>
            )}
          </div>

          {/* Grupo Derecho: Acción Principal (Guardar/Actualizar) */}
          <button 
            type="submit" 
            className="btn btn-success fw-bold px-5 shadow-lg"
          >
            {editingId ? 'Actualizar Reserva' : 'Guardar Reserva'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservasForm;