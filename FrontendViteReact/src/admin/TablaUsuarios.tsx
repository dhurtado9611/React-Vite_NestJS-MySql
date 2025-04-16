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
    <div className="text-black">
      <h2 className="text-xl font-bold mb-6 text-white">Tabla de Usuarios</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">
          ⚠️ Error: {error}
        </div>
      )}

      <div className="mb-6 bg-white/30 backdrop-blur p-4 rounded-xl shadow-lg">
        <h4 className="font-semibold mb-3 text-white">➕ Crear nuevo usuario</h4>
        <div className="flex flex-wrap gap-3">
          <input
            placeholder="Usuario"
            value={nuevoUsuario.username}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })}
            className="px-3 py-2 rounded-md w-full sm:w-auto border focus:outline-none"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={nuevoUsuario.password}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
            className="px-3 py-2 rounded-md w-full sm:w-auto border focus:outline-none"
          />
          <select
            value={nuevoUsuario.rol}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
            className="px-3 py-2 rounded-md w-full sm:w-auto border focus:outline-none"
          >
            <option value="admin">Admin</option>
            <option value="invitado">Invitado</option>
          </select>
          <button
            onClick={crearUsuario}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md transition"
          >
            Crear
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full bg-white text-sm rounded-xl shadow-xl overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Usuario</th>
              <th className="px-4 py-2 text-left">Contraseña</th>
              <th className="px-4 py-2 text-left">Rol</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">••••••••</td>
                <td className="px-4 py-2 capitalize">{user.rol}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => eliminarUsuario(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaUsuarios;