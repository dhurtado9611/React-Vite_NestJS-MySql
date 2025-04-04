import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  role: 'admin' | 'invitado' | string;
};

const TablaUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [creando, setCreando] = useState(false);
  const [creandoUsuario, setCreandoUsuario] = useState<Omit<Usuario, 'id'>>({
    nombre: '',
    email: '',
    password: '',
    role: 'invitado',
  });

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get('https://react-vitenestjs-mysql-production.up.railway.app/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  const eliminarUsuario = async (id: number) => {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      await axios.delete(`https://react-vitenestjs-mysql-production.up.railway.app/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      cargarUsuarios();
    }
  };

  const actualizarUsuario = async () => {
    if (!editando) return;
    await axios.put(
      `https://react-vitenestjs-mysql-production.up.railway.app/users/${editando.id}`,
      editando,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
    setEditando(null);
    cargarUsuarios();
  };

  const crearUsuario = async () => {
    await axios.post(
      'https://react-vitenestjs-mysql-production.up.railway.app/users',
      creandoUsuario,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
    setCreando(false);
    setCreandoUsuario({ nombre: '', email: '', password: '', role: 'invitado' });
    cargarUsuarios();
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Usuarios</h3>
        <button onClick={() => setCreando(true)} className="bg-blue-500 text-white px-3 py-1 rounded">➕ Crear Usuario</button>
      </div>

      <table className="table-auto w-full border text-sm">
        <thead>
          <tr>
            <th className="border p-1">ID</th>
            <th className="border p-1">Nombre</th>
            <th className="border p-1">Correo</th>
            <th className="border p-1">Rol</th>
            <th className="border p-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td className="border p-1">{user.id}</td>
              <td className="border p-1">{user.nombre}</td>
              <td className="border p-1">{user.email}</td>
              <td className="border p-1">{user.role}</td>
              <td className="border p-1 space-x-2">
                <button onClick={() => setEditando(user)} className="text-blue-600">✏️</button>
                <button onClick={() => eliminarUsuario(user.id)} className="text-red-600">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      {editando && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow w-[300px]">
            <h4 className="text-lg font-semibold mb-2">Editar Usuario</h4>
            <input
              type="text"
              value={editando.nombre}
              onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
              className="border p-1 mb-2 w-full"
              placeholder="Nombre"
            />
            <input
              type="email"
              value={editando.email}
              onChange={(e) => setEditando({ ...editando, email: e.target.value })}
              className="border p-1 mb-2 w-full"
              placeholder="Correo"
            />
            <input
              type="text"
              value={editando.role}
              onChange={(e) => setEditando({ ...editando, role: e.target.value })}
              className="border p-1 mb-2 w-full"
              placeholder="Rol"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditando(null)}>Cancelar</button>
              <button onClick={actualizarUsuario} className="bg-green-600 text-white px-3 py-1 rounded">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de creación */}
      {creando && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow w-[300px]">
            <h4 className="text-lg font-semibold mb-2">Crear Usuario</h4>
            <input
              type="text"
              placeholder="Nombre"
              value={creandoUsuario.nombre}
              onChange={(e) => setCreandoUsuario({ ...creandoUsuario, nombre: e.target.value })}
              className="border p-1 mb-2 w-full"
            />
            <input
              type="email"
              placeholder="Correo"
              value={creandoUsuario.email}
              onChange={(e) => setCreandoUsuario({ ...creandoUsuario, email: e.target.value })}
              className="border p-1 mb-2 w-full"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={creandoUsuario.password}
              onChange={(e) => setCreandoUsuario({ ...creandoUsuario, password: e.target.value })}
              className="border p-1 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Rol (admin o invitado)"
              value={creandoUsuario.role}
              onChange={(e) => setCreandoUsuario({ ...creandoUsuario, role: e.target.value })}
              className="border p-1 mb-2 w-full"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setCreando(false)}>Cancelar</button>
              <button onClick={crearUsuario} className="bg-blue-600 text-white px-3 py-1 rounded">Crear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaUsuarios;