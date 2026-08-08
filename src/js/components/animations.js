// ============================================================
// FarmVest Dashboard Animations & Counter Effects
// ============================================================

/**
 * Animate a single element counter
 */
export function animateCounter(el, target, duration = 1200, prefix = '', suffix = '', decimals = 0) {
  let start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentVal = start + (target - start) * eased;

    el.textContent = `${prefix}${currentVal.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Animate numbers counting up when visible
 */
export function animateCounters() {
  const elements = document.querySelectorAll('[data-counter], [data-counter-target]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-counter') || el.getAttribute('data-counter-target') || '0');
        const prefix = el.getAttribute('data-prefix') || el.getAttribute('data-counter-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || el.getAttribute('data-counter-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals') || el.getAttribute('data-counter-decimals') || '0', 10);
        
        animateCounter(el, target, 1200, prefix, suffix, decimals);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));
}

/**
 * Stagger entrance animation for cards and grid items
 */
export function initStaggerEntrance() {
  const containers = document.querySelectorAll('.bento-grid, .row, .cycle-list');
  containers.forEach(container => {
    const cards = container.querySelectorAll('.bento-card, .stat-card, .pool-card, .card');
    cards.forEach((card, idx) => {
      card.style.animationDelay = `${idx * 0.08}s`;
      card.classList.add('fv-fade-in-up');
    });
  });
}
