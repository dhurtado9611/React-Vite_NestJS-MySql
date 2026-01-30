import { useEffect, useState } from 'react';
import { Reserva } from '../components/types';
import api from '../services/api';
import { Modal, Button } from 'react-bootstrap';
import Caja from '../components/Caja';

// ... (Tipos y lógica se mantienen igual) ...
type ReservaExtendida = Reserva & {
  hentradaNum: number;
  hsalidamaxNum: number;
};

const Historial = () => {
  const [reservas, setReservas] = useState<ReservaExtendida[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<ReservaExtendida | null>(null);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<number | null>(null);
  const [, setNow] = useState(new Date());

  // ... (Tus funciones fetchDatosReservas, calcularEstadoTiempo, etc. se quedan igual) ...
  const fetchDatosReservas = async () => {
      try {
        const response = await api.get('/reservas');
        setReservas(response.data);
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
      }
    };
  
    const calcularEstadoTiempo = (horaEntrada: string) => {
      if (!horaEntrada) return { minutosPasados: 0, minutosRestantes: 240, porcentaje: 0, excedido: false };
  
      const fechaActual = new Date();
      const [h, m] = horaEntrada.split(':').map(Number);
      const fechaEntrada = new Date();
      fechaEntrada.setHours(h, m, 0, 0);
  
      if (fechaEntrada > fechaActual) fechaEntrada.setDate(fechaEntrada.getDate() - 1);
  
      const diferenciaMs = fechaActual.getTime() - fechaEntrada.getTime();
      const minutosPasados = Math.floor(diferenciaMs / 60000);
      const LIMITE_TIEMPO = 240; 
      
      const porcentaje = Math.min((minutosPasados / LIMITE_TIEMPO) * 100, 100);
      
      return {
        minutosPasados,
        minutosRestantes: LIMITE_TIEMPO - minutosPasados,
        porcentaje,
        excedido: minutosPasados >= LIMITE_TIEMPO
      };
    };
  
    const handleClickHabitacion = (habitacion: number) => {
      setHabitacionSeleccionada(habitacion);
      const activa = reservas.find(r => r.habitacion === habitacion && !r.hsalida);
      setReservaSeleccionada(activa || null);
      setShowModal(true);
    };
  
    const formatoTiempoRestante = (minutos: number) => {
      if (minutos <= 0) return "Tiempo finalizado";
      const h = Math.floor(minutos / 60);
      const m = minutos % 60;
      return `${h}h ${m}m`;
    };
  
    useEffect(() => {
      fetchDatosReservas();
      const dataInterval = setInterval(fetchDatosReservas, 10000);
      const clockInterval = setInterval(() => setNow(new Date()), 60000);
      return () => { clearInterval(dataInterval); clearInterval(clockInterval); };
    }, []);
  
    const estadoModal = reservaSeleccionada ? calcularEstadoTiempo(reservaSeleccionada.hentrada) : null;


  return (
    // CAMBIO 1: Agregamos 'text-white' al contenedor principal y fondo transparente
    <div className="min-h-screen pt-16 pb-20 px-4 lg:pl-24 bg-transparent text-white font-sans">
      <style>
        {`
          /* Estilos locales para vidrio y texto */
          .glass-panel {
            background: rgba(0, 0, 0, 0.3); /* Fondo oscuro semitransparente */
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
            color: white; /* Fuerza texto blanco dentro del panel */
          }
          
          .room-btn {
            position: relative;
            height: 100px;
            border-radius: 20px;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.05); /* Botón oscuro translúcido */
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .room-btn:hover {
             background: rgba(255, 255, 255, 0.15);
             transform: translateY(-2px);
          }

          /* Forzar tablas a ser transparentes si usas Bootstrap/Tailwind tables */
          .table { color: white !important; --bs-table-bg: transparent !important; }
          .table td, .table th { border-color: rgba(255,255,255,0.1) !important; color: white !important; }
        `}
      </style>

      <div className="container-fluid">
        <div className="row g-4">
          {/* COLUMNA IZQUIERDA: HABITACIONES */}
          <div className="col-lg-8">
            <div className="glass-panel p-4 h-100">
              <h2 className="text-center mb-5 fw-bold text-uppercase tracking-widest text-white">
                Estado de Habitaciones
              </h2>
              
              <div className="row g-3">
                {[...Array(16)].map((_, i) => {
                  const num = i + 1;
                  const r = reservas.find(res => res.habitacion === num && !res.hsalida);
                  const info = r ? calcularEstadoTiempo(r.hentrada) : null;
                  const estado = !r ? 'libre' : info?.excedido ? 'critica' : 'ocupada';

                  return (
                    <div key={num} className="col-4 col-md-3">
                      <button 
                        onClick={() => handleClickHabitacion(num)}
                        className="room-btn w-100"
                        style={{
                          border: `1px solid ${estado === 'libre' ? 'rgba(0,255,127,0.3)' : 'rgba(255,255,255,0.1)'}`,
                          boxShadow: estado === 'critica' ? '0 0 15px rgba(255,0,0,0.5)' : 'none'
                        }}
                      >
                         {/* Círculo de progreso opcional (código anterior) */}
                         {info && (
                           <div className="position-absolute w-100 h-100 top-0 start-0 opacity-25"
                                style={{
                                  background: `conic-gradient(${info.excedido ? 'red' : 'cyan'} ${info.porcentaje}%, transparent 0)`
                                }}
                           />
                         )}
                        <span className="fs-2 fw-bold z-10">{num}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: CAJA (RESUMEN OPERATIVO) */}
          <div className="col-lg-4">
            {/* CAMBIO 2: Eliminamos bg-white y usamos glass-panel */}
            <div className="glass-panel p-5 h-100 d-flex flex-column">
                <p className="text-white/70 text-uppercase mb-4 text-center tracking-widest text-sm">
                    Resumen Operativo
                </p>
                
                {/* Asegúrate de que el componente <Caja /> use clases transparentes 
                   o herede el color. Si <Caja> tiene un div bg-white adentro, 
                   necesitarás editar ese archivo también.
                */}
                <div className="text-white">
                   <Caja />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL (Estilo Oscuro) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-secondary">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title>Habitación {habitacionSeleccionada}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
             {/* ... contenido del modal ... */}
             {reservaSeleccionada ? (
                 <div>
                    <p>Placa: <strong className="text-info">{reservaSeleccionada.placa}</strong></p>
                    <h2 className="text-center my-4">{
                        estadoModal?.excedido 
                        ? <span className="text-danger">TIEMPO EXCEDIDO</span> 
                        : <span className="text-success">{formatoTiempoRestante(estadoModal?.minutosRestantes || 0)}</span>
                    }</h2>
                 </div>
             ) : <p>Disponible</p>}
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="outline-light" onClick={() => setShowModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Historial;