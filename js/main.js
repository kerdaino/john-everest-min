/* set footer year */
(function setYear(){
  const years = document.querySelectorAll('#year, #yearFooter');
  const y = new Date().getFullYear();
  years.forEach(el => el.textContent = y);
})();

/* mobile menu toggle */
(function mobileMenu(){
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mainNavList');
  if(!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    nav.style.display = open ? 'none' : 'flex';
  });
})();

/* bank details toggle */
document.getElementById('bankDetailsBtn')?.addEventListener('click', () => {
  const bd = document.getElementById('bankDetails');
  if(!bd) return;
  bd.hidden = !bd.hidden;
});

/* basic input sanitization helper (use server-side as source of truth) */
function sanitizeInput(str) {
  if (!str) return '';
  return String(str).replace(/[<>]/g, '');
}

/* simple fetch wrapper to handle JSON errors */
async function fetchJSON(url, opts){
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Network error');
  }
  return res.json();
}
