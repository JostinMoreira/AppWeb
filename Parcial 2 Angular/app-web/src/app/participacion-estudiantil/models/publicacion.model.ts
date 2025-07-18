export interface Publicacion {
  id: string;
  titulo: string;
  contenido: string;
  autorId: string;
  fechaCreacion: Date;
  publicada: boolean;
}