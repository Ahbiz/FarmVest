export function showToast(type = 'success', title = 'Success', message = '') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const iconMap = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <div class="toast__icon">
      <i class="fas ${iconMap[type] || 'fa-info-circle'}"></i>
    </div>
    <div class="toast__body">
      <div class="toast__title">${title}</div>
      <div class="toast__message">${message}</div>
    </div>
    <button type="button" class="toast__close">&times;</button>
  `;

  container.appendChild(toast);

  // Trigger entrance
  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  const closeToast = () => {
    toast.classList.remove('is-visible');
    toast.classList.add('is-leaving');
    toast.addEventListener('transitionend', () => toast.remove());
  };

  toast.querySelector('.toast__close').addEventListener('click', closeToast);
  setTimeout(closeToast, 4000);
}
