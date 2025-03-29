import Carousel from '../components/Carousel';

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
      {/* Saludo */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">
          ¡Bienvenido a nuestra plataforma de reservas!
        </h1>
      </div>

      {/* Carrusel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 relative z-50">
        <Carousel />
      </div>
    </div>
  );
};

export default Home;