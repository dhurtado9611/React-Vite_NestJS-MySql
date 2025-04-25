import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';

interface Inventario {
  id: number;
  colaborador: string;
  fecha: string;
  turno: string;
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
}

const TablaInventarioAdmin = () => {
  const [inventarios, setInventarios] = useState<Inventario[]>([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/inventario`)
      .then(res => setInventarios(res.data))
      .catch(err => console.error('Error cargando inventarios:', err));
  }, []);

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(inventarios);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
    XLSX.writeFile(wb, 'Inventario.xlsx');
  };

  const eliminarItem = async (id: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/inventario/${id}`);
      setInventarios(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error al eliminar item:', err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Inventario</h2>
        <Button onClick={exportarExcel}>Exportar a Excel</Button>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Colaborador</th>
            <th>Fecha</th>
            <th>Turno</th>
            <th colSpan={14}>Productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventarios.map(inv => (
            <tr key={inv.id}>
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
                <Button variant="danger" size="sm" onClick={() => eliminarItem(inv.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TablaInventarioAdmin;