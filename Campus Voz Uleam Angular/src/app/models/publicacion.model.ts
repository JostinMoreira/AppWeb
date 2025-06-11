export enum TipoPublicacion {
  QUEJA = 'queja',
  PROPUESTA = 'propuesta',
  SUGERENCIA = 'sugerencia',
  IDEA = 'idea'
}

export enum EstadoPublicacion {
  PENDIENTE = 'pendiente',
  APROBADA = 'aprobada',
  RECHAZADA = 'rechazada',
  IMPLEMENTADA = 'implementada'
}

export interface Publicacion {
  id: string;
  titulo: string;
  contenido: string;
  tipo: TipoPublicacion;
  autorId: string;
  autorNombre: string;
  estado: EstadoPublicacion;
  fechaCreacion: Date;
  votosPositivos: number;
  votosNegativos: number;
  totalComentarios: number;
}