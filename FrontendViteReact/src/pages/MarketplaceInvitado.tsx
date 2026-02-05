import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Badge } from 'react-bootstrap';
// CORRECCIÓN AQUÍ: Se cambió FaboxOpen por FaBoxOpen
import { FaBoxOpen, FaHistory, FaPlus, FaShoppingCart, FaEdit } from 'react-icons/fa';
import axios from 'axios';

// --- INTERFACES ---
interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

interface Movimiento {
  id: number;
  tipo: 'compra' | 'venta';
  cantidad: number;
  fecha: string;
  producto?: Product;
  colaborador?: string;
  habitacion?: number;
  precioUnitario: number;
}

interface InventoryModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onInventoryUpdate: () => void;
}

// --- CONFIGURACIÓN AXIOS ---
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const InventoryModal: React.FC<InventoryModalProps> = ({ showModal, setShowModal, onInventoryUpdate }) => {
  const [mode, setMode] = useState<'menu' | 'compra' | 'venta' | 'historial' | 'editar'>('menu');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [precioCompra, setPrecioCompra] = useState<number>(0);
  const [colaboradorVenta, setColaboradorVenta] = useState('');
  const [habitacionVenta, setHabitacionVenta] = useState<number | ''>('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newPriceInput, setNewPriceInput] = useState<number | ''>('');

  const [colaboradoresList, setColaboradoresList] = useState<string[]>([]);
  const [habitacionesList, setHabitacionesList] = useState<number[]>([]);

  // --- CARGA DE DATOS ---
  useEffect(() => {
    if (showModal && mode !== 'menu' && mode !== 'editar') {
      fetchProducts();
      if (mode === 'venta') fetchAuxDataVentas();
      if (mode === 'historial') fetchHistorial();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, mode]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/productos');
      setProducts(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error al cargar productos.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistorial = async () => {
      setLoading(true);
      try {
          const res = await api.get('/movimientos');
          setMovimientos(res.data);
      } catch (err) {
          console.error("Error cargando historial:", err);
      } finally {
          setLoading(false);
      }
  }

  const fetchAuxDataVentas = async () => {
      try {
          setColaboradoresList(['Admin', 'Recepcion1', 'Recepcion2']);
          setHabitacionesList(Array.from({length: 20}, (_, i) => i + 1));
      } catch (error) {
          console.error("Error cargando datos auxiliares", error);
      }
  }

  // --- MANEJADORES ---
  const handleCloseModal = () => {
    setShowModal(false);
    setMode('menu');
    resetForm();
    setError('');
    setEditingProduct(null);
  };

  const resetForm = () => {
    setSelectedProductId('');
    setCantidad(1);
    setPrecioCompra(0);
    setColaboradorVenta('');
    setHabitacionVenta('');
  };

  const handleEditClick = (product: Product) => {
      setEditingProduct(product);
      setNewPriceInput(product.precio); 
      setMode('editar');
      setError('');
  };

  const handleCancelEdit = () => {
      setEditingProduct(null);
      setNewPriceInput('');
      setMode('historial');
      setError('');
  };

  const handleSubmitPriceChange = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingProduct || newPriceInput === '' || Number(newPriceInput) <= 0) {
          setError('Ingresa un precio válido mayor a 0.');
          return;
      }

      setLoading(true);
      try {
          await api.post(`/productos/${editingProduct.id}/precio`, {
              precio: Number(newPriceInput)
          });

          alert(`Precio de "${editingProduct.nombre}" actualizado correctamente.`);
          await fetchProducts(); 
          handleCancelEdit(); 
          onInventoryUpdate(); 

      } catch (err: any) {
          console.error(err);
          setError(err.response?.data?.message || 'Error al actualizar el precio.');
      } finally {
          setLoading(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || cantidad <= 0) {
      setError('Selecciona un producto y una cantidad válida.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const product = products.find(p => p.id === Number(selectedProductId));
      if (!product) throw new Error("Producto no encontrado");

      let endpoint = '';
      let payload = {};

      if (mode === 'compra') {
        if (precioCompra <= 0) {
           setError("Ingresa un precio de compra válido.");
           setLoading(false);
           return;
        }
        endpoint = '/movimientos/compra';
        payload = {
          productoId: product.id,
          cantidad: cantidad,
          precioCompra: precioCompra
        };
      } else if (mode === 'venta') {
        if (product.stock < cantidad) {
             setError(`Stock insuficiente. Disponible: ${product.stock}`);
             setLoading(false);
             return;
        }
        endpoint = '/movimientos/venta';
        payload = {
          productoId: product.id,
          cantidad: cantidad,
          precioVenta: product.precio,
          colaborador: colaboradorVenta || 'Venta Directa',
          habitacion: habitacionVenta || null
        };
      }

      await api.post(endpoint, payload);
      onInventoryUpdate();
      await fetchProducts();
      resetForm();
      alert(`${mode === 'compra' ? 'Compra' : 'Venta'} registrada con éxito.`);
      setMode('menu');

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || `Error al registrar la ${mode}.`);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERS DE UI ---

  const renderMenu = () => (
    <div className="d-grid gap-3 p-4">
      <Button variant="outline-primary" size="lg" className="d-flex align-items-center justify-content-center gap-3 py-3 border-2" onClick={() => setMode('compra')}>
        <FaShoppingCart size={24} /> Registrar Compra (Entrada)
      </Button>
      <Button variant="outline-success" size="lg" className="d-flex align-items-center justify-content-center gap-3 py-3 border-2" onClick={() => setMode('venta')}>
        <FaPlus size={24} /> Registrar Venta (Salida)
      </Button>
      <Button variant="outline-info" size="lg" className="d-flex align-items-center justify-content-center gap-3 py-3 border-2 text-white" onClick={() => setMode('historial')}>
        <FaHistory size={24} /> Ver Historial y Stock
      </Button>
    </div>
  );

  const renderEditForm = () => {
      if (!editingProduct) return null;
      return (
          <Form onSubmit={handleSubmitPriceChange} className="p-3">
              <div className="mb-4 p-3 border border-secondary rounded bg-black/30">
                  <h6 className="text-info mb-1">Producto a editar:</h6>
                  <h4 className="text-white fw-bold">{editingProduct.nombre}</h4>
                  <p className="text-white mb-0">Precio actual: <span className="badge bg-secondary">${editingProduct.precio}</span></p>
              </div>

              <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-warning">Nuevo Precio de Venta</Form.Label>
                  <Form.Control
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={newPriceInput}
                      onChange={(e) => setNewPriceInput(e.target.value === '' ? '' : Number(e.target.value))}
                      required
                      className="bg-dark text-white border-warning fw-bold fs-5"
                      placeholder="Ingrese el nuevo valor..."
                  />
                  <Form.Text className="text-muted">
                      Este cambio actualizará el precio para futuras ventas.
                  </Form.Text>
              </Form.Group>

              <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button variant="secondary" onClick={handleCancelEdit} disabled={loading}>
                      Cancelar
                  </Button>
                  <Button type="submit" variant="warning" disabled={loading}>
                      {loading ? 'Guardando...' : 'Actualizar Precio'}
                  </Button>
              </div>
          </Form>
      );
  };

  const renderForm = () => {
    const isCompra = mode === 'compra';
    const selectedProduct = products.find(p => p.id === Number(selectedProductId));

    return (
      <Form onSubmit={handleSubmit} className="p-3">
        <Form.Group className="mb-3">
          <Form.Label>Producto</Form.Label>
          <Form.Select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value === '' ? '' : Number(e.target.value))}
            required
            className="bg-dark text-white border-secondary"
          >
            <option value="">Selecciona un producto...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre} (Stock: {p.stock}) {isCompra ? '' : `- $${p.precio}`}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cantidad</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            required
            className="bg-dark text-white border-secondary"
          />
        </Form.Group>

        {isCompra ? (
           <Form.Group className="mb-3">
            <Form.Label>Precio de Compra Unitario (Costo)</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="0.01"
              value={precioCompra}
              onChange={(e) => setPrecioCompra(Number(e.target.value))}
              required
              className="bg-dark text-white border-secondary"
            />
          </Form.Group>
        ) : (
           <>
              <div className="mb-3 p-2 border border-secondary rounded bg-black">
                  <small className="text-white">Precio de Venta Unitario: </small>
                  <strong>${selectedProduct?.precio || 0}</strong>
                   <br/>
                   <small className="text-white">Total Venta: </small>
                   <strong className="text-success">${(selectedProduct?.precio || 0) * cantidad}</strong>
              </div>

               <Form.Group className="mb-3">
                <Form.Label>Vendido por (Opcional)</Form.Label>
                <Form.Select
                    value={colaboradorVenta}
                    onChange={(e) => setColaboradorVenta(e.target.value)}
                    className="bg-dark text-white border-secondary"
                >
                    <option value="">Seleccionar Colaborador...</option>
                    {colaboradoresList.map(c => <option key={c} value={c}>{c}</option>)}
                </Form.Select>
              </Form.Group>

               <Form.Group className="mb-3">
                <Form.Label>Habitación (Opcional)</Form.Label>
                <Form.Select
                    value={habitacionVenta}
                    onChange={(e) => setHabitacionVenta(e.target.value === '' ? '' : Number(e.target.value))}
                    className="bg-dark text-white border-secondary"
                >
                    <option value="">Seleccionar Habitación...</option>
                    {habitacionesList.map(h => <option key={h} value={h}>{h}</option>)}
                </Form.Select>
              </Form.Group>
           </>
        )}

        <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setMode('menu')} disabled={loading}>
                 Cancelar
            </Button>
            <Button type="submit" variant={isCompra ? "primary" : "success"} disabled={loading}>
              {loading ? 'Procesando...' : `Registrar ${isCompra ? 'Compra' : 'Venta'}`}
            </Button>
        </div>
      </Form>
    );
  };

  const renderHistorial = () => (
    <div className="p-3">
       <h5 className="mb-3 text-white">Stock Actual y Precios</h5>
       <Table striped bordered hover responsive size="sm" variant="dark" className="mb-4 align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Precio Venta</th>
              <th>Stock</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td className="fw-bold">{p.nombre}</td>
                <td className="text-info fw-bold">${p.precio}</td>
                <td className={p.stock < 5 ? 'text-danger fw-bold' : (p.stock > 20 ? 'text-success' : '')}>
                    {p.stock}
                </td>
                <td className="text-center">
                    <Button 
                        variant="outline-warning" 
                        size="sm" 
                        onClick={() => handleEditClick(p)}
                        title="Editar precio"
                    >
                        <FaEdit /> <span className="d-none d-md-inline">Editar</span>
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

      <h5 className="mb-3 text-white">Últimos Movimientos</h5>
      <div style={{maxHeight: '300px', overflowY: 'auto'}}>
          <Table striped bordered hover responsive size="sm" variant="dark">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio U.</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map(m => (
                <tr key={m.id}>
                  <td>{new Date(m.fecha).toLocaleDateString()}</td>
                  <td>
                      <Badge bg={m.tipo === 'compra' ? 'primary' : 'success'}>
                          {m.tipo.toUpperCase()}
                      </Badge>
                  </td>
                  <td>{m.producto?.nombre || 'N/A'}</td>
                  <td>{m.cantidad}</td>
                  <td>${m.precioUnitario}</td>
                  <td className="small">
                      {m.colaborador && <div>Colab: {m.colaborador}</div>}
                      {m.habitacion && <div>Hab: {m.habitacion}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
      </div>

       <div className="mt-3 text-end">
          <Button variant="secondary" onClick={() => setMode('menu')}>Volver al Menú</Button>
       </div>
    </div>
  );

  return (
    <Modal 
      show={showModal} 
      onHide={handleCloseModal} 
      size="lg" 
      centered
      backdrop="static"
    >
      <Modal.Header closeButton className="bg-dark text-white border-secondary">
        {/* CORRECCIÓN AQUÍ: Uso de FaBoxOpen */}
        <Modal.Title className="d-flex align-items-center gap-2">
          <FaBoxOpen />
          {mode === 'menu' && 'Gestión de Inventario'}
          {mode === 'compra' && 'Registrar Compra'}
          {mode === 'venta' && 'Registrar Venta'}
          {mode === 'historial' && 'Historial y Stock'}
          {mode === 'editar' && 'Actualizar Precio'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="bg-dark text-white">
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {loading && mode !== 'menu' && mode !== 'editar' && (
            <div className="text-center py-3">Cargando datos...</div>
        )}

        {!loading && (
            <>
                {mode === 'menu' && renderMenu()}
                {(mode === 'compra' || mode === 'venta') && renderForm()}
                {mode === 'historial' && renderHistorial()}
                {mode === 'editar' && renderEditForm()}
            </>
        )}
      </Modal.Body>
       
       <Modal.Footer className="bg-dark text-white border-secondary p-1">
       </Modal.Footer>
    </Modal>
  );
};

export default InventoryModal;