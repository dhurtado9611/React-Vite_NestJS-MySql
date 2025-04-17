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

interface Reserva {
  id: number;
  habitacion: number;
  valor: number;
  fecha: string;
  hentrada: string;
}

interface Cuadre {
  turno: string;
  turnoCerrado: string;
  basecaja: number;
  fecha: string;
}

const TablaReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cuadres, setCuadres] = useState<Cuadre[]>([]);
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [fechaTurno, setFechaTurno] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('https://react-vitenestjs-mysql-production.up.railway.app/reservas', { headers });
      const cuad = await axios.get('https://react-vitenestjs-mysql-production.up.railway.app/cuadre', { headers });
      setReservas(res.data);
      setCuadres(cuad.data);
    };
    fetchData();
  }, []);

  const ingresosMensuales = reservas.reduce((acc: any, r) => {
    const fecha = new Date(r.fecha);
    const key = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
    if (!acc[key]) acc[key] = { mes: key, total: 0 };
    acc[key].total += r.valor;
    return acc;
  }, {});
  const datosIngresosMes = Object.values(ingresosMensuales).filter(
    (d: any) => parseInt(d.mes.split('-')[0]) === anio
  );

  const datosTurno = ['08:00', '14:00', '20:00'].map((turno) => {
    const total = reservas.reduce((acc, r) => {
      return r.fecha === fechaTurno && r.hentrada.startsWith(turno) ? acc + r.valor : acc;
    }, 0);
    return { turno, total };
  });

  const habPorUso = reservas.reduce((acc: any, r) => {
    const fecha = new Date(r.fecha);
    if (fecha.getMonth() + 1 === mes && fecha.getFullYear() === anio) {
      const key = `Hab. ${r.habitacion}`;
      if (!acc[key]) acc[key] = { habitacion: key, cantidad: 0 };
      acc[key].cantidad++;
    }
    return acc;
  }, {});
  const datosHabUso = Object.values(habPorUso);

  const totalMesActual = reservas.reduce((acc, r) => {
    const fecha = new Date(r.fecha);
    return fecha.getMonth() + 1 === new Date().getMonth() + 1 ? acc + r.valor : acc;
  }, 0);

  const ultimoCuadre = cuadres.find(c => !c.turnoCerrado);
  const reservasTurno = reservas.reduce((acc, r) => {
    return r.fecha === ultimoCuadre?.fecha ? acc + r.valor : acc;
  }, 0);
  const totalTurnoActivo = (ultimoCuadre?.basecaja || 0) + reservasTurno;

  return (
    <div className="container-fluid px-2 py-3">
      <div className="row g-2 mb-3">
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
        <div className="col">
          <label className="form-label">Fecha Turno</label>
          <input
            type="date"
            className="form-control"
            value={fechaTurno}
            onChange={(e) => setFechaTurno(e.target.value)}
          />
        </div>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body p-2">
          <h6 className="text-success text-sm mb-2">Ingresos por mes</h6>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={datosIngresosMes as any[]}>
              <XAxis dataKey="mes" />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#198754" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body p-2">
          <h6 className="text-primary text-sm mb-2">Ingresos por turno</h6>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={datosTurno}>
              <XAxis dataKey="turno" />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#0d6efd" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body p-2">
          <h6 className="text-info text-sm mb-2">Habitaciones más usadas</h6>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={datosHabUso as any[]}>
              <XAxis dataKey="habitacion" />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="cantidad" stroke="#0dcaf0" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body p-2">
              <h6 className="text-dark text-sm">Total Turno Activo</h6>
              <p className="fs-5 fw-bold text-success">${totalTurnoActivo.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body p-2">
              <h6 className="text-dark text-sm">Total Ingresos Mes Actual</h6>
              <p className="fs-5 fw-bold text-primary">${totalMesActual.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaReservas;