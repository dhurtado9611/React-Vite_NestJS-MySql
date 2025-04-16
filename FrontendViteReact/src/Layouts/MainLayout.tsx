import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const MainLayout = () => {
  return(<div className="flex min-h-screen w-full bg-gray-900 text-white overflow-hidden">
    <Sidebar />
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout