import { showToast } from '../components/toast.js';

export function initThemeToggle() {
  const themeToggleBtns = document.querySelectorAll('[data-theme-toggle]');
  if (!themeToggleBtns.length) return;
  
  const savedTheme = localStorage.getItem('fv-theme') || localStorage.getItem('fv_theme') || 'dark';
  
  document.documentElement.setAttribute('data-theme', savedTheme);

  const updateLogoSource = (theme) => {
    document.querySelectorAll('.dashboard__brand img').forEach(img => {
      // Keep white logo in admin sidebar regardless of theme
      if (img.closest('.admin-sidebar')) {
        img.src = '/images/logo-white.svg';
      } else {
        img.src = theme === 'dark' ? '/images/logo-white.svg' : '/images/logo.svg';
      }
    });
  };

  const updateToggleIcon = (theme) => {
    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        // admin.js style
        icon.className = theme === 'dark' ? 'fas fa-sun text-warning' : 'fas fa-moon';
      } else {
        // dashboard.js style fallback
        btn.innerHTML = theme === 'dark' 
          ? '<i class="fa-solid fa-sun text-warning"></i>' 
          : '<i class="fa-solid fa-moon"></i>';
      }
    });
  };

  updateLogoSource(savedTheme);
  updateToggleIcon(savedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('fv-theme', nextTheme);
      localStorage.setItem('fv_theme', nextTheme);
      
      updateLogoSource(nextTheme);
      updateToggleIcon(nextTheme);
      
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  });
}
