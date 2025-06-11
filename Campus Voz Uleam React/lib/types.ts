export type Role = "student" | "professor" | "authority"

export interface UserData {
  uid: string
  email: string
  role: Role
/** Usuario activo/inactivo para bloquear acceso */
  active?: boolean
  nombres?: string
  celular?: string
  ciudad?: string
  nacionalidad?: string
  facultad?: string
  carrera?: string
  nivel?: string
  edad?: number
  createdAt?: number
  /** Reputación basada en participación e impacto positivo */
  reputation?: number
}

export interface Comment {
  id: string
  uid: string
  authorEmail: string
  comment: string
  createdAt: number
}

export interface Post {
  id: string
  uid: string
  authorEmail: string
  title: string
  type: string
  content: string
  createdAt: number
  votes: string[]
  comments: Comment[]
  institutionalResponse?: string
  status?: 'sin_responder' | 'en_seguimiento' | 'respondida' | 'cerrada'
}
