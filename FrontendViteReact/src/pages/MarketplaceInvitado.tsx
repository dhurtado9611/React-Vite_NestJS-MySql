import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaSync } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';

// ✅ 1. DICCIONARIO DE IMÁGENES LOCALES
// Como en la BD la imagen es NULL, usamos este mapa para asignarlas según el nombre.
// Las claves están en MAYÚSCULAS para facilitar la búsqueda sin importar cómo venga de la BD.
const imagenesLocales: Record<string, string> = {
  'AGUARDIENTE': '/assets/Aguardiente.jpg',
  'RON': '/assets/ron.jpg',
  'POKER': '/assets/poker.jpg',
  'ENERGIZANTE': '/assets/energizante.jpg',
  'JUGOS_HIT': '/assets/jugohit.jpg',
  'JUGOS HIT': '/assets/jugohit.jpg', // Variación por si acaso
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
  // Estado inicial vacío, se llenará con la BD
  const [productos, setProductos] = useState<any[]>([]); 
  const [carrito, setCarrito] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  // Guardamos el ID de la reserva seleccionada
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

  // Función auxiliar para obtener headers con Token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ✅ 2. FUNCIÓN ACTUALIZADA: Carga desde BD y mezcla con imágenes locales
  const fetchInventario = async () => {
    try {
      // A. Obtenemos los precios y nombres de la BD (Tu tabla 'preciosInventario')
      const resPrecios = await axios.get(`${import.meta.env.VITE_API_URL}/preciosInventario`);
      const productosBD = resPrecios.data; // Array de { id, nombre, precio, imagen ... }

      // B. Obtenemos el stock (Si usas el endpoint antiguo de inventario para cantidades)
      let stockMap: any = {};
      try {
          const resStock = await axios.get(`${import.meta.env.VITE_API_URL}/inventario`);
          if (resStock.data && resStock.data.length > 0) {
              // Asumimos que el último registro tiene los stocks actuales
              stockMap = resStock.data[resStock.data.length - 1];
          }
      } catch (e) {
          console.warn("No se pudo cargar stock, asumiendo 0", e);
      }

      // C. Mezclamos todo (Precio BD + Imagen Local + Stock)
      const productosProcesados = productosBD.map((item: any) => {
          // Normalizamos nombre a mayúsculas para buscar la imagen
          const nombreMayus = item.nombre ? item.nombre.toUpperCase() : '';
          
          // Buscamos la imagen: BD > Local > Placeholder
          const imagenFinal = item.imagen || imagenesLocales[nombreMayus] || imagenesLocales[item.nombre] || 'https://via.placeholder.com/150?text=Sin+Imagen';

          return {
              id: item.id,
              nombre: item.nombre,
              precio: Number(item.precio),
              imagen: imagenFinal,
              // Buscamos el stock por el nombre exacto
              stock: Number(stockMap[item.nombre] || 0) 
          };
      });

      setProductos(productosProcesados);

    } catch (err) {
      console.error("Error cargando inventario desde BD", err);
    }
  };

  // 🔒 LÓGICA SEGURA: Buscar habitaciones ocupadas y guardar sus IDs
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
      console.error("Error buscando reservas activas. Verifique si inició sesión.", error);
    }
  };

  // Funciones del Carrito
  const agregarAlCarrito = (producto: any) => {
    setCarrito(prev => {
      // Usamos ID si existe, sino nombre para compatibilidad
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

  // 🔒 CONFIRMAR PEDIDO
  const confirmarPedido = async () => {
    if (!reservaSeleccionadaId) {
      alert("Por favor seleccione una habitación de la lista.");
      return;
    }

    setLoading(true);
    try {
      const headers = getAuthHeaders();

      // 1. OBTENER DATOS ACTUALES DE LA RESERVA
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reservas/${reservaSeleccionadaId}`, { headers });
      const reservaActual = res.data;

      if (!reservaActual || reservaActual.hsalida) {
        alert("⚠️ Error: Esta reserva ya fue cerrada o no existe.");
        fetchReservasActivas();
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
      }, { headers });

      // 4. DESCONTAR INVENTARIO
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/inventario/venta`, {
            items: carrito.map(item => ({ nombre: item.nombre, cantidad: item.cantidad }))
        }, { headers });
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
    <div className="relative min-h-screen pb-20 md:pl-24">
      
      {/* NAVBAR PERSONALIZADO */}
      <div className="fixed top-0 left-0 w-full bg-black border-b border-white/10 z-50 px-4 py-3 shadow-lg flex justify-between items-center">
        <div className="text-sm md:text-lg font-bold truncate pr-2 md:pl-24 text-white">Servicio a la habitacion</div>
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
      <div className="container mx-auto p-4 pt-20"> {/* Ajusté el padding-top por el navbar fijo */}
        {productos.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Cargando productos...</div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productos.map(prod => (
                <div key={prod.id || prod.nombre} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition">
                <div className="h-40 bg-gray-200 relative">
                    <img 
                    src={prod.imagen} 
                    alt={prod.nombre} 
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Sin+Imagen'; }}
                    />
                    {prod.stock !== undefined && prod.stock <= 0 && (
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
        )}
      </div>
      
      {/* Modal Carrito */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
         <Modal.Header closeButton><Modal.Title>Resumen del Pedido</Modal.Title></Modal.Header>
         <Modal.Body>
            {carrito.length === 0 ? (
                <p className="text-center text-black">El carrito está vacío</p>
            ) : (
                <div className="space-y-3">
                    {/* Lista de Items */}
                    {carrito.map((item, i) => (
                        <div key={i} className="flex justify-between items-center border-b pb-2">
                            <div>
                                <p className="font-bold m-0">{item.nombre}</p>
                                <p className="text-xs text-gray-500 m-0">${item.precio.toLocaleString()} x {item.cantidad}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => reducirDelCarrito(item)} className="bg-gray-200 px-2 rounded hover:bg-gray-300">-</button>
                                <span className="font-bold">{item.cantidad}</span>
                                <button onClick={() => agregarAlCarrito(item)} className="bg-gray-200 px-2 rounded hover:bg-gray-300">+</button>
                                <button onClick={() => removerDelCarrito(item.id)} className="text-red-500 ml-2"><FaTrash/></button>
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