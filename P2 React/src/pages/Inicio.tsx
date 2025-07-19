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
      <h1>Campus Voz Uleam</h1>
      <h2>Bienvenido, {perfil.nombre} ({perfil.rol})</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Link to="/perfil">
          <button type="button" className="boton-estilizado">Perfil</button>
        </Link>
        <Link to="../componentes/Notificaciones">
          <button type="button" className="boton-estilizado">🔔</button>
        </Link>
        {perfil.rol?.toLowerCase() === 'autoridad' && (
          <>
            <Link to="/usuarios"> <button type="button" className="boton-estilizado">Gestion Usuarios</button></Link>
          </>
        )}
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </nav>
    </div>
  )
}