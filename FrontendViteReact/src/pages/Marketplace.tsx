// Marketplace.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface InventarioItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

const Marketplace = () => {
  const [inventario, setInventario] = useState<InventarioItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/inventario`)
      .then(res => setInventario(res.data))
      .catch(err => console.error(err));
  }, []);

  const manejarVenta = async (item: InventarioItem) => {
    const reservaId = prompt('Ingrese el ID de la reserva a asignar:');
    if (!reservaId) return;

    try {
      const { data: reserva } = await axios.get(`${import.meta.env.VITE_API_URL}/reservas/${reservaId}`);

      const nuevasObservaciones = `${reserva.observaciones || ''}\nVenta: ${item.nombre} - $${item.precio}`;
      const nuevoValor = reserva.valor + item.precio;

      await axios.put(`${import.meta.env.VITE_API_URL}/reservas/${reservaId}`, {
        ...reserva,
        observaciones: nuevasObservaciones,
        valor: nuevoValor
      });

      await axios.put(`${import.meta.env.VITE_API_URL}/inventario/${item.id}`, {
        ...item,
        cantidad: item.cantidad - 1
      });

      alert('Producto asignado a la reserva con éxito.');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Error al asignar producto.');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-2xl font-bold mb-4">Tienda</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {inventario.map(item => (
          <div key={item.id} className="p-4 shadow-lg border rounded">
            <img src={item.imagen} alt={item.nombre} className="w-full h-40 object-cover rounded" />
            <h3 className="text-lg font-semibold mt-2">{item.nombre}</h3>
            <p className="text-sm">Precio: ${item.precio}</p>
            <p className="text-sm">Disponibles: {item.cantidad}</p>
            <button
              disabled={item.cantidad <= 0}
              onClick={() => manejarVenta(item)}
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            >
              Vender
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;