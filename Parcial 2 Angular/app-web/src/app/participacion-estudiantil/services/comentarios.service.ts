import { Injectable } from '@angular/core';
import { Comentario } from '../models/comentario.model';

@Injectable({ providedIn: 'root' })
export class ComentariosService {
  private comentarios: Comentario[] = [];

  crear(comentario: Comentario) {}
  editar(id: string, data: Partial<Comentario>) {}
  eliminar(id: string) {}
  listar(publicacionId: string): Comentario[] { return []; }
}