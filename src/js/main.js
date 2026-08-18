import * as bootstrap from 'bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Lenis from 'lenis';
import '../css/style.css';

// Expose bootstrap globally for dynamic modal handlers
window.bootstrap = bootstrap;

// Icon fonts bundled from npm (no production CDN dependency)
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css';
import { createIcons, icons } from 'lucide';

import { initPreloader } from './components/preloader.js';
import { initNavbar } from './components/navbar.js';
import { initMobileNav } from './components/mobile-nav.js';
import { initSliders } from './components/slider.js';
import { initCounters } from './components/counter.js';
import { initCookieConsent } from './components/cookie-consent.js';
import { initBackToTop } from './components/back-to-top.js';
import { initAboutAnimations } from './components/about-gsap.js';
import { initYieldPools } from './components/yield-pools.js';
import { initBlogInsights } from './components/blog-insights.js';
import { initBlogDetails } from './components/blog-details.js';
import { initFaqSearch } from './components/faq-search.js';
import { initAuthForms } from './auth.js';
import { initCartDrawer } from './components/cart-drawer.js';
import { initStoreCatalog } from './components/store-catalog.js';

document.addEventListener('DOMContentLoaded', () => {
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

  AOS.init({
    duration: 600,
    once: true,
    easing: 'ease-out-cubic',
  });

  createIcons({ icons });

  initPreloader();
  initNavbar();
  initMobileNav();
  initCartDrawer();
  initSliders();
  initCounters();
  initCookieConsent();
  initBackToTop();
  initAboutAnimations();
  initYieldPools();
  initStoreCatalog();
  initBlogInsights();
  initBlogDetails();
  initFaqSearch();
  initAuthForms();

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
