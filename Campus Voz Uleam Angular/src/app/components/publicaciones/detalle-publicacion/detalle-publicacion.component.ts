import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PublicacionesService } from '../../../services/publicaciones.service';
import { AuthService } from '../../../services/auth.service';
import { Publicacion, TipoPublicacion, EstadoPublicacion } from '../../../models/publicacion.model';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-detalle-publicacion',
  templateUrl: './detalle-publicacion.component.html',
  styleUrls: ['./detalle-publicacion.component.css']
})
export class DetallePublicacionComponent implements OnInit, OnDestroy {
  publicacion: Publicacion | null = null;
  usuario: Usuario | null = null;
  loading = true;
  error = '';

  public esAutor: boolean = false;
  public esAdmin: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicacionesService: PublicacionesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener usuario actual
    const userSub = this.authService.getCurrentUser().subscribe(user => {
      this.usuario = user;
    });
    this.subscriptions.push(userSub);

    // Obtener ID de la publicación de la URL
    const publicacionId = this.route.snapshot.params['id'];
    if (publicacionId) {
      this.cargarPublicacion(publicacionId);
    } else {
      this.error = 'ID de publicación no válido';
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private cargarPublicacion(publicacionId: string): void {
    const publicacionSub = this.publicacionesService
      .obtenerPublicacionPorId(publicacionId)
      .subscribe({
        next: (publicacion) => {
          if (publicacion) {
            this.publicacion = publicacion;
            console.log('Publicación cargada:', publicacion);
            // Determinar si el usuario es el autor
            this.esAutor = !!(this.usuario && this.publicacion && this.usuario.id === this.publicacion.autorId);
            // Determinar si el usuario es admin (ajusta la lógica según tu modelo)
            this.esAdmin = !!(this.usuario && this.usuario.rol && this.usuario.rol.toLowerCase() === 'admin');
          } else {
            this.error = 'Publicación no encontrada';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar publicación:', error);
          this.error = 'Error al cargar la publicación';
          this.loading = false;
        }
      });
    
    this.subscriptions.push(publicacionSub);
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

  getEstadoLabel(estado: EstadoPublicacion): string {
    const labels: { [key in EstadoPublicacion]: string } = {
      [EstadoPublicacion.PENDIENTE]: 'Pendiente',
      [EstadoPublicacion.APROBADA]: 'Aprobada',
      [EstadoPublicacion.RECHAZADA]: 'Rechazada',
      [EstadoPublicacion.IMPLEMENTADA]: 'Implementada'
    };
    return labels[estado];
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  puedeEditarPublicacion(): boolean {
    if (!this.usuario || !this.publicacion) {
      return false;
    }
    return this.usuario.id === this.publicacion.autorId;
  }

  async eliminarPublicacion(): Promise<void> {
    if (!this.publicacion?.id || !confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      return;
    }

    try {
      await this.publicacionesService.eliminarPublicacion(this.publicacion.id);
      this.router.navigate(['/publicaciones']);
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
      this.error = 'Error al eliminar la publicación';
    }
  }
}