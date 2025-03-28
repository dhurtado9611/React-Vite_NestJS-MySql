import React, { useEffect } from 'react';
import './Home.css';
import api from '../services/api';

const Home: React.FC = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/'); // Ruta base de tu API en Render
        console.log(response.data); // Muestra la respuesta en consola
      } catch (error) {
        console.error('Error al conectar con el backend:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-container">
      <div className="overlay">
        <div className="content">
          <h1 className="display-4">¡Bienvenido!</h1>
          <p className="lead">Administra tus reservas de manera fácil y rápida.</p>
          <a href="/reservas" className="btn btn-primary btn-lg">Ir a Reservas</a>
        </div>
      </div>
    </div>
  );
};

export default Home;