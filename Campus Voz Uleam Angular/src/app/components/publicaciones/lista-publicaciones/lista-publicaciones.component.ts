import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PublicacionesService } from '../../../services/publicaciones.service';
import { AuthService } from '../../../services/auth.service';
import { Publicacion, TipoPublicacion, EstadoPublicacion } from '../../../models/publicacion.model';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-lista-publicaciones',
  templateUrl: './lista-publicaciones.component.html',
  styleUrls: ['./lista-publicaciones.component.css']
})
export class ListaPublicacionesComponent implements OnInit, OnDestroy {
  publicaciones: Publicacion[] = [];
  publicacionesFiltradas: Publicacion[] = [];
  usuario: Usuario | null = null;
  loading = true;
  error = '';
  
  // Filtros
  filtroTipo: TipoPublicacion | 'todos' = 'todos';
  filtroEstado: EstadoPublicacion | 'todos' = 'todos';
  busqueda = '';
  
  // Enums para el template
  tiposPublicacion = Object.values(TipoPublicacion);
  estadosPublicacion = Object.values(EstadoPublicacion);
  
  private subscriptions: Subscription[] = [];

  constructor(
    private publicacionesService: PublicacionesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener usuario actual
    const userSub = this.authService.getCurrentUser().subscribe(user => {
      this.usuario = user;
    });
    this.subscriptions.push(userSub);

    // Cargar publicaciones
    this.cargarPublicaciones();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Cambiar de private a public para que sea accesible desde el template
  cargarPublicaciones(): void {
    this.loading = true;
    this.error = '';
    
    const publicacionesSub = this.publicacionesService
      .obtenerPublicaciones()
      .subscribe({
        next: (publicaciones) => {
          this.publicaciones = publicaciones;
          this.aplicarFiltros();
          this.loading = false;
          console.log('Publicaciones cargadas:', publicaciones.length);
        },
        error: (error) => {
          console.error('Error al cargar publicaciones:', error);
          this.error = 'Error al cargar las publicaciones';
          this.loading = false;
        }
      });
    
    this.subscriptions.push(publicacionesSub);
  }

  aplicarFiltros(): void {
    let resultado = [...this.publicaciones];

    // Filtro por tipo
    if (this.filtroTipo !== 'todos') {
      resultado = resultado.filter(pub => pub.tipo === this.filtroTipo);
    }

    // Filtro por estado
    if (this.filtroEstado !== 'todos') {
      resultado = resultado.filter(pub => pub.estado === this.filtroEstado);
    }

    // Filtro por búsqueda
    if (this.busqueda.trim()) {
      const termino = this.busqueda.toLowerCase().trim();
      resultado = resultado.filter(pub => 
        pub.titulo.toLowerCase().includes(termino) ||
        pub.contenido.toLowerCase().includes(termino) ||
        pub.autorNombre.toLowerCase().includes(termino)
      );
    }

    this.publicacionesFiltradas = resultado;
  }

  onFiltroChange(): void {
    this.aplicarFiltros();
  }

  onBusquedaChange(): void {
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.filtroTipo = 'todos';
    this.filtroEstado = 'todos';
    this.busqueda = '';
    this.aplicarFiltros();
  }

  getTipoLabel(tipo: TipoPublicacion): string {
    const labels: { [key in TipoPublicacion]: string } = {
      [TipoPublicacion.QUEJA]: 'Queja',
      [TipoPublicacion.PROPUESTA]: 'Propuesta',
      [TipoPublicacion.SUGERENCIA]: 'Sugerencia',
      [TipoPublicacion.IDEA]: 'Idea'
    };
    return labels[tipo];
  }

  getTipoClass(tipo: TipoPublicacion): string {
    const classes: { [key in TipoPublicacion]: string } = {
      [TipoPublicacion.QUEJA]: 'tipo-queja',
      [TipoPublicacion.PROPUESTA]: 'tipo-propuesta',
      [TipoPublicacion.SUGERENCIA]: 'tipo-sugerencia',
      [TipoPublicacion.IDEA]: 'tipo-idea'
    };
    return classes[tipo];
  }

  getEstadoLabel(estado: EstadoPublicacion): string {
    const labels: { [key in EstadoPublicacion]: string } = {
      [EstadoPublicacion.PENDIENTE]: 'Pendiente',
      [EstadoPublicacion.APROBADA]: 'Aprobada',
      [EstadoPublicacion.RECHAZADA]: 'Rechazada',
      [EstadoPublicacion.IMPLEMENTADA]: 'Implementada'
    };
    return labels[estado];
  }

  getEstadoClass(estado: EstadoPublicacion): string {
    const classes: { [key in EstadoPublicacion]: string } = {
      [EstadoPublicacion.PENDIENTE]: 'estado-pendiente',
      [EstadoPublicacion.APROBADA]: 'estado-aprobada',
      [EstadoPublicacion.RECHAZADA]: 'estado-rechazada',
      [EstadoPublicacion.IMPLEMENTADA]: 'estado-implementada'
    };
    return classes[estado];
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  trackByPublicacion(index: number, publicacion: Publicacion): string {
    return publicacion.id;
  }
}