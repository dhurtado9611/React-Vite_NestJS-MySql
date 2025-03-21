export type Reserva = {
  id: number;
  fecha: string; // ✅ Nueva propiedad agregada
  vehiculo: string;
  placa: string;
  habitacion: number;
  valor: number;
  hentrada: string;
  hsalidamax: string;
  hsalida: string | null;
  observaciones: string;
};
