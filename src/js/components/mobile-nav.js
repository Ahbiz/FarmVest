// Mobile navigation drawer: hamburger toggle, backdrop, Esc, and link-close.
export function initMobileNav() {
  const drawer = document.getElementById('mobileNav');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const openBtn = document.querySelector('[data-nav-open]');
  if (!drawer || !backdrop || !openBtn) return;

  const closeEls = document.querySelectorAll('[data-nav-close]');
  const links = drawer.querySelectorAll('a');

  const open = () => {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    backdrop.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Hide backdrop from a11y tree after the transition completes.
    setTimeout(() => {
      if (!drawer.classList.contains('is-open')) backdrop.hidden = true;
    }, 320);
  };

  openBtn.addEventListener('click', open);
  closeEls.forEach((el) => el.addEventListener('click', close));
  links.forEach((link) => link.addEventListener('click', close));

  // Close on Escape when the drawer is open.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
  });
}
