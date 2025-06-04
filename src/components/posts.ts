import { db, auth } from '../firebase';
import { collection, addDoc, Timestamp, query, orderBy, getDocs } from 'firebase/firestore';

// Función de prueba para verificar conexión a Firestore
async function testFirestoreConnection() {
  try {
    const testQuery = query(collection(db, "posts"));
    await getDocs(testQuery);
    console.log('✅ Conexión a Firestore exitosa');
  } catch (error) {
    console.error('❌ Error de conexión a Firestore:', error);
  }
}

export function renderPosts(container: HTMLElement) {
  container.innerHTML = `
    <div class="posts glass">
      <h2>Publicar una idea, queja o sugerencia</h2>
      <form id="postForm">
        <input type="text" id="post-title" placeholder="Título" required />
        <textarea id="post-desc" placeholder="Describe tu propuesta o queja" required></textarea>
        <select id="post-type" required>
          <option value="">Tipo</option>
          <option value="idea">Idea</option>
          <option value="queja">Queja</option>
          <option value="sugerencia">Sugerencia</option>
        </select>
        <label>
          <input type="checkbox" id="post-anonymous" />
          Publicar como anónimo
        </label>
        <button type="submit">Publicar</button>
      </form>
      <hr>
      <h2>Publicaciones recientes</h2>
      <div id="posts-list"></div>
    </div>
  `;

  const postForm = document.getElementById('postForm') as HTMLFormElement;
  const postsList = document.getElementById('posts-list') as HTMLElement;

  // Función para cargar y mostrar publicaciones
  async function loadPosts() {
    try {
      postsList.innerHTML = '<p>Cargando publicaciones...</p>';
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        postsList.innerHTML = '<p>No hay publicaciones aún.</p>';
        return;
      }
      
      postsList.innerHTML = '';
      querySnapshot.forEach((docSnap) => {
        const post = docSnap.data();
        const date = post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : '';
        postsList.innerHTML += `
          <div class="post-card glass">
            <h3>${post.title}</h3>
            <p>${post.desc}</p>
            <span class="post-type">${post.type}</span>
            <div class="post-meta">
              <small>${post.anonymous ? 'Anónimo' : (post.author || 'Desconocido')}</small>
              <small>${date}</small>
            </div>
          </div>
        `;
      });
      
      console.log(`✅ Se cargaron ${querySnapshot.size} publicaciones`);
      
    } catch (error: any) {
      console.error('❌ Error al cargar publicaciones:', error);
      postsList.innerHTML = '<p>Error al cargar publicaciones. Revisa la consola.</p>';
    }
  }

  // Publicar nueva publicación
  postForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const title = (document.getElementById('post-title') as HTMLInputElement).value;
    const desc = (document.getElementById('post-desc') as HTMLTextAreaElement).value;
    const type = (document.getElementById('post-type') as HTMLSelectElement).value;
    const anonymous = (document.getElementById('post-anonymous') as HTMLInputElement).checked;
    
    const user = auth.currentUser;
    
    if (!user) {
      (window as any).showNotification('Debes iniciar sesión para publicar', 'error');
      return;
    }

    console.log('👤 Usuario autenticado:', user.email);
    console.log('📝 Datos a publicar:', { title, desc, type, anonymous });

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title,
        desc,
        type,
        anonymous,
        author: anonymous ? null : user.email,
        createdAt: Timestamp.now()
      });
      
      console.log('✅ Publicación creada con ID:', docRef.id);
      (window as any).showNotification('¡Publicación creada exitosamente!', 'success');
      postForm.reset();
      loadPosts();
      
    } catch (err: any) {
      console.error('❌ Error completo al publicar:', err);
      console.error('🔴 Código de error:', err.code);
      console.error('💬 Mensaje:', err.message);
      (window as any).showNotification(`Error: ${err.message}`, 'error');
    }
  };

  // Cargar publicaciones al iniciar
  loadPosts();
  
  // Verificar conexión a Firestore
  testFirestoreConnection();
}