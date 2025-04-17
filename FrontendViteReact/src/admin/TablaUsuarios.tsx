import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
      if (!token) return setError('No hay token disponible.');

      const response = await axios.get('https://react-vitenestjs-mysql-production.up.railway.app/users', {
        headers: { Authorization: `Bearer ${token}` },
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
      <h2 className="text-xl font-bold mb-4 text-white">Tabla de Usuarios</h2>

      {error && (
        <div className="bg-danger text-white p-3 rounded mb-4">
          ⚠️ Error: {error}
        </div>
      )}

      <div className="mb-5 bg-white p-4 rounded shadow">
        <h4 className="font-semibold mb-3">➕ Crear nuevo usuario</h4>
        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Usuario"
              value={nuevoUsuario.username}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <input
              type="password"
              placeholder="Contraseña"
              value={nuevoUsuario.password}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <select
              value={nuevoUsuario.rol}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
              className="form-select"
            >
              <option value="admin">Admin</option>
              <option value="invitado">Invitado</option>
            </select>
          </div>
          <div className="col-md-3">
            <button onClick={crearUsuario} className="btn btn-primary w-100">
              Crear
            </button>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Contraseña</th>
              <th>Rol</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>••••••••</td>
                <td className="text-capitalize">{user.rol}</td>
                <td className="text-center">
                  <button
                    onClick={() => eliminarUsuario(user.id)}
                    className="btn btn-sm btn-outline-danger me-2"
                    title="Eliminar"
                  >
                    <i className="bi bi-trash-fill"></i>
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