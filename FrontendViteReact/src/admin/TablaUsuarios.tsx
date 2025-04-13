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
  const [nuevoUsuario, setNuevoUsuario] = useState({ username: '', password: '', rol: 'invitado' });

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

  const crearUsuario = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://react-vitenestjs-mysql-production.up.railway.app/users', nuevoUsuario, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNuevoUsuario({ username: '', password: '', rol: 'invitado' });
      cargarUsuarios();
    } catch (error) {
      alert('Error al crear usuario');
      console.error(error);
    }
  };

  const eliminarUsuario = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://react-vitenestjs-mysql-production.up.railway.app/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cargarUsuarios();
    } catch (error) {
      alert('Error al eliminar usuario');
      console.error(error);
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

      <div className="mb-4 p-4 bg-gray-100 rounded shadow-md">
        <h4 className="font-semibold mb-2">Crear nuevo usuario</h4>
        <div className="flex gap-2 flex-wrap">
          <input
            placeholder="Username"
            value={nuevoUsuario.username}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })}
            className="border p-1 rounded"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={nuevoUsuario.password}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
            className="border p-1 rounded"
          />
          <select
            value={nuevoUsuario.rol}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
            className="border p-1 rounded"
          >
            <option value="admin">Admin</option>
            <option value="invitado">Invitado</option>
          </select>
          <button onClick={crearUsuario} className="bg-blue-600 text-white px-3 py-1 rounded">
            ➕ Crear
          </button>
        </div>
      </div>

      <table className="table-auto w-full border text-sm">
        <thead>
          <tr>
            <th className="border p-1">ID</th>
            <th className="border p-1">Usuario</th>
            <th className="border p-1">Contraseña</th>
            <th className="border p-1">Rol</th>
            <th className="border p-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td className="border p-1">{user.id}</td>
              <td className="border p-1">{user.username}</td>
              <td className="border p-1">••••••••</td>
              <td className="border p-1">{user.rol}</td>
              <td className="border p-1 text-center">
                <button onClick={() => eliminarUsuario(user.id)} className="text-red-600">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaUsuarios;