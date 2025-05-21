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

interface ProductoBase {
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
}

interface ProductoEditable extends ProductoBase {
  original?: ProductoBase;
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
          .map(nombre => {
            const base = {
              nombre,
              imagen: '',
              precio: 0,
              cantidad: Number(ultimo[nombre]) || 0,
            };
            return { ...base, original: { ...base } };
          });

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

      const actualizados = productosEditables.map(p =>
        p.nombre === producto.nombre ? { ...producto, original: { ...producto } } : p
      );
      setProductosEditables(actualizados);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleChange = (index: number, field: keyof ProductoBase, value: string | number) => {
    const nuevos = [...productosEditables];
    if (field === 'precio' || field === 'cantidad') {
      nuevos[index][field] = parseFloat(String(value));
    } else {
      nuevos[index][field] = value as string;
    }
    setProductosEditables(nuevos);
  };

  const esDiferente = (p: ProductoEditable) => {
    return (
      p.imagen !== p.original?.imagen ||
      p.precio !== p.original?.precio ||
      p.cantidad !== p.original?.cantidad
    );
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
                onChange={(e) => handleChange(idx, 'imagen', e.target.value)}
                placeholder="URL de imagen"
                className="w-full p-1 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Editar precio</label>
              <input
                type="number"
                value={prod.precio}
                onChange={(e) => handleChange(idx, 'precio', e.target.value)}
                className="w-full p-1 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Editar cantidad</label>
              <input
                type="number"
                value={prod.cantidad}
                onChange={(e) => handleChange(idx, 'cantidad', e.target.value)}
                className="w-full p-1 border rounded"
              />
            </div>
            <button
              onClick={() => guardarProducto(prod)}
              className={`mt-2 w-full py-2 rounded text-white ${esDiferente(prod) ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
              disabled={!esDiferente(prod)}
            >
              Guardar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceAdmin;