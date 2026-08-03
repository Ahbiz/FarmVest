import 'bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Lenis from 'lenis';

// Icon fonts bundled from npm (no production CDN dependency)
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { initPreloader } from './components/preloader';
import { initNavbar } from './components/navbar';
import { initMobileNav } from './components/mobile-nav';
import { initSliders } from './components/slider';
import { initCounters } from './components/counter';
import { initCookieConsent } from './components/cookie-consent';
import { initBackToTop } from './components/back-to-top';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Initialize AOS scroll reveals
  AOS.init({
    duration: 600,
    once: true,
    easing: 'ease-out-cubic',
  });

  // Initialize Components
  initPreloader();
  initNavbar();
  initMobileNav();
  initSliders();
  initCounters();
  initCookieConsent();
  initBackToTop();

  // FAQ Accordion Card Active Highlight Handler
  const faqAccordion = document.getElementById('faqAccordionV2');
  if (faqAccordion) {
    faqAccordion.addEventListener('show.bs.collapse', (e) => {
      const card = e.target.closest('.faq-card-v2');
      if (card) card.classList.add('is-open');
    });
    faqAccordion.addEventListener('hide.bs.collapse', (e) => {
      const card = e.target.closest('.faq-card-v2');
      if (card) card.classList.remove('is-open');
    });
  }

  // FAQ Category Filter Handler
  const catNav = document.getElementById('faqCatNav');
  if (catNav) {
    const catBtns = catNav.querySelectorAll('.faq-cat-btn');
    const faqCards = document.querySelectorAll('#faqAccordionV2 .faq-card-v2');

    catBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        catBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-faq-cat');
        faqCards.forEach((card) => {
          const cardCat = card.getAttribute('data-cat');
          if (cat === 'all' || cardCat === cat || cardCat === 'all') {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});
