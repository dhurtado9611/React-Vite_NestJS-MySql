import { useEffect, useState } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import api from '../services/api';
import * as XLSX from 'xlsx';

// Definición de la estructura de datos para TypeScript
interface Inventario {
  id: number;
  AGUARDIENTE: number;
  RON: number;
  POKER: number;
  ENERGIZANTE: number;
  JUGOS_HIT: number;
  AGUA: number;
  GASEOSA: number;
  PAPEL_HIGIENICO: number;
  ALKA_SELTZER: number;
  SHAMPOO: number;
  TOALLA_HIGIENICA: number;
  CONDONES: number;
  BONOS: number;
  fecha: string;
  turno: string;
  colaborador: string;
}

const TablaInventarioAdmin = () => {
  const [inventarios, setInventarios] = useState<Inventario[]>([]);
  
  // Estados para la lógica de edición
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Inventario>>({});

  const obtenerDatos = async () => {
    try {
      const res = await api.get('/inventario');
      setInventarios(res.data);
    } catch (error) {
      console.error('Error al obtener inventario:', error);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  // --- Funciones de Edición ---
  const iniciarEdicion = (inv: Inventario) => {
    setEditandoId(inv.id);
    setEditFormData(inv);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditFormData({});
  };

  const manejarCambioInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Identificamos si el campo debe ser numérico
    const camposTexto = ['fecha', 'turno', 'colaborador'];
    const esNumero = !camposTexto.includes(name);

    setEditFormData({
      ...editFormData,
      [name]: esNumero ? Number(value) : value,
    });
  };

  const guardarCambios = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/inventario/${id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Registro actualizado correctamente');
      setEditandoId(null);
      obtenerDatos();
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('No se pudo actualizar el registro. Verifica la conexión o permisos.');
    }
  };

  // --- Funciones de Gestión ---
  const eliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este registro permanentemente?')) {
      try {
        await api.delete(`/inventario/${id}`);
        obtenerDatos();
      } catch (error) {
        alert('Error al eliminar el registro');
      }
    }
  };

  const exportarExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(inventarios);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Inventario');
    XLSX.writeFile(libro, 'inventario_real.xlsx');
  };

  const resetearInventario = async () => {
    if (window.confirm('¡ATENCIÓN! Esto borrará TODA la base de datos y reiniciará los IDs. ¿Proceder?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete('/inventario/admin/reset/inventario', {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Base de datos reseteada');
        obtenerDatos();
      } catch (error) {
        alert('Error al resetear la tabla');
      }
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-xl font-bold">Panel de Control: Inventario Real</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-success" onClick={exportarExcel}>
            📊 Exportar Excel
          </Button>
          <Button variant="danger" onClick={resetearInventario}>
            ⚠️ Resetear Todo
          </Button>
        </div>
      </div>

      <div className="table-responsive shadow-sm border rounded">
        <Table striped bordered hover className="align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Colaborador</th>
              <th>Fecha</th>
              <th>Turno</th>
              <th>Aguardiente</th>
              <th>Ron</th>
              <th>Poker</th>
              <th>Energizante</th>
              <th>Hit</th>
              <th>Agua</th>
              <th>Gaseosa</th>
              <th>Papel</th>
              <th>Alka</th>
              <th>Shampoo</th>
              <th>Toalla</th>
              <th>Condones</th>
              <th>Bonos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventarios.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.id}</td>
                {editandoId === inv.id ? (
                  // FILA EN MODO EDICIÓN
                  <>
                    <td><Form.Control size="sm" name="colaborador" value={editFormData.colaborador || ''} onChange={manejarCambioInput} /></td>
                    <td><Form.Control size="sm" type="date" name="fecha" value={editFormData.fecha || ''} onChange={manejarCambioInput} /></td>
                    <td><Form.Control size="sm" name="turno" value={editFormData.turno || ''} onChange={manejarCambioInput} /></td>
                    <td><Form.Control size="sm" type="number" name="AGUARDIENTE" value={editFormData.AGUARDIENTE || 0} onChange={manejarCambioInput} /></td>
                    <td><Form.Control size="sm" type="number" name="RON" value={editFormData.RON || 0} onChange={manejarCambioInput} /></td>
                    <td><Form.Control size="sm" type="number" name="POKER" value={editFormData.POKER || 0} onChange={manejarCambioInput} /></td>
                    <td><Form.Control size="sm" type="number" name="ENERGIZANTE" value={editFormData.ENERGIZANTE || 0} onChange={manejarCambioInput} /></td>
                    <td><Form.Control size="sm" type="number" name="JUGOS_HIT" value={editFormData.JUGOS_HIT || 0} onChange={manejarCambioInput} /></td>
                    <td><Form.Control size="sm" type="number" name="AGUA" value={editFormData.AGUA || 0} onChange={manejarCambioInput} /></td>
                    <td><Form.Control size="sm" type="number" name="GASEOSA" value={editFormData.GASEOSA || 0} onChange={manejarCambioInput} /></td>
                    <td><Form.Control size="sm" type="number" name="PAPEL_HIGIENICO" value={editFormData.PAPEL_HIGIENICO || 0} onChange={manejarCambioInput} /></td>
                    <td><Form.Control size="sm" type="number" name="ALKA_SELTZER" value={editFormData.ALKA_SELTZER || 0} onChange={manejarCambioInput} /></td>
                    <td><Form.Control size="sm" type="number" name="SHAMPOO" value={editFormData.SHAMPOO || 0} onChange={manejarCambioInput} /></td>
                    <td><Form.Control size="sm" type="number" name="TOALLA_HIGIENICA" value={editFormData.TOALLA_HIGIENICA || 0} onChange={manejarCambioInput} /></td>
                    <td><Form.Control size="sm" type="number" name="CONDONES" value={editFormData.CONDONES || 0} onChange={manejarCambioInput} /></td>
                    <td><Form.Control size="sm" type="number" name="BONOS" value={editFormData.BONOS || 0} onChange={manejarCambioInput} /></td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button variant="success" size="sm" onClick={() => guardarCambios(inv.id)}>💾</Button>
                        <Button variant="secondary" size="sm" onClick={cancelarEdicion}>❌</Button>
                      </div>
                    </td>
                  </>
                ) : (
                  // FILA EN MODO VISTA
                  <>
                    <td>{inv.colaborador}</td>
                    <td>{inv.fecha}</td>
                    <td>{inv.turno}</td>
                    <td>{inv.AGUARDIENTE}</td>
                    <td>{inv.RON}</td>
                    <td>{inv.POKER}</td>
                    <td>{inv.ENERGIZANTE}</td>
                    <td>{inv.JUGOS_HIT}</td>
                    <td>{inv.AGUA}</td>
                    <td>{inv.GASEOSA}</td>
                    <td>{inv.PAPEL_HIGIENICO}</td>
                    <td>{inv.ALKA_SELTZER}</td>
                    <td>{inv.SHAMPOO}</td>
                    <td>{inv.TOALLA_HIGIENICA}</td>
                    <td>{inv.CONDONES}</td>
                    <td>{inv.BONOS}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button variant="warning" size="sm" onClick={() => iniciarEdicion(inv)}>✏️</Button>
                        <Button variant="outline-danger" size="sm" onClick={() => eliminar(inv.id)}>🗑️</Button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default TablaInventarioAdmin;