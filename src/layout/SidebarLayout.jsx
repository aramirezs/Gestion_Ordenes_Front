import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import {
  ClipboardList,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

export default function SidebarLayout() {
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNavigation = (path) => {
    navigate(path)
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white shadow-md border-r text-[#2b3a59] p-4 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div>
          <div className="flex items-center gap-2 mb-8">
            <img src="/images/logo-compra3.jpg" alt="Orden" className="h-10" />
            <h2 className="text-xl font-bold text-[#0057a3]">ORDEN SOFT</h2>
          </div>
          <nav className="flex flex-col gap-3 text-sm font-medium">
            <button
              onClick={() => handleNavigation('/ordenes')}
              className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[#e6f0fb] hover:text-[#0057a3] transition-all"
            >
              <ClipboardList size={18} /> Gestión de Ordenes
            </button>
          </nav>
        </div>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-2 py-2 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-[#f8fafd] overflow-y-auto">
        {/* Top bar for mobile */}
        <div className="md:hidden flex items-center justify-between p-4 border-b shadow-sm bg-white sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h2 className="text-lg font-bold text-[#0057a3]">ORDEN SOFT</h2>
          <div className="w-6" />
        </div>

        <Outlet />
      </main>
    </div>
  )
}
