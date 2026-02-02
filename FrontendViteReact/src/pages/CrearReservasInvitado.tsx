import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importante para redireccionar
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
  
  const navigate = useNavigate(); // Hook para navegación

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

  // Función para cerrar sesión
  const handleLogout = () => {
    if (window.confirm("¿Deseas cerrar sesión?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('datosTurno');
      navigate('/');
    }
  };

  return (
    // Agregamos 'pt-24' para dar espacio al Navbar fijo
    <div className="relative text-white w-screen min-h-screen pt-24 pb-20 px-4 sm:px-8 lg:pl-24">
      
      {/* NAVBAR PERSONALIZADO */}
      <nav className="fixed top-0 left-0 w-full bg-black border-b border-white/10 z-50 px-4 py-3 shadow-lg flex justify-between items-center">
        <div className="text-sm md:text-lg font-bold truncate pr-2 md:pl-24">
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