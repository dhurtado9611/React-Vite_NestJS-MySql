import { useEffect, useState } from 'react';
import api from '../services/api';

interface Cuadre {
  id: number;
  basecaja: number;
  colaborador: string;
  fecha: string;
  turno: string;
}

interface Reserva {
  id: number;
  valor: number;
  colaborador: string;
  fecha: string;
}

const Caja = () => {
  const [baseCaja, setBaseCaja] = useState<number>(0);
  const [totalReservas, setTotalReservas] = useState<number>(0);
  const [colaborador, setColaborador] = useState<string>('');
  const [fecha, setFecha] = useState<string>('');
  const [turno, setTurno] = useState<string>('');

  const rol = localStorage.getItem('rol');

  useEffect(() => {
    const datosTurno = localStorage.getItem('datosTurno');
    const hoy = new Date().toISOString().split('T')[0];
    setFecha(hoy);

    if (rol === 'invitado' && datosTurno) {
      const { colaborador, turno } = JSON.parse(datosTurno);
      setColaborador(colaborador);
      setTurno(turno);
      obtenerBaseCaja(colaborador, hoy);
      calcularTotalReservas(colaborador, hoy);
    } else if (rol === 'admin') {
      const admin = localStorage.getItem('username') || '';
      setColaborador(admin);
      setTurno('');
      obtenerBaseCaja(admin, hoy);
      calcularTotalReservas(admin, hoy);
    }
  }, [rol]);

  const obtenerBaseCaja = async (colaborador: string, fecha: string) => {
    try {
      const response = await api.get('/cuadre');
      const registros: Cuadre[] = response.data;
      const base = registros.find(r => r.colaborador === colaborador && r.fecha === fecha)?.basecaja || 0;
      setBaseCaja(base);
    } catch (error) {
      console.error('Error al obtener base de caja:', error);
    }
  };

  const calcularTotalReservas = async (colaborador: string, fecha: string) => {
    try {
      const response = await api.get('/reservas');
      const reservas: Reserva[] = response.data;
      const total = reservas
        .filter(r => r.colaborador === colaborador && r.fecha === fecha)
        .reduce((sum, r) => sum + r.valor, 0);
      setTotalReservas(total);
    } catch (error) {
      console.error('Error al calcular total de reservas:', error);
    }
  };

  if (rol === 'invitado' && !localStorage.getItem('datosTurno')) {
    return <p className="text-center text-white mt-10">Debes iniciar turno para ver el cuadre.</p>;
  }

  const totalCaja = baseCaja + totalReservas;

  return (
    <div className="mt-5 p-4 text-white">
      <h3 className="text-2xl font-semibold mb-4">Cuadre de Caja</h3>
      <div className="overflow-x-auto">
        <table className="table table-bordered table-striped w-full max-w-4xl text-center text-sm md:text-base">
          <thead className="bg-light">
            <tr>
              <th>Colaborador</th>
              <th>Fecha</th>
              <th>Turno</th>
              <th>Base Caja</th>
              <th>Total Reservas</th>
              <th>Total Caja</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{colaborador}</td>
              <td>{fecha}</td>
              <td>{turno}</td>
              <td>${baseCaja.toLocaleString()}</td>
              <td>${totalReservas.toLocaleString()}</td>
              <td className="font-bold">${totalCaja.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Caja;