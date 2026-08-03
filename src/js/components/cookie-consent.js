export function initCookieConsent() {
  const banner = document.querySelector('.cookie-consent');
  if (!banner) return;

  if (!localStorage.getItem('farmvest_cookies_accepted')) {
    setTimeout(() => {
      banner.classList.add('is-visible');
    }, 1500);
  }

  const btn = banner.querySelector('.cookie-consent__btn');
  if (btn) {
    btn.addEventListener('click', () => {
      localStorage.setItem('farmvest_cookies_accepted', 'true');
      banner.classList.remove('is-visible');
      banner.classList.add('is-hidden');
    });
  }
}
