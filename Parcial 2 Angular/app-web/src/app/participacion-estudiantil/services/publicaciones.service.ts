import { Injectable } from '@angular/core';
import { Publicacion } from '../models/publicacion.model';

@Injectable({ providedIn: 'root' })
export class PublicacionesService {
  private publicaciones: Publicacion[] = [];

  crear(publicacion: Publicacion) {}
  editar(id: string, data: Partial<Publicacion>) {}
  eliminar(id: string) {}
  listar(): Publicacion[] { return []; }
}