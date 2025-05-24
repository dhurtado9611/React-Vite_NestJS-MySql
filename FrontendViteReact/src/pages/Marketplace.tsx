// Marketplace.tsx
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
  const [productos, setProductos] = useState<PrecioItem[]>([]);
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const manejarErrorAuth = (error: any) => {
    if (error.response?.status === 401) {
      alert('Sesión expirada. Por favor inicia sesión nuevamente.');
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      console.error('Error cargando datos:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [preciosRes, inventarioRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/preciosInventario`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/inventario`, config),
        ]);

        const inventario = inventarioRes.data.at(-1); // último inventario registrado

        const productosConCantidad = preciosRes.data.map((item: PrecioItem) => {
          const nombreCampo = item.producto.toUpperCase().replace(/\s/g, '_');
          const cantidad = inventario[nombreCampo] ?? 0;
          return { ...item, cantidad };
        });

        setProductos(productosConCantidad);
      } catch (error) {
        manejarErrorAuth(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="text-center text-xl font-bold mb-4">🛍️ Productos Disponibles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productos.map((prod) => (
          <div
            key={prod.id}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center text-center"
          >
            <img
              src={prod.imagen || '/images/default.jpg'}
              alt={prod.producto}
              className="w-28 h-28 object-cover rounded mb-2"
            />
            <h3 className="text-md font-semibold text-gray-700">{prod.producto}</h3>
            <p className="text-sm text-gray-500 mb-1">Precio: ${prod.precio}</p>
            <p className={`text-sm font-medium ${prod.cantidad === 0 ? 'text-red-600' : 'text-green-600'}`}>
              {prod.cantidad === 0 ? 'Agotado' : `Disponibles: ${prod.cantidad}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;