import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import authService from '../services/authService'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = await authService.login(username, password)
      login(token)
      navigate('/ordenes')
    } catch (err) {
      setError("Credenciales inválidas")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm sm:max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src="/images/logo-compra3.jpg" alt="Logo" className="h-25 mb-2" />
          <h1 className="text-xl sm:text-2xl font-bold text-[#0057a3]">Gestión de Órdenes</h1>
        </div>

        <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#0057a3]"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#0057a3]"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-[#0057a3] hover:bg-[#004080] text-white py-2 px-4 rounded w-full transition"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}
