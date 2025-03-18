import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficaReservas = () => {
  const [data, setData] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/reservas');
        const reservas = response.data;

        // Contar las reservas por habitación
        const conteoHabitaciones: { [key: number]: number } = {};
        reservas.forEach((reserva: any) => {
          const habitacion = reserva.habitacion;
          conteoHabitaciones[habitacion] = (conteoHabitaciones[habitacion] || 0) + 1;
        });

        setData(conteoHabitaciones);
      } catch (error) {
        console.error('Error al obtener los datos de las reservas:', error);
      }
    };

    fetchData();
  }, []);

  const labels = Object.keys(data);
  const valores = Object.values(data);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Cantidad de Reservas',
        data: valores,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">Reservas por Habitación</h2>
      <div className="d-flex justify-content-center">
        <div style={{ width: '800px', height: '600px' }}>
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default GraficaReservas;
