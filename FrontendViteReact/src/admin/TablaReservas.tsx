import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

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

const TablaReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroTurno, setFiltroTurno] = useState('');

  const cargarReservas = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('https://react-vitenestjs-mysql-production.up.railway.app/reservas', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReservas(res.data);
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const reservasFiltradas = reservas.filter((r) => {
    return (
      (!filtroFecha || r.fecha === filtroFecha) &&
      (!filtroTurno || r.hentrada.startsWith(filtroTurno))
    );
  });

  const habitacionesPorUso = Object.values(
    reservasFiltradas.reduce((acc: any, r: Reserva) => {
      const clave = `Habitación ${r.habitacion}`;
      if (!acc[clave]) acc[clave] = { habitacion: clave, cantidad: 0 };
      acc[clave].cantidad++;
      return acc;
    }, {})
  );

  const ingresosPorTurno = ['08:00', '14:00', '20:00'].map((turno) => {
    const total = reservasFiltradas
      .filter((r) => r.hentrada.startsWith(turno))
      .reduce((sum, r) => sum + r.valor, 0);
    return { turno, total };
  });

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4">
        <div>
          <label className="block mb-1">Filtrar por fecha:</label>
          <input type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} className="border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block mb-1">Filtrar por turno:</label>
          <select value={filtroTurno} onChange={(e) => setFiltroTurno(e.target.value)} className="border px-2 py-1 rounded">
            <option value="">Todos</option>
            <option value="08:00">Mañana</option>
            <option value="14:00">Tarde</option>
            <option value="20:00">Noche</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-3 text-green-600">📊 Habitaciones más reservadas</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={habitacionesPorUso}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="habitacion" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-3 text-indigo-600">💰 Ingresos por turno</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ingresosPorTurno}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="turno" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* tabla de reservas aquí ... */}
    </div>
  );
};

export default TablaReservas;