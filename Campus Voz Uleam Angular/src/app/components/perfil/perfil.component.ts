import { Component, OnInit, OnDestroy } from "@angular/core"
import { Router } from "@angular/router"
import { Subscription } from "rxjs"
import { AuthService } from "../../services/auth.service"
import { PublicacionesService } from "../../services/publicaciones.service"
import { Usuario, RolUsuario } from "../../models/usuario.model"
import { Publicacion } from "../../models/publicacion.model"

@Component({
  selector: "app-perfil",
  templateUrl: "./perfil.component.html",
  styleUrls: ["./perfil.component.css"],
})
export class PerfilComponent implements OnInit, OnDestroy {
  usuario: Usuario | null = null
  misPublicaciones: Publicacion[] = []
  loading = false
  error = ""
  success = ""
  editando = false

  // Datos para edición
  datosEdicion = {
    nombre: "",
    email: "",
  }

  private subscriptions: Subscription[] = []

  constructor(
    private authService: AuthService,
    private publicacionesService: PublicacionesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // CORREGIDO: Se suscribe a currentUser$ y se añade el tipo al parámetro.
    const userSub = this.authService.currentUser$.subscribe((user: Usuario | null) => {
      this.usuario = user
      if (user) {
        this.datosEdicion = {
          nombre: user.nombre,
          email: user.email,
        }
        this.cargarMisPublicaciones()
      } else {
        // La redirección ahora es responsabilidad del Shell.
        // Este componente simplemente no mostrará nada si no hay usuario.
      }
    })
    this.subscriptions.push(userSub)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  private cargarMisPublicaciones(): void {
    if (!this.usuario) return

    this.loading = true
    const pubSub = this.publicacionesService.obtenerPublicacionesPorAutor(this.usuario.id).subscribe({
      next: (publicaciones) => {
        this.misPublicaciones = publicaciones
        this.loading = false
      },
      error: (error) => {
        console.error("Error al cargar publicaciones:", error)
        this.error = "Error al cargar tus publicaciones"
        this.loading = false
      },
    })

    this.subscriptions.push(pubSub)
  }

  iniciarEdicion(): void {
    this.editando = true
    this.error = ""
    this.success = ""
  }

  cancelarEdicion(): void {
    this.editando = false
    if (this.usuario) {
      this.datosEdicion = {
        nombre: this.usuario.nombre,
        email: this.usuario.email,
      }
    }
  }

  // ELIMINADO: La lógica para guardar cambios y cerrar sesión se moverá al Shell.
  // async guardarCambios(): Promise<void> { ... }
  // async cerrarSesion(): Promise<void> { ... }

  getRolLabel(rol: RolUsuario): string {
    const labels: { [key: string]: string } = {
      [RolUsuario.ESTUDIANTE]: "Estudiante",
      [RolUsuario.PROFESOR]: "Profesor",
      [RolUsuario.AUTORIDAD]: "Autoridad",
    }
    return labels[rol]
  }

  getTotalVotos(): number {
    return this.misPublicaciones.reduce((total, pub) => total + pub.votosPositivos + pub.votosNegativos, 0)
  }

  getVotosPositivos(): number {
    return this.misPublicaciones.reduce((total, pub) => total + pub.votosPositivos, 0)
  }
}