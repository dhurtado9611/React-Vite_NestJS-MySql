import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from 'react-icons/fa'; // Asegúrate de tener react-icons instalado
import { Modal, Button, Form } from 'react-bootstrap'; // Usando Bootstrap para modales rápidos

// --- Tipos ---
interface InventarioCompleto {
  id: number;
  [key: string]: number | string; // Firma de índice para acceder dinámicamente
}

interface Producto {
  nombre: string;
  imagen: string;
  precio: number;
  stock: number;
}

interface ItemCarrito extends Producto {
  cantidad: number;
}

// --- Lista de Productos Base (Con referencias a imágenes) ---
const catalogoBase = [
  { nombre: 'AGUARDIENTE', imagen: '/src/assets/Aguardiente.jpg', precio: 7000 },
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

const MarketplaceCliente = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [habitacionCliente, setHabitacionCliente] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  // 1. Cargar Inventario Real
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/inventario`)
      .then(res => {
        const data = res.data;
        if (data.length > 0) {
          const ultimoInventario = data[data.length - 1];
          
          // Fusionar el catálogo base con el stock real de la BD
          const productosConStock = catalogoBase.map(prod => ({
            ...prod,
            stock: Number(ultimoInventario[prod.nombre]) || 0
          }));
          setProductos(productosConStock);
        }
      })
      .catch(err => console.error("Error cargando inventario", err));
  }, []);

  // 2. Lógica del Carrito
  const agregarAlCarrito = (producto: Producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.nombre === producto.nombre);
      if (existe) {
        // Validar que no supere el stock
        if (existe.cantidad + 1 > producto.stock) {
          alert(`Solo quedan ${producto.stock} unidades de ${producto.nombre}`);
          return prev;
        }
        return prev.map(item => 
          item.nombre === producto.nombre ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const removerDelCarrito = (nombre: string) => {
    setCarrito(prev => prev.filter(item => item.nombre !== nombre));
  };

  const totalCarrito = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  // 3. Procesar el Pedido (Checkout)
  const confirmarPedido = async () => {
    if (!habitacionCliente || Number(habitacionCliente) < 1 || Number(habitacionCliente) > 16) {
      alert("Por favor ingrese un número de habitación válido (1-16).");
      return;
    }

    setLoading(true);
    try {
      // A. Buscar la reserva ACTIVA de esa habitación
      // NOTA: Esto asume que tu backend tiene un endpoint para listar reservas.
      // Filtraremos en el frontend si el backend no soporta filtros directos.
      const resReservas = await axios.get(`${import.meta.env.VITE_API_URL}/reservas`);
      const reservasActivas = resReservas.data.filter((r: any) => 
        Number(r.habitacion) === Number(habitacionCliente) && !r.hsalida
      );

      if (reservasActivas.length === 0) {
        alert("No se encontró una reserva activa para esta habitación.");
        setLoading(false);
        return;
      }

      const reservaActual = reservasActivas[reservasActivas.length - 1]; // La última activa
      
      // B. Preparar los datos actualizados
      let textoVenta = "";
      carrito.forEach(item => {
        textoVenta += `\n🛒 Compra: ${item.nombre} (x${item.cantidad}) - $${item.precio * item.cantidad}`;
      });

      const nuevasObservaciones = (reservaActual.observaciones || '') + textoVenta;
      const nuevoValor = parseFloat(reservaActual.valor) + totalCarrito;

      // C. Actualizar la Reserva (Cargar a la cuenta)
      await axios.put(`${import.meta.env.VITE_API_URL}/reservas/${reservaActual.id}`, {
        ...reservaActual,
        observaciones: nuevasObservaciones,
        valor: nuevoValor
      });

      // D. (Opcional) Aquí deberías llamar a un endpoint para descontar del inventario
      // await axios.post(`${import.meta.env.VITE_API_URL}/inventario/descontar`, { items: carrito });

      alert(`✅ ¡Pedido confirmado! Se han cargado $${totalCarrito} a la habitación ${habitacionCliente}.`);
      setCarrito([]);
      setShowModal(false);
      setHabitacionCliente('');

    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar el pedido. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-red-700 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-xl font-bold">Room Service 🛒</h2>
        <div className="relative cursor-pointer" onClick={() => setShowModal(true)}>
          <FaShoppingCart size={28} />
          {carrito.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
            </span>
          )}
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productos.map(prod => (
            <div key={prod.nombre} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              <div className="h-40 overflow-hidden bg-gray-200">
                 {/* Placeholder si falla la imagen */}
                <img 
                  src={prod.imagen} 
                  alt={prod.nombre} 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image'; }}
                />
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-800 text-sm md:text-base">{prod.nombre}</h3>
                <p className="text-gray-500 text-xs mb-2">Disponible: {prod.stock}</p>
                <div className="mt-auto flex justify-between items-center">
                  <span className="font-bold text-green-700">${prod.precio.toLocaleString()}</span>
                  <button
                    disabled={prod.stock <= 0}
                    onClick={() => agregarAlCarrito(prod)}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-800 disabled:opacity-50 transition"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal del Carrito (Usando Bootstrap Modal o podrías hacer uno custom) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tu Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {carrito.length === 0 ? (
            <p className="text-center text-gray-500">El carrito está vacío 😢</p>
          ) : (
            <div className="space-y-3">
              {carrito.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-bold">{item.nombre}</p>
                    <p className="text-sm text-gray-600">${item.precio} x {item.cantidad}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">${(item.precio * item.cantidad).toLocaleString()}</span>
                    <button 
                      onClick={() => removerDelCarrito(item.nombre)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 pt-2 border-t border-gray-800 flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>${totalCarrito.toLocaleString()}</span>
              </div>

              {/* Input de Habitación para Checkout */}
              <div className="mt-4 bg-gray-100 p-3 rounded">
                <Form.Label className="font-semibold">¿A qué habitación cargamos el pedido?</Form.Label>
                <Form.Control 
                  type="number" 
                  placeholder="Ej: 5" 
                  value={habitacionCliente}
                  onChange={(e) => setHabitacionCliente(Number(e.target.value))}
                  autoFocus
                />
                <Form.Text className="text-muted">
                  El valor se sumará a su cuenta automáticamente.
                </Form.Text>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Seguir comprando
          </Button>
          {carrito.length > 0 && (
            <Button variant="success" onClick={confirmarPedido} disabled={loading}>
              {loading ? 'Procesando...' : 'Confirmar Pedido'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MarketplaceCliente;