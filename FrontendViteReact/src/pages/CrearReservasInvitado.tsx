import { useEffect, useState } from 'react';
import api from '../services/api';
import ReservasForm from '../components/CrearReservas/ReservasForm';
import TableCrearReservas from '../components/CrearReservas/TableCrearReservasInvitado';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Iconos
const ExcelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

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

const CrearReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [formData, setFormData] = useState<Partial<Reserva>>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []);

  const fetchReservas = async () => {
    try {
      const response = await api.get('/reservas');
      if (response.data && Array.isArray(response.data)) {
        setReservas(response.data);
      } else {
        console.warn('La API no devolvió un array:', response.data);
        setReservas([]);
      }
    } catch (error) {
      console.error('Error fetching reservas:', error);
      setReservas([]);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const exportarExcel = () => {
    const datosTurno = localStorage.getItem('datosTurno');
    if (!datosTurno) return alert('No hay turno activo');

    const { colaborador, fecha } = JSON.parse(datosTurno);

    const reservasFiltradas = reservas.filter(
      (reserva) => reserva.fecha === fecha && reserva.colaborador === colaborador
    );

    const worksheet = XLSX.utils.json_to_sheet(reservasFiltradas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, `reservas_${colaborador}_${fecha}.xlsx`);
  };

  return (
    // Cambiado el fondo a oscuro (bg-slate-900) y el texto a blanco (text-white)
    <div className="min-h-screen bg-slate-900 pb-20 pt-4 sm:pt-10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Panel de Reservas
            </h1>
            <p className="mt-1 text-sm text-gray-300">
              Hola, <span className="font-semibold text-indigo-400">{username || 'Invitado'}</span>. Gestiona tu turno hoy.
            </p>
          </div>
          
          <button 
            onClick={exportarExcel} 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 w-full md:w-auto"
          >
            <ExcelIcon />
            Exportar Excel
          </button>
        </div>

        {/* LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="lg:col-span-1 space-y-6">

            {/* Formulario */}
            {/* Tarjeta con fondo oscuro (bg-gray-800) y bordes oscuros */}
            <div className="bg-gray-800 shadow rounded-lg border border-gray-700 flex flex-col">
              {/* Encabezado de la tarjeta con fondo más oscuro (bg-gray-700) */}
              <div className="px-4 py-5 sm:px-6 border-b border-gray-700 bg-gray-700 rounded-t-lg">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Nueva Reserva
                </h3>
              </div>
              {/* Aumentado el padding para dar más espacio al formulario */}
              <div className="p-6 sm:p-8">
                <ReservasForm
                  fetchReservas={fetchReservas}
                  formData={formData}
                  setFormData={setFormData}
                  editingId={null}
                  setEditingId={() => {}}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  reservas={reservas}
                  disableEditButton={true}
                  disableDeleteButton={true}
                />
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: TABLA */}
          <div className="lg:col-span-2">
            {/* Tarjeta de la tabla con fondo oscuro */}
            <div className="bg-gray-800 shadow rounded-lg border border-gray-700 min-h-[500px] flex flex-col">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-700 flex justify-between items-center bg-gray-700 rounded-t-lg">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-white">
                    Historial del Turno
                  </h3>
                </div>
                {/* Badge ajustado para modo oscuro */}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-200">
                  {reservas ? reservas.length : 0} Total
                </span>
              </div>
              
              <div className="flex-1 overflow-x-auto p-4 sm:p-0 text-gray-300">
                <TableCrearReservas
                  reservas={reservas || []}
                  fetchReservas={fetchReservas}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CrearReservas;