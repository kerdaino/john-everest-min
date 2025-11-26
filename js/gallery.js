/* gallery.js - Swiper gallery that preserves full images (object-fit: contain)
   and wires up pagination + prev/next navigation buttons correctly.
*/

(function initGallery(){
  // SAMPLE slides - replace with CMS data or call window.updateGallerySlides([...]) later
  const slides = [
    '/assets/gallery1.jpeg',
    '/assets/gallery2.jpeg',
    '/assets/gallery3.jpeg'
  ];

  const wrapper = document.querySelector('.gallery-swiper .swiper-wrapper');
  if(!wrapper) return;

  // Clear existing slides (if any)
  wrapper.innerHTML = '';

  // Build slides with consistent wrapper and contained <img>
  slides.forEach((src, idx) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    // inject CSS var used by the echo background
    slide.style.setProperty('--slide-bg', `url("${src}")`);

    const inner = document.createElement('div');
    inner.className = 'slide-inner';

    const img = document.createElement('img');
    img.setAttribute('data-src', src);
    img.setAttribute('alt', `Gallery image ${idx + 1}`);
    img.loading = 'lazy';

    inner.appendChild(img);
    slide.appendChild(inner);
    wrapper.appendChild(slide);
  });

  // Ensure navigation elements exist (if you dynamically create them elsewhere)
  // Using buttons with classes .swiper-button-prev / .swiper-button-next in HTML
  const prevEl = document.querySelector('.gallery-swiper .swiper-button-prev');
  const nextEl = document.querySelector('.gallery-swiper .swiper-button-next');
  const paginationEl = document.querySelector('.gallery-swiper .swiper-pagination');

  // Initialize Swiper AFTER slides are inserted
  const swiper = new Swiper('.gallery-swiper', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 12,
    centeredSlides: true,
    autoHeight: false,
    lazy: {
      loadPrevNext: true,
      loadPrevNextAmount: 2,
      elementClass: 'swiper-lazy',
    },
    pagination: { el: paginationEl, clickable: true },
    navigation: {
      prevEl: prevEl,
      nextEl: nextEl
    },
    autoplay: { delay: 4000, disableOnInteraction: false },
    keyboard: { enabled: true, onlyInViewport: true },
    a11y: { enabled: true }
  });

  // Small helper to set actual src from data-src (lazy load fallback)
  function lazyLoadVisibleImages() {
    const imgs = document.querySelectorAll('.gallery-swiper img[data-src]');
    imgs.forEach(img => {
      if (!img.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    });
  }

  // initial load
  lazyLoadVisibleImages();

  // preload on slide change
  swiper.on('slideChange', () => {
    setTimeout(() => lazyLoadVisibleImages(), 120);
  });

  // expose update method for CMS integration (updates slides and refreshes navigation)
  window.updateGallerySlides = function(newSlides) {
    if (!Array.isArray(newSlides)) return;
    // remove all, then append new
    swiper.removeAllSlides();
    const newEls = newSlides.map((src, idx) => {
      return `<div class="swiper-slide" style="--slide-bg:url('${src}')">
                <div class="slide-inner">
                  <img data-src="${src}" alt="Gallery image ${idx+1}" loading="lazy" />
                </div>
              </div>`;
    });
    swiper.appendSlide(newEls);
    // ensure nav elements are re-attached (Swiper does this internally, but safe)
    swiper.params.navigation.prevEl = prevEl;
    swiper.params.navigation.nextEl = nextEl;
    swiper.navigation.init();
    swiper.navigation.update();
    lazyLoadVisibleImages();
    swiper.update();
  };

  // Accessibility: allow Enter/Space to activate buttons when focused
  [prevEl, nextEl].forEach(btn => {
    if (!btn) return;
    btn.tabIndex = 0;
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        btn.click();
      }
    });
  });

})();
