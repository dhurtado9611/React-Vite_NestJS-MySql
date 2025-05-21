// MarketplaceAdmin.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface InventarioCompleto {
  id: number;
  [key: string]: any;
  colaborador: string;
  turno: string;
  fecha: string;
}

interface ProductoEditable {
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
}

const MarketplaceAdmin = () => {
  const [inventario, setInventario] = useState<InventarioCompleto | null>(null);
  const [productosEditables, setProductosEditables] = useState<ProductoEditable[]>([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/inventario`)
      .then(res => {
        const data = res.data;
        const ultimo = data[data.length - 1];
        setInventario(ultimo);

        const tempProductos: ProductoEditable[] = Object.keys(ultimo)
          .filter(k => !['id', 'colaborador', 'turno', 'fecha'].includes(k))
          .map(nombre => ({
            nombre,
            imagen: '',
            precio: 0,
            cantidad: Number(ultimo[nombre]) || 0,
          }));

        setProductosEditables(tempProductos);
      })
      .catch(err => console.error(err));
  }, []);

  const guardarProducto = async (producto: ProductoEditable) => {
    if (!inventario) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Usuario no autenticado');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    const nuevoInventario = { ...inventario, [producto.nombre]: producto.cantidad };

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/inventario/${inventario.id}`, nuevoInventario, { headers });
      await axios.post(`${import.meta.env.VITE_API_URL}/precios-inventario/bulk-update`, {
        productos: [{
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen?.trim() || null
        }]
      }, { headers });
      console.log(`Producto "${producto.nombre}" actualizado exitosamente.`);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleAutoSave = (index: number, field: keyof ProductoEditable, value: string | number) => {
    const nuevos = [...productosEditables];
    if (field === 'precio' || field === 'cantidad') {
      nuevos[index][field] = parseFloat(value as string);
    } else {
      nuevos[index][field] = value as string;
    }
    setProductosEditables(nuevos);
    guardarProducto(nuevos[index]);
  };

  return (
    <div className="container py-4">
      <h2 className="text-2xl font-bold mb-4">Editar Tienda (Admin)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {productosEditables.map((prod, idx) => (
          <div key={prod.nombre} className="p-4 shadow-lg border rounded">
            <h3 className="text-lg font-semibold mb-2">{prod.nombre}</h3>
            <div className="mb-2">
              {prod.imagen && <img src={prod.imagen} alt={prod.nombre} className="w-full h-40 object-cover rounded mb-2" />}
              <label className="block text-sm font-medium">Editar imagen</label>
              <input
                type="text"
                value={prod.imagen}
                onChange={(e) => handleAutoSave(idx, 'imagen', e.target.value)}
                placeholder="URL de imagen"
                className="w-full p-1 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Editar precio</label>
              <input
                type="number"
                value={prod.precio}
                onChange={(e) => handleAutoSave(idx, 'precio', e.target.value)}
                className="w-full p-1 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Editar cantidad</label>
              <input
                type="number"
                value={prod.cantidad}
                onChange={(e) => handleAutoSave(idx, 'cantidad', e.target.value)}
                className="w-full p-1 border rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceAdmin;
