import React from 'react';

// Definimos la interfaz aquí también para asegurar tipado fuerte
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

interface Props {
  reservas: Reserva[];
  fetchReservas: () => void;
}

const TableCrearReservas: React.FC<Props> = ({ reservas }) => {
  
  // Función auxiliar para formatear dinero
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  };

  // Si no hay datos, mostramos un estado vacío elegante
  if (reservas.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-3">
          <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reservas activas</h3>
        <p className="mt-1 text-sm text-gray-500">Comienza registrando un vehículo en el formulario.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      
      {/* ==========================================
          VISTA MÓVIL (Tarjetas)
          Se muestra solo en pantallas pequeñas (block md:hidden)
      ========================================== */}
      <div className="block md:hidden space-y-4 p-4">
        {reservas.map((reserva) => (
          <div key={reserva.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            
            {/* Cabecera de la Tarjeta: Placa y Habitación */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                 <span className="font-bold text-gray-900 text-lg">{reserva.placa}</span>
                 <span className="text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-200 px-2 py-0.5 rounded-md">
                   {reserva.vehiculo}
                 </span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Hab: {reserva.habitacion}
              </span>
            </div>

            {/* Cuerpo de la Tarjeta: Detalles */}
            <div className="px-4 py-3 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Entrada</p>
                  <p className="font-medium text-gray-900">{reserva.hentrada}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Salida Max</p>
                  <p className="font-medium text-red-600">{reserva.hsalidamax}</p>
                </div>
              </div>
              
              {reserva.observaciones && (
                <div className="pt-2">
                  <p className="text-gray-500 text-xs">Observaciones</p>
                  <p className="text-gray-700 text-sm italic">"{reserva.observaciones}"</p>
                </div>
              )}
            </div>

            {/* Pie de la Tarjeta: Valor y Estado */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Colab: {reserva.colaborador}
              </span>
              <span className="text-lg font-bold text-green-600">
                {formatMoney(reserva.valor)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ==========================================
          VISTA ESCRITORIO (Tabla Clásica)
          Se muestra solo en pantallas medianas hacia arriba (hidden md:block)
      ========================================== */}
      <div className="hidden md:block overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehículo / Placa
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Habitación
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horarios
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Observaciones
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservas.map((reserva) => (
              <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500">
                      {/* Icono simple de auto */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{reserva.placa}</div>
                      <div className="text-sm text-gray-500">{reserva.vehiculo}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    {reserva.habitacion}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">In: {reserva.hentrada}</div>
                  <div className="text-sm text-red-500 text-xs">Max: {reserva.hsalidamax}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 truncate max-w-xs" title={reserva.observaciones}>
                    {reserva.observaciones || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">
                  {formatMoney(reserva.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableCrearReservas;