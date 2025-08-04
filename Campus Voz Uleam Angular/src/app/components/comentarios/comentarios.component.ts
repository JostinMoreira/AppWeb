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
    // CORREGIDO: Se suscribe a currentUser$ y se añade el tipo al parámetro.
    const userSub = this.authService.currentUser$.subscribe((user: Usuario | null) => {
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
    // CORREGIDO: Se elimina la llamada a confirm().
    // Aquí deberías implementar un diálogo modal personalizado.
    console.log('Se debería mostrar un modal de confirmación para eliminar.');
    
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
    // Asegurarse de que la fecha sea un objeto Date válido
    const date = fecha instanceof Date ? fecha : new Date(fecha);
    return date.toLocaleDateString('es-ES', {
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