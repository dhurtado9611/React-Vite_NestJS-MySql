import React, { useState } from 'react';
import TablaUsuarios from './TablaUsuarios';
import TablaReservas from './TablaReservas';
import TablaCuadre from './TablaCuadre';

const AdminDashboard = () => {
  const [selectedTable, setSelectedTable] = useState<'users' | 'reservas' | 'cuadre'>('users');

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Panel de Administración</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedTable('users')}
          className={`px-4 py-2 rounded ${selectedTable === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Usuarios
        </button>
        <button
          onClick={() => setSelectedTable('reservas')}
          className={`px-4 py-2 rounded ${selectedTable === 'reservas' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Reservas
        </button>
        <button
          onClick={() => setSelectedTable('cuadre')}
          className={`px-4 py-2 rounded ${selectedTable === 'cuadre' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Cuadre
        </button>
      </div>

      <div>
        {selectedTable === 'users' && <TablaUsuarios />}
        {selectedTable === 'reservas' && <TablaReservas />}
        {selectedTable === 'cuadre' && <TablaCuadre />}
      </div>
    </div>
  );
};

export default AdminDashboard;