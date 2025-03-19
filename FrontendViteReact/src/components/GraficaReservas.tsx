import { Reserva } from './types';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  reservas: Reserva[];
}

const GraficaReservas: React.FC<Props> = ({ reservas }) => {
  const data = reservas.reduce(
    (acc, reserva) => {
      acc[reserva.habitacion] = (acc[reserva.habitacion] || 0) + 1;
      return acc;
    },
    {} as { [key: number]: number }
  );

  const labels = Object.keys(data).map(Number);
  const valores = Object.values(data);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Cantidad de Reservas',
        data: valores,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgb(255, 10, 10)',
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
