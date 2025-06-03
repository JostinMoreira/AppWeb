import { db, auth } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

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
      <div id="posts-list"></div>
    </div>
  `;

  const postForm = document.getElementById('postForm') as HTMLFormElement;
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
        author: anonymous ? null : user.uid,
        createdAt: Timestamp.now()
      });
      (window as any).showNotification('¡Publicado!', 'success');
      postForm.reset();
    } catch (err: any) {
      (window as any).showNotification('Error al publicar', 'error');
    }
  };
}
