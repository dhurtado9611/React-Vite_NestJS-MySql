import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Usuario {
  id: number;
  username: string;
  password: string;
  rol: string;
}

const TablaUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);

  const cargarUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay token disponible.');
        return;
      }

      const response = await axios.get('https://react-vitenestjs-mysql-production.up.railway.app/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsuarios(response.data);
      setError(null);
    } catch (error: any) {
      console.error('Error al cargar usuarios:', error);
      setError(error.response?.data?.message || 'Error desconocido');
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Tabla de Usuarios</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          Error: {error}
        </div>
      )}

      <table className="table-auto w-full border text-sm">
        <thead>
          <tr>
            <th className="border p-1">ID</th>
            <th className="border p-1">Usuario</th>
            <th className="border p-1">Contraseña</th>
            <th className="border p-1">Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td className="border p-1">{user.id}</td>
              <td className="border p-1">{user.username}</td>
              <td className="border p-1">{user.password}</td>
              <td className="border p-1">{user.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaUsuarios;