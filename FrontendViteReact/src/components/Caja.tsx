import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Interfaces mantenidas del original
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
  
  // Ref para el intervalo: evita fugas de memoria en servidores reales
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const rol = localStorage.getItem('rol');
  const navigate = useNavigate();

  // useCallback evita que la función se recree innecesariamente
  const cargarDatosCaja = useCallback(async (nombreColaborador: string, fechaActual: string) => {
    try {
      // 1. Obtener base de caja (solo si no la tenemos)
      const resCuadre = await api.get('/cuadre');
      const registros: Cuadre[] = resCuadre.data;
      const registro = registros.find(r => 
        r.colaborador === nombreColaborador && 
        r.fecha === fechaActual && 
        !r.turnoCerrado
      );

      if (registro) {
        setBaseCaja(registro.basecaja || 0);
        setCuadreId(registro.id);
      }

      // 2. Obtener reservas y actualizar total
      const resReservas = await api.get('/reservas');
      const reservas: Reserva[] = resReservas.data;
      const total = reservas
        .filter(r => r.colaborador === nombreColaborador && r.fecha === fechaActual)
        .reduce((sum, r) => sum + r.valor, 0);
      
      setTotalReservas(total);

      // Actualización automática en BD (opcional según tu lógica de backend)
      if (registro) {
        await api.patch(`/cuadre/${registro.id}`, {
          totalActual: total + (registro.basecaja || 0)
        });
      }
    } catch (error) {
      console.error('Error en sincronización de caja:', error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const datosTurno = localStorage.getItem('datosTurno');
    const hoy = new Date().toISOString().split('T')[0];
    setFecha(hoy);

    let usuarioActual = '';
    if (rol === 'invitado' && datosTurno) {
      const { colaborador: nombre, turno: nombreTurno } = JSON.parse(datosTurno);
      setColaborador(nombre);
      setTurno(nombreTurno);
      usuarioActual = nombre;
    } else if (rol === 'admin') {
      usuarioActual = localStorage.getItem('username') || '';
      setColaborador(usuarioActual);
    }

    if (usuarioActual) {
      cargarDatosCaja(usuarioActual, hoy);
      
      // Limpiar intervalo anterior si existe
      if (intervaloRef.current) clearInterval(intervaloRef.current);
      
      // En host real, 10-15 segundos es más seguro que 5
      intervaloRef.current = setInterval(() => {
        cargarDatosCaja(usuarioActual, hoy);
      }, 10000); 
    }

    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, [rol, cargarDatosCaja]);

  const cerrarTurno = async () => {
    if (!cuadreId) return;
    const horaActual = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/cuadre/${cuadreId}`, {
        turnoCerrado: horaActual,
        totalEntregado: totalReservas,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (intervaloRef.current) clearInterval(intervaloRef.current);
      localStorage.removeItem('datosTurno');
      navigate('/', { state: { turnoCerrado: true } });
    } catch (error) {
      alert('Error al cerrar: El servidor no responde.');
    }
  };

  if (rol === 'invitado' && !localStorage.getItem('datosTurno')) {
    return <p className="text-center text-white mt-10">Debes iniciar turno para ver el cuadre.</p>;
  }

  return (
    <div className="mt-5 text-white p-4">
      <h3 className="text-2xl font-bold mb-6 text-center">Resumen de Caja</h3>
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-5xl mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
              <tr>
                <th className="p-4">Colaborador</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Turno</th>
                <th className="p-4">Base</th>
                <th className="p-4">Ventas/Res.</th>
                <th className="p-4">Total en Caja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="p-4">{colaborador}</td>
                <td className="p-4">{fecha}</td>
                <td className="p-4">{turno || 'Admin'}</td>
                <td className="p-4">${baseCaja.toLocaleString()}</td>
                <td className="p-4 text-blue-400">
                  {cargando ? 'Cargando...' : `$${totalReservas.toLocaleString()}`}
                </td>
                <td className="p-4 font-bold text-green-400 text-lg">
                  ${(baseCaja + totalReservas).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {rol === 'invitado' && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={cerrarTurno}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            Finalizar Jornada y Cerrar Turno
          </button>
        </div>
      )}
    </div>
  );
};

export default Caja;