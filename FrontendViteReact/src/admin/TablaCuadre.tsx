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
    .map((c) => {
      const dia = new Date(c.fecha).getDate();
      return { dia, basecaja: c.basecaja };
    });

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

      {/* Gráfica basecaja por día */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-2">
          <h6 className="text-primary text-sm mb-2">Base caja por día</h6>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={datosFiltrados} layout="vertical">
              <XAxis type="number" dataKey="basecaja" />
              <YAxis type="category" dataKey="dia" interval={0} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="basecaja"
                stroke="#0d6efd"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla con scroll en todas direcciones y tamaño reducido en móvil */}
      <div className="card shadow-sm">
        <div className="card-body p-2">
          <h6 className="text-dark text-sm mb-2">Registros de Cuadre</h6>
          <div className="overflow-auto w-100" style={{ maxHeight: '300px' }}>
            <div className="table-responsive">
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
    </div>
  );
};

export default TablaCuadre;
