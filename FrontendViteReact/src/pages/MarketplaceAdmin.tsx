import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Badge } from 'react-bootstrap';
import { FaBoxOpen, FaEdit, FaSync, FaSave, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const imagenesLocales: Record<string, string> = {
  'AGUARDIENTE': '/assets/Aguardiente.jpg',
  'RON': '/assets/ron.jpg',
  'POKER': '/assets/poker.jpg',
  'ENERGIZANTE': '/assets/energizante.jpg',
  'JUGOS_HIT': '/assets/jugohit.jpg',
  'AGUA': '/assets/agua.jpg',
  'GASEOSA': '/assets/gaseosa.jpg',
  'PAPEL_HIGIENICO': '/assets/papelh.jpg',
  'ALKA_SELTZER': '/assets/alka.jpg',
  'SHAMPOO': '/assets/shampoo.jpg',
  'TOALLA_HIGIENICA': '/assets/toallah.jpg',
  'CONDONES': '/assets/condones.jpg',
  'BONOS': '/assets/bono.jpg',
};

// --- INTERFACES ---
interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string | null;
  fecha_actualizacion?: string;
}

// Configuración de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Interceptor para inyectar el Token automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const InventarioAdmin = () => {
  // Estados de datos
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados de Edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newPrice, setNewPrice] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);

  // --- CARGAR PRODUCTOS ---
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      // Consumimos la ruta '/productos' que configuramos en el Backend
      const res = await api.get('/preciosInventario');
      
      // Procesamos para asignar imágenes si vienen nulas
      const dataProcesada = res.data.map((p: Product) => ({
          ...p,
          precio: Number(p.precio), // Asegurar que sea número
          imagen: p.imagen || imagenesLocales[p.nombre] || null
      }));

      setProducts(dataProcesada);
    } catch (err: any) {
      console.error(err);
      setError('No se pudo cargar la lista de precios. Verifica la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- MANEJADORES DE EDICIÓN ---
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setNewPrice(product.precio);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    setNewPrice('');
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !newPrice || Number(newPrice) < 0) {
        alert("Por favor ingresa un precio válido.");
        return;
    }

    setSaving(true);
    try {
        // Usamos PUT hacia /productos/:id
        await api.put(`/preciosInventario/${editingProduct.id}`, {
            precio: Number(newPrice),
            // Si tu backend requiere nombre también, descomenta la siguiente línea:
            // nombre: editingProduct.nombre 
        });

        // Feedback visual
        alert(`✅ Precio de ${editingProduct.nombre} actualizado a $${Number(newPrice).toLocaleString()}`);
        
        // Recargar lista y cerrar modal
        await fetchProducts();
        handleCloseModal();

    } catch (err: any) {
        console.error(err);
        alert("❌ Error al guardar: " + (err.response?.data?.message || err.message));
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-indigo-500 selection:text-white md:pl-24 md:pr-24 pb-20 md:pb-0">
      
      {/* HEADER */}
      <div className="bg-black border-b border-gray-700 p-4 sticky top-0 z-40 shadow-lg flex justify-between items-center">
        <div>
            <h2 className="d-flex align-items-center gap-3 mb-0">
                <FaBoxOpen className="text-warning" />
                Administración de Precios
            </h2>
            <small className="text-muted">Gestiona el valor de venta al público</small>
        </div>
        <Button variant="outline-info" onClick={fetchProducts} disabled={loading}>
            <FaSync className={loading ? 'fa-spin' : ''} /> Refrescar
        </Button>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
          <div className="alert alert-danger bg-danger text-white border-0 shadow-sm mb-4">
              {error}
          </div>
      )}

      {/* TABLA DE PRODUCTOS */}
      <div className="card bg-black border border-secondary shadow-lg">
        <div className="card-body p-0 table-responsive">
          <Table striped hover variant="dark" className="mb-0 align-middle">
            <thead className="bg-secondary text-uppercase text-xs">
              <tr>
                <th className="py-3 ps-4">Producto</th>
                <th className="py-3 text-center">Precio Actual</th>
                <th className="py-3 text-center">Última Actualización</th>
                <th className="py-3 text-end pe-4">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                  <tr>
                      <td colSpan={4} className="text-center py-5 text-muted">Cargando inventario...</td>
                  </tr>
              ) : products.length === 0 ? (
                  <tr>
                      <td colSpan={4} className="text-center py-5 text-muted">No se encontraron productos en la base de datos.</td>
                  </tr>
              ) : (
                  products.map((p) => (
                    <tr key={p.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-white rounded p-1" style={{width: '45px', height: '45px'}}>
                                <img 
                                    src={p.imagen || 'https://via.placeholder.com/45'} 
                                    alt={p.nombre} 
                                    className="w-100 h-100 object-fit-contain rounded"
                                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/45?text=N/A')}
                                />
                            </div>
                            <span className="fw-bold">{p.nombre}</span>
                        </div>
                      </td>
                      <td className="text-center">
                          <Badge bg="success" className="px-3 py-2 fs-6">
                              ${p.precio.toLocaleString()}
                          </Badge>
                      </td>
                      <td className="text-center text-muted small">
                          {p.fecha_actualizacion 
                            ? new Date(p.fecha_actualizacion).toLocaleDateString() 
                            : '---'}
                      </td>
                      <td className="text-end pe-4">
                        <Button 
                            variant="warning" 
                            size="sm" 
                            className="fw-bold d-inline-flex align-items-center gap-2"
                            onClick={() => handleEditClick(p)}
                        >
                            <FaEdit /> Editar Precio
                        </Button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
      <Modal 
        show={showEditModal} 
        onHide={handleCloseModal} 
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="bg-dark text-white border-secondary">
          <Modal.Title className="d-flex align-items-center gap-2">
              <FaEdit className="text-warning"/> 
              Editar Precio
          </Modal.Title>
          <Button variant="link" onClick={handleCloseModal} className="text-white text-decoration-none">
              <FaTimes />
          </Button>
        </Modal.Header>
        
        <Modal.Body className="bg-dark text-white">
            {editingProduct && (
                <Form onSubmit={handleSavePrice}>
                    <div className="text-center mb-4">
                        <h5 className="mb-1">{editingProduct.nombre}</h5>
                        <small className="text-muted">ID: {editingProduct.id}</small>
                    </div>

                    <Form.Group className="mb-4">
                        <Form.Label className="text-info">Nuevo Precio de Venta ($)</Form.Label>
                        <Form.Control 
                            type="number" 
                            value={newPrice}
                            onChange={(e) => setNewPrice(Number(e.target.value))}
                            autoFocus
                            min={0}
                            className="bg-secondary text-white border-0 text-center fs-3 fw-bold py-3"
                        />
                    </Form.Group>

                    <div className="d-grid gap-2">
                        <Button type="submit" variant="warning" size="lg" disabled={saving}>
                            {saving ? 'Guardando...' : 'Guardar Nuevo Precio'} <FaSave className="ms-2"/>
                        </Button>
                        <Button variant="outline-light" onClick={handleCloseModal} disabled={saving}>
                            Cancelar
                        </Button>
                    </div>
                </Form>
            )}
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default InventarioAdmin;