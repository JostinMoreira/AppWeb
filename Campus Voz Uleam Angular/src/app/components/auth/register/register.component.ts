import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RolUsuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  nombre = '';
  rol: RolUsuario = RolUsuario.ESTUDIANTE;
  loading = false;
  error = '';

  roles = Object.values(RolUsuario);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    if (!this.email || !this.password || !this.nombre) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      await this.authService.register(this.email, this.password, this.nombre, this.rol);
      this.router.navigate(['/publicaciones']);
    } catch (error: any) {
      this.error = 'Error al registrarse. Intenta nuevamente.';
      console.error('Error de registro:', error);
    } finally {
      this.loading = false;
    }
  }

  getRolLabel(rol: RolUsuario): string {
    const labels = {
      [RolUsuario.ESTUDIANTE]: 'Estudiante',
      [RolUsuario.PROFESOR]: 'Profesor',
      [RolUsuario.AUTORIDAD]: 'Autoridad'
    };
    return labels[rol];
  }
}