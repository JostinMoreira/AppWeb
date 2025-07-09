import { useEffect, useState } from 'react'
import { useAuth } from '../context/ContextoAutenticacion'
import { obtenerPerfil } from '../services/usuarioService'
import type { Usuario } from '../types/Usuario'
import { useNavigate } from 'react-router-dom'
import BotonVolver from '../components/BotonVolver'


export default function PerfilUsuario() {
  const { usuario } = useAuth()
  const [perfil, setPerfil] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)
  const navegar = useNavigate()

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

  if (cargando) return <p>Cargando perfil...</p>
  if (!perfil) return <p>No se encontró perfil.</p>

  return (
    <div>
    <BotonVolver />
      <h2>Mi Perfil</h2>
      <p><strong>Nombre:</strong> {perfil.nombre}</p>
      <p><strong>Correo:</strong> {perfil.correo}</p>
      <p><strong>Rol:</strong> {perfil.rol}</p>
      {perfil.facultad && <p><strong>Facultad:</strong> {perfil.facultad}</p>}
      {perfil.carrera && <p><strong>Carrera:</strong> {perfil.carrera}</p>}
      {perfil.rol === 'Estudiante' && perfil.semestre && (
        <p><strong>Semestre:</strong> {perfil.semestre}</p>
      )}
      <button onClick={() => navegar('/editar-perfil')}>Editar perfil</button>
    </div>
  )
}