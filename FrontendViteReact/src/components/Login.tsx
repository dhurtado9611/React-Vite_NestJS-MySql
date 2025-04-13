import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import FormularioTurno from './FormularioTurno'
import { FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const Login = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState<string | null>(null)
  const [turnoIniciado, setTurnoIniciado] = useState(false)
  const [mostrarModalTurno, setMostrarModalTurno] = useState(false)
  const [datosTurno, setDatosTurno] = useState<null | {
    colaborador: string
    turno: string
    fecha: string
  }>(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.post('/auth/login', { username, password })
      const {
        access_token,
        user: { rol, username: nombreUsuario, id }
      } = response.data

      localStorage.setItem('token', access_token)
      localStorage.setItem('rol', rol)
      localStorage.setItem('username', nombreUsuario)
      localStorage.setItem('userId', id.toString())

      setRol(rol)

      if (rol === 'invitado') {
        setMostrarModalTurno(true)
      } else {
        navigate('/reservas')
      }
    } catch (error) {
      console.error(error)
      setError('Usuario o contraseña incorrectos')
    }
  }

  const handleTurnoSubmit = (data: { colaborador: string; turno: string; fecha: string }) => {
    setDatosTurno(data)
    setTurnoIniciado(true)
    setMostrarModalTurno(false)
    navigate('/crear-reservas')
  }

  const handleCerrarModal = () => {
    setMostrarModalTurno(false)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-white/10 backdrop-blur-md border border-red-600 text-white p-6 rounded-2xl w-[350px] shadow-xl relative"
        >
          <h2 className="text-xl font-semibold mb-4 text-center text-red-500">Inicio de Sesión</h2>

          {error && (
            <div className="bg-red-600 text-white px-4 py-2 rounded-md text-sm text-center mb-3">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm mb-1">
                Usuario
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Tu usuario"
                className="w-full px-4 py-2 bg-black/70 border border-red-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-1">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-black/70 border border-red-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>
        </motion.div>
      </AnimatePresence>

      {mostrarModalTurno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="absolute top-4 right-4">
            <button onClick={handleCerrarModal} className="text-white text-2xl hover:text-red-500">
              <FaTimes />
            </button>
          </div>
          <FormularioTurno onSubmit={handleTurnoSubmit} />
        </div>
      )}
    </div>
  )
}

export default Login