import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, combineLatest } from 'rxjs';
import { Publicacion, TipoPublicacion, EstadoPublicacion } from '../../../models/publicacion.model';
import { Comentario } from '../../../models/comentario.model';
import { Voto, TipoVoto } from '../../../models/voto.model';
import { Usuario } from '../../../models/usuario.model';
import { PublicacionesService } from '../../../services/publicaciones.service';
import { ComentariosService } from '../../../services/comentarios.service';
import { VotosService } from '../../../services/votos.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-detalle-publicacion',
  templateUrl: './detalle-publicacion.component.html',
  styleUrls: ['./detalle-publicacion.component.css']
})
export class DetallePublicacionComponent implements OnInit {
  publicacion$: Observable<Publicacion | null>;
  comentarios$: Observable<Comentario[]>;
  votoUsuario$: Observable<Voto | null>;
  usuario$: Observable<Usuario | null>;
  
  nuevoComentario = '';
  cargandoComentario = false;
  cargandoVoto = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicacionesService: PublicacionesService,
    private comentariosService: ComentariosService,
    private votosService: VotosService,
    private authService: AuthService
  ) {
    this.usuario$ = this.authService.getCurrentUser();
    
    this.publicacion$ = this.route.params.pipe(
      switchMap(params => this.publicacionesService.obtenerPublicacionPorId(params['id']))
    );

    this.comentarios$ = this.route.params.pipe(
      switchMap(params => this.comentariosService.obtenerComentariosPorPublicacion(params['id']))
    );

    this.votoUsuario$ = combineLatest([
      this.route.params,
      this.usuario$
    ]).pipe(
      switchMap(([params, usuario]) => {
        if (usuario) {
          return this.votosService.obtenerVotoUsuario(params['id'], usuario.id);
        }
        return new Observable(observer => observer.next(null));
      })
    );
  }

  ngOnInit(): void {}

  async agregarComentario(): Promise<void> {
    if (!this.nuevoComentario.trim()) return;

    this.cargandoComentario = true;
    
    try {
      const usuario = await this.usuario$.pipe().toPromise();
      const publicacionId = this.route.snapshot.params['id'];
      
      if (usuario) {
        const comentario: Omit<Comentario, 'id'> = {
          publicacionId,
          autorId: usuario.id,
          autorNombre: usuario.nombre,
          contenido: this.nuevoComentario.trim(),
          fecha: new Date()
        };

        await this.comentariosService.crearComentario(comentario).toPromise();
        this.nuevoComentario = '';
        
        // Actualizar contador de comentarios
        const publicacion = await this.publicacion$.pipe().toPromise();
        if (publicacion) {
          await this.publicacionesService.actualizarPublicacion(publicacionId, {
            totalComentarios: publicacion.totalComentarios + 1
          }).toPromise();
        }
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    } finally {
      this.cargandoComentario = false;
    }
  }

  async votar(tipoVoto: TipoVoto): Promise<void> {
    this.cargandoVoto = true;
    
    try {
      const usuario = await this.usuario$.pipe().toPromise();
      const publicacionId = this.route.snapshot.params['id'];
      
      if (usuario) {
        await this.votosService.votar(publicacionId, usuario.id, tipoVoto).toPromise();
      }
    } catch (error) {
      console.error('Error al votar:', error);
    } finally {
      this.cargandoVoto = false;
    }
  }

  async eliminarPublicacion(): Promise<void> {
    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      try {
        const publicacionId = this.route.snapshot.params['id'];
        await this.publicacionesService.eliminarPublicacion(publicacionId).toPromise();
        this.router.navigate(['/publicaciones']);
      } catch (error) {
        console.error('Error al eliminar publicación:', error);
      }
    }
  }

  puedeEditarPublicacion(publicacion: Publicacion, usuario: Usuario | null): boolean {
    return usuario !== null && (
      usuario.id === publicacion.autorId || 
      usuario.rol === 'autoridad'
    );
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

  getVotoClass(tipoVoto: TipoVoto, votoUsuario: Voto | null): string {
    if (votoUsuario && votoUsuario.tipoVoto === tipoVoto) {
      return tipoVoto === TipoVoto.POSITIVO ? 'voto-positivo-activo' : 'voto-negativo-activo';
    }
    return '';
  }
}