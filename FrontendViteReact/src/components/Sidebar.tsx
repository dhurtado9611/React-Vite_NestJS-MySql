import {
    Home,
    BarChart,
    Paintbrush2,
    Megaphone,
    Mail,
    Download,
    Bell
  } from 'lucide-react'
  
  const Sidebar = () => {
    return (
      <div className="h-screen w-16 bg-black text-white flex flex-col justify-between items-center py-4 fixed left-0 top-0 z-50">
        <div className="flex flex-col gap-6">
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-xl font-bold">
            S
          </div>
          <Home className="w-6 h-6 hover:text-yellow-400 cursor-pointer" />
          <Paintbrush2 className="w-6 h-6 hover:text-yellow-400 cursor-pointer" />
          <Megaphone className="w-6 h-6 bg-white text-black p-1 rounded-full" />
          <Mail className="w-6 h-6 hover:text-yellow-400 cursor-pointer" />
          <Download className="w-6 h-6 hover:text-yellow-400 cursor-pointer" />
          <div className="relative">
            <Bell className="w-6 h-6 hover:text-yellow-400 cursor-pointer" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
          <img
            src="https://i.pravatar.cc/40"
            alt="user"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    )
  }
  
  export default Sidebar  