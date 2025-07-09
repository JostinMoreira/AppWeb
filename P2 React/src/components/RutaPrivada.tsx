import { Navigate } from 'react-router-dom'
import { usarAutenticacion } from '../context/ContextoAutenticacion'
import type { ReactNode } from 'react'

export const RutaPrivada = ({ children }: { children: ReactNode }) => {
  const { usuario, cargando } = usarAutenticacion()

  if (cargando) return <p>Cargando...</p>
  return usuario ? children : <Navigate to="/iniciar-sesion" />
}