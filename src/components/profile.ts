export function renderProfile(container: HTMLElement, onLogout: () => void) {
  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  container.innerHTML = `
    <div class="profile glass">
      <div class="profile-header">
        <div class="avatar">👤</div>
        <div>
          <h2>${userProfile.name || 'Nombre de Usuario'}</h2>
          <p>${userProfile.email || 'correo@universidad.edu'}</p>
          <span class="role">${userProfile.role || 'Estudiante'}</span>
        </div>
      </div>
      <button class="logout-btn">Cerrar sesión</button>
    </div>
  `;
  container.querySelector('.logout-btn')!.addEventListener('click', () => {
    localStorage.removeItem('userProfile');
    (window as any).showNotification('Sesión cerrada', 'info');
    onLogout();
  });
}
