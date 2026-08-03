export function initNavbar() {
  const headerMain = document.querySelector('.header-main');
  if (!headerMain) return;

  const handleScroll = () => {
    if (window.scrollY > 120) {
      headerMain.classList.add('is-sticky');
    } else {
      headerMain.classList.remove('is-sticky');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}
