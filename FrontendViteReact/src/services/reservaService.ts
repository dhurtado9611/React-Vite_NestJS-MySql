import api from './api';

interface Reserva {
  id?: number;
  vehiculo: string;
  placa: string;
  habitacion: number;
  valor: number;
  observaciones?: string;
  hentrada: string;
  hsalidamax?: string;
  hsalida?: string;
}

export const getReservas = async () => {
  const response = await api.get('/reservas');
  return response.data;
};

export const createReserva = async (reserva: Reserva) => {
  const response = await api.post('/reservas', reserva);
  return response.data;
};

export const updateReserva = async (id: number, reserva: Reserva) => {
  const response = await api.put(`/reservas/${id}`, reserva);
  return response.data;
};

export const deleteReserva = async (id: number) => {
  const response = await api.delete(`/reservas/${id}`);
  return response.data;
};