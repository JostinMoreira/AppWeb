import { Injectable } from "@angular/core";
import { Auth, user } from "@angular/fire/auth";
import { Firestore, doc, getDoc } from "@angular/fire/firestore";
import { Observable, BehaviorSubject } from "rxjs";
import { type Usuario, RolUsuario } from "../models/usuario.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Observable público para que los componentes se suscriban
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    // Escuchar el estado de autenticación de Firebase.
    // Esto funciona a través de todos los micro-frontends.
    user(this.auth).subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        // Si hay un usuario, obtenemos sus datos detallados de Firestore
        const userData = await this.getUserData(firebaseUser.uid);
        this.currentUserSubject.next(userData);
      } else {
        // Si no hay usuario (logout desde el Shell), notificamos con null
        this.currentUserSubject.next(null);
      }
    });
  }

  // Esta función es perfecta, se encarga de obtener los datos del perfil
  private async getUserData(uid: string): Promise<Usuario | null> {
    const docSnap = await getDoc(doc(this.firestore, "usuarios", uid));
    if (docSnap.exists()) {
      return docSnap.data() as Usuario;
    }
    return null;
  }
}