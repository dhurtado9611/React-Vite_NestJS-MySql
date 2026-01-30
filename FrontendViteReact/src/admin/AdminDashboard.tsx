import React, { useState } from 'react';
import TablaUsuarios from './TablaUsuarios';
import TablaReservas from './TablaReservas';
import TablaCuadre from './TablaCuadre';
import TablaInventarioAdmin from './TablaInventarioAdmin';

const AdminDashboard = () => {
  const [selectedTable, setSelectedTable] = useState<'users' | 'reservas' | 'cuadre' | 'inventario'>('users');

  // Configuración de las pestañas para iterar limpiamente
  const tabs = [
    { id: 'users', label: 'Usuarios' },
    { id: 'reservas', label: 'Reservas' },
    { id: 'cuadre', label: 'Cuadre' },
    { id: 'inventario', label: 'Inventario' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#0f172a] overflow-hidden text-white font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* 1. ORBES DE FONDO (Para el efecto Liquid Glass) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* Contenedor Principal Limitado (Evita que se vea gigante) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        {/* 2. ENCABEZADO Y NAVEGACIÓN */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6">
          
          {/* Título con efecto glass sutil */}
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-lg">
            Panel Administrativo
          </h2>

          {/* Navegación tipo "Píldora Flotante" */}
          <div className="flex p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTable(tab.id as any)}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ease-out
                  ${selectedTable === tab.id 
                    ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. ÁREA DE CONTENIDO (GLASS CARD) */}
        {/* Aquí es donde ocurre la magia del Liquid Glass para los datos */}
        <div className="relative group">
          {/* Borde brillante decorativo */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
          
          <div className="relative bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Header de la tarjeta (opcional, para acciones de tabla) */}
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
              <span className="text-sm text-gray-400 uppercase tracking-wider font-semibold">
                Vista de datos: <span className="text-cyan-400">{selectedTable}</span>
              </span>
              {/* Aquí podrías poner un botón de exportar o filtros globales */}
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
            </div>

            {/* Contenedor de la Tabla con Scroll Suave */}
            <div className="p-6 overflow-x-auto custom-scrollbar">
              <div className="min-w-full inline-block align-middle">
                {/* IMPORTANTE: Tus componentes de tabla deben aceptar clases 
                   o ser transparentes para heredar el fondo glass.
                */}
                <div className="text-gray-200">
                  {selectedTable === 'users' && <TablaUsuarios />}
                  {selectedTable === 'reservas' && <TablaReservas />}
                  {selectedTable === 'cuadre' && <TablaCuadre />}
                  {selectedTable === 'inventario' && <TablaInventarioAdmin />}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;