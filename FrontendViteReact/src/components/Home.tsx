//import React from 'react';

const Home = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Bienvenido al sistema de reservas</h1>
      <p className="text-center">Gestiona tus reservas de manera fácil y rápida.</p>
      <div className="d-flex justify-content-center">
        <img src="/images/hotel.jpg" alt="Hotel" className="img-fluid rounded" style={{ maxHeight: '400px' }} />
      </div>
    </div>
  );
};

export default Home;
