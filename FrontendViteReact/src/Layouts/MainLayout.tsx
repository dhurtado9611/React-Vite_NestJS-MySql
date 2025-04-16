import { Outlet } from "react-router-dom";
import SidebarResponsive from "../components/Sidebar";

const MainLayout = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden">
      <SidebarResponsive />

      <main className="fixed inset-0 z-0 pt-16 px-4 sm:px-6 lg:px-8 lg:pl-28 overflow-y-auto">
        <div className="min-h-screen backdrop-blur-sm bg-black/30 rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
