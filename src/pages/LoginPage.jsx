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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Usuario" value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 mb-4 w-full" />
          <input type="password" placeholder="Contraseña" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 w-full" />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}
