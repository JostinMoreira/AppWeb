import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export function renderAuth(container: HTMLElement, onAuthSuccess: () => void) {
  container.innerHTML = `
    <div class="auth glass">
      <h2>Iniciar Sesión</h2>
      <form id="loginForm">
        <input type="email" id="email" placeholder="Correo institucional" required />
        <input type="password" id="password" placeholder="Contraseña" required />
        <button type="submit">Entrar</button>
      </form>
      <hr />
      <h2>Registrarse</h2>
      <form id="registerForm">
        <input type="text" id="reg-name" placeholder="Nombre completo" required />
        <input type="email" id="reg-email" placeholder="Correo institucional" required />
        <input type="password" id="reg-password" placeholder="Contraseña" required />
        <input type="password" id="reg-password2" placeholder="Repite la contraseña" required />
        <select id="reg-role" required>
          <option value="">Selecciona tu rol</option>
          <option value="estudiante">Estudiante</option>
          <option value="profesor">Profesor</option>
          <option value="autoridad">Autoridad</option>
        </select>
        <button type="submit">Crear cuenta</button>
      </form>
    </div>
  `;

  // Login
  const loginForm = document.getElementById('loginForm') as HTMLFormElement;
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Obtener datos de Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (userDoc.exists()) {
        localStorage.setItem('userProfile', JSON.stringify(userDoc.data()));
      }
      (window as any).showNotification('¡Bienvenido!', 'success');
      onAuthSuccess();
    } catch (err: any) {
      (window as any).showNotification('Error al iniciar sesión: ' + (err.message || ''), 'error');
    }
  };

  // Registro
  const registerForm = document.getElementById('registerForm') as HTMLFormElement;
  registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = (document.getElementById('reg-name') as HTMLInputElement).value;
    const email = (document.getElementById('reg-email') as HTMLInputElement).value;
    const pass1 = (document.getElementById('reg-password') as HTMLInputElement).value;
    const pass2 = (document.getElementById('reg-password2') as HTMLInputElement).value;
    const role = (document.getElementById('reg-role') as HTMLSelectElement).value;
    if (pass1 !== pass2) {
      (window as any).showNotification('Las contraseñas no coinciden', 'error');
      return;
    }
    if (!role) {
      (window as any).showNotification('Selecciona un rol', 'error');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass1);
      // Guardar datos adicionales en Firestore
      const userProfile = {
        uid: userCredential.user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, "users", userCredential.user.uid), userProfile);
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      (window as any).showNotification('¡Cuenta creada!', 'success');
      onAuthSuccess();
    } catch (err: any) {
      (window as any).showNotification('Error al registrarse: ' + (err.message || ''), 'error');
    }
  };
}
