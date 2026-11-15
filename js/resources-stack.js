/* Free resources deck (css/resources-stack.css). Each card sticks a step lower than the one before; this tips a covered card back from
   its top edge and shrinks it, a little more for each card over it (after loopsii.com: one card over it tips it back about 6.4deg
   and scales it to .955; it settles at 8deg, and each further card takes off another .045). How far a later card covers it runs from
   0 (a card's height below its own sticking place) to 1 (stuck), so the motion follows the scroll exactly. It also writes today's
   date on the Current Affairs card. Off on narrow screens (the cards stack plainly) and with reduced motion. */
(() => {
  const today = document.getElementById('rsToday');
  if (today) { const d = new Date(); today.dateTime = d.toISOString().slice(0, 10); today.textContent = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }

  const list = document.querySelector('#resources .rk'); if (!list) return;
  const cards = [...list.querySelectorAll('.rk__card')]; if (cards.length < 2) return;
  const wide = matchMedia('(min-width: 701px)'), reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;

  const frame = () => {
    raf = 0;
    if (!wide.matches || reduce.matches) { cards.forEach(c => { c.style.transform = ''; }); return; }
    const tops = cards.map(c => c.getBoundingClientRect().top);
    const stuck = cards.map(c => parseFloat(getComputedStyle(c).top));
    const cover = cards.map((c, j) => {
      const span = c.offsetHeight + 36;
      return Math.min(1, Math.max(0, 1 - (tops[j] - stuck[j]) / span));
    });
    cards.forEach((c, i) => {
      let depth = 0;
      for (let j = i + 1; j < cards.length; j++) depth += cover[j];
      if (depth <= 0.001) { c.style.transform = ''; return; }
      const tilt = 8 * (1 - Math.exp(-1.6 * depth)), scale = Math.max(.72, 1 - .045 * depth);
      c.style.transform = `perspective(1400px) rotateX(${(-tilt).toFixed(3)}deg) scale(${scale.toFixed(4)})`;
    });
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(frame); };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  wide.addEventListener?.('change', queue);
  reduce.addEventListener?.('change', queue);
  queue();
})();
