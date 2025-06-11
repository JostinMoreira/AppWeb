import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Publicacion, TipoPublicacion, EstadoPublicacion } from '../../../models/publicacion.model';
import { PublicacionesService } from '../../../services/publicaciones.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-formulario-publicacion',
  templateUrl: './formulario-publicacion.component.html',
  styleUrls: ['./formulario-publicacion.component.css']
})
export class FormularioPublicacionComponent implements OnInit {
  publicacion: Partial<Publicacion> = {
    titulo: '',
    contenido: '',
    tipo: TipoPublicacion.PROPUESTA
  };
  
  tiposPublicacion = Object.values(TipoPublicacion);
  loading = false;
  error = '';
  esEdicion = false;
  publicacionId?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicacionesService: PublicacionesService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.publicacionId = this.route.snapshot.params['id'];
    this.esEdicion = !!this.publicacionId;

    if (this.esEdicion && this.publicacionId) {
      await this.cargarPublicacion();
    }
  }

  private async cargarPublicacion(): Promise<void> {
    if (!this.publicacionId) return;

    try {
      const publicacion = await this.publicacionesService
        .obtenerPublicacionPorId(this.publicacionId)
        .toPromise();
      
      if (publicacion) {
        this.publicacion = publicacion;
      }
    } catch (error) {
      console.error('Error al cargar publicación:', error);
      this.error = 'Error al cargar la publicación';
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.publicacion.titulo || !this.publicacion.contenido) {
      this.error = 'Por favor completa todos los campos obligatorios';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const usuario = await this.authService.getCurrentUser().toPromise();
      
      if (!usuario) {
        this.error = 'Debes estar autenticado para realizar esta acción';
        return;
      }

      if (this.esEdicion && this.publicacionId) {
        await this.publicacionesService.actualizarPublicacion(
          this.publicacionId,
          this.publicacion
        ).toPromise();
      } else {
        const nuevaPublicacion: Omit<Publicacion, 'id'> = {
          titulo: this.publicacion.titulo!,
          contenido: this.publicacion.contenido!,
          tipo: this.publicacion.tipo!,
          autorId: usuario.id,
          autorNombre: usuario.nombre,
          estado: EstadoPublicacion.PENDIENTE,
          fechaCreacion: new Date(),
          votosPositivos: 0,
          votosNegativos: 0,
          totalComentarios: 0
        };

        await this.publicacionesService.crearPublicacion(nuevaPublicacion).toPromise();
      }

      this.router.navigate(['/publicaciones']);
    } catch (error) {
      console.error('Error al guardar publicación:', error);
      this.error = 'Error al guardar la publicación';
    } finally {
      this.loading = false;
    }
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
}