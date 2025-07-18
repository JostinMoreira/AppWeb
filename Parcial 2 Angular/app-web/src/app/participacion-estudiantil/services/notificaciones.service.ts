import { Injectable } from '@angular/core';
import { Notificacion } from '../models/notificacion.model';

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private notificaciones: Notificacion[] = [];

  agregar(notificacion: Notificacion) {}
  obtenerPorUsuario(usuarioId: string): Notificacion[] { return []; }
  marcarComoLeido(id: string) {}
}
