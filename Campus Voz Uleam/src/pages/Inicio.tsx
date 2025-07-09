import { useEffect, useState } from 'react'
import { useAuth } from '../context/ContextoAutenticacion'
import { obtenerPerfil } from '../services/usuarioService'
import type { Usuario } from '../types/Usuario'
import {Link } from 'react-router-dom'

export default function Inicio() {
  const { usuario, cerrarSesion } = useAuth()
  const [perfil, setPerfil] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarPerfil = async () => {
      if (usuario) {
        const datos = await obtenerPerfil(usuario.id)
        setPerfil(datos)
      }
      setCargando(false)
    }
    cargarPerfil()
  }, [usuario])

  if (cargando) return <p>Cargando...</p>
  if (!perfil) return <p>Error cargando perfil</p>

  // Para depuración
  console.log('ROL DEL PERFIL:', perfil.rol)

  return (
    <div>
      <h2>Bienvenido, {perfil.nombre} ({perfil.rol})</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link to="/perfil">🧑‍💼 Ver / Editar Perfil</Link>
        <Link to="/notificaciones">🔔 Ver Notificaciones</Link>
        {perfil.rol?.toLowerCase() === 'autoridad' && (
          <>
            <Link to="/usuarios">👥 Gestión de Usuarios</Link>
            <Link to="/respuestas">📢 Respuestas Institucionales</Link>
          </>
        )}
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </nav>
    </div>
  )
}