export interface Comentario {
  id: string;
  publicacionId: string;
  autorId: string;
  contenido: string;
  fechaCreacion: Date;
  publicado: boolean;
}