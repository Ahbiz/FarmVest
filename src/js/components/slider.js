import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export function initSliders() {
  // Testimonials Slider (Fast Autoplay & Custom Circular Navigation)
  if (document.querySelector('.testimonial-slider')) {
    new Swiper('.testimonial-slider', {
      modules: [Autoplay, Navigation, Pagination, Mousewheel],
      slidesPerView: 1.15,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 2200,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      mousewheel: {
        forceToAxis: true,
        releaseOnEdges: true,
      },
      navigation: {
        nextEl: '.testimonial-next',
        prevEl: '.testimonial-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        576: { slidesPerView: 2, spaceBetween: 24 },
        992: { slidesPerView: 3, spaceBetween: 28 },
      },
    });
  }

  // Popular Yield Offers Slider (Vid2.mp4 style)
  if (document.querySelector('.offers-slider')) {
    new Swiper('.offers-slider', {
      modules: [Autoplay, Navigation, Pagination, Mousewheel],
      slidesPerView: 1.15,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3200,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      mousewheel: {
        forceToAxis: true,
        releaseOnEdges: true,
      },
      navigation: {
        nextEl: '.offer-next',
        prevEl: '.offer-prev',
      },
      breakpoints: {
        576: { slidesPerView: 2, spaceBetween: 24 },
        992: { slidesPerView: 3, spaceBetween: 24 },
        1200: { slidesPerView: 4, spaceBetween: 24 },
      },
    });
  }

  // Interactive Horizontal Investment Opportunities Track / Scroll Slider
  if (document.querySelector('.project-slider')) {
    new Swiper('.project-slider', {
      modules: [Autoplay, Navigation, Pagination, Mousewheel],
      slidesPerView: 1.1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      mousewheel: {
        forceToAxis: true,
        releaseOnEdges: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        576: { slidesPerView: 2, spaceBetween: 24 },
        992: { slidesPerView: 3, spaceBetween: 24 },
        1200: { slidesPerView: 4, spaceBetween: 24 },
      },
    });
  }

  // Partner brands slider
  if (document.querySelector('.brand-slider')) {
    new Swiper('.brand-slider', {
      modules: [Autoplay],
      slidesPerView: 2,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      breakpoints: {
        576: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        992: { slidesPerView: 6 },
      },
    });
  }
}
