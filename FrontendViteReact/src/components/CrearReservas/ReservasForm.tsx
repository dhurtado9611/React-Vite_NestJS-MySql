import { useEffect, useState } from 'react';
import api from '../../services/api';
import { getFechaLocal } from '../../utils/fecha';

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
  metodoPago: string;
  bancoTransferencia: string;
  referenciaTransferencia: string;
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
  esAdmin?: boolean;
}

interface UsuarioInvitado {
  id: number;
  username: string;
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
  esAdmin = false,
}: Props) => {
  // Filtra las habitaciones que actualmente tienen un estado activo o pendiente
  const habitacionesOcupadas = reservas
    .filter((r) => !r.hsalida || r.hsalida.toLowerCase() === 'pendiente')
    .map((r) => r.habitacion);

  const [usuariosInvitados, setUsuariosInvitados] = useState<UsuarioInvitado[]>([]);

  // Solo el admin puede reasignar el colaborador de una reserva; se listan los
  // usuarios con rol "invitado" para elegir a quién se le atribuye.
  useEffect(() => {
    if (!esAdmin) return;
    api.get('/users')
      .then((res) => {
        const invitados = (res.data as any[])
          .filter((u) => u.rol === 'invitado')
          .map((u) => ({ id: u.id, username: u.username }));
        setUsuariosInvitados(invitados);
      })
      .catch((error) => console.error('Error cargando usuarios invitados:', error));
  }, [esAdmin]);

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
      // Al volver a "efectivo" se limpian los datos de transferencia para no enviar información obsoleta.
      if (name === 'metodoPago' && value === 'efectivo') {
        newFormData.bancoTransferencia = '';
        newFormData.referenciaTransferencia = '';
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
        !formData.hentrada ||
        !formData.metodoPago
      ) {
        alert('Por favor completa todos los campos requeridos.');
        return;
      }
      if (
        formData.metodoPago === 'transferencia' &&
        (!formData.bancoTransferencia || !formData.referenciaTransferencia)
      ) {
        alert('Selecciona el banco/app y escribe la referencia de la transferencia.');
        return;
      }
      const fechaActual = getFechaLocal();
      const datosTurno = JSON.parse(localStorage.getItem('datosTurno') || '{}');
      const adminUsername = localStorage.getItem('username') || 'admin';
      // "id" viene de handleEdit (setFormData(reserva)) cuando se está editando; el
      // backend rechaza cualquier propiedad que no sea parte del DTO (whitelist).
      const { id: _id, ...formDataSinId } = formData;
      const dataToSend = {
        ...formDataSinId,
        habitacion: Number(formData.habitacion),
        // El input de Valor acepta formato "$50,000.00" (ver pattern del input); se limpia antes de convertir.
        valor: Number(String(formData.valor).replace(/[^0-9.]/g, '')),
        fecha: fechaActual,
        // Si ya venía un colaborador (reserva existente, o seleccionado en el
        // combo de admin) se respeta; si no, se usa el colaborador del turno
        // activo (invitado) o el admin logueado, sin pisar nunca un valor ya asignado.
        colaborador: formData.colaborador || datosTurno.colaborador || adminUsername,
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

        <div className="col">
          <label className="form-label text-white fw-semibold">Método de Pago</label>
          <select
            name="metodoPago"
            value={formData.metodoPago || ''}
            onChange={handleInputChange}
            className="form-control bg-light border-0 shadow-sm"
            required
          >
            <option value="">Seleccione</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        {esAdmin && (
          <div className="col">
            <label className="form-label text-white fw-semibold">Colaborador</label>
            <select
              name="colaborador"
              value={formData.colaborador || ''}
              onChange={handleInputChange}
              className="form-control bg-light border-0 shadow-sm"
            >
              <option value="">-- Admin (sin cambios) --</option>
              {formData.colaborador &&
                !usuariosInvitados.some((u) => u.username === formData.colaborador) && (
                  <option value={formData.colaborador}>{formData.colaborador} (actual)</option>
                )}
              {usuariosInvitados.map((u) => (
                <option key={u.id} value={u.username}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.metodoPago === 'transferencia' && (
          <>
            <div className="col">
              <label className="form-label text-white fw-semibold">Banco / App</label>
              <select
                name="bancoTransferencia"
                value={formData.bancoTransferencia || ''}
                onChange={handleInputChange}
                className="form-control bg-light border-0 shadow-sm"
                required
              >
                <option value="">Seleccione</option>
                <option value="Nequi">Nequi</option>
                <option value="Daviplata">Daviplata</option>
                <option value="Bancolombia">Bancolombia</option>
                <option value="Bre-B">Bre-B</option>
              </select>
            </div>

            <div className="col">
              <label className="form-label text-white fw-semibold">Referencia de la Transferencia</label>
              <input
                type="text"
                name="referenciaTransferencia"
                value={formData.referenciaTransferencia || ''}
                onChange={handleInputChange}
                className="form-control bg-light border-0 shadow-sm"
                placeholder="Número de comprobante"
                required
              />
            </div>
          </>
        )}

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
        <div className="col-12 d-flex flex-column flex-sm-row justify-content-sm-between align-items-stretch align-items-sm-center gap-2 mt-4 pt-3 border-top border-white/10">

          {/* Grupo Izquierdo: Acciones de Gestión (Editar/Eliminar) */}
          <div className="d-flex gap-2">
            {!disableEditButton && (
              <button
                type="button"
                className="btn btn-outline-warning text-white border-warning fw-bold px-4 flex-fill"
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
                className="btn btn-outline-danger text-white border-danger fw-bold px-4 flex-fill"
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
            className="btn btn-success fw-bold px-5 shadow-lg w-full sm:w-auto"
          >
            {editingId ? 'Actualizar Reserva' : 'Guardar Reserva'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservasForm;