/* Next batches: the buttons on the two sides of the row of tickets (#price, css/batches-row.css) move it a whole screenful at a time,
   as many tickets as show at once (4 on wide screens, 3, 2, 1 on narrower ones: the row's --per), in one glide (user 2026-11-16: "the 4
   cards should change at once, not one by one"); each one hides at its end of the row, and both hide when every ticket already fits. */
(() => {
  const row = document.getElementById('price'), nav = document.querySelector('#batches .bnav'); if (!row || !nav) return;
  const prev = nav.querySelector('.bnav__prev'), next = nav.querySelector('.bnav__next');
  const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  const step = () => {
    const a = row.children[0], b = row.children[1];
    return a && b ? b.offsetLeft - a.offsetLeft : row.clientWidth;
  };
  const update = () => {
    const max = row.scrollWidth - row.clientWidth;
    nav.classList.toggle('is-none', max <= 2);
    prev.disabled = row.scrollLeft <= 2;
    next.disabled = row.scrollLeft >= max - 2;
  };
  const per = () => Math.max(1, parseInt(getComputedStyle(row).getPropertyValue('--per'), 10) || 1);
  const move = d => row.scrollBy({ left: d * step() * per(), behavior: smooth ? 'smooth' : 'auto' });

  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  row.addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
})();
