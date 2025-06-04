import './styles/global.css';
import { renderAuth } from './components/auth';
import { renderProfile } from './components/profile';
import { renderPosts } from './components/posts';
import { renderStats } from './components/stats';

const app = document.getElementById('app') as HTMLElement;

function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}
(window as any).showNotification = showNotification;

function renderApp() {
  app.innerHTML = `
    <div class="container glass">
      <h1 class="logo">Campus Voz</h1>
      <nav class="main-nav">
        <button id="nav-auth">Login</button>
        <button id="nav-profile">Perfil</button>
        <button id="nav-posts">Publicaciones</button>
        <button id="nav-stats">Estadísticas</button>
      </nav>
      <div id="main-view"></div>
    </div>
  `;
  const mainView = document.getElementById('main-view')!;
  const nav = {
    auth: document.getElementById('nav-auth')!,
    profile: document.getElementById('nav-profile')!,
    posts: document.getElementById('nav-posts')!,
    stats: document.getElementById('nav-stats')!
  };
  nav.auth.onclick = () => renderAuth(mainView, () => nav.profile.click());
  nav.profile.onclick = () => renderProfile(mainView, () => nav.auth.click());
  nav.posts.onclick = () => renderPosts(mainView);
  nav.stats.onclick = () => renderStats(mainView);
  nav.auth.click();
}
renderApp();
