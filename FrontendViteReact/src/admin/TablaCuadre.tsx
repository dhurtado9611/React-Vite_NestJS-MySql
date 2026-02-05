// TablaCuadre.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Trash2 } from 'lucide-react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface Cuadre {
  id: number;
  colaborador: string;
  fecha: string;
  turno: string;
  turnoCerrado: string;
  basecaja: number;
  totalEntregado: number;
}

const TablaCuadre = () => {
  const [cuadres, setCuadres] = useState<Cuadre[]>([]);
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [cuadreEliminar, setCuadreEliminar] = useState<Cuadre | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarCuadres = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cuadre`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCuadres(res.data);
    } catch (err) {
      console.error('Error al cargar cuadre:', err);
    }
  };

  const resetearCuadre = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (window.confirm('¿Estás seguro de borrar todos los registros de cuadre y reiniciar los IDs?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/cuadre/admin/reset/cuadre`, {
          headers: { Authorization: `Bearer ${token}` },
        });        
        alert('Registros de cuadre eliminados correctamente.');
        cargarCuadres();
      } catch (err) {
        console.error('Error al resetear cuadre:', err);
        alert('Error al eliminar registros de cuadre.');
      }
    }
  };

  const confirmarEliminacion = (cuadre: Cuadre) => {
    setCuadreEliminar(cuadre);
    setMostrarModal(true);
  };

  const eliminarCuadreConfirmado = async () => {
    if (!cuadreEliminar) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await axios.delete(`${import.meta.env.VITE_API_URL}/cuadre/${cuadreEliminar.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCuadres(cuadres.filter((c) => c.id !== cuadreEliminar.id));
      setMostrarModal(false);
    } catch (err) {
      console.error('Error al eliminar cuadre:', err);
    }
  };

  useEffect(() => {
    cargarCuadres();
  }, []);

  const datosFiltrados = cuadres
    .filter((c) => {
      const fecha = new Date(c.fecha);
      return fecha.getMonth() + 1 === mes && fecha.getFullYear() === anio;
    })
    .reduce((acc: { dia: string; total: number }[], c) => {
      const dia = new Date(c.fecha).toISOString().split('T')[0];
      const existente = acc.find((d) => d.dia === dia);
      if (existente) {
        existente.total += c.totalEntregado;
      } else {
        acc.push({ dia, total: c.totalEntregado });
      }
      return acc;
    }, []);

  return (
    // CAMBIO 1: bg-light para dar contraste al fondo general y text-dark para asegurar legibilidad
    <div className="container-fluid px-3 py-3 bg-light min-vh-100">
      
      {/* Filtros y botón de reset */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <label className="form-label text-dark fw-bold">Mes</label>
          {/* CAMBIO 2: bg-white y text-dark explícitos en inputs */}
          <select 
            className="form-select bg-white text-dark border-secondary" 
            value={mes} 
            onChange={(e) => setMes(Number(e.target.value))}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label text-dark fw-bold">Año</label>
          <input
            type="number"
            className="form-control bg-white text-dark border-secondary"
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
          />
        </div>
        <div className="col-12 col-md-4 d-flex align-items-end">
          <button className="btn btn-danger w-100 shadow-sm" onClick={resetearCuadre}>
            Resetear Todo
          </button>
        </div>
      </div>

      {/* Gráfica total entregado */}
      {/* CAMBIO 3: Card con bg-white y text-dark forzados */}
      <div className="card shadow mb-4 bg-white border-0">
        <div className="card-body p-3">
          <h6 className="text-primary fw-bold mb-3">Total entregado por fecha</h6>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={datosFiltrados} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="dia" tick={{ fontSize: 12, fill: '#333' }} />
              <YAxis tick={{ fontSize: 12, fill: '#333' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', color: '#000', borderRadius: '8px', border: '1px solid #ddd' }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#dc3545"
                strokeWidth={3}
                dot={{ r: 4, fill: '#dc3545' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla con scroll */}
      <div className="card shadow bg-white border-0">
        <div className="card-body p-0">
          <div className="p-3 border-bottom">
            <h6 className="text-dark fw-bold m-0">Historial de Registros</h6>
          </div>
          <div style={{ overflowX: 'auto' }}>
            {/* CAMBIO 4: Tabla con clases explícitas para evitar herencia de color blanco */}
            <table className="table table-striped table-hover align-middle mb-0" style={{ minWidth: '900px' }}>
              <thead className="bg-dark text-white">
                <tr>
                  <th className="py-3 ps-3">ID</th>
                  <th className="py-3">Colaborador</th>
                  <th className="py-3">Fecha</th>
                  <th className="py-3">Turno</th>
                  <th className="py-3">Cierre</th>
                  <th className="py-3">Base</th>
                  <th className="py-3">Total</th>
                  <th className="py-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="text-dark">
                {cuadres.length > 0 ? (
                  cuadres.map((cuadre) => (
                    <tr key={cuadre.id}>
                      <td className="ps-3 fw-bold">#{cuadre.id}</td>
                      <td>{cuadre.colaborador}</td>
                      <td>{new Date(cuadre.fecha).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${cuadre.turno === 'Mañana' ? 'bg-info' : 'bg-warning'} text-dark`}>
                          {cuadre.turno}
                        </span>
                      </td>
                      <td>{cuadre.turnoCerrado || <span className="text-muted fst-italic">--</span>}</td>
                      <td className="text-success">${cuadre.basecaja.toLocaleString()}</td>
                      <td className="fw-bold text-success">${cuadre.totalEntregado.toLocaleString()}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-danger border-0"
                          onClick={() => confirmarEliminacion(cuadre)}
                          title="Eliminar registro"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">
                      No hay registros para este filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        {/* Asegurar que el modal tenga fondo blanco y texto oscuro */}
        <Modal.Header closeButton className="bg-white border-bottom">
          <Modal.Title className="text-dark">Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white text-dark">
          <p>¿Estás seguro de que deseas eliminar el cuadre del día?</p>
          <div className="alert alert-warning">
             Fecha: <strong>{cuadreEliminar?.fecha}</strong>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-white border-top">
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarCuadreConfirmado}>
            Sí, Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TablaCuadre;