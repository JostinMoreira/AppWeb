export interface Usuario {
  id: string
  nombre: string
  correo: string
  rol: 'Estudiante' | 'Profesor' | 'Autoridad'
  facultad?: string
  carrera?: string
  semestre?: string
}

export type CrearUsuarioInput = Omit<Usuario, 'id'>
export type ActualizarUsuarioInput = Partial<Omit<Usuario, 'id'>>
