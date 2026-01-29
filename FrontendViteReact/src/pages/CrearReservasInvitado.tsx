import React, { useEffect, useState } from 'react';

interface Reserva {
  id: number;
  vehiculo: string;
  placa: string;
  habitacion: number;
  valor: number;
  hentrada: string;
  hsalidamax: string; // Formato esperado "HH:mm"
  hsalida: string;
  observaciones: string;
  fecha: string; // Formato esperado "YYYY-MM-DD"
  colaborador: string;
}

interface Props {
  reservas: Reserva[];
  fetchReservas: () => void;
}

const TableCrearReservas: React.FC<Props> = ({ reservas }) => {
  const [now, setNow] = useState(new Date());

  // Actualizamos el reloj cada minuto para que las alertas sean en tiempo real
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  };

  // Función lógica para verificar si está vencido
  const checkVencimiento = (reserva: Reserva) => {
    // Si ya tiene hora de salida marcada (ya se fue), no está vencido
    if (reserva.hsalida && reserva.hsalida.trim() !== '') return { vencido: false, minutosTarde: 0 };

    try {
      // Crear fecha completa de vencimiento combinando fecha de reserva y hora máxima
      const fechaVencimiento = new Date(`${reserva.fecha}T${reserva.hsalidamax}:00`);
      
      // Si la fecha es inválida (ej: formato incorrecto), asumimos que no está vencido
      if (isNaN(fechaVencimiento.getTime())) return { vencido: false, minutosTarde: 0 };

      const diffMs = now.getTime() - fechaVencimiento.getTime();
      const minutosTarde = Math.floor(diffMs / 60000);

      // Si minutosTarde > 0, significa que se pasó del tiempo
      return { 
        vencido: minutosTarde > 0, 
        minutosTarde: minutosTarde > 0 ? minutosTarde : 0 
      };
    } catch (e) {
      return { vencido: false, minutosTarde: 0 };
    }
  };

  if (reservas.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-3">
          <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reservas activas</h3>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* VISTA MÓVIL (Tarjetas) */}
      <div className="block md:hidden space-y-4 p-4">
        {reservas.map((reserva) => {
          const { vencido, minutosTarde } = checkVencimiento(reserva);
          
          return (
            <div 
              key={reserva.id} 
              className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all duration-200 
                ${vencido ? 'border-red-500 ring-1 ring-red-500 shadow-red-100' : 'border-gray-200 hover:shadow-md'}
              `}
            >
              {/* Cabecera con alerta visual si está vencido */}
              <div className={`px-4 py-3 border-b flex justify-between items-center ${vencido ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-center space-x-2">
                   <span className="font-bold text-gray-900 text-lg">{reserva.placa}</span>
                   {vencido && (
                     <span className="animate-pulse bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded border border-red-200">
                       VENCIDO (+{minutosTarde} min)
                     </span>
                   )}
                </div>
                <span className="text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                  Hab: {reserva.habitacion}
                </span>
              </div>

              <div className="px-4 py-3 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Entrada</p>
                    <p className="font-medium text-gray-900">{reserva.hentrada}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Salida Max</p>
                    <p className={`font-medium ${vencido ? 'text-red-700 font-bold' : 'text-gray-900'}`}>
                      {reserva.hsalidamax}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                 {/* Sugerencia de cobro extra si está vencido */}
                 {vencido ? (
                   <span className="text-xs font-bold text-red-600">
                     Sugerir recargo
                   </span>
                 ) : (
                   <span className="text-xs text-gray-500">{reserva.vehiculo}</span>
                 )}
                <span className="text-lg font-bold text-green-600">
                  {formatMoney(reserva.valor)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* VISTA ESCRITORIO (Tabla) */}
      <div className="hidden md:block overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Habitación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiempo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservas.map((reserva) => {
              const { vencido, minutosTarde } = checkVencimiento(reserva);
              return (
                <tr key={reserva.id} className={vencido ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {reserva.placa}
                    <div className="text-xs text-gray-400 font-normal">{reserva.vehiculo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {reserva.habitacion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">In: {reserva.hentrada}</div>
                    <div className={`text-sm ${vencido ? 'text-red-700 font-bold' : 'text-gray-500'}`}>
                      Max: {reserva.hsalidamax}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vencido ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Vencido (+{minutosTarde} min)
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        En tiempo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">
                    {formatMoney(reserva.valor)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableCrearReservas;