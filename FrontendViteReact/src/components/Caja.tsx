import { useEffect, useState } from 'react';
import api from '../services/api';

interface Cuadre {
  id: number;
  basecaja: number;
  colaborador: string;
  fecha: string;
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

  useEffect(() => {
    const datosTurno = localStorage.getItem('datosTurno');
    if (datosTurno) {
      const { colaborador, fecha } = JSON.parse(datosTurno);
      setColaborador(colaborador);
      setFecha(fecha);
      obtenerBaseCaja(colaborador, fecha);
      calcularTotalReservas(colaborador, fecha);
    }
  }, []);

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

  const totalCaja = baseCaja + totalReservas;

  return (
    <div className="mt-5">
      <h3 className="text-xl font-bold mb-3">Cuadre de Caja</h3>
      <table className="table table-bordered table-striped w-auto mx-auto text-center">
        <thead>
          <tr>
            <th>Colaborador</th>
            <th>Fecha</th>
            <th>Base Caja</th>
            <th>Total Reservas</th>
            <th>Total Caja</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{colaborador}</td>
            <td>{fecha}</td>
            <td>${baseCaja.toLocaleString()}</td>
            <td>${totalReservas.toLocaleString()}</td>
            <td className="fw-bold">${totalCaja.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Caja;