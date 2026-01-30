import React, { useState } from 'react';
import TablaUsuarios from './TablaUsuarios';
import TablaReservas from './TablaReservas';
import TablaCuadre from './TablaCuadre';
import TablaInventarioAdmin from './TablaInventarioAdmin';

const AdminDashboard = () => {
  const [selectedTable, setSelectedTable] = useState<'users' | 'reservas' | 'cuadre' | 'inventario'>('users');

  const tabs = [
    { id: 'users', label: 'Usuarios' },
    { id: 'reservas', label: 'Reservas' },
    { id: 'cuadre', label: 'Cuadre' },
    { id: 'inventario', label: 'Inventario' },
  ];

  return (
    // FONDO GENERAL: Oscuro profundo (Slate 950) para que resalte el efecto vidrio
    <div className="relative min-h-screen w-full bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">
      
      {/* 1. LUCES DE FONDO (AMBIENT LIGHTING) */}
      {/* Sin bordes, solo luces difusas para dar atmósfera */}
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
        <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[100px] opacity-30"></div>
      </div>

      {/* CONTENEDOR PRINCIPAL: Controla el ancho en escritorio */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 z-10">
        
        {/* 2. ENCABEZADO MINIMALISTA */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">
              Dashboard
            </h2>
            <p className="text-slate-400 mt-2 text-sm font-medium">
              Gestión administrativa y control de ventas
            </p>
          </div>

          {/* 3. NAVEGACIÓN FLOTANTE (SIN BORDES) */}
          {/* Usamos un fondo muy sutil y sombras internas */}
          <div className="flex bg-slate-900/50 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl ring-1 ring-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTable(tab.id as any)}
                className={`
                  relative px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-500 ease-out
                  ${selectedTable === tab.id 
                    ? 'text-white bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)]' // Glow azul en lugar de borde
                    : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. TARJETA DE CONTENIDO (GLASS LIMPIO) */}
        {/* Eliminamos border-white. Usamos shadow-black para elevarlo y ring-white/5 para un borde casi invisible */}
        <div className="relative w-full">
          
          {/* Capa de brillo superior (opcional, para efecto premium) */}
          <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50"></div>

          <div className="bg-[#0f172a]/60 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/5 overflow-hidden">
            
            {/* Barra superior de la tabla (opcional) */}
            <div className="px-8 py-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${selectedTable === 'inventario' ? 'bg-orange-500 shadow-[0_0_8px_orange]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}></div>
                 <span className="text-sm font-medium text-slate-300 capitalize">{selectedTable}</span>
               </div>
               {/* Simulación de botones de acción de ventana */}
               <div className="flex gap-2 opacity-50">
                 <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                 <div className="w-3 h-3 rounded-full bg-slate-600"></div>
               </div>
            </div>

            {/* Contenedor con Scroll y Texto Blanco Forzado */}
            <div className="p-8 overflow-x-auto">
              {/* Forzamos que los hijos tengan texto claro si no tienen estilos propios */}
              <div className="min-w-full text-slate-200 [&_table]:w-full [&_td]:py-3 [&_th]:py-3 [&_th]:text-slate-400 [&_tr]:border-b [&_tr]:border-white/5 [&_tr:hover]:bg-white/5 transition-colors">
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
  );
};

export default AdminDashboard;