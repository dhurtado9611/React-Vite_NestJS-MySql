import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const MainLayout = () => {
  return(<div className="flex min-h-screen w-full bg-gray-900 text-white overflow-hidden">
    <Sidebar />
      <div className="ml-16 flex-1 p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout