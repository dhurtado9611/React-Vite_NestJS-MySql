import { useState } from 'react';

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
  colaborador?: string;
}

interface Props {
  reservas: Reserva[];
}

const TableCrearReservas = ({ reservas }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Lógica de Filtrado: Obtiene datos del turno actual desde localStorage
  const datosTurnoString = localStorage.getItem('datosTurno');
  let reservasFiltradas = reservas;
  let filtroInfo = { colaborador: '', fecha: '' };

  if (datosTurnoString) {
    try {
      const { colaborador, fecha } = JSON.parse(datosTurnoString);
      filtroInfo = { colaborador, fecha };
      // Filtra por colaborador y fecha exacta
      reservasFiltradas = reservas.filter(
        (reserva) => reserva.fecha === fecha && reserva.colaborador === colaborador
      );
    } catch (error) {
      console.error('Error al parsear datosTurno:', error);
    }
  }

  // Lógica de Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reservasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reservasFiltradas.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    // Contenedor Glassmorphism
    <div className="mt-5 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-white">
      
      {/* Encabezado con información del filtro activo */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-white/10 pb-3">
        <h2 className="h4 font-bold m-0">Historial de Reservas</h2>
        {filtroInfo.colaborador && (
          <span className="badge bg-primary/50 border border-primary/30 text-white px-3 py-2">
            Turno: {filtroInfo.colaborador} | Fecha: {filtroInfo.fecha}
          </span>
        )}
      </div>

      <div className="table-responsive" style={{ minHeight: '300px' }}>
        <table className="table table-hover text-center align-middle" style={{ color: 'white' }}>
          <thead className="border-bottom border-white/20">
            <tr>
              <th className="bg-transparent text-white fw-semibold">ID</th>
              <th className="bg-transparent text-white fw-semibold">Vehículo</th>
              <th className="bg-transparent text-white fw-semibold">Placa</th>
              <th className="bg-transparent text-white fw-semibold">Habitación</th>
              <th className="bg-transparent text-white fw-semibold">Valor</th>
              <th className="bg-transparent text-white fw-semibold">Entrada</th>
              <th className="bg-transparent text-white fw-semibold">Salida Max</th>
              <th className="bg-transparent text-white fw-semibold">Salida</th>
              <th className="bg-transparent text-white fw-semibold">Obs</th>
              <th className="bg-transparent text-white fw-semibold">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((reserva) => (
                <tr key={reserva.id} className="border-bottom border-white/10 hover:bg-white/5 transition-colors">
                  <td className="bg-transparent text-white">{reserva.id}</td>
                  <td className="bg-transparent text-white">
                    <span className={`badge ${reserva.vehiculo === 'Moto' ? 'bg-info' : 'bg-secondary'}`}>
                      {reserva.vehiculo}
                    </span>
                  </td>
                  <td className="bg-transparent text-white fw-bold">{reserva.placa}</td>
                  <td className="bg-transparent text-white">{reserva.habitacion}</td>
                  <td className="bg-transparent text-success fw-bold">${reserva.valor}</td>
                  <td className="bg-transparent text-white">{reserva.hentrada}</td>
                  <td className="bg-transparent text-white opacity-75">{reserva.hsalidamax}</td>
                  <td className="bg-transparent text-white">
                    {reserva.hsalida ? (
                      reserva.hsalida
                    ) : (
                      <span className="badge bg-warning text-dark">Pendiente</span>
                    )}
                  </td>
                  <td className="bg-transparent text-white small text-truncate" style={{ maxWidth: '150px' }}>
                    {reserva.observaciones}
                  </td>
                  <td className="bg-transparent text-white">{reserva.fecha || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-5 text-white/50 bg-transparent">
                  No se encontraron reservas para este turno.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4 border-top border-white/10 pt-3">
          <span className="text-white/70 text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <div className="btn-group">
            <button
              className="btn btn-outline-light btn-sm px-3"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              <i className="bi bi-chevron-left me-1"></i> Anterior
            </button>
            <button
              className="btn btn-outline-light btn-sm px-3"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Siguiente <i className="bi bi-chevron-right ms-1"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableCrearReservas;