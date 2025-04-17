import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Reserva } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface GraficaReservasProps {
  reservas: Reserva[];
}

const GraficaReservas: React.FC<GraficaReservasProps> = ({ reservas }) => {
  const [data, setData] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    // Contar las reservas por habitación
    const conteoHabitaciones: { [key: number]: number } = reservas.reduce(
      (acc, reserva) => {
        acc[reserva.habitacion] = (acc[reserva.habitacion] || 0) + 1;
        return acc;
      },
      {} as { [key: number]: number }
    );

    setData(conteoHabitaciones);
  }, [reservas]);

  const labels = Object.keys(data).map(Number);
  const valores = Object.values(data);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Cantidad de Reservas',
        data: valores,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        borderRadius: 4, // Bordes redondeados
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        ticks: { color: '#333' },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#333' },
        grid: { color: 'rgba(200, 200, 200, 0.3)' },
      },
    },
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">Reservas por Habitación</h2>
      <div className="d-flex justify-content-center">
        <div style={{ width: '90%', height: '300px' }}>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default GraficaReservas;
