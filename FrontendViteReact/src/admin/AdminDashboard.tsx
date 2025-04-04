import React, { useState } from 'react';
import TablaUsuarios from './TablaUsuarios';

const AdminDashboard = () => {
  const [selectedTable, setSelectedTable] = useState('users');

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Panel de Administración</h2>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setSelectedTable('users')}>Usuarios</button>
        <button onClick={() => setSelectedTable('reservas')}>Reservas</button>
        <button onClick={() => setSelectedTable('cuadre')}>Cuadre</button>
      </div>

      {selectedTable === 'users' && <TablaUsuarios />}
      {/* Más adelante: TablaReservas, TablaCuadre */}
    </div>
  );
};

export default AdminDashboard;
