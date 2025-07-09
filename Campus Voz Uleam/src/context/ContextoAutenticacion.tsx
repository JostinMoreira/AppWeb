import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Session, User } from '@supabase/supabase-js'

interface ContextoTipo {
  sesion: Session | null
  usuario: User | null
  cargando: boolean
  cerrarSesion: () => void
}

const ContextoAutenticacion = createContext<ContextoTipo | undefined>(undefined)

export const ProveedorAutenticacion = ({ children }: { children: ReactNode }) => {
  const [sesion, setSesion] = useState<Session | null>(null)
  const [usuario, setUsuario] = useState<User | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session)
      setUsuario(data.session?.user ?? null)
      setCargando(false)
    })

    const { data: subscripcion } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      setSesion(sesion)
      setUsuario(sesion?.user ?? null)
    })

    return () => subscripcion?.subscription.unsubscribe()
  }, [])

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    setSesion(null)
    setUsuario(null)
  }

  return (
    <ContextoAutenticacion.Provider value={{ sesion, usuario, cargando, cerrarSesion }}>
      {children}
    </ContextoAutenticacion.Provider>
  )
}

export const usarAutenticacion = () => {
  const contexto = useContext(ContextoAutenticacion)
  if (!contexto) throw new Error('usarAutenticacion debe usarse dentro de ProveedorAutenticacion')
  return contexto
}

export function useAuth() {
  const contexto = useContext(ContextoAutenticacion)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un ProveedorAutenticacion')
  }
  return contexto
}