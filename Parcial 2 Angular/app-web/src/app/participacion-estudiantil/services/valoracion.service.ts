import { Injectable } from '@angular/core';
import { Valoracion } from '../models/valoracion.model';

@Injectable({ providedIn: 'root' })
export class ValoracionService {
  private valoraciones: Valoracion[] = [];

  valorar(valoracion: Valoracion) {}
  obtenerValoracion(publicacionId: string, usuarioId: string): Valoracion | undefined {
    return undefined;
  }
}