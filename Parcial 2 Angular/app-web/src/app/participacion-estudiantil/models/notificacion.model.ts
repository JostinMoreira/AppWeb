export interface Notificacion {
  id: string;
  usuarioId: string;
  mensaje: string;
  leido: boolean;
  fecha: Date;
}