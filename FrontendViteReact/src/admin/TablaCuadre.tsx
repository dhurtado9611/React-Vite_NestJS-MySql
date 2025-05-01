// TablaCuadre.tsx completo con botón "Resetear Cuadre" y gráfica

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
        await axios.delete(`${import.meta.env.VITE_API_URL}/cuadre/reset`, {
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
    <div className="container-fluid px-3 py-3">
      {/* Filtros y botón de reset */}
      <div className="row g-3 mb-3">
        <div className="col">
          <label className="form-label">Mes</label>
          <select className="form-select" value={mes} onChange={(e) => setMes(Number(e.target.value))}>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <label className="form-label">Año</label>
          <input
            type="number"
            className="form-control"
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
          />
        </div>
        <div className="col d-flex align-items-end">
          <button className="btn btn-danger w-100" onClick={resetearCuadre}>
            Resetear Cuadre
          </button>
        </div>
      </div>

      {/* Gráfica total entregado */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-2">
          <h6 className="text-primary text-sm mb-2">Total entregado por fecha</h6>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={datosFiltrados}>
              <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#dc3545"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla con scroll */}
      <div className="card shadow-sm">
        <div className="card-body p-2">
          <h6 className="text-dark text-sm mb-2">Registros de Cuadre</h6>
          <div style={{ overflow: 'auto', maxHeight: '400px' }}>
            <table className="table table-sm table-striped table-bordered text-center" style={{ minWidth: '900px' }}>
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Colaborador</th>
                  <th>Fecha</th>
                  <th>Turno</th>
                  <th>Hora Cierre</th>
                  <th>Base Caja</th>
                  <th>Total Entregado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {cuadres.map((cuadre) => (
                  <tr key={cuadre.id}>
                    <td>{cuadre.id}</td>
                    <td>{cuadre.colaborador}</td>
                    <td>{cuadre.fecha}</td>
                    <td>{cuadre.turno}</td>
                    <td>{cuadre.turnoCerrado || 'Pendiente'}</td>
                    <td>${cuadre.basecaja}</td>
                    <td>${cuadre.totalEntregado}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => confirmarEliminacion(cuadre)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar el cuadre del día <strong>{cuadreEliminar?.fecha}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarCuadreConfirmado}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TablaCuadre;