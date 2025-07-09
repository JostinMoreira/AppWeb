import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'



export default function Registro() {
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [nombre, setNombre] = useState('')
  const [rol, setRol] = useState('Estudiante')
  const [facultad, setFacultad] = useState('')
  const [carrera, setCarrera] = useState('')
  const [semestre, setSemestre] = useState('')
  const [error, setError] = useState('')
  const navegar = useNavigate()

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Registrar en auth
    const { data, error: errorAuth } = await supabase.auth.signUp({
      email: correo,
      password: clave
    })

    if (errorAuth) {
      setError(errorAuth.message)
      return
    }

    const usuarioId = data.user?.id

    // 2. Insertar en la tabla usuarios
    const { error: errorInsertar } = await supabase.from('usuarios').insert({
      id: usuarioId,
      nombre,
      correo,
      rol,
      facultad,
      carrera,
      semestre
    })

    if (errorInsertar) {
      setError('Error al guardar el perfil: ' + errorInsertar.message)
      return
    }

    navegar('/iniciar-sesion')
  }

  return (
    <form onSubmit={manejarRegistro}>
      <h2>Registro</h2>

      <input value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo" />
      <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} placeholder="Contraseña" />
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo" />

      <select value={rol} onChange={(e) => setRol(e.target.value)}>
        <option value="Estudiante">Estudiante</option>
        <option value="Profesor">Profesor</option>
        <option value="Autoridad">Autoridad</option>
      </select>

      {/* Estos campos pueden dejarse vacíos si no aplican */}
      <input value={facultad} onChange={(e) => setFacultad(e.target.value)} placeholder="Facultad" />
      <input value={carrera} onChange={(e) => setCarrera(e.target.value)} placeholder="Carrera" />
      <input value={semestre} onChange={(e) => setSemestre(e.target.value)} placeholder="Semestre" />

      <button type="submit">Registrarse</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
    
  )
}
