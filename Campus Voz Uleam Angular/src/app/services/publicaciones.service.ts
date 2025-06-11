import { Injectable } from "@angular/core"
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from "@angular/fire/firestore"
import { type Observable, from, map } from "rxjs"
import type { Publicacion } from "../models/publicacion.model"

@Injectable({
  providedIn: "root",
})
export class PublicacionesService {
  private collectionName = "publicaciones"

  constructor(private firestore: Firestore) {}

  crearPublicacion(publicacion: Omit<Publicacion, "id">): Observable<string> {
    const publicacionesRef = collection(this.firestore, this.collectionName)
    return from(addDoc(publicacionesRef, publicacion)).pipe(map((docRef) => docRef.id))
  }

  obtenerPublicaciones(): Observable<Publicacion[]> {
    const publicacionesRef = collection(this.firestore, this.collectionName)
    const q = query(publicacionesRef, orderBy("fechaCreacion", "desc"))

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
              fechaCreacion:
                doc.data()["fechaCreacion"] instanceof Timestamp
                  ? doc.data()["fechaCreacion"].toDate()
                  : new Date(doc.data()["fechaCreacion"]),
            }) as Publicacion,
        ),
      ),
    )
  }

  obtenerPublicacionesPorAutor(autorId: string): Observable<Publicacion[]> {
    const publicacionesRef = collection(this.firestore, this.collectionName)
    const q = query(publicacionesRef, where("autorId", "==", autorId), orderBy("fechaCreacion", "desc"))

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
              fechaCreacion:
                doc.data()["fechaCreacion"] instanceof Timestamp
                  ? doc.data()["fechaCreacion"].toDate()
                  : new Date(doc.data()["fechaCreacion"]),
            }) as Publicacion,
        ),
      ),
    )
  }

  obtenerPublicacionPorId(id: string): Observable<Publicacion | null> {
    const docRef = doc(this.firestore, this.collectionName, id)
    return from(getDoc(docRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data()
          return {
            id: docSnap.id,
            titulo: data["titulo"] || "",
            contenido: data["contenido"] || "",
            tipo: data["tipo"] || "queja",
            autorId: data["autorId"] || "",
            autorNombre: data["autorNombre"] || "",
            estado: data["estado"] || "pendiente",
            fechaCreacion:
              data["fechaCreacion"] instanceof Timestamp
                ? data["fechaCreacion"].toDate()
                : new Date(data["fechaCreacion"]),
            votosPositivos: data["votosPositivos"] ?? 0,
            votosNegativos: data["votosNegativos"] ?? 0,
            totalComentarios: data["totalComentarios"] ?? 0,
          } as Publicacion
        }
        return null
      }),
    )
  }

  actualizarPublicacion(id: string, datos: Partial<Publicacion>): Observable<void> {
    const docRef = doc(this.firestore, this.collectionName, id)
    return from(updateDoc(docRef, datos))
  }

  eliminarPublicacion(id: string): Observable<void> {
    const docRef = doc(this.firestore, this.collectionName, id)
    return from(deleteDoc(docRef))
  }
}
