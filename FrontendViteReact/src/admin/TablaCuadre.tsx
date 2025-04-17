import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface Cuadre {
  id: number;
  colaborador: string;
  fecha: string;
  turno: string;
  turnoCerrado: string;
  basecaja: number;
}

const TablaCuadre = () => {
  const [cuadres, setCuadres] = useState<Cuadre[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filtroTurno, setFiltroTurno] = useState<string>('');

  const cargarCuadres = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return setError('No hay token disponible.');

      const res = await axios.get('https://react-vitenestjs-mysql-production.up.railway.app/cuadre', {
        headers: { Authorization: `Bearer ${token}` },
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

  const datosGrafica = Object.values(
    cuadresFiltrados.reduce((acc: any, c: Cuadre) => {
      if (!acc[c.fecha]) acc[c.fecha] = { fecha: c.fecha, total: 0 };
      acc[c.fecha].total += c.basecaja;
      return acc;
    }, {})
  );

  return (
    <div className="container-fluid px-3 py-4">
      <h2 className="text-xl fw-bold mb-4 text-white">📋 Registro de Cuadres</h2>

      {error && <div className="alert alert-danger">Error: {error}</div>}

      <div className="mb-4">
        <label className="form-label me-2">Filtrar por turno:</label>
        <select
          value={filtroTurno}
          onChange={(e) => setFiltroTurno(e.target.value)}
          className="form-select w-auto d-inline-block"
        >
          <option value="">Todos</option>
          <option value="08:00">Mañana</option>
          <option value="14:00">Tarde</option>
          <option value="20:00">Noche</option>
        </select>
      </div>

      <div className="card mb-5 shadow-sm">
        <div className="card-body">
          <h6 className="card-title text-primary mb-3">📈 Base de caja por día</h6>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={datosGrafica}>
              <XAxis dataKey="fecha" hide />
              <YAxis hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#0d6efd"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Colaborador</th>
              <th>Fecha</th>
              <th>Turno</th>
              <th>Hora Cierre</th>
              <th>Base Caja</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuadresFiltrados.map((cuadre) => (
              <tr key={cuadre.id}>
                <td>{cuadre.id}</td>
                <td>{cuadre.colaborador}</td>
                <td>{cuadre.fecha}</td>
                <td>{cuadre.turno}</td>
                <td>{cuadre.turnoCerrado || 'Pendiente'}</td>
                <td>${cuadre.basecaja}</td>
                <td>
                  <button
                    onClick={() => eliminarCuadre(cuadre.id)}
                    className="btn btn-sm btn-outline-danger"
                    title="Eliminar"
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaCuadre;