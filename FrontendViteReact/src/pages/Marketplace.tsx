import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';

// ✅ RUTAS DE IMÁGENES CORREGIDAS (Carpeta public)
const catalogoBase = [
  { nombre: 'AGUARDIENTE', imagen: '/assets/Aguardiente.jpg', precio: 7000 },
  { nombre: 'RON', imagen: '/assets/ron.jpg', precio: 7500 },
  { nombre: 'POKER', imagen: '/assets/poker.jpg', precio: 3500 },
  { nombre: 'ENERGIZANTE', imagen: '/assets/energizante.jpg', precio: 4000 },
  { nombre: 'JUGOS_HIT', imagen: '/assets/jugohit.jpg', precio: 2000 },
  { nombre: 'AGUA', imagen: '/assets/agua.jpg', precio: 1500 },
  { nombre: 'GASEOSA', imagen: '/assets/gaseosa.jpg', precio: 2500 },
  { nombre: 'PAPEL_HIGIENICO', imagen: '/assets/papelh.jpg', precio: 2000 },
  { nombre: 'ALKA_SELTZER', imagen: '/assets/alka.jpg', precio: 3000 },
  { nombre: 'SHAMPOO', imagen: '/assets/shampoo.jpg', precio: 3000 },
  { nombre: 'TOALLA_HIGIENICA', imagen: '/assets/toallah.jpg', precio: 2500 },
  { nombre: 'CONDONES', imagen: '/assets/condones.jpg', precio: 2000 },
  { nombre: 'BONOS', imagen: '/assets/bono.jpg', precio: 5000 },
];

const MarketplaceCliente = () => {
  // Inicializamos con stock 0 para que se vea la estructura aunque falle la BD
  const [productos, setProductos] = useState(catalogoBase.map(p => ({ ...p, stock: 0 }))); 
  const [carrito, setCarrito] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [habitacionCliente, setHabitacionCliente] = useState<number | ''>('');
  const [precioFinal, setPrecioFinal] = useState<number>(0); 
  const [loading, setLoading] = useState(false);

  // 1. Cargar Inventario al iniciar
  useEffect(() => {
    fetchInventario();
  }, []);

  // Calcular precio total cuando cambia el carrito
  useEffect(() => {
    const totalCalculado = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    setPrecioFinal(totalCalculado);
  }, [carrito]);

  const fetchInventario = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/inventario`)
      .then(res => {
        const data = res.data;
        if (data && data.length > 0) {
          const ultimoInventario = data[data.length - 1];
          const productosActualizados = catalogoBase.map(prod => ({
            ...prod,
            stock: Number(ultimoInventario[prod.nombre] || 0)
          }));
          setProductos(productosActualizados);
        }
      })
      .catch(err => console.error("Error cargando inventario", err));
  };

  // 2. Funciones del Carrito
  const agregarAlCarrito = (producto: any) => {
    setCarrito(prev => {
      const existe = prev.find((i: any) => i.nombre === producto.nombre);
      if (existe) {
        if (existe.cantidad + 1 > producto.stock) {
          alert(`Solo quedan ${producto.stock} unidades de ${producto.nombre}`);
          return prev;
        }
        return prev.map((i: any) => i.nombre === producto.nombre ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const reducirDelCarrito = (producto: any) => {
    if (producto.cantidad === 1) {
      setCarrito(prev => prev.filter((i: any) => i.nombre !== producto.nombre));
    } else {
      setCarrito(prev => prev.map((i: any) => i.nombre === producto.nombre ? { ...i, cantidad: i.cantidad - 1 } : i));
    }
  };

  const removerDelCarrito = (nombre: string) => {
    setCarrito(prev => prev.filter((i: any) => i.nombre !== nombre));
  };

  // 3. Confirmar Pedido (Lógica ID Automático)
  const confirmarPedido = async () => {
    // Validación básica
    if (!habitacionCliente || Number(habitacionCliente) < 1 || Number(habitacionCliente) > 16) {
      alert("Por favor ingrese una habitación válida (1-16).");
      return;
    }

    setLoading(true);
    try {
      // A. OBTENER EL ID (Igual que en MarketplaceInvitado, pero automático)
      // Pedimos todas las reservas y buscamos la que esté ACTIVA en esa habitación
      const resReservas = await axios.get(`${import.meta.env.VITE_API_URL}/reservas`);
      
      const reservasActivas = resReservas.data.filter((r: any) => 
        Number(r.habitacion) === Number(habitacionCliente) && !r.hsalida
      );

      if (reservasActivas.length === 0) {
        alert("⚠️ No hay una reserva activa en la habitación " + habitacionCliente);
        setLoading(false);
        return;
      }

      // Tomamos la última reserva activa (esta tiene el ID que necesitamos)
      const reservaActual = reservasActivas[reservasActivas.length - 1];
      const reservaId = reservaActual.id; // ¡AQUÍ ESTÁ EL ID!

      // B. Preparar los datos nuevos
      let detalleCompra = "";
      carrito.forEach(item => {
        detalleCompra += ` | 🛒 ${item.nombre} (x${item.cantidad})`;
      });
      // Añadimos el precio final editado al texto para registro
      detalleCompra += ` | Total Venta: $${precioFinal.toLocaleString()}`;

      const nuevasObservaciones = (reservaActual.observaciones || '') + detalleCompra;
      const nuevoValor = parseFloat(reservaActual.valor) + precioFinal;

      // C. ACTUALIZAR LA RESERVA (Igual que MarketplaceInvitado)
      await axios.put(`${import.meta.env.VITE_API_URL}/reservas/${reservaId}`, {
        ...reservaActual, 
        valor: nuevoValor,
        observaciones: nuevasObservaciones
      });

      // D. DESCONTAR DEL INVENTARIO (Si tu backend ya tiene este endpoint)
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/inventario/venta`, {
            items: carrito.map(item => ({ nombre: item.nombre, cantidad: item.cantidad }))
        });
      } catch (invError) {
        console.warn("No se pudo descontar inventario automáticamente (Revisar Backend).", invError);
      }

      alert(`✅ ¡Éxito! Se cargaron $${precioFinal.toLocaleString()} a la Habitación ${habitacionCliente}`);
      
      // Limpieza
      setCarrito([]);
      setShowModal(false);
      setHabitacionCliente('');
      setPrecioFinal(0);
      fetchInventario(); 

    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Error de conexión';
      alert(`Error al procesar: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ CORRECCIÓN DE DISEÑO: 'md:pl-24' evita que el Sidebar tape el contenido
    <div className="relative min-h-screen bg-gray-50 pb-20 md:pl-24">
      
      {/* Header */}
      <div className="bg-red-700 text-white p-4 sticky top-0 z-40 flex justify-between items-center shadow-md">
        <h2 className="text-xl font-bold flex items-center gap-2">Room Service 🍽️</h2>
        <div 
          className="relative cursor-pointer bg-white text-red-700 p-2 rounded-full hover:bg-gray-200 transition" 
          onClick={() => setShowModal(true)}
        >
          <FaShoppingCart size={20} />
          {carrito.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-black font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs border border-white">
              {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
            </span>
          )}
        </div>
      </div>

      {/* Grid Productos */}
      <div className="container mx-auto p-4 pt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productos.map(prod => (
            <div key={prod.nombre} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition">
              <div className="h-40 bg-gray-200 relative">
                <img 
                  src={prod.imagen} 
                  alt={prod.nombre} 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Sin+Imagen'; }}
                />
                {prod.stock <= 0 && (
                   <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold">AGOTADO</div>
                )}
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-800 text-sm">{prod.nombre}</h3>
                <p className={`text-xs mb-2 ${prod.stock < 5 ? 'text-red-500 font-bold' : 'text-green-600'}`}>
                  Disponible: {prod.stock}
                </p>
                <div className="mt-auto flex justify-between items-center pt-2">
                  <span className="font-bold text-gray-900">${prod.precio.toLocaleString()}</span>
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
      
      {/* Modal Carrito */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
         <Modal.Header closeButton><Modal.Title>Resumen del Pedido</Modal.Title></Modal.Header>
         <Modal.Body>
            {carrito.length === 0 ? (
                <p className="text-center text-gray-500">El carrito está vacío</p>
            ) : (
                <div className="space-y-3">
                    {/* Lista de Items */}
                    {carrito.map((item, i) => (
                        <div key={i} className="flex justify-between items-center border-b pb-2">
                            <div>
                                <p className="font-bold m-0">{item.nombre}</p>
                                <p className="text-xs text-gray-500 m-0">${item.precio} x {item.cantidad}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => reducirDelCarrito(item)} className="bg-gray-200 px-2 rounded hover:bg-gray-300">-</button>
                                <span className="font-bold">{item.cantidad}</span>
                                <button onClick={() => agregarAlCarrito(item)} className="bg-gray-200 px-2 rounded hover:bg-gray-300">+</button>
                                <button onClick={() => removerDelCarrito(item.nombre)} className="text-red-500 ml-2"><FaTrash/></button>
                            </div>
                        </div>
                    ))}
                    
                    <div className="pt-4 bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="mb-3">
                            <Form.Label className="font-bold text-gray-700">Total a Cargar ($):</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={precioFinal}
                                onChange={(e) => setPrecioFinal(Number(e.target.value))}
                                className="font-bold text-xl text-red-700 border-red-200"
                            />
                            <Form.Text className="text-muted text-xs">Puedes editar este valor si aplicas descuento.</Form.Text>
                        </div>
                        
                        <div>
                            <Form.Label className="font-bold text-gray-700">Habitación Cliente:</Form.Label>
                            <Form.Control 
                                type="number" 
                                placeholder="Ej: 5" 
                                value={habitacionCliente} 
                                onChange={e => setHabitacionCliente(Number(e.target.value))} 
                                autoFocus
                                className="text-center font-bold text-lg"
                            />
                        </div>
                    </div>
                </div>
            )}
         </Modal.Body>
         <Modal.Footer>
             <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
             {carrito.length > 0 && (
                <Button 
                    variant="success" 
                    onClick={confirmarPedido} 
                    disabled={loading || !habitacionCliente}
                >
                    {loading ? 'Procesando...' : 'Confirmar Cargo'}
                </Button>
             )}
         </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MarketplaceCliente;