import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const ReservarCliente = () => {
  const [fecha, setFecha] = useState<Date | null>(new Date());
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState<number[]>([]);
  const [horaEntrada, setHoraEntrada] = useState('14:00');
  const [horaSalida, setHoraSalida] = useState('16:00');
  const [habitacion, setHabitacion] = useState('');
  const [tipoHabitacion, setTipoHabitacion] = useState('Sencilla');
  const [precio, setPrecio] = useState(80000);
  const [telefono, setTelefono] = useState('');
  const [notas, setNotas] = useState('');
  const [correoCliente, setCorreoCliente] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [clienteId, setClienteId] = useState('cliente-uid-ejemplo');

  useEffect(() => {
    const fetchDisponibles = async () => {
      if (!fecha) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/reservas-cliente/disponibles`, {
          params: { fecha: fecha.toISOString().split('T')[0] },
        });
        setHabitacionesDisponibles(res.data.disponibles);
        if (res.data.disponibles.length > 0) {
          setHabitacion(String(res.data.disponibles[0]));
        } else {
          setHabitacion('');
        }
      } catch (err) {
        console.error('Error obteniendo habitaciones disponibles', err);
      }
    };
    fetchDisponibles();
  }, [fecha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/reservas-cliente`, {
        cliente_id: clienteId,
        nombre_cliente: nombreCliente,
        correo_cliente: correoCliente,
        telefono_cliente: telefono,
        habitacion,
        tipo_habitacion: tipoHabitacion,
        fecha: fecha?.toISOString().split('T')[0],
        hora_entrada: horaEntrada,
        hora_salida: horaSalida,
        precio,
        notas,
      });
      alert('Reserva enviada con éxito');
    } catch (error) {
      console.error(error);
      alert('Error al enviar la reserva');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white text-black rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Reservar habitación</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            className="input text-black"
            required
          />
          <input
            type="email"
            placeholder="Correo"
            value={correoCliente}
            onChange={(e) => setCorreoCliente(e.target.value)}
            className="input text-black"
            required
          />
        </div>

        <input
          type="tel"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="input w-full text-black"
          required
        />

        <DatePicker
          selected={fecha}
          onChange={(date) => setFecha(date)}
          className="input w-full text-black"
          placeholderText="Selecciona una fecha"
          dateFormat="yyyy-MM-dd"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="time"
            value={horaEntrada}
            onChange={(e) => setHoraEntrada(e.target.value)}
            className="input text-black"
            required
          />
          <input
            type="time"
            value={horaSalida}
            onChange={(e) => setHoraSalida(e.target.value)}
            className="input text-black"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            value={habitacion}
            onChange={(e) => setHabitacion(e.target.value)}
            className="input text-black"
            required
          >
            <option value="" disabled>
              {habitacionesDisponibles.length === 0
                ? 'No hay habitaciones disponibles'
                : 'Selecciona habitación'}
            </option>
            {habitacionesDisponibles.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>

          <select
            value={tipoHabitacion}
            onChange={(e) => setTipoHabitacion(e.target.value)}
            className="input text-black"
          >
            <option value="Sencilla">Sencilla</option>
            <option value="Doble">Doble</option>
            <option value="Jacuzzi">Jacuzzi</option>
          </select>
        </div>

        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(Number(e.target.value))}
          className="input w-full text-black"
          placeholder="Precio"
          required
        />

        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Notas u observaciones"
          className="input w-full h-24 text-black"
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Confirmar reserva
        </button>
      </form>
    </div>
  );
};

export default ReservarCliente;