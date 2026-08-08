export function initSidebarToggle() {
  const sidebar = document.querySelector('.dashboard__sidebar');
  const backdrop = document.querySelector('.dashboard-backdrop');
  const toggle = document.querySelector('[data-sidebar-toggle]');

  if (!sidebar) return;

  function openSidebar() {
    sidebar?.classList.add('is-open');
    backdrop?.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar?.classList.remove('is-open');
    backdrop?.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  toggle?.addEventListener('click', () => {
    if (sidebar?.classList.contains('is-open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  backdrop?.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sidebar?.classList.contains('is-open')) {
      closeSidebar();
    }
  });

  window.addEventListener('resize', () => {
    // Keep sidebar closed when returning to desktop layout
    if (window.innerWidth >= 992) closeSidebar();
  });

  sidebar?.querySelectorAll('.dashboard__nav-item').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) closeSidebar();
    });
  });
}
