export interface Comentario {
  id: string;
  publicacionId: string;
  autorId: string;
  autorNombre: string;
  contenido: string;
  fechaCreacion: Date;
  editado: boolean;
  fechaEdicion?: Date;
}