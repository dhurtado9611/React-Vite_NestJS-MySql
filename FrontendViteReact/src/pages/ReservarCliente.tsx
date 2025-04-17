import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Reservar Habitación</h3>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Correo</label>
              <input
                type="email"
                className="form-control"
                value={correoCliente}
                onChange={(e) => setCorreoCliente(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                className="form-control"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Fecha de Reserva</label>
              <div className="border rounded">
                <DatePicker
                  selected={fecha}
                  onChange={(date) => setFecha(date)}
                  inline
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Hora de Entrada</label>
              <input
                type="time"
                className="form-control"
                value={horaEntrada}
                onChange={(e) => setHoraEntrada(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Hora de Salida</label>
              <input
                type="time"
                className="form-control"
                value={horaSalida}
                onChange={(e) => setHoraSalida(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Habitación</label>
              <select
                className="form-select"
                value={habitacion}
                onChange={(e) => setHabitacion(e.target.value)}
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
            </div>

            <div className="col-md-6">
              <label className="form-label">Tipo de Habitación</label>
              <select
                className="form-select"
                value={tipoHabitacion}
                onChange={(e) => setTipoHabitacion(e.target.value)}
              >
                <option value="Sencilla">Sencilla</option>
                <option value="Doble">Doble</option>
                <option value="Jacuzzi">Jacuzzi</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Precio</label>
              <input
                type="number"
                className="form-control"
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Notas u Observaciones</label>
              <textarea
                className="form-control"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
              />
            </div>

            <div className="col-12 text-center">
              <button type="submit" className="btn btn-primary px-4">
                Confirmar Reserva
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservarCliente;