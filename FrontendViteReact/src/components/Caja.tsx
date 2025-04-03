import { useEffect, useState } from 'react';
import api from '../services/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Cuadre {
  id: number;
  basecaja: number;
  colaborador: string;
  fecha: string;
  turno: string;
}

interface Reserva {
  id: number;
  valor: number;
  colaborador: string;
  fecha: string;
}

const Caja = () => {
  const [baseCaja, setBaseCaja] = useState<number>(0);
  const [totalReservas, setTotalReservas] = useState<number>(0);
  const [colaborador, setColaborador] = useState<string>('');
  const [fecha, setFecha] = useState<string>('');
  const [turno, setTurno] = useState<string>('');

  useEffect(() => {
    const datosTurno = localStorage.getItem('datosTurno');
    const hoy = new Date().toISOString().split('T')[0];
    setFecha(hoy);

    if (datosTurno) {
      const { colaborador, turno } = JSON.parse(datosTurno);
      setColaborador(colaborador);
      setTurno(turno);
      obtenerBaseCaja(colaborador, hoy);
      calcularTotalReservas(colaborador, hoy);
    }
  }, []);

  const obtenerBaseCaja = async (colaborador: string, fecha: string) => {
    try {
      const response = await api.get('/cuadre');
      const registros: Cuadre[] = response.data;
      const base = registros.find(r => r.colaborador === colaborador && r.fecha === fecha)?.basecaja || 0;
      setBaseCaja(base);
    } catch (error) {
      console.error('Error al obtener base de caja:', error);
    }
  };

  const calcularTotalReservas = async (colaborador: string, fecha: string) => {
    try {
      const response = await api.get('/reservas');
      const reservas: Reserva[] = response.data;
      const total = reservas
        .filter(r => r.colaborador === colaborador && r.fecha === fecha)
        .reduce((sum, r) => sum + r.valor, 0);
      setTotalReservas(total);
    } catch (error) {
      console.error('Error al calcular total de reservas:', error);
    }
  };

  const exportarExcel = () => {
    const data = [
      {
        Colaborador: colaborador,
        Fecha: fecha,
        Turno: turno,
        'Base Caja': baseCaja,
        'Total Reservas': totalReservas,
        'Total Caja': baseCaja + totalReservas,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cuadre');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(fileData, `cuadre_${fecha}_${turno}.xlsx`);
  };

  if (!localStorage.getItem('datosTurno')) {
    return <p className="text-center text-white mt-10">No hay turno activo para mostrar caja.</p>;
  }

  const totalCaja = baseCaja + totalReservas;

  return (
    <div className="mt-5 p-4 text-white">
      <h3 className="text-2xl font-semibold mb-4">Cuadre de Caja</h3>
      <div className="overflow-x-auto">
        <table className="table table-bordered table-striped w-full max-w-4xl text-center text-sm md:text-base">
          <thead className="bg-light">
            <tr>
              <th>Colaborador</th>
              <th>Fecha</th>
              <th>Turno</th>
              <th>Base Caja</th>
              <th>Total Reservas</th>
              <th>Total Caja</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{colaborador}</td>
              <td>{fecha}</td>
              <td>{turno}</td>
              <td>${baseCaja.toLocaleString()}</td>
              <td>${totalReservas.toLocaleString()}</td>
              <td className="font-bold">${totalCaja.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={exportarExcel}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow font-semibold transition-colors"
        >
          Exportar a Excel
        </button>
      </div>
    </div>
  );
};

export default Caja;