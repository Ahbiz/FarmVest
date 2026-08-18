/**
 * Polymorphic toast notification dispatcher.
 * Supports:
 * - showToast(message, type)
 * - showToast(type, title, message)
 * - showToast(type, message)
 * - showToast(message)
 */
export function showToast(arg1 = 'Operation successful', arg2 = '', arg3 = '') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const validTypes = ['success', 'error', 'warning', 'info', 'danger'];
  let type = 'success';
  let title = '';
  let message = '';

  // Determine call style
  if (validTypes.includes(arg1)) {
    type = arg1 === 'danger' ? 'error' : arg1;
    if (arg3) {
      title = arg2;
      message = arg3;
    } else {
      title = type.charAt(0).toUpperCase() + type.slice(1);
      message = arg2 || title;
    }
  } else {
    // Called as showToast(message, type) or showToast(message)
    message = arg1;
    if (validTypes.includes(arg2)) {
      type = arg2 === 'danger' ? 'error' : arg2;
    }
    title = type.charAt(0).toUpperCase() + type.slice(1);
  }

  const iconMap = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.innerHTML = `
    <div class="toast__icon">
      <i class="fas ${iconMap[type] || 'fa-circle-info'}"></i>
    </div>
    <div class="toast__body">
      <div class="toast__title">${title}</div>
      <div class="toast__message">${message}</div>
    </div>
    <button type="button" class="toast__close" aria-label="Close notification">&times;</button>
  `;

  container.appendChild(toast);

  // Trigger entrance
  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  const closeToast = () => {
    toast.classList.remove('is-visible');
    toast.classList.add('is-leaving');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 400);
  };

  toast.querySelector('.toast__close')?.addEventListener('click', closeToast);
  setTimeout(closeToast, 4000);
}

