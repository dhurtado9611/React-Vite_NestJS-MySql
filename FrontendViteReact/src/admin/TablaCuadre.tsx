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

interface Cuadre {
  id: number;
  colaborador: string;
  fecha: string;
  turno: string;
  turnoCerrado: string;
  basecaja: number;
  totalEntregado: number;
}

const TablaCuadre = () => {
  const [cuadres, setCuadres] = useState<Cuadre[]>([]);
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [anio, setAnio] = useState<number>(new Date().getFullYear());

  const cargarCuadres = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get('https://react-vitenestjs-mysql-production.up.railway.app/cuadre', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCuadres(res.data);
    } catch (err) {
      console.error('Error al cargar cuadre:', err);
    }
  };

  useEffect(() => {
    cargarCuadres();
  }, []);

  const datosFiltrados = cuadres
    .filter((c) => {
      const fecha = new Date(c.fecha);
      return fecha.getMonth() + 1 === mes && fecha.getFullYear() === anio;
    })
    .reduce((acc: { dia: number; total: number }[], c) => {
      const dia = new Date(c.fecha).getDate();
      const existente = acc.find((d) => d.dia === dia);
      if (existente) {
        existente.total += c.totalEntregado;
      } else {
        acc.push({ dia, total: c.totalEntregado });
      }
      return acc;
    }, []);

  return (
    <div className="container-fluid px-3 py-3">
      {/* Filtros de mes y año */}
      <div className="row g-3 mb-3">
        <div className="col">
          <label className="form-label">Mes</label>
          <select className="form-select" value={mes} onChange={(e) => setMes(Number(e.target.value))}>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <label className="form-label">Año</label>
          <input
            type="number"
            className="form-control"
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Gráfica totalEntregado por día */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-2">
          <h6 className="text-primary text-sm mb-2">Total entregado por día</h6>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={datosFiltrados}>
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#dc3545"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla con scroll completo */}
      <div className="card shadow-sm">
        <div className="card-body p-2">
          <h6 className="text-dark text-sm mb-2">Registros de Cuadre</h6>
          <div className="table-responsive overflow-auto" style={{ maxHeight: '400px', maxWidth: '100%' }}>
            <table className="table table-sm table-striped table-bordered text-center">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Colaborador</th>
                  <th>Fecha</th>
                  <th>Turno</th>
                  <th>Hora Cierre</th>
                  <th>Base Caja</th>
                  <th>Total Entregado</th>
                </tr>
              </thead>
              <tbody>
                {cuadres.map((cuadre) => (
                  <tr key={cuadre.id}>
                    <td>{cuadre.id}</td>
                    <td>{cuadre.colaborador}</td>
                    <td>{cuadre.fecha}</td>
                    <td>{cuadre.turno}</td>
                    <td>{cuadre.turnoCerrado || 'Pendiente'}</td>
                    <td>${cuadre.basecaja}</td>
                    <td>${cuadre.totalEntregado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaCuadre;