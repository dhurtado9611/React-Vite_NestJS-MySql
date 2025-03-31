import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
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

const Reservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [formData, setFormData] = useState<Partial<Reserva>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // ✅ Estados para el filtrado y paginación
  const [filterDate, setFilterDate] = useState<string>(''); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 20;


const exportToExcel = () => {
  // Filtrar los datos basados en la fecha seleccionada
  const filteredData = filterDate
    ? reservas.filter((reserva) => reserva.fecha === filterDate)
    : reservas;

  if (filteredData.length === 0) {
    alert('No hay datos para exportar.');
    return;
  }

  // Crear una hoja de trabajo (worksheet)
  const worksheet = XLSX.utils.json_to_sheet(
    filteredData.map(({ id, vehiculo, placa, habitacion, valor, hentrada, hsalidamax, hsalida, observaciones, fecha }) => ({
      ID: id,
      Vehículo: vehiculo,
      Placa: placa,
      Habitación: habitacion,
      Valor: valor,
      'Hora Entrada': hentrada,
      'Hora Salida Máxima': hsalidamax,
      'Hora Salida': hsalida || 'Pendiente',
      Observaciones: observaciones,
      Fecha: fecha || 'Sin fecha',
    }))
  );

  // Crear el libro de trabajo (workbook)
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');

  // Generar el archivo y descargarlo
  XLSX.writeFile(workbook, `Reservas_${filterDate || 'Todas'}.xlsx`);
};


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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.vehiculo || !formData.placa || !formData.habitacion || !formData.valor || !formData.hentrada) {
        alert('Por favor completa todos los campos requeridos.');
        return;
      }

      const fechaActual = new Date().toISOString().split('T')[0];
  
      const dataToSend = {
        ...formData,
        fecha: fechaActual,
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
      fetchReservas();
    } catch (error) {
      console.error('Error al registrar la hora de salida:', error);
    }
  };

  // Filtrar por fecha
  const filteredReservas = filterDate
    ? reservas.filter((reserva) => reserva.fecha === filterDate)
    : reservas;

  // Paginación
  //const indexOfLastRow = currentPage * rowsPerPage;
  //const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  //const currentRows = filteredReservas.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredReservas.length / rowsPerPage);

  return (
    <div className="container mt-5">
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
    <div className="row">
      <div className="col">
        <h2 className="mt-5">Lista de Reservas</h2>
      </div>
      <div className="col d-flex justify-content-end">
        <h3 className='mt-5'>Filtrar por fecha</h3>
          {/* Filtro por fecha */}
          <div className="mt-5 px-3">
            <input
              type="date"
              value={filterDate}
              onChange={handleFilterChange}
              className="form-control"
            />
          </div>
          <button
            className="btn btn-success mt-5 px-3"
            onClick={exportToExcel}
            >
            Exportar a Excel
        </button>
      </div>
    </div>
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
              <th>Fecha</th>
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
                <td>{reserva.hsalida || 'Pendiente'}</td>
                <td>{reserva.observaciones}</td>
                <td>{reserva.fecha || 'Sin fecha'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ✅ Paginación */}
      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-secondary me-2"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="btn btn-secondary ms-2"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Reservas;