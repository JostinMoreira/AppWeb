import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Publicacion, TipoPublicacion, EstadoPublicacion } from 'src/app/models/publicacion.model';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { AuthService } from "src/app/services/auth.service";
@Component({
  selector: 'app-lista-publicaciones',
  templateUrl: './lista-publicaciones.component.html',
  styleUrls: ['./lista-publicaciones.component.css']
})
export class ListaPublicacionesComponent implements OnInit {
  publicaciones$: Observable<Publicacion[]>;
  filtroTipo$ = new BehaviorSubject<TipoPublicacion | ''>('');
  filtroEstado$ = new BehaviorSubject<EstadoPublicacion | ''>('');
  busqueda$ = new BehaviorSubject<string>('');
  
  tiposPublicacion = Object.values(TipoPublicacion);
  estadosPublicacion = Object.values(EstadoPublicacion);
  
  constructor(
    private publicacionesService: PublicacionesService,
    public authService: AuthService
  ) {
    this.publicaciones$ = combineLatest([
      this.filtroTipo$.pipe(startWith('')),
      this.filtroEstado$.pipe(startWith('')),
      this.busqueda$.pipe(startWith(''))
    ]).pipe(
      map(([tipo, estado, busqueda]) => ({
        tipo: tipo || undefined,
        estado: estado || undefined,
        busqueda: busqueda || undefined,
        limite: 20
      })),
      map(filtros => this.publicacionesService.obtenerPublicaciones(filtros)),
      map(obs => obs)
    );
  }

  ngOnInit(): void {}

  onFiltroTipoChange(tipo: string): void {
    this.filtroTipo$.next(tipo as TipoPublicacion);
  }

  onFiltroEstadoChange(estado: string): void {
    this.filtroEstado$.next(estado as EstadoPublicacion);
  }

  onBusquedaChange(termino: string): void {
    this.busqueda$.next(termino);
  }

  getTipoLabel(tipo: TipoPublicacion): string {
    const labels = {
      [TipoPublicacion.QUEJA]: 'Queja',
      [TipoPublicacion.PROPUESTA]: 'Propuesta',
      [TipoPublicacion.SUGERENCIA]: 'Sugerencia',
      [TipoPublicacion.IDEA]: 'Idea'
    };
    return labels[tipo];
  }

  getEstadoLabel(estado: EstadoPublicacion): string {
    const labels = {
      [EstadoPublicacion.PENDIENTE]: 'Pendiente',
      [EstadoPublicacion.EN_REVISION]: 'En Revisión',
      [EstadoPublicacion.RESPONDIDA]: 'Respondida',
      [EstadoPublicacion.CERRADA]: 'Cerrada'
    };
    return labels[estado];
  }

  getEstadoClass(estado: EstadoPublicacion): string {
    const classes = {
      [EstadoPublicacion.PENDIENTE]: 'estado-pendiente',
      [EstadoPublicacion.EN_REVISION]: 'estado-revision',
      [EstadoPublicacion.RESPONDIDA]: 'estado-respondida',
      [EstadoPublicacion.CERRADA]: 'estado-cerrada'
    };
    return classes[estado];
  }
}