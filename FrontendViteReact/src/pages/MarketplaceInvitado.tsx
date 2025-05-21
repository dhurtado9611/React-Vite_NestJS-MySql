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

const productos = [
  { nombre: 'AGUARDIENTE', imagen: 'src/assets/Aguardiente.jpg', precio: 7000 },
  { nombre: 'RON', imagen: '/src/assets/ron.jpg', precio: 7500 },
  { nombre: 'POKER', imagen: '/src/assets/poker.jpg', precio: 3500 },
  { nombre: 'ENERGIZANTE', imagen: '/src/assets/energizante.jpg', precio: 4000 },
  { nombre: 'JUGOS_HIT', imagen: '/src/assets/jugos.jpg', precio: 2000 },
  { nombre: 'AGUA', imagen: '/src/assets/agua.jpg', precio: 1500 },
  { nombre: 'GASEOSA', imagen: '/src/assets/gaseosa.jpg', precio: 2500 },
  { nombre: 'PAPEL_HIGIENICO', imagen: '/src/assets/papel.jpg', precio: 2000 },
  { nombre: 'ALKA_SELTZER', imagen: '/src/assets/alka.jpg', precio: 3000 },
  { nombre: 'SHAMPOO', imagen: '/src/assets/shampoo.jpg', precio: 3000 },
  { nombre: 'TOALLA_HIGIENICA', imagen: '/src/assets/toalla.jpg', precio: 2500 },
  { nombre: 'CONDONES', imagen: '/src/assets/condones.jpg', precio: 2000 },
  { nombre: 'BONOS', imagen: '/src/assets/bono.jpg', precio: 5000 },
];

const MarketplaceInvitado = () => {
  const [inventario, setInventario] = useState<InventarioCompleto | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/inventario`)
      .then(res => {
        const data = res.data;
        const ultimo = data[data.length - 1];
        setInventario(ultimo);
      })
      .catch(err => console.error(err));
  }, []);

  const manejarVenta = async (nombre: string, precio: number) => {
    const reservaId = prompt('Ingrese el ID de la reserva a asignar:');
    if (!reservaId || isNaN(Number(reservaId))) {
      alert('ID no válido');
      return;
    }
  
    const token = localStorage.getItem('token'); // O usa sessionStorage si lo guardaste allí
    if (!token) {
      alert('Usuario no autenticado');
      return;
    }
  
    try {
      const headers = { Authorization: `Bearer ${token}` };
  
      const { data: reserva } = await axios.get(`${import.meta.env.VITE_API_URL}/reservas/${reservaId}`, { headers });
  
      const observacionesAnteriores = reserva.observaciones || '';
      const nuevasObservaciones = `${observacionesAnteriores}\nVenta: ${nombre} + $${precio}`;
      const valorActual = parseFloat(reserva.valor) || 0;
      const nuevoValor = valorActual + precio;
  
      await axios.put(`${import.meta.env.VITE_API_URL}/reservas/${reservaId}`, {
        ...reserva,
        observaciones: nuevasObservaciones,
        valor: nuevoValor
      }, { headers });
  
      alert('Producto asignado a la reserva con éxito.');
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        alert('No autorizado. Inicia sesión.');
      } else if (error.response?.status === 404) {
        alert('Reserva no encontrada.');
      } else {
        alert('Error al asignar producto.');
      }
    }
  };  

  return (
    <div className="container py-4">
      <h2 className="text-2xl font-bold mb-4">Tienda</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {inventario && productos.map(prod => {
          const cantidad = Number(inventario[prod.nombre as keyof InventarioCompleto]);
          return (
            <div key={prod.nombre} className="p-4 shadow-lg border rounded">
              <img src={prod.imagen} alt={prod.nombre} className="w-full h-40 object-cover rounded" />
              <h3 className="text-lg font-semibold mt-2">{prod.nombre}</h3>
              <p className="text-sm">Precio: ${prod.precio}</p>
              <p className="text-sm">Disponibles: {cantidad}</p>
              <button
                disabled={cantidad <= 0}
                onClick={() => manejarVenta(prod.nombre, prod.precio)}
                className="mt-2 w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
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

export default MarketplaceInvitado;