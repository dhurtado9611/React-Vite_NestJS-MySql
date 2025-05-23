// Marketplace.tsx (extensión con edición de precio, imagen y cantidad)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface PrecioItem {
  id: number;
  producto: string;
  precio: number;
  imagen?: string;
  cantidad?: number;
}

const Marketplace = () => {
  const [precios, setPrecios] = useState<PrecioItem[]>([]);
  const navigate = useNavigate();

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  const manejarErrorAuth = (error: any) => {
    if (error.response && error.response.status === 401) {
      alert('Sesión expirada. Inicia sesión nuevamente.');
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      console.error(error);
    }
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/preciosInventario`, config)
      .then(res => setPrecios(res.data))
      .catch(manejarErrorAuth);
  }, []);

  const actualizarCampo = async (id: number, campo: string, valor: string | number) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/preciosInventario/${id}`, {
        [campo]: valor
      }, config);
      alert(`${campo} actualizado con éxito.`);
      setPrecios(prev =>
        prev.map(item =>
          item.id === id ? { ...item, [campo]: valor } : item
        )
      );
    } catch (err) {
      manejarErrorAuth(err);
      alert(`Error al actualizar ${campo}`);
    }
  };

  return (
    <div className="container py-8 mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">🛒 Gestión de Productos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {precios.map(prod => (
          <div
            key={prod.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center"
          >
            <img
              src={prod.imagen || '/images/default.jpg'}
              alt={prod.producto}
              className="w-32 h-32 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-semibold">{prod.producto}</h3>
            <p className="text-sm text-gray-600">Precio: ${prod.precio}</p>
            <p className="text-sm text-gray-500">Cantidad: {prod.cantidad ?? 'N/D'}</p>

            <div className="flex flex-col gap-2 mt-3 w-full">
              <button
                onClick={() => {
                  const nuevo = prompt('Nuevo precio:', String(prod.precio));
                  if (nuevo) actualizarCampo(prod.id, 'precio', Number(nuevo));
                }}
                className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 rounded"
              >
                Editar precio
              </button>
              <button
                onClick={() => {
                  const nueva = prompt('Nueva URL de imagen:', prod.imagen || '');
                  if (nueva) actualizarCampo(prod.id, 'imagen', nueva);
                }}
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 rounded"
              >
                Editar imagen
              </button>
              <button
                onClick={() => {
                  const nueva = prompt('Nueva cantidad:', String(prod.cantidad ?? 0));
                  if (nueva) actualizarCampo(prod.id, 'cantidad', Number(nueva));
                }}
                className="bg-green-500 hover:bg-green-600 text-white py-1 rounded"
              >
                Editar cantidad
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;