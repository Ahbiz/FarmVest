// ============================================================
// FarmVest — Rolling Odometer Slot Reel & Gauge Component
// ============================================================

export function initCounters() {
  const odometers = document.querySelectorAll('.odometer-num');
  const gaugeFills = document.querySelectorAll('.stat-gauge-fill[data-percent]');

  if (!odometers.length && !gaugeFills.length) return;

  // Build Odometer Reel DOM structure for each .odometer-num
  odometers.forEach((el) => {
    const valueStr = el.getAttribute('data-value') || el.textContent.trim();
    el.innerHTML = '';

    Array.from(valueStr).forEach((char, idx) => {
      if (/\d/.test(char)) {
        // Digit 0-9: Create vertical slot reel
        const reel = document.createElement('span');
        reel.className = 'odometer-reel';

        const strip = document.createElement('span');
        strip.className = 'odometer-strip';
        strip.setAttribute('data-digit', char);
        strip.style.transitionDelay = `${idx * 70}ms`;

        // Digits 0 through 9
        for (let i = 0; i <= 9; i++) {
          const numSpan = document.createElement('span');
          numSpan.textContent = i;
          strip.appendChild(numSpan);
        }

        reel.appendChild(strip);
        el.appendChild(reel);
      } else {
        // Static symbol ($, ., %, +, M, etc.)
        const charSpan = document.createElement('span');
        charSpan.className = 'odometer-char';
        charSpan.textContent = char;
        el.appendChild(charSpan);
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (entry.isIntersecting) {
          if (el.dataset.animating === 'true') return;
          el.dataset.animating = 'true';

          // Trigger vertical slot reel roll
          if (el.classList.contains('odometer-num')) {
            const strips = el.querySelectorAll('.odometer-strip');
            strips.forEach((strip) => {
              const digit = parseInt(strip.getAttribute('data-digit'), 10);
              strip.style.transform = `translateY(-${digit * 10}%)`;
            });
          }

          // Trigger gauge fill bar animation
          if (el.classList.contains('stat-gauge-fill')) {
            const percent = el.getAttribute('data-percent') || '100';
            setTimeout(() => {
              el.style.width = `${percent}%`;
            }, 120);
          }
        } else {
          el.dataset.animating = 'false';
          if (el.classList.contains('odometer-num')) {
            const strips = el.querySelectorAll('.odometer-strip');
            strips.forEach((strip) => {
              strip.style.transform = 'translateY(0%)';
            });
          }
          if (el.classList.contains('stat-gauge-fill')) {
            el.style.width = '0%';
          }
        }
      });
    },
    { threshold: 0.2 }
  );

  odometers.forEach((el) => observer.observe(el));
  gaugeFills.forEach((el) => observer.observe(el));
}
