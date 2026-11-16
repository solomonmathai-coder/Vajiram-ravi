/* Phone carousels (user 2026-11-16, "mobile version updates"; styles in css/mobile.css). On screens 760px and narrower the Why section's
   six reasons and the Free resources cards scroll sideways, one card at a time with a quarter of the next showing. This adds the site's
   chevron arrows at their two sides, centred on the cards: a click moves one card; the arrow at an end of the row is hidden. The rows
   themselves are plain scroll-snap lists, so a swipe works without this. On wider screens the arrows are not shown. */
(() => {
  const CHEV = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const phone = matchMedia('(max-width: 760px)');
  const rows = [
    { row: document.querySelector('#story .cmp__track'), label: 'reason' },
    { row: document.querySelector('#resources .sm__grid--res'), label: 'resource' }
  ].filter(r => r.row);

  rows.forEach(({ row, label }) => {
    const wrap = document.createElement('div');
    wrap.className = 'mcar';
    row.parentNode.insertBefore(wrap, row);
    wrap.appendChild(row);
    wrap.insertAdjacentHTML('beforeend',
      `<button type="button" class="mcar__btn mcar__btn--prev" aria-label="Previous ${label}">${CHEV('M15 6L9 12L15 18')}</button>` +
      `<button type="button" class="mcar__btn mcar__btn--next" aria-label="Next ${label}">${CHEV('M9 6L15 12L9 18')}</button>`);
    const prev = wrap.querySelector('.mcar__btn--prev'), next = wrap.querySelector('.mcar__btn--next');
    const stepW = () => { const c = row.children[0]; return c ? c.getBoundingClientRect().width + (parseFloat(getComputedStyle(row).columnGap) || 0) : row.clientWidth; };
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    prev.addEventListener('click', () => row.scrollBy({ left: -stepW(), behavior: smooth ? 'smooth' : 'auto' }));
    next.addEventListener('click', () => row.scrollBy({ left: stepW(), behavior: smooth ? 'smooth' : 'auto' }));
    const ends = () => {
      prev.disabled = row.scrollLeft <= 2;
      next.disabled = row.scrollLeft >= row.scrollWidth - row.clientWidth - 2;
    };
    // centre the arrows on the cards' picture (the first image in a card), else on the cards
    const centre = () => {
      const c = row.children[0]; if (!c) return;
      const pic = c.querySelector('figure, .rmk, img');
      const box = (pic || c).getBoundingClientRect(), w = wrap.getBoundingClientRect();
      wrap.style.setProperty('--mcar-y', (box.top - w.top + box.height / 2) + 'px');
    };
    row.addEventListener('scroll', ends, { passive: true });
    addEventListener('resize', () => { ends(); centre(); });
    addEventListener('load', () => { ends(); centre(); });
    if ('ResizeObserver' in window) new ResizeObserver(() => { ends(); centre(); }).observe(row);
    phone.addEventListener('change', () => { ends(); centre(); });
    ends(); centre();
  });
})();
