import React, { useState } from 'react';
import TablaUsuarios from './TablaUsuarios';
import TablaReservas from './TablaReservas';
import TablaCuadre from './TablaCuadre';

const AdminDashboard = () => {
  const [selectedTable, setSelectedTable] = useState<'users' | 'reservas' | 'cuadre'>('users');

  return (
    <div className="relative min-h-screen text-auto pt-20 pb-10 lg:pl-24">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center border-b border-white pb-2">Panel de Administración</h2>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
          onClick={() => setSelectedTable('users')}
          className={`px-4 py-2 text-sm sm:text-base rounded-lg shadow-md transition-all duration-300 ${selectedTable === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-black hover:bg-blue-100'}`}
        >
          Usuarios
        </button>
        <button
          onClick={() => setSelectedTable('reservas')}
          className={`px-4 py-2 text-sm sm:text-base rounded-lg shadow-md transition-all duration-300 ${selectedTable === 'reservas' ? 'bg-blue-600 text-white' : 'bg-white text-black hover:bg-blue-100'}`}
        >
          Reservas
        </button>
        <button
          onClick={() => setSelectedTable('cuadre')}
          className={`px-4 py-2 text-sm sm:text-base rounded-lg shadow-md transition-all duration-300 ${selectedTable === 'cuadre' ? 'bg-blue-600 text-white' : 'bg-white text-black hover:bg-blue-100'}`}
        >
          Cuadre
        </button>
      </div>

      <div className="rounded-xl bg-white text-black p-4 shadow-xl overflow-auto">
        {selectedTable === 'users' && <TablaUsuarios />}
        {selectedTable === 'reservas' && <TablaReservas />}
        {selectedTable === 'cuadre' && <TablaCuadre />}
      </div>
    </div>
  );
};

export default AdminDashboard;