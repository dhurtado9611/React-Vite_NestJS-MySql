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

  // --- LÓGICA DE FILTRADO ESTRICTO ---
  const datosTurnoString = localStorage.getItem('datosTurno');
  
  // 1. Por defecto, la lista está VACÍA (seguridad primero)
  let reservasFiltradas: Reserva[] = []; 
  let filtroInfo = { colaborador: '', fecha: '', turno: '' };

  if (datosTurnoString) {
    try {
      // Intentamos leer los datos del turno (incluyendo si guardan "turno": mañana/tarde/noche)
      const parsedData = JSON.parse(datosTurnoString);
      const { colaborador, fecha, turno } = parsedData;
      
      filtroInfo = { colaborador, fecha, turno };

      // 2. Solo llenamos la lista si coinciden Colaborador Y Fecha
      if (colaborador && fecha) {
        reservasFiltradas = reservas.filter(
          (reserva) => reserva.fecha === fecha && reserva.colaborador === colaborador
        );
      }
    } catch (error) {
      console.error('Error al leer datos del turno:', error);
      // Si falla, la lista se mantiene vacía []
    }
  }

  // --- PAGINACIÓN ---
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
    <div className="mt-5 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-white">
      
      {/* Encabezado con información del filtro activo */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-white/10 pb-3">
        <h2 className="h4 font-bold m-0">Historial del Turno Actual</h2>
        
        {/* Badge informativo del turno */}
        {filtroInfo.colaborador ? (
          <div className="d-flex gap-2">
            {filtroInfo.turno && (
              <span className="badge bg-warning text-dark border border-warning">
                {filtroInfo.turno}
              </span>
            )}
            <span className="badge bg-primary/50 border border-primary/30 text-white px-3">
              <i className="bi bi-person-badge me-1"></i> {filtroInfo.colaborador}
            </span>
            <span className="badge bg-info/50 border border-info/30 text-white px-3">
              <i className="bi bi-calendar-event me-1"></i> {filtroInfo.fecha}
            </span>
          </div>
        ) : (
          <span className="badge bg-danger/50 border border-danger/30 text-white">
            Sin turno activo
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-5 text-white/50 bg-transparent">
                  {filtroInfo.colaborador 
                    ? "No hay reservas registradas en este turno." 
                    : "No se detectó un turno activo. Inicie sesión nuevamente."}
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