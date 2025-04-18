import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Cuadre {
  id: number;
  basecaja: number;
  colaborador: string;
  fecha: string;
  turno: string;
  turnoCerrado?: string | null;
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
  const [cargando, setCargando] = useState<boolean>(true);
  const [colaborador, setColaborador] = useState<string>('');
  const [fecha, setFecha] = useState<string>('');
  const [turno, setTurno] = useState<string>('');
  const [cuadreId, setCuadreId] = useState<number | null>(null);
  const [intervaloId, setIntervaloId] = useState<ReturnType<typeof setInterval> | null>(null);

  const rol = localStorage.getItem('rol');
  const navigate = useNavigate();

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
      const id = setInterval(() => calcularTotalReservas(colaborador, hoy), 5000);
      setIntervaloId(id);
    } else if (rol === 'admin') {
      const admin = localStorage.getItem('username') || '';
      setColaborador(admin);
      setTurno('');
      obtenerBaseCaja(admin, hoy);
      calcularTotalReservas(admin, hoy);
      const id = setInterval(() => calcularTotalReservas(admin, hoy), 5000);
      setIntervaloId(id);
    }

    return () => {
      if (intervaloId) clearInterval(intervaloId);
    };
  }, [rol]);

  const obtenerBaseCaja = async (colaborador: string, fecha: string) => {
    try {
      const response = await api.get('/cuadre');
      const registros: Cuadre[] = response.data;
      const registro = registros.find(r => r.colaborador === colaborador && r.fecha === fecha);
      setBaseCaja(registro?.basecaja || 0);
      setCuadreId(registro?.id || null);
    } catch (error) {
      console.error('Error al obtener base de caja:', error);
    }
  };

  const calcularTotalReservas = async (colaborador: string, fecha: string) => {
    setCargando(true);
    try {
      const response = await api.get('/reservas');
      const reservas: Reserva[] = response.data;
      const total = reservas
        .filter(r => r.colaborador === colaborador && r.fecha === fecha)
        .reduce((sum, r) => sum + r.valor, 0);
      setTotalReservas(total);

      const cuadreResponse = await api.get('/cuadre');
      const cuadreActivo = cuadreResponse.data.find((c: Cuadre) => c.colaborador === colaborador && c.fecha === fecha && !c.turnoCerrado);

      if (cuadreActivo) {
        await api.patch(`/cuadre/${cuadreActivo.id}`, {
          totalActual: total + (cuadreActivo.basecaja || 0)
        });
      }
    } catch (error) {
      console.error('Error al calcular total de reservas:', error);
    } finally {
      setCargando(false);
    }
  };

  const cerrarTurno = async () => {
    if (!cuadreId) return;
    const horaActual = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/cuadre/${cuadreId}`, {
        turnoCerrado: horaActual,
        totalEntregado: totalReservas,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('datosTurno');
      navigate('/', { state: { turnoCerrado: true } });
    } catch (error) {
      console.error('Error al cerrar turno:', error);
      alert('No se pudo cerrar el turno');
    }
  };

  if (rol === 'invitado' && !localStorage.getItem('datosTurno')) {
    return <p className="text-center text-white mt-10">Debes iniciar turno para ver el cuadre.</p>;
  }

  const totalCaja = baseCaja + totalReservas;

  return (
    <div className="mt-5 text-auto">
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
              <td>
                {cargando ? (
                  <span className="italic text-gray-300">...</span>
                ) : (
                  `$${totalReservas.toLocaleString()}`
                )}
              </td>
              <td className="font-bold">${totalCaja.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {rol === 'invitado' && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={cerrarTurno}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow"
            >
              Cerrar Turno
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Caja;