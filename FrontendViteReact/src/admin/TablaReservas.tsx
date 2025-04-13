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
  const [error, setError] = useState<string | null>(null);

  const cargarReservas = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://react-vitenestjs-mysql-production.up.railway.app/reservas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservas(res.data);
    } catch (err: any) {
      console.error('Error al cargar reservas:', err);
      setError(err.response?.data?.message || 'Error desconocido');
    }
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

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Tabla de Reservas</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">📊 Habitaciones más reservadas</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={habitacionesPorUso} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="habitacion" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="table-auto w-full border text-sm">
        <thead>
          <tr>
            <th className="border p-1">ID</th>
            <th className="border p-1">Habitación</th>
            <th className="border p-1">Vehículo</th>
            <th className="border p-1">Placa</th>
            <th className="border p-1">Colaborador</th>
            <th className="border p-1">Valor</th>
            <th className="border p-1">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((r) => (
            <tr key={r.id}>
              <td className="border p-1">{r.id}</td>
              <td className="border p-1">{r.habitacion}</td>
              <td className="border p-1">{r.vehiculo}</td>
              <td className="border p-1">{r.placa}</td>
              <td className="border p-1">{r.colaborador}</td>
              <td className="border p-1">${r.valor.toLocaleString()}</td>
              <td className="border p-1">{r.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaReservas;