// src/pages/MarketplaceCliente.tsx (o Marketplace.tsx)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaTrash, FaPlus } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';

// ✅ IMPORTANTE: Rutas directas a /assets (sin src, sin import)
const catalogoBase = [
  { nombre: 'AGUARDIENTE', imagen: '/assets/Aguardiente.jpg', precio: 7000 },
  { nombre: 'RON', imagen: '/assets/ron.jpg', precio: 7500 },
  { nombre: 'POKER', imagen: '/assets/poker.jpg', precio: 3500 },
  { nombre: 'ENERGIZANTE', imagen: '/assets/energizante.jpg', precio: 4000 },
  { nombre: 'JUGOS_HIT', imagen: '/assets/jugos.jpg', precio: 2000 },
  { nombre: 'AGUA', imagen: '/assets/agua.jpg', precio: 1500 },
  { nombre: 'GASEOSA', imagen: '/assets/gaseosa.jpg', precio: 2500 },
  { nombre: 'PAPEL_HIGIENICO', imagen: '/assets/papel.jpg', precio: 2000 },
  { nombre: 'ALKA_SELTZER', imagen: '/assets/alka.jpg', precio: 3000 },
  { nombre: 'SHAMPOO', imagen: '/assets/shampoo.jpg', precio: 3000 },
  { nombre: 'TOALLA_HIGIENICA', imagen: '/assets/toalla.jpg', precio: 2500 },
  { nombre: 'CONDONES', imagen: '/assets/condones.jpg', precio: 2000 },
  { nombre: 'BONOS', imagen: '/assets/bono.jpg', precio: 5000 },
];

const MarketplaceCliente = () => {
  const [productos, setProductos] = useState(catalogoBase.map(p => ({ ...p, stock: 0 }))); // Inicia con stock 0
  const [carrito, setCarrito] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [habitacionCliente, setHabitacionCliente] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar inventario, pero si falla o está vacío, ya tenemos el catálogo base visible
    axios.get(`${import.meta.env.VITE_API_URL}/inventario`)
      .then(res => {
        const data = res.data;
        if (data && data.length > 0) {
          const ultimoInventario = data[data.length - 1];
          // Actualizamos stock basado en la BD
          const productosActualizados = catalogoBase.map(prod => ({
            ...prod,
            stock: Number(ultimoInventario[prod.nombre] || 0)
          }));
          setProductos(productosActualizados);
        }
      })
      .catch(err => console.error("No se pudo cargar inventario (quizás BD vacía)", err));
  }, []);

  // ... (El resto de las funciones agregarAlCarrito, confirmarPedido, etc. iguales que antes)

  return (
    <div className="relative min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-red-700 text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-md">
        <h2 className="text-xl font-bold">Room Service 🍽️</h2>
        <div className="relative cursor-pointer bg-white text-red-700 p-2 rounded-full" onClick={() => setShowModal(true)}>
          <FaShoppingCart size={20} />
          {carrito.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-black font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
            </span>
          )}
        </div>
      </div>

      {/* Grid Productos */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productos.map(prod => (
            <div key={prod.nombre} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              <div className="h-40 bg-gray-200">
                <img 
                  src={prod.imagen} 
                  alt={prod.nombre} 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Imagen+No+Encontrada'; }}
                />
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-800 text-sm">{prod.nombre}</h3>
                <p className="text-xs text-gray-500">Disponible: {prod.stock}</p>
                <div className="mt-auto flex justify-between items-center pt-2">
                  <span className="font-bold text-gray-900">${prod.precio.toLocaleString()}</span>
                  {/* Botón habilitado aunque stock sea 0 para pruebas, puedes cambiar disabled={false} */}
                  <button
                    onClick={() => {
                        // Lógica simplificada de agregar
                        setCarrito(prev => {
                            const existe = prev.find(i => i.nombre === prod.nombre);
                            if(existe) return prev.map(i => i.nombre === prod.nombre ? {...i, cantidad: i.cantidad + 1} : i);
                            return [...prev, {...prod, cantidad: 1}];
                        });
                    }}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-800"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal Carrito (Simplificado para el ejemplo) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
         <Modal.Header closeButton><Modal.Title>Tu Pedido</Modal.Title></Modal.Header>
         <Modal.Body>
            {carrito.length === 0 ? <p>Carrito vacío</p> : carrito.map((item, i) => (
                <div key={i} className="flex justify-between border-b py-2">
                    <span>{item.nombre} x {item.cantidad}</span>
                    <span>${(item.precio * item.cantidad).toLocaleString()}</span>
                </div>
            ))}
            {carrito.length > 0 && (
                <div className="mt-4">
                    <p className="font-bold">Total: ${carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0).toLocaleString()}</p>
                    <Form.Control 
                        type="number" placeholder="Habitación (1-16)" 
                        value={habitacionCliente} onChange={e => setHabitacionCliente(Number(e.target.value))} 
                        className="mt-2"
                    />
                </div>
            )}
         </Modal.Body>
         <Modal.Footer>
             {carrito.length > 0 && <Button variant="success" disabled={!habitacionCliente}>Confirmar</Button>}
         </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MarketplaceCliente;