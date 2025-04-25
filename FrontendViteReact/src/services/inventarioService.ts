import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

// Crear un nuevo inventario
export const crearInventario = async (data: any) => {
  const response = await axios.post(`${API}/inventario`, data);
  return response.data;
};

// Consultar si ya existe un inventario para el turno
export const consultarInventario = async (
  fecha: string,
  turno: string,
  colaborador: string
) => {
  const response = await axios.get(`${API}/inventario/buscar`, {
    params: { fecha, turno, colaborador },
  });
  return response.data;
};
