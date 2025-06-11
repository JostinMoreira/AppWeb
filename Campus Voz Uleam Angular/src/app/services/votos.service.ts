import { Injectable } from "@angular/core"
import { Firestore, doc, setDoc, deleteDoc, getDoc, updateDoc, increment } from "@angular/fire/firestore"
import { type Observable, from } from "rxjs"

export interface Voto {
  id: string
  publicacionId: string
  usuarioId: string
  tipo: "positivo" | "negativo"
  fechaVoto: Date
}

@Injectable({
  providedIn: "root",
})
export class VotosService {
  constructor(private firestore: Firestore) {}

  async votar(publicacionId: string, usuarioId: string, tipo: "positivo" | "negativo"): Promise<void> {
    const votoId = `${publicacionId}_${usuarioId}`
    const votoRef = doc(this.firestore, "votos", votoId)
    const publicacionRef = doc(this.firestore, "publicaciones", publicacionId)

    try {
      // Verificar si ya existe un voto
      const votoExistente = await getDoc(votoRef)

      if (votoExistente.exists()) {
        const votoData = votoExistente.data() as Voto

        if (votoData.tipo === tipo) {
          // Si es el mismo tipo, eliminar voto
          await deleteDoc(votoRef)

          // Decrementar contador
          const campo = tipo === "positivo" ? "votosPositivos" : "votosNegativos"
          await updateDoc(publicacionRef, {
            [campo]: increment(-1),
          })
        } else {
          // Si es diferente, cambiar tipo
          await setDoc(votoRef, {
            id: votoId,
            publicacionId,
            usuarioId,
            tipo,
            fechaVoto: new Date(),
          })

          // Actualizar contadores
          const campoAnterior = votoData.tipo === "positivo" ? "votosPositivos" : "votosNegativos"
          const campoNuevo = tipo === "positivo" ? "votosPositivos" : "votosNegativos"

          await updateDoc(publicacionRef, {
            [campoAnterior]: increment(-1),
            [campoNuevo]: increment(1),
          })
        }
      } else {
        // Crear nuevo voto
        await setDoc(votoRef, {
          id: votoId,
          publicacionId,
          usuarioId,
          tipo,
          fechaVoto: new Date(),
        })

        // Incrementar contador
        const campo = tipo === "positivo" ? "votosPositivos" : "votosNegativos"
        await updateDoc(publicacionRef, {
          [campo]: increment(1),
        })
      }
    } catch (error) {
      console.error("Error al votar:", error)
      throw error
    }
  }

  obtenerVotoUsuario(publicacionId: string, usuarioId: string): Observable<Voto | null> {
    const votoId = `${publicacionId}_${usuarioId}`
    return from(
      getDoc(doc(this.firestore, "votos", votoId)).then((doc) =>
        doc.exists() ? ({ ...doc.data(), id: doc.id } as Voto) : null,
      ),
    )
  }
}
