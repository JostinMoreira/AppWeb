import { supabase } from '../lib/supabaseClient'
import type { Usuario, ActualizarUsuarioInput } from '../types/Usuario'
import type { CrearUsuarioInput } from '../types/Usuario'

export const obtenerPerfil = async (id: string): Promise<Usuario | null> => {
  const { data, error } = await supabase.from('usuarios').select('*').eq('id', id).single()
  if (error) {
    console.error('Error al obtener perfil:', error)
    return null
  }
  return data
}

export const actualizarPerfil = async (id: string, datos: ActualizarUsuarioInput): Promise<boolean> => {
  const { error } = await supabase
    .from('usuarios')
    .update(datos)
    .eq('id', id)

  if (error) {
    console.error('Error al actualizar perfil:', error)
    return false
  }

  return true
}

// Obtener todos los usuarios
export const obtenerUsuarios = async (): Promise<Usuario[]> => {
  const { data, error } = await supabase.from('usuarios').select('*')
  if (error) throw error
  return data
}

// Crear usuario
export const crearUsuario = async (usuario: CrearUsuarioInput) => {
  const { error } = await supabase.from('usuarios').insert(usuario)
  if (error) throw error
}

// Actualizar usuario
export const actualizarUsuario = async (id: string, datos: ActualizarUsuarioInput) => {
  const { error } = await supabase.from('usuarios').update(datos).eq('id', id)
  if (error) throw error
}

// Eliminar usuario
export const eliminarUsuario = async (id: string) => {
  const { error, data } = await supabase.from('usuarios').delete().eq('id', id)
  if (error) {
    console.error('Supabase error:', error)
    throw error
  }
  console.log('Usuario eliminado:', data)
}
