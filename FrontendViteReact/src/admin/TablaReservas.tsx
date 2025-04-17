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
import TableReservas from '../components/CrearReservas/TableCrearReservasAdmin';

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
  const [ingresosMesActual, setIngresosMesActual] = useState<number>(0);

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

  useEffect(() => {
    const mesActual = new Date().getMonth() + 1;
    const anioActual = new Date().getFullYear();
    const totalMes = reservas.reduce((acc, r) => {
      const fecha = new Date(r.fecha);
      if (fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === anioActual) {
        return acc + r.valor;
      }
      return acc;
    }, 0);
    setIngresosMesActual(totalMes);
  }, [reservas]);

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
    <div className="container-fluid px-3 py-4">
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title text-success mb-3">📊 Habitaciones más reservadas</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={habitacionesPorUso}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="habitacion" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="#198754" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title text-primary mb-3">📈 Ingresos por día</h5>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={ingresosPorDia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#0d6efd" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <h5 className="card-title text-info">📦 Total ingresos del mes actual</h5>
          <p className="fs-4 fw-bold text-dark mt-2">${ingresosMesActual.toLocaleString()}</p>
        </div>
      </div>

      <div>
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