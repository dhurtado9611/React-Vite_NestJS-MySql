import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';

// --- Tipos y Interfaces ---
interface ProductoBase {
  nombre: string;
  imagen: string;
  precio: number;
}

interface ProductoStock extends ProductoBase {
  stock: number;
}

interface ItemCarrito extends ProductoStock {
  cantidad: number;
}

// --- Catálogo Base (Rutas actualizadas a /assets para producción) ---
const catalogoBase: ProductoBase[] = [
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
  const [productos, setProductos] = useState<ProductoStock[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [habitacionCliente, setHabitacionCliente] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  // 1. Cargar Inventario Real desde el Backend
  useEffect(() => {
    fetchInventario();
  }, []);

  const fetchInventario = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/inventario`)
      .then(res => {
        const data = res.data;
        if (data.length > 0) {
          // El último registro es el inventario actual
          const ultimoInventario = data[data.length - 1];
          
          // Mapeamos el catálogo base con el stock real de la base de datos
          const productosConStock = catalogoBase.map(prod => ({
            ...prod,
            // Buscamos la propiedad dinámica en el objeto (ej: ultimoInventario['POKER'])
            stock: Number(ultimoInventario[prod.nombre] || 0)
          }));
          setProductos(productosConStock);
        }
      })
      .catch(err => console.error("Error cargando inventario:", err));
  };

  // 2. Funciones del Carrito
  const agregarAlCarrito = (producto: ProductoStock) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.nombre === producto.nombre);
      if (existe) {
        if (existe.cantidad + 1 > producto.stock) {
          alert(`¡Lo sentimos! Solo quedan ${producto.stock} unidades de ${producto.nombre}`);
          return prev;
        }
        return prev.map(item => 
          item.nombre === producto.nombre ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const reducirDelCarrito = (producto: ItemCarrito) => {
    if (producto.cantidad === 1) {
      removerDelCarrito(producto.nombre);
    } else {
      setCarrito(prev => prev.map(item => 
        item.nombre === producto.nombre ? { ...item, cantidad: item.cantidad - 1 } : item
      ));
    }
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
      const resReservas = await axios.get(`${import.meta.env.VITE_API_URL}/reservas`);
      
      // Filtramos: Habitación correcta Y que NO tenga fecha de salida (hsalida == null)
      const reservasActivas = resReservas.data.filter((r: any) => 
        Number(r.habitacion) === Number(habitacionCliente) && !r.hsalida
      );

      if (reservasActivas.length === 0) {
        alert("No encontramos una reserva activa para esta habitación. Por favor contacte a recepción.");
        setLoading(false);
        return;
      }

      // Tomamos la última reserva activa (por seguridad)
      const reservaActual = reservasActivas[reservasActivas.length - 1]; 
      
      // B. Preparar datos para actualizar la Reserva
      let textoVenta = "";
      carrito.forEach(item => {
        textoVenta += ` | 🛒 ${item.nombre} (x${item.cantidad}) $${item.precio * item.cantidad}`;
      });

      const nuevasObservaciones = (reservaActual.observaciones || '') + textoVenta;
      const nuevoValor = parseFloat(reservaActual.valor) + totalCarrito;

      // C. Actualizar la Reserva (Cargar a la cuenta)
      await axios.put(`${import.meta.env.VITE_API_URL}/reservas/${reservaActual.id}`, {
        valor: nuevoValor,
        observaciones: nuevasObservaciones
      });

      // D. Descontar del Inventario (Llamada al nuevo endpoint del Backend)
      await axios.post(`${import.meta.env.VITE_API_URL}/inventario/venta`, {
        items: carrito.map(item => ({
          nombre: item.nombre,
          cantidad: item.cantidad
        }))
      });

      // E. Finalizar
      alert(`✅ ¡Pedido exitoso! Se cargaron $${totalCarrito.toLocaleString()} a la habitación ${habitacionCliente}.`);
      setCarrito([]);
      setShowModal(false);
      setHabitacionCliente('');
      fetchInventario(); // Recargamos inventario para ver los stocks actualizados

    } catch (error) {
      console.error("Error procesando el pedido:", error);
      alert("Hubo un error al procesar el pedido. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-red-700 text-white p-4 shadow-md sticky top-0 z-50 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Room Service 🍽️
        </h2>
        
        {/* Botón del Carrito */}
        <div 
          className="relative cursor-pointer bg-white text-red-700 p-2 rounded-full shadow hover:bg-gray-100 transition" 
          onClick={() => setShowModal(true)}
        >
          <FaShoppingCart size={24} />
          {carrito.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-black font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs border border-white">
              {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
            </span>
          )}
        </div>
      </div>

      {/* --- GRID DE PRODUCTOS --- */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productos.map(prod => (
            <div key={prod.nombre} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition duration-300">
              <div className="h-40 overflow-hidden bg-gray-200 relative group">
                <img 
                  src={prod.imagen} 
                  alt={prod.nombre} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Sin+Imagen'; }}
                />
                {prod.stock <= 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg">
                    AGOTADO
                  </div>
                )}
              </div>
              
              <div className="p-3 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-800 text-sm md:text-base mb-1">{prod.nombre}</h3>
                <p className={`text-xs mb-2 ${prod.stock < 5 ? 'text-red-500 font-bold' : 'text-green-600'}`}>
                  Disponibles: {prod.stock}
                </p>
                
                <div className="mt-auto flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-900">${prod.precio.toLocaleString()}</span>
                  <button
                    disabled={prod.stock <= 0}
                    onClick={() => agregarAlCarrito(prod)}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
                  >
                    <FaPlus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL CARRITO (Bootstrap) --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-gray-100">
          <Modal.Title className="font-bold text-gray-800 flex items-center gap-2">
            <FaShoppingCart /> Tu Pedido
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-4">
          {carrito.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío 😢</p>
              <Button variant="outline-danger" onClick={() => setShowModal(false)}>
                Ir a comprar
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Lista de Items */}
              <div className="max-h-60 overflow-y-auto pr-2">
                {carrito.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-gray-100 py-3">
                    <div className="flex items-center gap-3">
                      <img src={item.imagen} alt={item.nombre} className="w-12 h-12 rounded object-cover border" />
                      <div>
                        <p className="font-bold text-gray-800 m-0">{item.nombre}</p>
                        <p className="text-xs text-gray-500 m-0">${item.precio.toLocaleString()} c/u</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button onClick={() => reducirDelCarrito(item)} className="px-2 py-1 bg-gray-200 hover:bg-gray-300">-</button>
                        <span className="px-3 font-semibold">{item.cantidad}</span>
                        <button onClick={() => agregarAlCarrito(item)} className="px-2 py-1 bg-gray-200 hover:bg-gray-300">+</button>
                      </div>
                      <span className="font-bold text-gray-700 min-w-[70px] text-right">
                        ${(item.precio * item.cantidad).toLocaleString()}
                      </span>
                      <button 
                        onClick={() => removerDelCarrito(item.nombre)}
                        className="text-red-400 hover:text-red-600 ml-2"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Resumen Total */}
              <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center border border-gray-200">
                <span className="text-gray-600 font-medium">Total a Pagar:</span>
                <span className="text-2xl font-bold text-red-700">${totalCarrito.toLocaleString()}</span>
              </div>

              {/* Input Habitación */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-4">
                <Form.Group>
                  <Form.Label className="font-bold text-gray-800 flex items-center gap-2">
                    🔑 ¿En qué habitación estás?
                  </Form.Label>
                  <Form.Control 
                    type="number" 
                    placeholder="Ej: 5" 
                    value={habitacionCliente}
                    onChange={(e) => setHabitacionCliente(Number(e.target.value))}
                    className="text-lg text-center font-bold tracking-widest"
                    autoFocus
                  />
                  <Form.Text className="text-muted text-sm mt-1 block text-center">
                    El valor se cargará automáticamente a tu cuenta.
                  </Form.Text>
                </Form.Group>
              </div>
            </div>
          )}
        </Modal.Body>
        
        <Modal.Footer className="bg-gray-50">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Seguir mirando
          </Button>
          {carrito.length > 0 && (
            <Button 
              variant="danger" 
              onClick={confirmarPedido} 
              disabled={loading || !habitacionCliente}
              className="px-6 font-bold"
            >
              {loading ? 'Procesando...' : 'Confirmar Pedido'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MarketplaceCliente;