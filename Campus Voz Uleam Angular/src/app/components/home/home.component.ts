import { Component, OnInit } from '@angular/core';
import { PublicacionesService } from '../../services/publicaciones.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { TipoPublicacion } from '../../models/publicacion.model';

interface Estadisticas {
  totalPublicaciones: number;
  totalVotos: number;
  totalComentarios: number;
  totalUsuarios: number;
  publicacionesPorTipo: { [key: string]: number };
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  estadisticas: Estadisticas = {
    totalPublicaciones: 0,
    totalUsuarios: 0,
    totalVotos: 0,
    totalComentarios: 0,
    publicacionesPorTipo: {}
  };
  
  usuario: Usuario | null = null;
  loading = true;
  
  // Getter para las claves
  get tiposPublicacion(): string[] {
    return Object.keys(this.estadisticas.publicacionesPorTipo);
  }

  constructor(
    private publicacionesService: PublicacionesService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    // Obtener usuario actual
    this.authService.getCurrentUser().subscribe(user => {
      this.usuario = user;
    });

    // Cargar estadísticas básicas
    await this.cargarEstadisticas();
  }

  private async cargarEstadisticas(): Promise<void> {
    try {
      // Por ahora, estadísticas básicas
      this.estadisticas = {
        totalPublicaciones: 0,
        totalUsuarios: 1,
        totalVotos: 0,
        totalComentarios: 0,
        publicacionesPorTipo: {
          [TipoPublicacion.PROPUESTA]: 0,
          [TipoPublicacion.QUEJA]: 0,
          [TipoPublicacion.SUGERENCIA]: 0,
          [TipoPublicacion.IDEA]: 0
        }
      };
      
      console.log('Estadísticas cargadas:', this.estadisticas);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      this.loading = false;
    }
  }

  // Modificar el método para aceptar string
  getTipoLabel(tipo: string): string {
    const labels: { [key: string]: string } = {
      [TipoPublicacion.QUEJA]: 'Quejas',
      [TipoPublicacion.PROPUESTA]: 'Propuestas',
      [TipoPublicacion.SUGERENCIA]: 'Sugerencias',
      [TipoPublicacion.IDEA]: 'Ideas'
    };
    return labels[tipo] || tipo;
  }
}