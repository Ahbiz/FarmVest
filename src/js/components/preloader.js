export function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  const bar = preloader.querySelector('.preloader__progress-bar-inner');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 25) + 15;
    if (bar) {
      bar.style.width = `${Math.min(progress, 100)}%`;
    }
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('is-done');
      }, 250);
    }
  }, 120);
}
