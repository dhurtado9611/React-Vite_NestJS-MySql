import Carousel from '../components/Carousel'; 

const Home = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white relative">
      {/* Saludo */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <h1 className="text-4xl font-bold">¡Bienvenido a nuestra plataforma de reservas!</h1>
      </div>
      
      {/* Carrusel */}
      <div className="m-3 w-1/2 flex items-center justify-center relative z-50"> {/* Asegurar que el carrusel esté encima */}
        <Carousel />
      </div>
    </div>
  );
};

export default Home;
