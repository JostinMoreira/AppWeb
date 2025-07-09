import { useEffect, useState } from 'react'
import { useAuth } from '../context/ContextoAutenticacion'
import { obtenerPerfil, actualizarPerfil } from '../services/usuarioService'
import type { Usuario } from '../types/Usuario'
import { useNavigate } from 'react-router-dom'
import BotonVolver from '../components/BotonVolver'

export default function EditarPerfil() {
  const { usuario } = useAuth()
  const [perfil, setPerfil] = useState<Usuario | null>(null)
  const [mensaje, setMensaje] = useState('')
  const navegar = useNavigate()

  useEffect(() => {
    const cargarPerfil = async () => {
      if (usuario) {
        const datos = await obtenerPerfil(usuario.id)
        setPerfil(datos)
      }
    }
    cargarPerfil()
  }, [usuario])

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (perfil) {
      setPerfil({ ...perfil, [e.target.name]: e.target.value })
    }
  }

  const guardarCambios = async () => {
    if (usuario && perfil) {
      const exito = await actualizarPerfil(usuario.id, perfil)
      if (exito) {
        setMensaje('Perfil actualizado correctamente')
        setTimeout(() => navegar('/perfil'), 1500)
      } else {
        setMensaje('Error al actualizar perfil')
      }
    }
  }

  if (!perfil) return <p>Cargando...</p>

  return (
    <div>
      <BotonVolver />
      <h2>Editar Perfil</h2>
      <input name="nombre" value={perfil.nombre} onChange={manejarCambio} placeholder="Nombre" />
      <input name="correo" value={perfil.correo} onChange={manejarCambio} placeholder="Correo" />
      <select name="rol" value={perfil.rol} onChange={manejarCambio}>
        <option value="Estudiante">Estudiante</option>
        <option value="Profesor">Profesor</option>
        <option value="Autoridad">Autoridad</option>
      </select>
      <select name="facultad" value={perfil.facultad} onChange={manejarCambio}>
        <option value="">Seleccione una facultad</option>
        <option value="Ciencias de la vida y Tegnologia">Ciencias de la vida y Tegnologia</option>
        <option value="Medicina">Medicina</option>
        <option value="Derecho">Derecho</option>
      </select>
      <input name="carrera" value={perfil.carrera ?? ''} onChange={manejarCambio} placeholder="Carrera" />
      <input name="semestre" value={perfil.semestre ?? ''} onChange={manejarCambio} placeholder="Semestre" />
      <button onClick={guardarCambios}>Guardar cambios</button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  )
}
