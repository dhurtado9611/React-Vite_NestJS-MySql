import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaTrash, FaPlus, FaSync } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';

// ✅ 1. DICCIONARIO DE IMÁGENES
const imagenesLocales: Record<string, string> = {
  'AGUARDIENTE': '/assets/Aguardiente.jpg',
  'RON': '/assets/ron.jpg',
  'POKER': '/assets/poker.jpg',
  'ENERGIZANTE': '/assets/energizante.jpg',
  'JUGOS_HIT': '/assets/jugohit.jpg',
  'JUGOS HIT': '/assets/jugohit.jpg',
  'AGUA': '/assets/agua.jpg',
  'GASEOSA': '/assets/gaseosa.jpg',
  'PAPEL_HIGIENICO': '/assets/papelh.jpg',
  'PAPEL HIGIENICO': '/assets/papelh.jpg',
  'ALKA_SELTZER': '/assets/alka.jpg',
  'ALKA SELTZER': '/assets/alka.jpg',
  'SHAMPOO': '/assets/shampoo.jpg',
  'TOALLA_HIGIENICA': '/assets/toallah.jpg',
  'TOALLA HIGIENICA': '/assets/toallah.jpg',
  'CONDONES': '/assets/condones.jpg',
  'BONOS': '/assets/bono.jpg',
};

// Interface auxiliar
interface ReservaActiva {
  id: number;
  habitacion: number;
}

const MarketplaceCliente = () => {
  const [productos, setProductos] = useState<any[]>([]); 
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

  const fetchInventario = async () => {
    try {
      const resPrecios = await axios.get(`${import.meta.env.VITE_API_URL}/preciosInventario`);
      const productosBD = resPrecios.data; 

      let stockMap: any = {};
      try {
          const resStock = await axios.get(`${import.meta.env.VITE_API_URL}/inventario`);
          if (resStock.data && resStock.data.length > 0) {
              stockMap = resStock.data[resStock.data.length - 1];
          }
      } catch (e) {
          console.warn("No se pudo cargar stock, asumiendo 0", e);
      }

      const productosProcesados = productosBD.map((item: any) => {
          const nombreMayus = item.nombre ? item.nombre.toUpperCase() : '';
          const imagenFinal = item.imagen || imagenesLocales[nombreMayus] || imagenesLocales[item.nombre] || 'https://placehold.co/150?text=Sin+Imagen';

          return {
              id: item.id,
              nombre: item.nombre,
              precio: Number(item.precio),
              imagen: imagenFinal,
              stock: Number(stockMap[item.nombre] || 0) 
          };
      });

      setProductos(productosProcesados);

    } catch (err) {
      console.error("Error cargando inventario desde BD", err);
    }
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
      console.error("Error buscando reservas activas", error);
    }
  };

  const agregarAlCarrito = (producto: any) => {
    setCarrito(prev => {
      const existe = prev.find((i: any) => i.id === producto.id);
      if (existe) {
        if (existe.cantidad + 1 > producto.stock) {
          alert(`Solo quedan ${producto.stock} unidades de ${producto.nombre}`);
          return prev;
        }
        return prev.map((i: any) => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const reducirDelCarrito = (producto: any) => {
    if (producto.cantidad === 1) {
      setCarrito(prev => prev.filter((i: any) => i.id !== producto.id));
    } else {
      setCarrito(prev => prev.map((i: any) => i.id === producto.id ? { ...i, cantidad: i.cantidad - 1 } : i));
    }
  };

  const removerDelCarrito = (id: number) => {
    setCarrito(prev => prev.filter((i: any) => i.id !== id));
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
        console.warn("No se pudo descontar inventario automáticamente.", invError);
      }

      alert(`✅ ¡Pedido cargado con éxito a la Habitación ${reservaActual.habitacion}!`);
      
      setCarrito([]);
      setShowModal(false);
      setReservaSeleccionadaId('');
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
    <div className="relative min-h-screen pb-20 md:pl-24 bg-gray-900">
      
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full bg-black/90 backdrop-blur-md border-b border-white/10 z-50 px-4 py-3 shadow-lg flex justify-between items-center">
        <div className="text-sm md:text-lg font-bold truncate pr-2 md:pl-24 text-white">Servicio a la habitación</div>
        <div 
          className="relative cursor-pointer bg-white/10 text-red-500 p-2 rounded-full hover:bg-white/20 transition border border-white/20" 
          onClick={() => setShowModal(true)}
        >
          <FaShoppingCart size={20} />
          {carrito.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md">
              {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
            </span>
          )}
        </div>
      </div>

      {/* Grid Productos */}
      <div className="container mx-auto p-4 pt-24"> 
        {productos.length === 0 ? (
            <div className="text-center py-10 text-white/50">Cargando productos...</div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productos.map(prod => {
                const itemEnCarrito = carrito.find(item => item.id === prod.id);
                const cantidadLlevada = itemEnCarrito ? itemEnCarrito.cantidad : 0;
                const stockVisual = prod.stock - cantidadLlevada;

                return (
                  <div key={prod.id || prod.nombre} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl overflow-hidden flex flex-col hover:border-red-600/50 transition duration-300">
                  <div className="h-40 bg-black/20 relative">
                      <img 
                      src={prod.imagen} 
                      alt={prod.nombre} 
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/150?text=Sin+Imagen'; }}
                      />
                      {stockVisual <= 0 && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white font-bold backdrop-blur-sm">
                        {prod.stock <= 0 ? 'AGOTADO' : 'MÁXIMO ALCANZADO'}
                      </div>
                      )}
                  </div>
                  <div className="p-3 flex flex-col flex-grow">
                      <h3 className="font-bold text-gray-100 text-sm">{prod.nombre}</h3>
                      <p className={`text-xs mb-2 ${stockVisual < 5 ? 'text-red-400 font-bold' : 'text-green-400'}`}>
                      Disponible: {stockVisual}
                      </p>
                      <div className="mt-auto flex justify-between items-center pt-2">
                      <span className="font-bold text-white text-lg">${prod.precio.toLocaleString()}</span>
                      <button
                          disabled={stockVisual <= 0}
                          onClick={() => agregarAlCarrito(prod)}
                          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 disabled:opacity-50 disabled:bg-gray-600 transition shadow-lg shadow-red-900/20"
                      >
                          <FaPlus size={12} />
                      </button>
                      </div>
                  </div>
                  </div>
                );
            })}
            </div>
        )}
      </div>
      
      {/* 💎 MODAL CORREGIDO - FUERZA EL FONDO OSCURO 💎 
        Usamos !bg-... para sobreescribir el estilo de Bootstrap
      */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered
        contentClassName="!bg-black/90 backdrop-blur-xl !border-white/20 !text-white shadow-2xl rounded-2xl"
      >
         <Modal.Header closeButton closeVariant="white" className="!border-white/10 !bg-transparent">
            <Modal.Title className="font-bold text-lg">🛍️ Resumen del Pedido</Modal.Title>
         </Modal.Header>
         
         <Modal.Body className="custom-scrollbar">
            {carrito.length === 0 ? (
                <p className="text-center text-gray-400 py-4">El carrito está vacío</p>
            ) : (
                <div className="space-y-4">
                    <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3">
                        {carrito.map((item, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-white/10 pb-3">
                                <div>
                                    <p className="font-bold m-0 text-gray-200">{item.nombre}</p>
                                    <p className="text-xs text-gray-400 m-0">${item.precio.toLocaleString()} x {item.cantidad}</p>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1 border border-white/5">
                                    <button onClick={() => reducirDelCarrito(item)} className="w-7 h-7 flex items-center justify-center bg-white/10 rounded hover:bg-white/20 text-white">-</button>
                                    <span className="font-bold text-sm w-4 text-center">{item.cantidad}</span>
                                    <button onClick={() => agregarAlCarrito(item)} className="w-7 h-7 flex items-center justify-center bg-white/10 rounded hover:bg-white/20 text-white">+</button>
                                    <button onClick={() => removerDelCarrito(item.id)} className="text-red-400 hover:text-red-300 ml-1"><FaTrash size={14}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="pt-4 bg-white/5 p-4 rounded-xl border border-white/10 mt-4">
                        <div className="mb-4">
                            <Form.Label className="font-bold text-gray-300 text-sm">Total a Cargar ($):</Form.Label>
                            <div className="text-2xl font-bold text-green-400 tracking-wider">
                                ${precioFinal.toLocaleString()}
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-2">
                              <Form.Label className="font-bold text-gray-300 text-sm mb-0">Habitación Activa:</Form.Label>
                              <button onClick={fetchReservasActivas} title="Actualizar lista" className="text-blue-400 text-xs flex items-center gap-1 hover:text-blue-300 transition">
                                <FaSync size={10} /> Refrescar
                              </button>
                            </div>
                            
                            <Form.Select 
                              value={reservaSeleccionadaId} 
                              onChange={e => setReservaSeleccionadaId(Number(e.target.value))}
                              // Aquí también usamos !bg- para asegurar que los inputs sean oscuros
                              className="font-bold !text-white !bg-gray-800 !border-white/20 focus:!bg-gray-700 focus:!border-blue-500 focus:shadow-none placeholder-gray-500"
                              style={{ colorScheme: 'dark' }} 
                            >
                              <option value="" className="text-gray-500 bg-gray-900">-- Seleccione --</option>
                              {listaReservasActivas.length === 0 ? (
                                <option disabled className="bg-gray-900">No hay habitaciones ocupadas</option>
                              ) : (
                                listaReservasActivas.map(reserva => (
                                  <option key={reserva.id} value={reserva.id} className="bg-gray-900 text-white">
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
         
         <Modal.Footer className="!border-white/10 !bg-transparent">
             <Button variant="outline-light" className="border-white/20 hover:bg-white/10" onClick={() => setShowModal(false)}>
                Cerrar
             </Button>
             {carrito.length > 0 && (
                <Button 
                    variant="danger" 
                    className="font-bold px-6 shadow-lg shadow-red-900/30"
                    onClick={confirmarPedido} 
                    disabled={loading || !reservaSeleccionadaId}
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