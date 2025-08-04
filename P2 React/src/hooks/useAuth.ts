import { useState, useEffect } from 'react';
// CORRECCIÓN: Se separa la importación de valores y tipos.
import { onAuthStateChanged } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Importa desde tu archivo de configuración

// Define una interfaz para tu modelo de usuario (debe coincidir con la de Firestore)
export interface Usuario {
  uid: string;
  email: string;
  nombre: string;
  rol: string;
  // ... otros campos que tengas
}

export default function useAuth() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Usuario logueado, obtenemos sus datos de Firestore
        const docRef = doc(db, "usuarios", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({ uid: firebaseUser.uid, ...docSnap.data() } as Usuario);
        } else {
          // Si no hay perfil en Firestore, usamos los datos básicos de Firebase Auth
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            nombre: firebaseUser.displayName || 'Usuario sin perfil',
            rol: 'ESTUDIANTE' // o un rol por defecto
          });
        }
      } else {
        // No hay usuario
        setUser(null);
      }
      setLoading(false);
    });

    // Se desuscribe al desmontar el componente para evitar fugas de memoria
    return () => unsubscribe();
  }, []);

  return { user, loading };
}
