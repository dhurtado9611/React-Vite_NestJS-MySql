import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NavbarTop from '../components/Navbar';

const MainLayout = () => {
  return (
    // Cambiado bg-white a un color que soporte temas oscuros/claros o sea neutro
    <div className="flex h-screen w-full bg-slate-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <NavbarTop />
        {/* h-full y overflow-y-auto permite que solo el contenido haga scroll, manteniendo el Navbar fijo */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;