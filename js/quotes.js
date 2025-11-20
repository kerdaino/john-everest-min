/* quotes.js - simple rotating quotes for the hero */
const quotes = [
  "Faith moves mountains.",
  "Pray until something happens.",
  "Love never fails."
];
let qIndex = 0;
const qEl = document.getElementById('quoteText');
const qMore = document.getElementById('quoteMore');

function rotateQuote(){
  if(!qEl) return;
  qIndex = (qIndex + 1) % quotes.length;
  qEl.classList.add('fade');
  setTimeout(()=> {
    qEl.textContent = quotes[qIndex];
    qEl.classList.remove('fade');
  }, 300);
}

setInterval(rotateQuote, 5000);
if(qMore) qMore.addEventListener('click', (e)=>{/* default link handles it */});
