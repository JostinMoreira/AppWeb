import { db, auth } from '../firebase';
import { collection, addDoc, Timestamp, query, orderBy, getDocs } from 'firebase/firestore';

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
  }

  // Publicar nueva publicación
  postForm.onsubmit = async (e) => {
    e.preventDefault();
    const title = (document.getElementById('post-title') as HTMLInputElement).value;
    const desc = (document.getElementById('post-desc') as HTMLTextAreaElement).value;
    const type = (document.getElementById('post-type') as HTMLSelectElement).value;
    const anonymous = (document.getElementById('post-anonymous') as HTMLInputElement).checked;
    const user = auth.currentUser;
    if (!user) return (window as any).showNotification('Debes iniciar sesión', 'error');
    try {
      await addDoc(collection(db, "posts"), {
        title,
        desc,
        type,
        anonymous,
        author: anonymous ? null : user.email,
        createdAt: Timestamp.now()
      });
      (window as any).showNotification('¡Publicado!', 'success');
      postForm.reset();
      loadPosts(); // Recarga la lista después de publicar
    } catch (err: any) {
      (window as any).showNotification('Error al publicar', 'error');
    }
  };

  // Cargar publicaciones al iniciar
  loadPosts();
}