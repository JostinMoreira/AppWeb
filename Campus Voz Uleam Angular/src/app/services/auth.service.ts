import { Injectable } from "@angular/core"
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  user,
} from "@angular/fire/auth"
import { Firestore, doc, setDoc, getDoc, updateDoc } from "@angular/fire/firestore"
import { type Observable, switchMap, of, BehaviorSubject } from "rxjs"
import { type Usuario, RolUsuario } from "../models/usuario.model"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user$ = user(this.auth)
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null)

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) {
    // Escuchar cambios en la autenticación
    this.user$.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        console.log("Usuario Firebase detectado:", firebaseUser.uid)
        console.log("Email de Firebase Auth:", firebaseUser.email)

        try {
          let userData = await this.getUserData(firebaseUser.uid)

          if (!userData) {
            console.log("No se encontraron datos del usuario, creando perfil básico...")
            const defaultName =
              firebaseUser.displayName ||
              firebaseUser.email?.split("@")[0] ||
              `Usuario_${firebaseUser.uid.substring(0, 6)}`

            userData = {
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              nombre: defaultName,
              rol: RolUsuario.ESTUDIANTE,
              fechaRegistro: new Date(),
            }

            await setDoc(doc(this.firestore, "usuarios", firebaseUser.uid), userData)
            console.log("Perfil básico creado:", userData)
          } else {
            // Verificar y corregir datos incompletos
            let needsUpdate = false

            // Corregir email vacío
            if (!userData.email || userData.email.trim() === "") {
              userData.email = firebaseUser.email || ""
              needsUpdate = true
              console.log("Email corregido:", userData.email)
            }

            // Corregir nombre vacío
            if (!userData.nombre || userData.nombre.trim() === "") {
              userData.nombre =
                firebaseUser.displayName ||
                firebaseUser.email?.split("@")[0] ||
                `Usuario_${firebaseUser.uid.substring(0, 6)}`
              needsUpdate = true
              console.log("Nombre corregido:", userData.nombre)
            }

            // Actualizar en Firestore si es necesario
            if (needsUpdate) {
              await updateDoc(doc(this.firestore, "usuarios", firebaseUser.uid), {
                email: userData.email,
                nombre: userData.nombre,
              })
              console.log("Datos del usuario actualizados en Firestore")
            }
          }

          console.log("Datos del usuario finales:", userData)
          this.currentUserSubject.next(userData)
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error)
          // En caso de error, crear un usuario básico con los datos de Firebase Auth
          const fallbackName =
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            `Usuario_${firebaseUser.uid.substring(0, 6)}`

          const fallbackUser: Usuario = {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            nombre: fallbackName,
            rol: RolUsuario.ESTUDIANTE,
            fechaRegistro: new Date(),
          }

          console.log("Usando usuario fallback:", fallbackUser)
          this.currentUserSubject.next(fallbackUser)
        }
      } else {
        console.log("No hay usuario autenticado")
        this.currentUserSubject.next(null)
      }
    })
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password)
      console.log("Login exitoso:", credential.user.uid)
    } catch (error) {
      console.error("Error en login:", error)
      throw error
    }
  }

  async register(email: string, password: string, nombre: string, rol: RolUsuario): Promise<void> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password)

      const nombreFinal = nombre.trim() || email.split("@")[0] || `Usuario_${credential.user.uid.substring(0, 6)}`

      const usuario: Usuario = {
        id: credential.user.uid,
        email,
        nombre: nombreFinal,
        rol,
        fechaRegistro: new Date(),
      }

      await setDoc(doc(this.firestore, "usuarios", credential.user.uid), usuario)
      console.log("Registro exitoso:", credential.user.uid, "con nombre:", nombreFinal)
    } catch (error) {
      console.error("Error en registro:", error)
      throw error
    }
  }

  async actualizarPerfil(nombre: string, email: string): Promise<void> {
    const user = this.auth.currentUser
    if (!user) throw new Error("No hay usuario autenticado")

    try {
      await updateDoc(doc(this.firestore, "usuarios", user.uid), {
        nombre: nombre.trim(),
        email: email.trim(),
      })

      // Actualizar el usuario en el BehaviorSubject
      const currentUser = this.currentUserSubject.value
      if (currentUser) {
        this.currentUserSubject.next({
          ...currentUser,
          nombre: nombre.trim(),
          email: email.trim(),
        })
      }

      console.log("Perfil actualizado exitosamente")
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth)
      this.currentUserSubject.next(null)
      console.log("Logout exitoso")
    } catch (error) {
      console.error("Error en logout:", error)
      throw error
    }
  }

  getCurrentUser(): Observable<Usuario | null> {
    return this.currentUserSubject.asObservable()
  }

  private async getUserData(uid: string): Promise<Usuario | null> {
    try {
      const docSnap = await getDoc(doc(this.firestore, "usuarios", uid))
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          email: data["email"] || "",
          nombre: data["nombre"] || "",
          rol: data["rol"] || RolUsuario.ESTUDIANTE,
          fechaRegistro: data["fechaRegistro"]?.toDate() || new Date(),
        } as Usuario
      }
      return null
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error)
      return null
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUserSubject.asObservable().pipe(switchMap((user) => of(user !== null)))
  }

  getCurrentUserSync(): Usuario | null {
    return this.currentUserSubject.value
  }

  async reloadUserData(): Promise<void> {
    const firebaseUser = this.auth.currentUser
    if (firebaseUser) {
      const userData = await this.getUserData(firebaseUser.uid)
      this.currentUserSubject.next(userData)
    }
  }
}
