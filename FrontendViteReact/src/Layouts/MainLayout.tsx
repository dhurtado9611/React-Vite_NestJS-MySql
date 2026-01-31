import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return (
    <div className="flex h-screen w-full bg-slate-900 overflow-hidden">
      
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />
      {/* Área de contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto relative">
           <Outlet />
        </main>
        
      </div>
    </div>
  );
};

export default MainLayout;