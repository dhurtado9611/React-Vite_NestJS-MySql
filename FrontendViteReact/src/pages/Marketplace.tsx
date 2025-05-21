// MarketplaceInvitado.tsx
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

const Marketplace = () => {
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

  const handleChange = (index: number, field: keyof ProductoEditable, value: string | number) => {
    const nuevos = [...productosEditables];
    if (field === 'precio' || field === 'cantidad') {
      nuevos[index][field] = parseFloat(value as string);
    } else {
      nuevos[index][field] = value as string;
    }
    setProductosEditables(nuevos);
  };

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
      alert(`Producto "${producto.nombre}" actualizado exitosamente.`);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Error al guardar los cambios';
      alert(msg);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-2xl font-bold mb-4">Editar Tienda (Invitado)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {productosEditables.map((prod, idx) => (
          <div key={prod.nombre} className="p-4 shadow-lg border rounded">
            <input
              type="text"
              placeholder="URL de la imagen"
              value={prod.imagen}
              onChange={(e) => handleChange(idx, 'imagen', e.target.value)}
              className="w-full mb-2 p-1 border rounded"
            />
            {prod.imagen && <img src={prod.imagen} alt={prod.nombre} className="w-full h-40 object-cover rounded" />}
            <h3 className="text-lg font-semibold mt-2">{prod.nombre}</h3>
            <input
              type="number"
              value={prod.precio}
              onChange={(e) => handleChange(idx, 'precio', e.target.value)}
              className="w-full my-1 p-1 border rounded"
              placeholder="Precio"
            />
            <input
              type="number"
              value={prod.cantidad}
              onChange={(e) => handleChange(idx, 'cantidad', e.target.value)}
              className="w-full my-1 p-1 border rounded"
              placeholder="Cantidad"
            />
            <button
              onClick={() => guardarProducto(prod)}
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded"
            >
              Guardar Producto
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;