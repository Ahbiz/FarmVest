import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAboutAnimations() {
  const aboutPage = document.querySelector('.about-page');
  if (!aboutPage) return;

  // 1. Hero text animation
  gsap.from('.ab-hero-banner__content', {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });

  // 2. Soil Section Animations
  gsap.from('.soil-img-stack__main', {
    scrollTrigger: {
      trigger: '.ab-soil-sec',
      start: 'top 75%'
    },
    x: -50,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  });

  gsap.from('.soil-img-stack__overlap', {
    scrollTrigger: {
      trigger: '.ab-soil-sec',
      start: 'top 75%'
    },
    x: 50,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    ease: 'power2.out'
  });

  // 3. Vision Cards Stagger
  gsap.from('.vision-card', {
    scrollTrigger: {
      trigger: '.ab-vision-sec',
      start: 'top 75%'
    },
    y: 40,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8,
    ease: 'power2.out'
  });

  // 4. Process Cards Stagger
  gsap.from('.process-card', {
    scrollTrigger: {
      trigger: '.ab-process-sec',
      start: 'top 75%'
    },
    y: 50,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power2.out'
  });

  // 5. Team Cards Stagger
  gsap.from('.team-card', {
    scrollTrigger: {
      trigger: '.ab-team-sec',
      start: 'top 75%'
    },
    y: 45,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power2.out'
  });

  // 6. Testimonial Cards Stagger
  gsap.from('.review-card', {
    scrollTrigger: {
      trigger: '.ab-reviews-sec',
      start: 'top 75%'
    },
    y: 40,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8,
    ease: 'power2.out'
  });

  // 7. FAQ Accordion Toggle Interactivity
  const faqItems = document.querySelectorAll('.faq-item-card');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-toggle-btn');
    const answer = item.querySelector('.faq-answer-body');

    if (btn && answer) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Close all other items
        faqItems.forEach(other => {
          other.classList.remove('is-open');
          const otherAns = other.querySelector('.faq-answer-body');
          if (otherAns) otherAns.style.display = 'none';
        });

        // Toggle current item
        if (!isOpen) {
          item.classList.add('is-open');
          answer.style.display = 'block';
        }
      });
    }
  });
}
