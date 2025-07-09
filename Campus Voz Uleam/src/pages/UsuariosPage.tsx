import { useEffect, useState } from 'react'
import type { Usuario, CrearUsuarioInput } from '../types/Usuario'
import {obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario as eliminarUsuarioService, obtenerPerfil} from '../services/usuarioService'
import UsuarioList from '../components/UsuarioList'
import UsuarioForm from '../components/UsuarioForm'
import { useAuth } from '../context/ContextoAutenticacion'

export default function UsuariosPage() {
  const { usuario: authUser } = useAuth()
  const [perfilActual, setPerfilActual] = useState<Usuario | null>(null)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      if (authUser) {
        const perfil = await obtenerPerfil(authUser.id)
        setPerfilActual(perfil)
      }
      const lista = await obtenerUsuarios()
      setUsuarios(lista)
      setCargando(false)
    }
    cargar()
  }, [authUser])

  const guardarUsuario = async (datos: CrearUsuarioInput | Partial<Usuario>) => {
    try {
      if (usuarioEditar) {
        await actualizarUsuario(usuarioEditar.id, datos)
      } else {
        if (!datos.nombre || !datos.correo || !datos.rol) {
          alert('Faltan campos obligatorios')
          return
        }
        await crearUsuario(datos as CrearUsuarioInput)
      }
      setUsuarioEditar(null)
      setMostrarFormulario(false)
      setUsuarios(await obtenerUsuarios())
    } catch (error) {
      console.error('Error al guardar:', error)
    }
  }

const eliminarUsuario = async (id: string) => {
  try {
    console.log('Intentando eliminar ID:', id)
    await eliminarUsuarioService(id)
    const listaActualizada = await obtenerUsuarios()
    console.log('Usuarios luego de eliminar:', listaActualizada)
    setUsuarios(listaActualizada)
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    alert('No se pudo eliminar el usuario. Verifica si tienes permisos.')
  }
}

  if (cargando) return <p>Cargando...</p>
  if (perfilActual?.rol?.toLowerCase() !== 'autoridad') return <p>Acceso denegado. Solo para autoridades.</p>

  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      <button onClick={() => { setMostrarFormulario(true); setUsuarioEditar(null) }}>
        Crear nuevo usuario
      </button>

      {mostrarFormulario && (
        <UsuarioForm
          usuarioEditar={usuarioEditar}
          onGuardar={guardarUsuario}
          onCancelar={() => { setMostrarFormulario(false); setUsuarioEditar(null) }}
        />
      )}

      <UsuarioList
        usuarios={usuarios}
        onEditar={u => { setUsuarioEditar(u); setMostrarFormulario(true) }}
        onEliminar={eliminarUsuario}
      />
    </div>
  )
}