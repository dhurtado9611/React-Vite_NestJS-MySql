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
  LineChart,
  Line,
} from 'recharts';
import TableReservas from '../components/TableReservas';

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
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  const habitacionesPorUso = Object.values(
    reservas.reduce((acc: any, r: Reserva) => {
      const clave = `Habitación ${r.habitacion}`;
      if (!acc[clave]) acc[clave] = { habitacion: clave, cantidad: 0 };
      acc[clave].cantidad++;
      return acc;
    }, {})
  );

  const ingresosPorDia = Object.values(
    reservas.reduce((acc: any, r: Reserva) => {
      if (!acc[r.fecha]) acc[r.fecha] = { fecha: r.fecha, total: 0 };
      acc[r.fecha].total += r.valor;
      return acc;
    }, {})
  );

  return (
    <div className="p-4">
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
          <h3 className="text-lg font-semibold mb-3 text-indigo-600">📈 Ingresos por día</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ingresosPorDia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <TableReservas
          reservas={reservas}
          fetchReservas={cargarReservas}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </div>
    </div>
  );
};

export default TablaReservas;