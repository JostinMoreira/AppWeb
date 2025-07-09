import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'


export default function IniciarSesion() {
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const navegar = useNavigate()

  const manejarInicio = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email: correo, password: clave })
    if (error) {
      setError(error.message)
    } else {
      navegar('/inicio')
    }
  }

  return (
    <form onSubmit={manejarInicio}>
      <div className="bg-campus-header py-3 px-4 border-b border-gray-300">
        <div className="text-center">
          <h1 className="text-black font-semibold text-lg sm:text-xl">Campus Voz Uleam</h1>
          <p className="text-black text-sm sm:text-base">
            "Universidad Laica Eloy Alfaro de Manabí"
          </p>
        </div>
      </div>
      <h2>Iniciar Sesión</h2>
      <input value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo" />
      <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} placeholder="Contraseña" />
      <button type="submit">Entrar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
      </p>
    </form>
  )
}
