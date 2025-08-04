import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/usuario.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  usuario: Usuario | null = null;
  menuAbierto = false;
  private userSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // CORREGIDO: Se suscribe a currentUser$ y se añade el tipo al parámetro.
    this.userSubscription = this.authService.currentUser$.subscribe((user: Usuario | null) => {
      this.usuario = user;
    });
  }

  ngOnDestroy(): void {
    // Buena práctica: desuscribirse para evitar fugas de memoria.
    this.userSubscription?.unsubscribe();
  }

  // ELIMINADO: El método logout() ya no pertenece a este componente.
  // La acción de cerrar sesión se manejará en el Shell.

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  closeMenu(): void {
    this.menuAbierto = false;
  }
}
