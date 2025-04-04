import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Tipado de cuadre
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
  const [editando, setEditando] = useState<Cuadre | null>(null);
  const [creando, setCreando] = useState(false);

  const [nuevoCuadre, setNuevoCuadre] = useState<Cuadre>({
    id: 0,
    basecaja: 0,
    fecha: '',
    turno: '',
    turnoCerrado: '',
    colaborador: '',
  });

  const cargarCuadres = async () => {
    try {
      const res = await axios.get('https://react-vitenestjs-mysql-production.up.railway.app/cuadre', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCuadres(res.data);
    } catch (err) {
      console.error('Error al cargar cuadre:', err);
    }
  };

  const eliminarCuadre = async (id: number) => {
    if (confirm('¿Seguro que deseas eliminar este cuadre?')) {
      await axios.delete(`https://react-vitenestjs-mysql-production.up.railway.app/cuadre/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      cargarCuadres();
    }
  };

  const actualizarCuadre = async () => {
    if (!editando) return;
    await axios.put(
      `https://react-vitenestjs-mysql-production.up.railway.app/cuadre/${editando.id}`,
      editando,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
    setEditando(null);
    cargarCuadres();
  };

  const crearCuadre = async () => {
    await axios.post(
      'https://react-vitenestjs-mysql-production.up.railway.app/cuadre',
      nuevoCuadre,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
    setCreando(false);
    setNuevoCuadre({ id: 0, basecaja: 0, fecha: '', turno: '', turnoCerrado: '', colaborador: '' });
    cargarCuadres();
  };

  useEffect(() => {
    cargarCuadres();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Cuadre</h3>
        <button onClick={() => setCreando(true)} className="bg-blue-500 text-white px-3 py-1 rounded">
          ➕ Crear Cuadre
        </button>
      </div>

      <table className="table-auto w-full border text-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Base Caja</th>
            <th>Fecha</th>
            <th>Turno</th>
            <th>Turno Cerrado</th>
            <th>Colaborador</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cuadres.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.basecaja}</td>
              <td>{c.fecha}</td>
              <td>{c.turno}</td>
              <td>{c.turnoCerrado}</td>
              <td>{c.colaborador}</td>
              <td className="space-x-2">
                <button onClick={() => setEditando(c)} className="text-blue-600">✏️</button>
                <button onClick={() => eliminarCuadre(c.id)} className="text-red-600">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal editar */}
      {editando && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow w-[350px]">
            <h4 className="text-lg font-semibold mb-2">Editar Cuadre</h4>
            {['basecaja', 'fecha', 'turno', 'turnoCerrado', 'colaborador'].map((campo) => (
              <input
                key={campo}
                value={(editando as any)[campo] || ''}
                onChange={(e) => setEditando({ ...editando, [campo]: e.target.value } as Cuadre)}
                placeholder={campo}
                className="border p-1 mb-2 w-full"
              />
            ))}
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditando(null)}>Cancelar</button>
              <button onClick={actualizarCuadre} className="bg-green-600 text-white px-3 py-1 rounded">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal crear */}
      {creando && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow w-[350px]">
            <h4 className="text-lg font-semibold mb-2">Crear Cuadre</h4>
            {['basecaja', 'fecha', 'turno', 'turnoCerrado', 'colaborador'].map((campo) => (
              <input
                key={campo}
                value={(nuevoCuadre as any)[campo] || ''}
                onChange={(e) => setNuevoCuadre({ ...nuevoCuadre, [campo]: e.target.value } as Cuadre)}
                placeholder={campo}
                className="border p-1 mb-2 w-full"
              />
            ))}
            <div className="flex justify-end gap-2">
              <button onClick={() => setCreando(false)}>Cancelar</button>
              <button onClick={crearCuadre} className="bg-blue-600 text-white px-3 py-1 rounded">Crear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaCuadre;