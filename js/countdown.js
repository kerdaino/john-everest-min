/* countdown.js - event timers
   Usage: include countdown.js and call startCountdown('2026-01-01', element)
*/
export function startCountdown(targetISO, el){
  const target = new Date(targetISO);
  if(isNaN(target)) return;
  function tick(){
    const diff = target - new Date();
    if(diff <= 0){
      el.textContent = 'Event started';
      clearInterval(interval);
      return;
    }
    const d = Math.floor(diff / (1000*60*60*24));
    const h = Math.floor((diff/(1000*60*60)) % 24);
    const m = Math.floor((diff/60000) % 60);
    const s = Math.floor((diff/1000) % 60);
    el.textContent = `${d}d ${h}h ${m}m ${s}s`;
  }
  tick();
  const interval = setInterval(tick, 1000);
  return () => clearInterval(interval);
}
