import { Component, OnInit, OnDestroy } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Subscription } from "rxjs"
import { Publicacion, TipoPublicacion, EstadoPublicacion } from "../../../models/publicacion.model"
import { PublicacionesService } from "../../../services/publicaciones.service"
import { AuthService } from "../../../services/auth.service"
import { Usuario } from "../../../models/usuario.model"

@Component({
  selector: "app-formulario-publicacion",
  templateUrl: "./formulario-publicacion.component.html",
  styleUrls: ["./formulario-publicacion.component.css"],
})
export class FormularioPublicacionComponent implements OnInit, OnDestroy {
  publicacion: Partial<Publicacion> = {
    titulo: "",
    contenido: "",
    tipo: TipoPublicacion.PROPUESTA,
  }

  tiposPublicacion = Object.values(TipoPublicacion)
  loading = false
  error = ""
  success = ""
  esEdicion = false
  publicacionId?: string
  usuario: Usuario | null = null

  private subscriptions: Subscription[] = []

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private publicacionesService: PublicacionesService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // CORREGIDO: Suscribirse a currentUser$ para obtener el usuario
    const userSub = this.authService.currentUser$.subscribe((user: Usuario | null) => {
      this.usuario = user
      if (!user) {
        // En un entorno de micro-frontend, la redirección la manejará el Shell.
        // Aquí simplemente nos aseguramos de que el formulario esté deshabilitado si no hay usuario.
        console.log("No hay usuario autenticado.");
      }
    })
    this.subscriptions.push(userSub)

    // Verificar si es edición
    this.publicacionId = this.route.snapshot.params["id"]
    this.esEdicion = !!this.publicacionId

    if (this.esEdicion && this.publicacionId) {
      this.cargarPublicacion()
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  private cargarPublicacion(): void {
    if (!this.publicacionId) return

    this.loading = true
    const publicacionSub = this.publicacionesService.obtenerPublicacionPorId(this.publicacionId).subscribe({
      next: (publicacion) => {
        if (publicacion) {
          this.publicacion = publicacion
        } else {
          this.error = "Publicación no encontrada"
        }
        this.loading = false
      },
      error: (error) => {
        console.error("Error al cargar publicación:", error)
        this.error = "Error al cargar la publicación"
        this.loading = false
      },
    })
    this.subscriptions.push(publicacionSub)
  }

  async onSubmit(): Promise<void> {
    // CORREGIDO: Se elimina la lógica de recarga de usuario.
    // Simplemente se verifica si el usuario existe.
    if (!this.usuario) {
      this.error = "Debes estar autenticado para realizar esta acción."
      return
    }

    if (!this.publicacion.titulo?.trim() || !this.publicacion.contenido?.trim()) {
      this.error = "El título y el contenido son obligatorios"
      return
    }

    this.loading = true
    this.error = ""
    this.success = ""

    try {
      if (this.esEdicion && this.publicacionId) {
        const updateData = {
          titulo: this.publicacion.titulo.trim(),
          contenido: this.publicacion.contenido.trim(),
          tipo: this.publicacion.tipo,
        }
        await this.publicacionesService.actualizarPublicacion(this.publicacionId, updateData)
        this.success = "Publicación actualizada exitosamente"
        setTimeout(() => this.router.navigate(["/publicaciones"]), 1500)

      } else {
        const nuevaPublicacion: Omit<Publicacion, "id"> = {
          titulo: this.publicacion.titulo!.trim(),
          contenido: this.publicacion.contenido!.trim(),
          tipo: this.publicacion.tipo!,
          autorId: this.usuario.id,
          autorNombre: this.usuario.nombre,
          estado: EstadoPublicacion.PENDIENTE,
          fechaCreacion: new Date(),
          votosPositivos: 0,
          votosNegativos: 0,
          totalComentarios: 0,
        }

        const publicacionId = await this.publicacionesService.crearPublicacion(nuevaPublicacion)
        console.log("Publicación creada con ID:", publicacionId)
        this.success = "Publicación creada exitosamente"
        setTimeout(() => this.router.navigate(["/publicaciones"]), 1500)
      }
    } catch (error) {
      console.error("Error al guardar publicación:", error)
      this.error = "Error al guardar la publicación. Por favor, intenta nuevamente."
    } finally {
      this.loading = false
    }
  }

  cancelar(): void {
    this.router.navigate(["/publicaciones"])
  }

  getTipoLabel(tipo: TipoPublicacion): string {
    const labels = {
      [TipoPublicacion.QUEJA]: "Queja",
      [TipoPublicacion.PROPUESTA]: "Propuesta",
      [TipoPublicacion.SUGERENCIA]: "Sugerencia",
      [TipoPublicacion.IDEA]: "Idea",
    }
    return labels[tipo]
  }
}