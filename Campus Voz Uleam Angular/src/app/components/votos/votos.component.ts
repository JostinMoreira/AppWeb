import { Component, Input, OnInit, OnDestroy } from "@angular/core"
import { VotosService, Voto } from "../../services/votos.service"
import { AuthService } from "../../services/auth.service"
import { Usuario } from "../../models/usuario.model"
import { Subscription } from "rxjs"

@Component({
  selector: "app-votos",
  template: `
    <div class="votos-container">
      <button 
        class="voto-btn positivo"
        [class.activo]="votoUsuario?.tipo === 'positivo'"
        (click)="votar('positivo')"
        [disabled]="!usuario || loading">
        👍 {{ votosPositivos }}
      </button>
      
      <button 
        class="voto-btn negativo"
        [class.activo]="votoUsuario?.tipo === 'negativo'"
        (click)="votar('negativo')"
        [disabled]="!usuario || loading">
        👎 {{ votosNegativos }}
      </button>
    </div>
  `,
  styles: [
    `
    .votos-container {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    .voto-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 8px 12px;
      border: 2px solid #ddd;
      background: white;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
    }
    
    .voto-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .voto-btn.positivo.activo {
      background: #4CAF50;
      color: white;
      border-color: #4CAF50;
    }
    
    .voto-btn.negativo.activo {
      background: #f44336;
      color: white;
      border-color: #f44336;
    }
    
    .voto-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  ],
})
export class VotosComponent implements OnInit, OnDestroy {
  @Input() publicacionId!: string
  @Input() votosPositivos = 0
  @Input() votosNegativos = 0

  usuario: Usuario | null = null
  votoUsuario: Voto | null = null
  loading = false

  private subscriptions: Subscription[] = []

  constructor(
    private votosService: VotosService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Suscribirse al usuario actual
    const userSub = this.authService.getCurrentUser().subscribe((user) => {
      this.usuario = user
      if (user && this.publicacionId) {
        this.cargarVotoUsuario()
      }
    })
    this.subscriptions.push(userSub)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  private cargarVotoUsuario(): void {
    if (!this.usuario || !this.publicacionId) return

    const votoSub = this.votosService.obtenerVotoUsuario(this.publicacionId, this.usuario.id).subscribe((voto) => {
      this.votoUsuario = voto
    })

    this.subscriptions.push(votoSub)
  }

  async votar(tipo: "positivo" | "negativo"): Promise<void> {
    if (!this.usuario || this.loading) return

    this.loading = true

    try {
      await this.votosService.votar(this.publicacionId, this.usuario.id, tipo)

      // Actualizar contadores localmente
      if (this.votoUsuario?.tipo === tipo) {
        // Eliminar voto
        if (tipo === "positivo") {
          this.votosPositivos--
        } else {
          this.votosNegativos--
        }
        this.votoUsuario = null
      } else if (this.votoUsuario) {
        // Cambiar voto
        if (this.votoUsuario.tipo === "positivo") {
          this.votosPositivos--
          this.votosNegativos++
        } else {
          this.votosNegativos--
          this.votosPositivos++
        }
        this.votoUsuario.tipo = tipo
      } else {
        // Nuevo voto
        if (tipo === "positivo") {
          this.votosPositivos++
        } else {
          this.votosNegativos++
        }
        this.votoUsuario = {
          id: `${this.publicacionId}_${this.usuario.id}`,
          publicacionId: this.publicacionId,
          usuarioId: this.usuario.id,
          tipo,
          fechaVoto: new Date(),
        }
      }
    } catch (error) {
      console.error("Error al votar:", error)
    } finally {
      this.loading = false
    }
  }
}
