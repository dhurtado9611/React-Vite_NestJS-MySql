import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaSync, FaStore } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';

// ✅ RUTAS DE IMÁGENES
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

interface ReservaActiva {
  id: number;
  habitacion: number;
}

const MarketplaceCliente = () => {
  const [productos, setProductos] = useState(catalogoBase.map(p => ({ ...p, stock: 0 }))); 
  const [carrito, setCarrito] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  const [reservaSeleccionadaId, setReservaSeleccionadaId] = useState<number | ''>('');
  const [listaReservasActivas, setListaReservasActivas] = useState<ReservaActiva[]>([]);

  const [precioFinal, setPrecioFinal] = useState<number>(0); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInventario();
  }, []);

  useEffect(() => {
    const totalCalculado = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    setPrecioFinal(totalCalculado);
  }, [carrito]);

  useEffect(() => {
    if (showModal) {
      fetchReservasActivas();
    }
  }, [showModal]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

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

  const fetchReservasActivas = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reservas`, {
        headers: getAuthHeaders()
      });
      
      const activas: ReservaActiva[] = (res.data as any[])
        .filter((r: any) => r.habitacion && !r.hsalida)
        .map((r: any) => ({
          id: r.id,            
          habitacion: Number(r.habitacion)
        }))
        .sort((a, b) => a.habitacion - b.habitacion);

      setListaReservasActivas(activas);
    } catch (error) {
      console.error("Error buscando reservas activas.", error);
    }
  };

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

  const confirmarPedido = async () => {
    if (!reservaSeleccionadaId) {
      alert("Por favor seleccione una habitación de la lista.");
      return;
    }

    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reservas/${reservaSeleccionadaId}`, { headers });
      const reservaActual = res.data;

      if (!reservaActual || reservaActual.hsalida) {
        alert("⚠️ Error: Esta reserva ya fue cerrada o no existe.");
        fetchReservasActivas();
        setLoading(false);
        return;
      }

      let detalleCompra = "";
      carrito.forEach(item => {
        detalleCompra += ` | 🛒 ${item.nombre} (x${item.cantidad})`;
      });
      detalleCompra += ` | Total Venta: $${precioFinal.toLocaleString()}`;

      const nuevasObservaciones = (reservaActual.observaciones || '') + detalleCompra;
      const nuevoValor = parseFloat(reservaActual.valor) + precioFinal;

      await axios.put(`${import.meta.env.VITE_API_URL}/reservas/${reservaSeleccionadaId}`, {
        ...reservaActual, 
        valor: nuevoValor,
        observaciones: nuevasObservaciones
      }, { headers });

      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/inventario/venta`, {
            items: carrito.map(item => ({ nombre: item.nombre, cantidad: item.cantidad }))
        }, { headers });
      } catch (invError) {
        console.warn("Error en inventario:", invError);
      }

      alert(`✅ Pedido agregado a Habitación ${reservaActual.habitacion}`);
      
      setCarrito([]);
      setShowModal(false);
      setReservaSeleccionadaId('');
      setPrecioFinal(0);
      fetchInventario(); 

    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.response?.data?.message || 'Conexión'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 text-white">
      
      {/* 2. NAVBAR FIJO Y OSCURO (Sticky top) */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-40 shadow-lg flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
                <FaStore className="text-white text-xl" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white m-0 leading-none">Room Service</h2>
                <p className="text-xs text-gray-400 m-0">Catálogo de productos</p>
            </div>
        </div>
        
        <button 
          className="relative bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 transition border border-gray-600" 
          onClick={() => setShowModal(true)}
        >
          <FaShoppingCart size={20} />
          {carrito.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm">
              {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Grid Productos */}
      <div className="container mx-auto p-4 pt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map(prod => (
            // 3. TARJETAS OSCURAS
            <div key={prod.nombre} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl hover:bg-gray-750 transition border border-gray-700">
              <div className="h-40 bg-gray-900 relative">
                <img 
                  src={prod.imagen} 
                  alt={prod.nombre} 
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Imagen'; }}
                />
                {prod.stock <= 0 && (
                   <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-red-500 font-bold border-2 border-red-500 m-4 rounded">AGOTADO</div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-100 text-sm uppercase tracking-wide">{prod.nombre.replace('_', ' ')}</h3>
                <p className={`text-xs mb-3 font-medium ${prod.stock < 5 ? 'text-red-400' : 'text-green-400'}`}>
                  Stock: {prod.stock}
                </p>
                <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-700">
                  <span className="font-bold text-xl text-white">${prod.precio.toLocaleString()}</span>
                  <button
                    disabled={prod.stock <= 0}
                    onClick={() => agregarAlCarrito(prod)}
                    className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 4. MODAL ESTILIZADO PARA DARK MODE */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered
        contentClassName="bg-gray-800 text-white border border-gray-700 shadow-2xl" // Clases clave para el fondo del modal
      >
         <Modal.Header closeButton closeVariant="white" className="border-b border-gray-700">
             <Modal.Title>Resumen del Pedido</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            {carrito.length === 0 ? (
                <p className="text-center text-gray-400 py-4">Tu carrito está vacío.</p>
            ) : (
                <div className="space-y-4">
                    {/* Lista de Items */}
                    {carrito.map((item, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-gray-700 pb-3">
                            <div>
                                <p className="font-bold m-0 text-white">{item.nombre}</p>
                                <p className="text-xs text-gray-400 m-0">${item.precio} x {item.cantidad}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => reducirDelCarrito(item)} className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600 transition">-</button>
                                <span className="font-bold text-white w-4 text-center">{item.cantidad}</span>
                                <button onClick={() => agregarAlCarrito(item)} className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600 transition">+</button>
                                <button onClick={() => removerDelCarrito(item.nombre)} className="text-red-400 hover:text-red-300 ml-2"><FaTrash/></button>
                            </div>
                        </div>
                    ))}
                    
                    <div className="pt-4 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                        <div className="mb-4">
                            <Form.Label className="font-bold text-gray-300">Total a Cargar ($):</Form.Label>
                            {/* Input con estilos oscuros */}
                            <Form.Control 
                                type="number" 
                                value={precioFinal}
                                onChange={(e) => setPrecioFinal(Number(e.target.value))}
                                className="font-bold text-xl text-green-400 bg-gray-800 border-gray-600 focus:bg-gray-700 focus:border-green-500 focus:text-green-400"
                            />
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-2">
                              <Form.Label className="font-bold text-gray-300 mb-0">Habitación Destino:</Form.Label>
                              <button onClick={fetchReservasActivas} title="Actualizar lista" className="text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300">
                                <FaSync size={12} /> Refrescar
                              </button>
                            </div>
                            
                            {/* Select con estilos oscuros */}
                            <Form.Select 
                              value={reservaSeleccionadaId} 
                              onChange={e => setReservaSeleccionadaId(Number(e.target.value))}
                              className="font-bold text-lg bg-gray-800 text-white border-gray-600 focus:bg-gray-700 focus:border-blue-500"
                              autoFocus
                            >
                              <option value="" className="text-gray-400">-- Seleccione Habitación --</option>
                              {listaReservasActivas.length === 0 ? (
                                <option disabled>No hay habitaciones ocupadas</option>
                              ) : (
                                listaReservasActivas.map(reserva => (
                                  <option key={reserva.id} value={reserva.id}>
                                    🚪 Habitación {reserva.habitacion}
                                  </option>
                                ))
                              )}
                            </Form.Select>
                        </div>
                    </div>
                </div>
            )}
         </Modal.Body>
         <Modal.Footer className="border-t border-gray-700">
             <Button variant="secondary" onClick={() => setShowModal(false)} className="bg-gray-600 border-gray-500 hover:bg-gray-500">
                Cancelar
             </Button>
             {carrito.length > 0 && (
                <Button 
                    variant="success" 
                    onClick={confirmarPedido} 
                    disabled={loading || !reservaSeleccionadaId}
                    className="bg-green-600 border-transparent hover:bg-green-700"
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