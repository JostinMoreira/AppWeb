import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComentariosService } from '../../services/comentarios.service';
import { AuthService } from '../../services/auth.service';
import { Comentario } from '../../models/comentario.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit, OnDestroy {
  @Input() publicacionId!: string;
  
  comentarios: Comentario[] = [];
  nuevoComentario = '';
  usuario: Usuario | null = null;
  loading = false;
  error = '';
  editandoComentario: string | null = null;
  contenidoEditado = '';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private comentariosService: ComentariosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener usuario actual
    const userSub = this.authService.getCurrentUser().subscribe(user => {
      this.usuario = user;
    });
    this.subscriptions.push(userSub);

    // Cargar comentarios
    this.cargarComentarios();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private cargarComentarios(): void {
    if (!this.publicacionId) return;

    const comentariosSub = this.comentariosService
      .obtenerComentariosPorPublicacion(this.publicacionId)
      .subscribe({
        next: (comentarios) => {
          this.comentarios = comentarios;
          console.log('Comentarios cargados:', comentarios.length);
        },
        error: (error) => {
          console.error('Error al cargar comentarios:', error);
          this.error = 'Error al cargar los comentarios';
        }
      });
    
    this.subscriptions.push(comentariosSub);
  }

  async enviarComentario(): Promise<void> {
    if (!this.nuevoComentario.trim() || !this.usuario) {
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const comentario: Omit<Comentario, 'id'> = {
        contenido: this.nuevoComentario.trim(),
        autorId: this.usuario.id,
        autorNombre: this.usuario.nombre,
        publicacionId: this.publicacionId,
        fechaCreacion: new Date(),
        editado: false
      };

      await this.comentariosService.crearComentario(comentario);
      this.nuevoComentario = '';
      console.log('Comentario enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      this.error = 'Error al enviar el comentario';
    } finally {
      this.loading = false;
    }
  }

  iniciarEdicion(comentario: Comentario): void {
    this.editandoComentario = comentario.id;
    this.contenidoEditado = comentario.contenido;
  }

  cancelarEdicion(): void {
    this.editandoComentario = null;
    this.contenidoEditado = '';
  }

  async guardarEdicion(comentarioId: string): Promise<void> {
    if (!this.contenidoEditado.trim()) {
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      await this.comentariosService.editarComentario(comentarioId, this.contenidoEditado.trim());
      this.editandoComentario = null;
      this.contenidoEditado = '';
      console.log('Comentario editado exitosamente');
    } catch (error) {
      console.error('Error al editar comentario:', error);
      this.error = 'Error al editar el comentario';
    } finally {
      this.loading = false;
    }
  }

  async eliminarComentario(comentarioId: string): Promise<void> {
    if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      await this.comentariosService.eliminarComentario(comentarioId);
      console.log('Comentario eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      this.error = 'Error al eliminar el comentario';
    } finally {
      this.loading = false;
    }
  }

  puedeEditarComentario(comentario: Comentario): boolean {
    return this.usuario?.id === comentario.autorId;
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackByComentario(index: number, comentario: Comentario): string {
    return comentario.id;
  }
}