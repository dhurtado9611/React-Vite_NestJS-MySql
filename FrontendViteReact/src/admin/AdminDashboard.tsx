import React, { useState } from 'react';
import TablaUsuarios from './TablaUsuarios';
import TablaReservas from './TablaReservas';
import TablaCuadre from './TablaCuadre';

const AdminDashboard = () => {
  const [selectedTable, setSelectedTable] = useState<'users' | 'reservas' | 'cuadre'>('users');

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6 pt-20 pb-10 lg:pl-24">
      <h2 className="text-3xl font-bold mb-8 text-center border-b border-white pb-2">Panel de Administración</h2>

      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setSelectedTable('users')}
          className={`px-5 py-2 rounded-xl shadow transition-all duration-300 ${selectedTable === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-black hover:bg-blue-100'}`}
        >
          Usuarios
        </button>
        <button
          onClick={() => setSelectedTable('reservas')}
          className={`px-5 py-2 rounded-xl shadow transition-all duration-300 ${selectedTable === 'reservas' ? 'bg-blue-600 text-white' : 'bg-white text-black hover:bg-blue-100'}`}
        >
          Reservas
        </button>
        <button
          onClick={() => setSelectedTable('cuadre')}
          className={`px-5 py-2 rounded-xl shadow transition-all duration-300 ${selectedTable === 'cuadre' ? 'bg-blue-600 text-white' : 'bg-white text-black hover:bg-blue-100'}`}
        >
          Cuadre
        </button>
      </div>

      <div className="rounded-xl bg-white/10 p-6 shadow-xl backdrop-blur-lg">
        {selectedTable === 'users' && <TablaUsuarios />}
        {selectedTable === 'reservas' && <TablaReservas />}
        {selectedTable === 'cuadre' && <TablaCuadre />}
      </div>
    </div>
  );
};

export default AdminDashboard;