import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NavbarTop from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-grey text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 px-0 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;