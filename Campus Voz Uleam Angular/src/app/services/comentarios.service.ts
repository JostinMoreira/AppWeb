import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, orderBy, onSnapshot, deleteDoc, doc, updateDoc, Timestamp } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { Comentario } from '../models/comentario.model';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {
  private comentariosSubject = new BehaviorSubject<Comentario[]>([]);

  constructor(private firestore: Firestore) {}

  obtenerComentariosPorPublicacion(publicacionId: string): Observable<Comentario[]> {
    const comentariosRef = collection(this.firestore, 'comentarios');
    const q = query(
      comentariosRef,
      where('publicacionId', '==', publicacionId),
      orderBy('fechaCreacion', 'asc')
    );

    return new Observable(observer => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const comentarios: Comentario[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const comentario: Comentario = {
            id: doc.id,
            publicacionId: data['publicacionId'],
            autorId: data['autorId'],
            autorNombre: data['autorNombre'],
            contenido: data['contenido'],
            fechaCreacion: data['fechaCreacion']?.toDate() || new Date(),
            editado: data['editado'] || false,
            fechaEdicion: data['fechaEdicion']?.toDate()
          };
          comentarios.push(comentario);
        });
        observer.next(comentarios);
      }, (error) => {
        observer.error(error);
      });

      return () => unsubscribe();
    });
  }

  async crearComentario(comentario: Omit<Comentario, 'id'>): Promise<string> {
    try {
      const comentariosRef = collection(this.firestore, 'comentarios');
      const comentarioData = {
        publicacionId: comentario.publicacionId,
        autorId: comentario.autorId,
        autorNombre: comentario.autorNombre,
        contenido: comentario.contenido,
        fechaCreacion: Timestamp.fromDate(new Date()),
        editado: false
      };
      
      const docRef = await addDoc(comentariosRef, comentarioData);
      console.log('Comentario creado con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error al crear comentario:', error);
      throw error;
    }
  }

  async eliminarComentario(comentarioId: string): Promise<void> {
    try {
      const comentarioRef = doc(this.firestore, 'comentarios', comentarioId);
      await deleteDoc(comentarioRef);
      console.log('Comentario eliminado:', comentarioId);
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      throw error;
    }
  }

  async editarComentario(comentarioId: string, contenido: string): Promise<void> {
    try {
      const comentarioRef = doc(this.firestore, 'comentarios', comentarioId);
      await updateDoc(comentarioRef, {
        contenido: contenido,
        editado: true,
        fechaEdicion: Timestamp.fromDate(new Date())
      });
      console.log('Comentario editado:', comentarioId);
    } catch (error) {
      console.error('Error al editar comentario:', error);
      throw error;
    }
  }
}