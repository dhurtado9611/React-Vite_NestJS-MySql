import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import api from '../services/api';
import * as XLSX from 'xlsx';

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

  const eliminar = async (id: number) => {
    try {
      await api.delete(`/inventario/${id}`);
      obtenerDatos();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const exportarExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(inventarios);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Inventario');
    XLSX.writeFile(libro, 'inventario.xlsx');
  };

  const resetearInventario = async () => {
    if (window.confirm('¿Estás seguro de borrar todo el inventario y reiniciar IDs?')) {
      try {
        await api.delete('/inventario/reset');
        obtenerDatos();
      } catch (error) {
        alert('Error al resetear inventario');
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Inventario Registrado</h2>
        <div className="flex gap-3">
          <Button variant="success" onClick={exportarExcel}>Exportar</Button>
          <Button variant="danger" onClick={resetearInventario}>Resetear Tabla</Button>
        </div>
      </div>
      <div className="overflow-auto">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Colaborador</th>
              <th>Fecha</th>
              <th>Turno</th>
              <th>Aguardiente</th>
              <th>Ron</th>
              <th>Poker</th>
              <th>Energizante</th>
              <th>Jugos Hit</th>
              <th>Agua</th>
              <th>Gaseosa</th>
              <th>Papel Higiénico</th>
              <th>Alka Seltzer</th>
              <th>Shampoo</th>
              <th>Toalla Higiénica</th>
              <th>Condones</th>
              <th>Bonos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventarios.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.id}</td>
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
                  <Button variant="danger" size="sm" onClick={() => eliminar(inv.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default TablaInventarioAdmin;