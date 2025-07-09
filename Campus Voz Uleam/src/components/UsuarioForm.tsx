import { useState, useEffect } from 'react'
import type { CrearUsuarioInput, Usuario } from '../types/Usuario'

interface Props {
  usuarioEditar?: Usuario | null
  onGuardar: (datos: CrearUsuarioInput) => void
  onCancelar: () => void
}

export default function UsuarioForm({ usuarioEditar, onGuardar, onCancelar }: Props) {
  const [formulario, setFormulario] = useState<CrearUsuarioInput>({
    nombre: '',
    correo: '',
    rol: 'Estudiante',
    facultad: '',
    carrera: '',
    semestre: '',
  })

  useEffect(() => {
    if (usuarioEditar) {
      setFormulario(prev => ({
        ...prev,
        nombre: usuarioEditar.nombre || '',
        correo: usuarioEditar.correo || '',
        rol: usuarioEditar.rol || 'Estudiante',
        facultad: usuarioEditar.facultad || '',
        carrera: usuarioEditar.carrera || '',
        semestre: usuarioEditar.semestre || '',
      }))
  }

  }, [usuarioEditar])
  const validarCampos = (): boolean => {
    const { nombre, correo, rol, facultad, carrera, semestre } = formulario
    if (!nombre || !correo || !rol) return false

    if (rol === 'Estudiante') return facultad && carrera && semestre ? true : false
    if (rol === 'Profesor') return facultad && carrera ? true : false
    return true // Autoridad
  }

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormulario(prev => ({ ...prev, [name]: value }))
  }

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validarCampos()) {
      alert('Por favor completa todos los campos obligatorios según el rol.')
      return
    }
    onGuardar(formulario)
  }

  return (
    <form onSubmit={enviar}>
      <input name="nombre" value={formulario.nombre} onChange={manejarCambio} placeholder="Nombre" />
      <input name="correo" value={formulario.correo} onChange={manejarCambio} placeholder="Correo" />
      <select name="rol" value={formulario.rol} onChange={manejarCambio}>
        <option value="Estudiante">Estudiante</option>
        <option value="Profesor">Profesor</option>
        <option value="Autoridad">Autoridad</option>
      </select>
      <select name="facultad" value={formulario.facultad} onChange={manejarCambio}>
        <option value="">Seleccione una facultad</option>
        <option value="Ciencias de la vida y Tegnologia">Ciencias de la vida y Tegnologia</option>
        <option value="Medicina">Medicina</option>
        <option value="Derecho">Derecho</option>
      </select>
      <input name="carrera" value={formulario.carrera} onChange={manejarCambio} placeholder="Carrera" />
      <input name="semestre" value={formulario.semestre} onChange={manejarCambio} placeholder="Semestre" />
      <button type="submit">Guardar</button>
      <button type="button" onClick={onCancelar}>Cancelar</button>
    </form>
  )
}
