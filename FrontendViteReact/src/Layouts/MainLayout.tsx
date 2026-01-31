import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return (
    // Mantenemos el fondo oscuro y evitamos el scroll global del body con overflow-hidden
    <div className="flex h-screen w-full bg-slate-900 overflow-hidden">
      
      {/* El Sidebar se mantiene fijo a la izquierda */}
      <Sidebar />

      {/* Contenedor principal sin NavbarTop */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* El componente main ahora es el único encargado del scroll.
          He añadido pt-8 (padding top) para compensar la ausencia del Navbar
          y que el contenido no quede pegado al borde superior.
        */}
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;