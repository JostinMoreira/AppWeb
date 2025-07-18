export interface Valoracion {
  id: string;
  publicacionId: string;
  usuarioId: string;
  tipo: 'like' | 'dislike';
}