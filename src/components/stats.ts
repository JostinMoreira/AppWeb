import Chart from 'chart.js/auto';

export function renderStats(container: HTMLElement) {
  container.innerHTML = `
    <div class="stats glass">
      <h2>Estadísticas de Participación</h2>
      <canvas id="statsChart"></canvas>
    </div>
  `;
  const data = {
    labels: ['Ideas', 'Quejas', 'Sugerencias'],
    datasets: [{
      label: 'Publicaciones',
      data: [12, 7, 5],
      backgroundColor: ['#7f5af0', '#2cb67d', '#ff3860']
    }]
  };
  new Chart(document.getElementById('statsChart') as HTMLCanvasElement, {
    type: 'bar',
    data,
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}
