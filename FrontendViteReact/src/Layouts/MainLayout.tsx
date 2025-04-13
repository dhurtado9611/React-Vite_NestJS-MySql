// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const MainLayout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen text-black">
      <Sidebar />

      <div className="ml-16 flex-1 p-4"> {/* Margen igual al ancho del sidebar */}
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout