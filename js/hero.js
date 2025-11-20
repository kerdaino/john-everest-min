/* hero.js - micro interactions for hero (CSS-first with small JS fallback)
   Optional Lottie/GSAP usage is commented so you can enable later.
*/

(function heroMicro(){
  const el = document.getElementById('hero-micro');
  if(!el) return;
  // simple breathing circle created with CSS
  el.innerHTML = '<div class="micro-circle" aria-hidden="true"></div>';
  // you can later replace with lottie player or GSAP for richer animation
})();
