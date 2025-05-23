// Marketplace.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface InventarioCompleto {
  id: number;
  AGUARDIENTE: number;
  RON: number;
  POKER: number;
  ENERGIZANTE: number;
  JUGOS_HIT: number;
  AGUA: number;
  GASEOSA: number;
  PAPEL_HIGIENICO: number;
  ALKA_SELTZER: number;
  SHAMPOO: number;
  TOALLA_HIGIENICA: number;
  CONDONES: number;
  BONOS: number;
  colaborador: string;
  turno: string;
  fecha: string;
}

interface PrecioItem {
  producto: string;
  precio: number;
}

const productos = [
  { nombre: 'AGUARDIENTE', imagen: '/images/aguardiente.jpg' },
  { nombre: 'RON', imagen: '/images/ron.jpg' },
  { nombre: 'POKER', imagen: '/images/poker.jpg' },
  { nombre: 'ENERGIZANTE', imagen: '/images/energizante.jpg' },
  { nombre: 'JUGOS_HIT', imagen: '/images/jugos.jpg' },
  { nombre: 'AGUA', imagen: '/images/agua.jpg' },
  { nombre: 'GASEOSA', imagen: '/images/gaseosa.jpg' },
  { nombre: 'PAPEL_HIGIENICO', imagen: '/images/papel.jpg' },
  { nombre: 'ALKA_SELTZER', imagen: '/images/alka.jpg' },
  { nombre: 'SHAMPOO', imagen: '/images/shampoo.jpg' },
  { nombre: 'TOALLA_HIGIENICA', imagen: '/images/toalla.jpg' },
  { nombre: 'CONDONES', imagen: '/images/condones.jpg' },
  { nombre: 'BONOS', imagen: '/images/bono.jpg' },
];

const Marketplace = () => {
  const [inventario, setInventario] = useState<InventarioCompleto | null>(null);
  const [precios, setPrecios] = useState<PrecioItem[]>([]);
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };

  const manejarErrorAuth = (error: any) => {
    if (error.response && error.response.status === 401) {
      alert('Sesión expirada. Por favor inicia sesión nuevamente.');
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      console.error(error);
    }
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/inventario`, config)
      .then(res => {
        const data = res.data;
        const ultimo = data[data.length - 1];
        setInventario(ultimo);
      })
      .catch(manejarErrorAuth);

    axios.get(`${import.meta.env.VITE_API_URL}/preciosInventario`, config)
      .then(res => setPrecios(res.data))
      .catch(manejarErrorAuth);
  }, []);

  const obtenerPrecio = (nombre: string): number | null => {
    const item = precios.find(p => p.producto === nombre);
    return item ? item.precio : null;
  };

  const manejarVenta = async (nombre: string) => {
    const precio = obtenerPrecio(nombre);
    if (precio === null) return alert('Este producto no tiene precio definido.');
    const reservaId = prompt('Ingrese el ID de la reserva a asignar:');
    if (!reservaId || !inventario) return;

    try {
      const { data: reserva } = await axios.get(`${import.meta.env.VITE_API_URL}/reservas/${reservaId}`, config);

      const nuevasObservaciones = `${reserva.observaciones || ''}\nVenta: ${nombre} - $${precio}`;
      const nuevoValor = reserva.valor + precio;

      await axios.put(`${import.meta.env.VITE_API_URL}/reservas/${reservaId}`, {
        ...reserva,
        observaciones: nuevasObservaciones,
        valor: nuevoValor
      }, config);

      const nuevoInventario = {
        ...inventario,
        [nombre]: (inventario[nombre as keyof InventarioCompleto] as number) - 1
      };

      await axios.put(`${import.meta.env.VITE_API_URL}/inventario/${inventario.id}`, nuevoInventario, config);
      setInventario(nuevoInventario);

      await axios.post(`${import.meta.env.VITE_API_URL}/historialVentas`, {
        producto: nombre,
        precio,
        reservaId: Number(reservaId),
        fecha: new Date().toISOString()
      }, config);

      alert('Producto asignado, descontado y registrado en el historial.');
    } catch (error) {
      manejarErrorAuth(error);
      alert('Error al procesar la venta.');
    }
  };

  return (
    <div className="container py-8 mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">🛍️ Tienda de Productos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {inventario && productos.map(prod => {
          const cantidad = Number(inventario[prod.nombre as keyof InventarioCompleto]);
          const precio = obtenerPrecio(prod.nombre);
          const agotado = cantidad <= 0 || precio === null;
          return (
            <div
              key={prod.nombre}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-4 flex flex-col items-center text-center"
            >
              <img
                src={prod.imagen}
                alt={prod.nombre}
                className="w-32 h-32 object-cover rounded-lg mb-4 hover:scale-105 transition-transform"
              />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">{prod.nombre}</h3>
              <p className="text-sm text-gray-500">
                {precio !== null ? `$${precio}` : 'Precio no disponible'}
              </p>
              <p className={`text-sm mt-1 ${agotado ? 'text-red-600' : 'text-green-600'}`}>
                {agotado ? 'Agotado' : `Disponibles: ${cantidad}`}
              </p>
              <button
                disabled={agotado}
                onClick={() => manejarVenta(prod.nombre)}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Vender
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Marketplace;