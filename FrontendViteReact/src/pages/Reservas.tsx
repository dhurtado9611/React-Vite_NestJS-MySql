import { useEffect, useState } from 'react';
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
}

// Componente para mostrar la hora actual
const HoraActual = () => {
  const [horaActual, setHoraActual] = useState<string>('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHoraActual(
        new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return ( 
    <div className="d-flex justify-content-center my-4">
      <div
        className="bg-light text-dark border rounded shadow-sm px-4 py-2"
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          letterSpacing: '1px',
          minWidth: '250px',
          textAlign: 'center',
        }}
      >
        {horaActual}
      </div>
    </div>
  );
};

const Reservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [formData, setFormData] = useState<Partial<Reserva>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      const response = await api.get('/reservas');
      setReservas(response.data);
    } catch (error) {
      console.error('Error fetching reservas:', error);
    }
  };

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
      if (editingId !== null) {
        await api.put(`/reservas/${editingId}`, formData);
      } else {
        await api.post('/reservas', formData);
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

  const handleSelect = (id: number) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const reservasSinSalida = reservas.filter((reserva) => !reserva.hsalida);

  const handleDarSalida = async (id: number) => {
    try {
      const horaActual = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });
      await api.put(`/reservas/${id}`, { hsalida: horaActual });
      fetchReservas(); // Refresca los datos
    } catch (error) {
      console.error('Error al registrar la hora de salida:', error);
    }
  };

  return (
    <div className="container mt-5"><HoraActual />
      <h2 className="mb-4">{editingId ? 'Editar Reserva' : 'Agregar Reserva'}</h2>
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
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
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
          >Editar
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={!selectedId}
          >Eliminar
          </button>
        </div>
      </form>
    {/*Tabla Pendientes*/}
      <h2 className='mt-5'>Habitaciones Ocupadas</h2>
      <div className="table-responsive overflow-auto" style={{ maxHeight: '400px' }}>
      <table className="table table-striped text-center">
           <thead>
            <tr>
              <th>ID</th>
              <th>Vehículo</th>
              <th>Placa</th>
              <th>Habitación</th>
              <th>Hora Entrada</th>
              <th>Dar Salida</th>
            </tr>
          </thead>
          <tbody>
            {reservasSinSalida.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.id}</td>
                <td>{reserva.vehiculo}</td>
                <td>{reserva.placa}</td>
                <td>{reserva.habitacion}</td>
                <td>{reserva.hentrada}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleDarSalida(reserva.id)}
                  >
                    Dar salida
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    {/*Tabla de Reservas*/}
      <h2 className="mt-5">Lista de Reservas</h2>
      <div className="table-responsive overflow-auto" style={{ maxHeight: '400px' }}>
        <table className="table table-striped text-center">
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Vehículo</th>
              <th>Placa</th>
              <th>Habitación</th>
              <th>Valor</th>
              <th>Hora Entrada</th>
              <th>Hora Salida Máxima</th>
              <th>Hora Salida</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedId === reserva.id}
                    onChange={() => handleSelect(reserva.id)}
                  />
                </td>
                <td>{reserva.id}</td>
                <td>{reserva.vehiculo}</td>
                <td>{reserva.placa}</td>
                <td>{reserva.habitacion}</td>
                <td>{reserva.valor}</td>
                <td>{reserva.hentrada}</td>
                <td>{reserva.hsalidamax}</td>
                <td>
                <td>{reserva.hsalida || 'Pendiente'}</td>
                </td>
                <td>{reserva.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reservas;