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

  async ngOnInit(): Promise<void> {
    console.log("Iniciando FormularioPublicacionComponent...")

    // Suscribirse a cambios del usuario
    const userSub = this.authService.getCurrentUser().subscribe((user) => {
      console.log("Usuario recibido en formulario:", user)
      this.usuario = user

      if (!user) {
        console.log("No hay usuario autenticado, redirigiendo a login...")
        this.router.navigate(["/login"])
      }
    })
    this.subscriptions.push(userSub)

    // Verificar si es edición
    this.publicacionId = this.route.snapshot.params["id"]
    this.esEdicion = !!this.publicacionId

    if (this.esEdicion && this.publicacionId) {
      await this.cargarPublicacion()
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  private async cargarPublicacion(): Promise<void> {
    if (!this.publicacionId) return

    try {
      this.loading = true
      const publicacionSub = this.publicacionesService.obtenerPublicacionPorId(this.publicacionId).subscribe({
        next: (publicacion) => {
          if (publicacion) {
            this.publicacion = publicacion
            console.log("Publicación cargada para edición:", publicacion)
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
    } catch (error) {
      console.error("Error al cargar publicación:", error)
      this.error = "Error al cargar la publicación"
      this.loading = false
    }
  }

  async onSubmit(): Promise<void> {
    console.log("Iniciando envío del formulario...")
    console.log("Usuario actual:", this.usuario)

    // Validaciones básicas
    if (!this.publicacion.titulo?.trim()) {
      this.error = "El título es obligatorio"
      return
    }

    if (!this.publicacion.contenido?.trim()) {
      this.error = "El contenido es obligatorio"
      return
    }

    // Verificar usuario autenticado
    if (!this.usuario) {
      console.error("No hay usuario autenticado")
      this.error = "No se pudo obtener el nombre del usuario autenticado."

      // Intentar recargar los datos del usuario
      try {
        await this.authService.reloadUserData()
        this.usuario = this.authService.getCurrentUserSync()

        if (!this.usuario) {
          this.error = "Debes estar autenticado para realizar esta acción. Por favor, inicia sesión nuevamente."
          this.router.navigate(["/login"])
          return
        }
      } catch (reloadError) {
        console.error("Error al recargar datos del usuario:", reloadError)
        this.error = "Error de autenticación. Por favor, inicia sesión nuevamente."
        this.router.navigate(["/login"])
        return
      }
    }

    // Validar que el usuario tenga los campos necesarios
    if (!this.usuario.id || !this.usuario.nombre) {
      console.error("Datos del usuario incompletos:", this.usuario)
      this.error = "Los datos del usuario están incompletos. Por favor, inicia sesión nuevamente."
      this.router.navigate(["/login"])
      return
    }

    // Asegurar que el nombre no esté vacío
    const nombreAutor =
      this.usuario.nombre.trim() || this.usuario.email?.split("@")[0] || `Usuario_${this.usuario.id.substring(0, 6)}`

    this.loading = true
    this.error = ""
    this.success = ""

    try {
      if (this.esEdicion && this.publicacionId) {
        console.log("Actualizando publicación...")
        const updateData = {
          titulo: this.publicacion.titulo.trim(),
          contenido: this.publicacion.contenido.trim(),
          tipo: this.publicacion.tipo,
        }

        const updateSub = this.publicacionesService.actualizarPublicacion(this.publicacionId, updateData).subscribe({
          next: () => {
            this.success = "Publicación actualizada exitosamente"
            console.log("Publicación actualizada")
            setTimeout(() => {
              this.router.navigate(["/publicaciones"])
            }, 1500)
          },
          error: (error) => {
            console.error("Error al actualizar publicación:", error)
            this.error = "Error al actualizar la publicación. Por favor, intenta nuevamente."
            this.loading = false
          },
        })

        this.subscriptions.push(updateSub)
      } else {
        console.log("Creando nueva publicación...")
        console.log("Usuario actual:", this.usuario)

        // Asegurar que el nombre del autor nunca sea undefined
        const nombreAutor = this.usuario?.nombre || this.usuario?.email?.split("@")[0] || "Usuario Anónimo"

        console.log("Nombre de autor a usar:", nombreAutor)

        // Crear objeto con todos los campos requeridos y validados
        const nuevaPublicacion: Omit<Publicacion, "id"> = {
          titulo: this.publicacion.titulo.trim(),
          contenido: this.publicacion.contenido.trim(),
          tipo: this.publicacion.tipo!,
          autorId: this.usuario!.id,
          autorNombre: nombreAutor, // Usar el nombre validado
          estado: EstadoPublicacion.PENDIENTE,
          fechaCreacion: new Date(),
          votosPositivos: 0,
          votosNegativos: 0,
          totalComentarios: 0,
        }

        console.log("Datos de la nueva publicación:", nuevaPublicacion)

        // Verificar que no hay campos undefined
        const hasUndefinedFields = Object.entries(nuevaPublicacion).some(([key, value]) => {
          if (value === undefined) {
            console.error(`Campo ${key} es undefined`)
            return true
          }
          return false
        })

        if (hasUndefinedFields) {
          this.error = "Error en los datos de la publicación. Por favor, intenta nuevamente."
          this.loading = false
          return
        }

        const createSub = this.publicacionesService.crearPublicacion(nuevaPublicacion).subscribe({
          next: (publicacionId) => {
            console.log("Publicación creada con ID:", publicacionId)
            this.success = "Publicación creada exitosamente"
            setTimeout(() => {
              this.router.navigate(["/publicaciones"])
            }, 1500)
          },
          error: (error) => {
            console.error("Error al crear publicación:", error)
            this.error = "Error al crear la publicación. Por favor, intenta nuevamente."
            this.loading = false
          },
        })

        this.subscriptions.push(createSub)
      }
    } catch (error) {
      console.error("Error al guardar publicación:", error)
      this.error = "Error al guardar la publicación. Por favor, intenta nuevamente."
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
