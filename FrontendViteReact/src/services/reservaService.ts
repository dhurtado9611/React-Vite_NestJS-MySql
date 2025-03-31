import api from './api';

export interface Reserva {
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

export const getReservas = async (): Promise<Reserva[]> => {
  try {
    const response = await api.get<Reserva[]>('/reservas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    throw error;
  }
};

export const createReserva = async (reserva: Reserva): Promise<Reserva> => {
  try {
    const response = await api.post<Reserva>('/reservas', reserva);
    return response.data;
  } catch (error) {
    console.error('Error al crear reserva:', error);
    throw error;
  }
};

export const updateReserva = async (id: number, reserva: Reserva): Promise<Reserva> => {
  try {
    const response = await api.put<Reserva>(`/reservas/${id}`, reserva);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar reserva con id ${id}:`, error);
    throw error;
  }
};

export const deleteReserva = async (id: number): Promise<Reserva> => {
  try {
    const response = await api.delete<Reserva>(`/reservas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar reserva con id ${id}:`, error);
    throw error;
  }
};