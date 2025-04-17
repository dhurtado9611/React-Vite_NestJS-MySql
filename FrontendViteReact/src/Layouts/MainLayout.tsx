import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NavbarTop from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-gray-900 text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 pt-20 px-4 sm:px-6 lg:px-8">
        <NavbarTop />
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;