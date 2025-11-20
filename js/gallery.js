/* gallery.js - basic Swiper init and lazy injection of slides (can be wired to CMS) */
(function initGallery(){
  const slides = [
    'assets/placeholder.webp',
    'assets/placeholder.webp',
    'assets/placeholder.webp'
  ];
  const wrapper = document.querySelector('.gallery-swiper .swiper-wrapper');
  if(!wrapper) return;
  slides.forEach(src => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `<img src="${src}" alt="Gallery image" loading="lazy" style="width:100%;height:260px;object-fit:cover;border-radius:8px">`;
    wrapper.appendChild(slide);
  });

  const swiper = new Swiper('.gallery-swiper', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: { el: '.swiper-pagination', clickable: true },
    autoplay: { delay: 3500, disableOnInteraction: false },
  });
})();
