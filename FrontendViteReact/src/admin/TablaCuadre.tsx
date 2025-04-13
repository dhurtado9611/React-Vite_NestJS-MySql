import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type Cuadre = {
  id: number;
  colaborador: string;
  fecha: string;
  turno: string;
  turnoCerrado: string;
  basecaja: number;
};

type IngresoPorDia = {
  fecha: string;
  total: number;
};

const TablaCuadre = () => {
  const [cuadres, setCuadres] = useState<Cuadre[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filtroTurno, setFiltroTurno] = useState<string>('');

  const cargarCuadres = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No hay token disponible.');
        return;
      }

      const res = await axios.get('https://react-vitenestjs-mysql-production.up.railway.app/cuadre', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCuadres(res.data);
      setError(null);
    } catch (err: any) {
      console.error('Error al cargar cuadre:', err);
      setError(err.response?.data?.message || 'Error desconocido');
    }
  };

  const eliminarCuadre = async (id: number) => {
    if (!confirm('¿Deseas eliminar este registro de cuadre?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://react-vitenestjs-mysql-production.up.railway.app/cuadre/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cargarCuadres();
    } catch (error) {
      alert('Error al eliminar el registro');
      console.error(error);
    }
  };

  useEffect(() => {
    cargarCuadres();
  }, []);

  const cuadresFiltrados = filtroTurno
    ? cuadres.filter((c) => c.turno === filtroTurno)
    : cuadres;

  const datosGrafica: IngresoPorDia[] = Object.values(
    cuadresFiltrados.reduce((acc: any, cuadre) => {
      if (!acc[cuadre.fecha]) acc[cuadre.fecha] = { fecha: cuadre.fecha, total: 0 };
      acc[cuadre.fecha].total += cuadre.basecaja;
      return acc;
    }, {})
  );

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Tabla Cuadre</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="mb-4">
        <label className="mr-2">Filtrar por turno:</label>
        <select
          value={filtroTurno}
          onChange={(e) => setFiltroTurno(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Todos</option>
          <option value="08:00">Mañana</option>
          <option value="14:00">Tarde</option>
          <option value="20:00">Noche</option>
        </select>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">📊 Ingresos por Día (Base Caja)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={datosGrafica} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="table-auto w-full border text-sm">
        <thead>
          <tr>
            <th className="border p-1">ID</th>
            <th className="border p-1">Colaborador</th>
            <th className="border p-1">Fecha</th>
            <th className="border p-1">Turno</th>
            <th className="border p-1">Hora Cierre</th>
            <th className="border p-1">Base Caja</th>
            <th className="border p-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cuadresFiltrados.map((cuadre) => (
            <tr key={cuadre.id}>
              <td className="border p-1">{cuadre.id}</td>
              <td className="border p-1">{cuadre.colaborador}</td>
              <td className="border p-1">{cuadre.fecha}</td>
              <td className="border p-1">{cuadre.turno}</td>
              <td className="border p-1">{cuadre.turnoCerrado || 'Pendiente'}</td>
              <td className="border p-1">{cuadre.basecaja}</td>
              <td className="border p-1 text-center">
                <button onClick={() => eliminarCuadre(cuadre.id)} className="text-red-600">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaCuadre;