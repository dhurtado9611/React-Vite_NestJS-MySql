import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ReservasForm from '../components/CrearReservas/ReservasForm';
import TableReservas from '../components/CrearReservas/TableCrearReservasInvitado';

interface Reserva {
  id: number;
  vehiculo: string;
  placa: string;
  habitacion: number;
  valor: number;
  hentrada: string;
  hsalidamax: string;
  hsalida: string;
  observaciones: string;
  fecha: string;
  colaborador: string;
}

const Reservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [formData, setFormData] = useState<Partial<Reserva>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
  }, []);

  const fetchReservas = async () => {
    try {
      const response = await api.get('/reservas');
      setReservas(response.data);
    } catch (error) {
      console.error('Error fetching reservas:', error);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const handleLogout = () => {
    if (window.confirm("¿Deseas cerrar sesión?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('datosTurno');
      navigate('/');
    }
  };

  return (
    // CAMBIO 1: Cambié 'w-screen' por 'w-full' para evitar desbordes.
    // CAMBIO 2: Ajusté 'lg:pl-24' a 'md:pl-24' para que desde pantallas medianas (laptops) deje espacio al sidebar.
    <div className="relative text-white w-full min-h-screen pt-24 pb-20 px-4 sm:px-8 md:pl-24 transition-all duration-300">
      
      {/* NAVBAR PERSONALIZADO */}
      {/* CAMBIO 3: La Navbar se mantiene fija, pero el contenido interno respeta el margen izquierdo en desktop */}
      <nav className="fixed top-0 left-0 w-full bg-black border-b border-white/10 z-40 py-3 shadow-lg flex justify-between items-center transition-all duration-300">
        {/* Agregamos md:pl-20 aquí para empujar el texto 'Bienvenido' a la derecha del sidebar */}
        <div className="text-sm md:text-lg font-bold truncate pr-2 md:pl-20">
          Bienvenido,{' '}
          <span className="text-red-600 font-extrabold uppercase tracking-wide">
            {username || 'Invitado'}
          </span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="bg-white/10 hover:bg-red-600 text-white text-xs md:text-sm px-3 py-2 rounded transition-colors border border-white/20 flex items-center gap-2 whitespace-nowrap"
        >
          <i className="bi bi-box-arrow-right"></i> Salir
        </button>
      </nav>

      {/* Título de la sección */}
      <h2 className="mb-4 text-xl font-semibold border-l-4 border-red-600 pl-3">
        {editingId ? 'Editar Reserva' : 'Agregar Nueva Reserva'}
      </h2>

      <ReservasForm
        fetchReservas={fetchReservas}
        formData={formData}
        setFormData={setFormData}
        editingId={editingId}
        setEditingId={setEditingId}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        reservas={reservas}
        disableEditButton={true}
        disableDeleteButton={true}
      />

      <TableReservas
        reservas={reservas}
      />
    </div>
  );
};

export default Reservas;