// ============================================================
// FarmVest Chart.js Integration Module
// Yield Trajectory Area Chart, Asset Allocation Donut Chart, Micro-Sparklines
// ============================================================

import Chart from 'chart.js/auto';

/**
 * Initialize main yield trajectory chart on overview dashboard
 */
export function initYieldChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const ctx = canvas.getContext('2d');
  
  // Create gradient fill
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(34, 197, 94, 0.35)');
  gradient.addColorStop(1, 'rgba(34, 197, 94, 0.0)');

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep (Est)', 'Oct (Est)', 'Nov (Est)', 'Dec (Est)'],
      datasets: [{
        label: 'Monthly Yield ($)',
        data: [450, 620, 710, 800, 910, 1050, 990, 1120, 1220, 1350, 1420, 1580],
        borderColor: '#22C55E',
        borderWidth: 3,
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#22C55E',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0F5132',
          titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
          bodyFont: { family: 'Inter', size: 13 },
          padding: 12,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: (context) => ` Yield: +$${context.parsed.y.toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { family: 'Plus Jakarta Sans', size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: {
            color: 'rgba(255, 255, 255, 0.6)',
            font: { family: 'Inter', size: 11 },
            callback: (val) => `$${val}`
          }
        }
      }
    }
  });
}

/**
 * Initialize Portfolio Asset Allocation Donut Chart
 */
export function initAllocationChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  return new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Organic Rice & Grains', 'Hydroponic Greenhouses', 'Poultry & Livestock', 'Avocado Orchards'],
      datasets: [{
        data: [17700, 12650, 11830, 4000],
        backgroundColor: ['#16A34A', '#0284C7', '#F59E0B', '#10B981'],
        borderWidth: 3,
        borderColor: 'var(--fv-card-bg, #FFFFFF)',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0B1320',
          titleFont: { family: 'Plus Jakarta Sans', size: 12 },
          bodyFont: { family: 'Inter', size: 13, weight: 'bold' },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (context) => ` $${context.parsed.toLocaleString()} (${((context.parsed / 46180) * 100).toFixed(1)}%)`
          }
        }
      }
    }
  });
}

/**
 * Initialize mini sparkline charts
 */
export function initSparkline(canvasId, data, color = '#10B981') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  return new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        data: data,
        borderColor: color,
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } }
    }
  });
}
