import React from 'react';
import './Home.css';

const Home: React.FC = () => {
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
}

export default Home;