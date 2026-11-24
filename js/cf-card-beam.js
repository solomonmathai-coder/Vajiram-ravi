/* popular courses: the running edge glow visits one card at a time (user 2026-11-23). Only cards fully in view take a turn.
   A relay, so the hand-over feels continuous (user 2026-11-23, "not smooth"): the glow starts each card at its left side (next
   to the card it came from), runs one and a half laps (7.5s, the CSS lap is 5s) to finish at the right side, then fades out
   there while the next card fades in from its left side; the outgoing glow keeps moving while it fades. Starts as soon as the
   first card has flipped in. Paused while the banner is off screen or the tab is hidden; nothing for reduced motion.
   Styles: .cf-feat .cf-k.is-beam (on), .is-beam-out (fading, still moving) */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const LAP = 5000;
  const HOLD = LAP * 1.5;                 // left side → round once → right side
  const START = LAP * 275 / 360;          // the gradient angle at which the bright tip sits at the card's left side
  const FADE = 900;                       // matches the CSS opacity transition
  const FIRST = 1100;                     // the first card's flip-in has settled by then

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
    // put a card's glow at its left side, ready to run
    const phase = card => document.getAnimations()
      .filter(a => a.animationName === 'cf-beam-run' && a.effect && a.effect.target === card)
      .forEach(a => { a.currentTime = START; });
    const fadeOut = card => {
      card.classList.remove('is-beam'); card.classList.add('is-beam-out');
      setTimeout(() => { if (!card.classList.contains('is-beam')) card.classList.remove('is-beam-out'); }, FADE + 100);
    };
    const step = () => {
      const cards = inView();
      if (!cards.length) { timer = setTimeout(step, 800); return; }
      const i = current ? cards.indexOf(current) : -1;
      const next = cards[(i + 1) % cards.length];
      if (current && current !== next) fadeOut(current);
      if (next !== current) { next.classList.remove('is-beam-out'); phase(next); next.classList.add('is-beam'); }
      current = next;
      timer = setTimeout(step, HOLD);
    };
    let running = false;
    const run = yes => {                  // only acts on a real change: a repeated "start" must not skip to the next card
      if (yes === running) return;
      running = yes; clearTimeout(timer);
      if (yes) step();
      else if (current) { fadeOut(current); current = null; }
    };
    let ready = false;
    setTimeout(() => { ready = true; run(seen && !document.hidden); }, FIRST);
    const gate = yes => run(ready && yes);
    new IntersectionObserver(es => { seen = es[0].isIntersecting; gate(seen && !document.hidden); }).observe(sec);
    document.addEventListener('visibilitychange', () => gate(seen && !document.hidden));
    // after the row scrolls, hand the glow to a card that is actually showing
    let st = 0;
    grid.addEventListener('scroll', () => { clearTimeout(st); st = setTimeout(() => { if (running && current && !inView().includes(current)) { clearTimeout(timer); step(); } }, 180); }, { passive: true });
  };

  const find = () => { const sec = document.getElementById('cat-top'); if (sec && sec.querySelector('.cf-k')) { start(sec); return true; } return false; };
  if (!find()) {
    const mo = new MutationObserver(() => { if (find()) mo.disconnect(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
