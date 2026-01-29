import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaSync } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';

// ✅ RUTAS DE IMÁGENES (Carpeta public)
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

// Interface para manejar la lista desplegable de forma segura
interface ReservaActiva {
  id: number;
  habitacion: number;
}

const MarketplaceCliente = () => {
  const [productos, setProductos] = useState(catalogoBase.map(p => ({ ...p, stock: 0 }))); 
  const [carrito, setCarrito] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  // 🔒 CAMBIO CLAVE: Ahora guardamos el ID de la reserva, no solo el número de habitación
  const [reservaSeleccionadaId, setReservaSeleccionadaId] = useState<number | ''>('');
  const [listaReservasActivas, setListaReservasActivas] = useState<ReservaActiva[]>([]);

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

  // Cargar habitaciones ocupadas cuando se abre el modal
  useEffect(() => {
    if (showModal) {
      fetchReservasActivas();
    }
  }, [showModal]);

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

  // 🔒 LÓGICA SEGURA: Buscar habitaciones ocupadas y guardar sus IDs
  const fetchReservasActivas = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reservas`);
      
      // Filtramos solo las que NO tienen hora de salida (Ocupadas)
      const activas: ReservaActiva[] = (res.data as any[])
        .filter((r: any) => r.habitacion && !r.hsalida)
        .map((r: any) => ({
          id: r.id,            // Guardamos el ID real de la base de datos
          habitacion: Number(r.habitacion) // Y el número para mostrarlo
        }))
        .sort((a, b) => a.habitacion - b.habitacion);

      setListaReservasActivas(activas);
      
    } catch (error) {
      console.error("Error buscando reservas activas", error);
    }
  };

  // Funciones del Carrito (Sin cambios)
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

  // 🔒 CONFIRMAR PEDIDO (Usando ID Directo)
  const confirmarPedido = async () => {
    if (!reservaSeleccionadaId) {
      alert("Por favor seleccione una habitación de la lista.");
      return;
    }

    setLoading(true);
    try {
      // 1. OBTENER DATOS ACTUALES DE LA RESERVA USANDO EL ID
      // Como ya tenemos el ID, vamos directo al grano. Es más seguro.
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reservas/${reservaSeleccionadaId}`);
      const reservaActual = res.data;

      if (!reservaActual || reservaActual.hsalida) {
        alert("⚠️ Error: Parece que esta reserva ya fue cerrada o no existe.");
        fetchReservasActivas(); // Refrescamos la lista
        setLoading(false);
        return;
      }

      // 2. Preparar los datos nuevos
      let detalleCompra = "";
      carrito.forEach(item => {
        detalleCompra += ` | 🛒 ${item.nombre} (x${item.cantidad})`;
      });
      detalleCompra += ` | Total Venta: $${precioFinal.toLocaleString()}`;

      const nuevasObservaciones = (reservaActual.observaciones || '') + detalleCompra;
      const nuevoValor = parseFloat(reservaActual.valor) + precioFinal;

      // 3. ACTUALIZAR RESERVA
      await axios.put(`${import.meta.env.VITE_API_URL}/reservas/${reservaSeleccionadaId}`, {
        ...reservaActual, 
        valor: nuevoValor,
        observaciones: nuevasObservaciones
      });

      // 4. DESCONTAR INVENTARIO
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/inventario/venta`, {
            items: carrito.map(item => ({ nombre: item.nombre, cantidad: item.cantidad }))
        });
      } catch (invError) {
        console.warn("No se pudo descontar inventario automáticamente.", invError);
      }

      alert(`✅ ¡Pedido cargado con éxito a la Habitación ${reservaActual.habitacion}!`);
      
      // Limpieza
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
                        {/* Precio Total Editable */}
                        <div className="mb-3">
                            <Form.Label className="font-bold text-gray-700">Total a Cargar ($):</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={precioFinal}
                                onChange={(e) => setPrecioFinal(Number(e.target.value))}
                                className="font-bold text-xl text-red-700 border-red-200"
                            />
                        </div>
                        
                        {/* 🔒 SELECTOR SEGURO: Muestra Habitación -> Guarda ID */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                              <Form.Label className="font-bold text-gray-700 mb-0">Seleccionar Habitación Activa:</Form.Label>
                              <button onClick={fetchReservasActivas} title="Actualizar lista" className="text-blue-600 text-sm flex items-center gap-1">
                                <FaSync size={12} /> Refrescar
                              </button>
                            </div>
                            
                            <Form.Select 
                              value={reservaSeleccionadaId} 
                              onChange={e => setReservaSeleccionadaId(Number(e.target.value))}
                              className="font-bold text-lg border-blue-300 bg-blue-50"
                              autoFocus
                            >
                              <option value="">-- Seleccione --</option>
                              {listaReservasActivas.length === 0 ? (
                                <option disabled>No hay habitaciones ocupadas</option>
                              ) : (
                                listaReservasActivas.map(reserva => (
                                  // Aquí está la magia: Value = ID, Label = Habitación
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
         <Modal.Footer>
             <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
             {carrito.length > 0 && (
                <Button 
                    variant="success" 
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