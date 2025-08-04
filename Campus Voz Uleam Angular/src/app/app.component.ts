import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service'; // Asegúrate que la ruta sea correcta
import { Usuario } from './models/usuario.model'; // Asegúrate que la ruta sea correcta

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Observable para escuchar los cambios del usuario de forma reactiva
  currentUser$: Observable<Usuario | null>;

  constructor(private authService: AuthService) {
    // Asignamos el observable desde nuestro servicio
    this.currentUser$ = this.authService.currentUser$;
  }
}