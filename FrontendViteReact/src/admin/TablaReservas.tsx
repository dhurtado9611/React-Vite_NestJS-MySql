import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Tipado de reserva
type Reserva = {
  id: number;
  vehiculo: string;
  placa: string;
  habitacion: number;
  valor: number;
  hentrada: string;
  hsalidamax?: string;
  hsalida?: string;
  observaciones?: string;
  fecha: string;
  colaborador: string;
};

const TablaReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [editando, setEditando] = useState<Reserva | null>(null);
  const [filtros, setFiltros] = useState({
    colaborador: '',
    fecha: '',
    placa: '',
    habitacion: '',
  });

  const cargarReservas = async () => {
    try {
      const res = await axios.get('https://react-vitenestjs-mysql-production.up.railway.app/reservas', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReservas(res.data);
    } catch (err) {
      console.error('Error al cargar reservas:', err);
    }
  };

  const eliminarReserva = async (id: number) => {
    if (confirm('¿Seguro que deseas eliminar esta reserva?')) {
      await axios.delete(`https://react-vitenestjs-mysql-production.up.railway.app/reservas/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      cargarReservas();
    }
  };

  const actualizarReserva = async () => {
    if (!editando) return;
    await axios.put(
      `https://react-vitenestjs-mysql-production.up.railway.app/reservas/${editando.id}`,
      editando,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
    setEditando(null);
    cargarReservas();
  };

  const exportarAExcel = () => {
    const colaboradorTurno = localStorage.getItem('colaborador') || '';
    const fechaTurno = localStorage.getItem('fecha') || '';

    const reservasFiltradas = reservas.filter(
      (r) => r.colaborador === colaboradorTurno && r.fecha === fechaTurno
    );

    if (reservasFiltradas.length === 0) {
      alert('No hay reservas para el turno actual');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(reservasFiltradas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `reservas_${colaboradorTurno}_${fechaTurno}.xlsx`);
  };

  const reservasFiltradas = reservas.filter((r) =>
    (!filtros.colaborador || r.colaborador?.toLowerCase().includes(filtros.colaborador.toLowerCase())) &&
    (!filtros.fecha || r.fecha?.includes(filtros.fecha)) &&
    (!filtros.placa || r.placa?.toLowerCase().includes(filtros.placa.toLowerCase())) &&
    (!filtros.habitacion || r.habitacion?.toString() === filtros.habitacion)
  );

  useEffect(() => {
    cargarReservas();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="text-lg font-semibold">Reservas</h3>
        <div className="flex flex-wrap gap-2">
          <input
            placeholder="Filtrar por colaborador"
            value={filtros.colaborador}
            onChange={(e) => setFiltros({ ...filtros, colaborador: e.target.value })}
            className="border p-1 rounded"
          />
          <input
            type="date"
            placeholder="Fecha"
            value={filtros.fecha}
            onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
            className="border p-1 rounded"
          />
          <input
            placeholder="Placa"
            value={filtros.placa}
            onChange={(e) => setFiltros({ ...filtros, placa: e.target.value })}
            className="border p-1 rounded"
          />
          <input
            placeholder="Habitación"
            value={filtros.habitacion}
            onChange={(e) => setFiltros({ ...filtros, habitacion: e.target.value })}
            className="border p-1 rounded"
          />
          <button
            onClick={exportarAExcel}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            📥 Exportar turno
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border text-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehículo</th>
              <th>Placa</th>
              <th>Habitación</th>
              <th>Valor</th>
              <th>Entrada</th>
              <th>Salida Máx</th>
              <th>Salida</th>
              <th>Observaciones</th>
              <th>Fecha</th>
              <th>Colaborador</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.vehiculo}</td>
                <td>{r.placa}</td>
                <td>{r.habitacion}</td>
                <td>{r.valor}</td>
                <td>{r.hentrada}</td>
                <td>{r.hsalidamax}</td>
                <td>{r.hsalida}</td>
                <td>{r.observaciones}</td>
                <td>{r.fecha}</td>
                <td>{r.colaborador}</td>
                <td className="space-x-2">
                  <button onClick={() => setEditando(r)} className="text-blue-600">✏️</button>
                  <button onClick={() => eliminarReserva(r.id)} className="text-red-600">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editando && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow w-[350px] max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-semibold mb-2">Editar Reserva</h4>
            {[
              'vehiculo',
              'placa',
              'habitacion',
              'valor',
              'hentrada',
              'hsalidamax',
              'hsalida',
              'observaciones',
              'fecha',
              'colaborador',
            ].map((campo) => (
              <input
                key={campo}
                value={(editando as any)[campo] || ''}
                onChange={(e) => setEditando({ ...editando, [campo]: e.target.value } as Reserva)}
                placeholder={campo}
                className="border p-1 mb-2 w-full"
              />
            ))}
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditando(null)}>Cancelar</button>
              <button onClick={actualizarReserva} className="bg-green-600 text-white px-3 py-1 rounded">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaReservas;