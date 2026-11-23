/* popular courses: the running edge glow visits one card at a time (user 2026-11-23). Only cards fully in view take a turn;
   each holds the glow for two laps (10s, the CSS lap is 5s), then it fades over to the next, left to right, round again.
   Paused while the banner is off screen or the tab is hidden; nothing for reduced motion. Styles: .cf-feat .cf-k.is-beam */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const HOLD = 10000;   // two 5s laps per card

  const start = sec => {
    const grid = sec.querySelector('.cf-grid');
    if (!grid) return;
    let timer = 0, current = null, seen = false;
    const inView = () => {
      const g = grid.getBoundingClientRect();
      return [...grid.querySelectorAll('.cf-k')].filter(k => {
        if (k.hidden) return false;
        const r = k.getBoundingClientRect();
        return r.left >= g.left - 2 && r.right <= g.right + 2;
      });
    };
    const step = () => {
      const cards = inView();
      if (!cards.length) { timer = setTimeout(step, 800); return; }
      const i = current ? cards.indexOf(current) : -1;
      const next = cards[(i + 1) % cards.length];
      if (current && current !== next) current.classList.remove('is-beam');
      current = next; current.classList.add('is-beam');
      timer = setTimeout(step, HOLD);
    };
    const run = yes => {
      clearTimeout(timer);
      if (yes) step();
      else if (current) { current.classList.remove('is-beam'); current = null; }
    };
    // wait for the cards' flip-in on load to finish before the first glow (they are see-through while they turn)
    let ready = false;
    setTimeout(() => { ready = true; run(seen && !document.hidden); }, 1800);
    const go = run; const gate = yes => go(ready && yes);
    new IntersectionObserver(es => { seen = es[0].isIntersecting; gate(seen && !document.hidden); }).observe(sec);
    document.addEventListener('visibilitychange', () => gate(seen && !document.hidden));
    // after the row scrolls, hand the glow to a card that is actually showing
    let st = 0;
    grid.addEventListener('scroll', () => { clearTimeout(st); st = setTimeout(() => { if (seen && !document.hidden && current && !inView().includes(current)) run(true); }, 180); }, { passive: true });
  };

  const find = () => { const sec = document.getElementById('cat-top'); if (sec && sec.querySelector('.cf-k')) { start(sec); return true; } return false; };
  if (!find()) {
    const mo = new MutationObserver(() => { if (find()) mo.disconnect(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
