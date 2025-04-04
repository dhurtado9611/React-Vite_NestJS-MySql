import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Cuadre = {
  id: number;
  colaborador: string;
  fecha: string;
  turno: string;
  turnoCerrado: string;
  basecaja: number;
};

const TablaCuadre = () => {
  const [cuadres, setCuadres] = useState<Cuadre[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    cargarCuadres();
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Tabla Cuadre</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          Error: {error}
        </div>
      )}

      <table className="table-auto w-full border text-sm">
        <thead>
          <tr>
            <th className="border p-1">ID</th>
            <th className="border p-1">Colaborador</th>
            <th className="border p-1">Fecha</th>
            <th className="border p-1">Turno</th>
            <th className="border p-1">Hora Cierre</th>
            <th className="border p-1">Base Caja</th>
          </tr>
        </thead>
        <tbody>
          {cuadres.map((cuadre) => (
            <tr key={cuadre.id}>
              <td className="border p-1">{cuadre.id}</td>
              <td className="border p-1">{cuadre.colaborador}</td>
              <td className="border p-1">{cuadre.fecha}</td>
              <td className="border p-1">{cuadre.turno}</td>
              <td className="border p-1">{cuadre.turnoCerrado || 'Pendiente'}</td>
              <td className="border p-1">{cuadre.basecaja}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaCuadre;