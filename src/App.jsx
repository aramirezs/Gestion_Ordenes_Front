import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import OrdersPage from './pages/OrdersPage'
import SidebarLayout from './layout/SidebarLayout'
import { useAuthStore } from './stores/authStore'

// Toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/ordenes" : "/login"} />} />
        <Route path="/login" element={<LoginPage />} />
        {isAuthenticated && (
          <Route element={<SidebarLayout />}>
            <Route path="/ordenes" element={<OrdersPage />} />
          </Route>
        )}
      </Routes>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  )
}
