/* Next batches: the buttons above the row of tickets (#price, css/batches-row.css) move it one ticket at a time; each one fades out
   at its end of the row, and both hide when every ticket already fits. */
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
  const move = d => row.scrollBy({ left: d * step(), behavior: smooth ? 'smooth' : 'auto' });

  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  row.addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
})();
