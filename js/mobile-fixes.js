/* Phone fixes (Anima, 2026-11-16; styles in css/mobile-fixes.css). Phones only (760px and narrower).
   - The WhatsApp button steps aside while you scroll down and over the footer, and comes back when you scroll up.
   - Every sideways row (Why, batches, resources, Life at V&R) gets one control bar under it: arrows either side of its dots.
   - The programme tabs show that the row goes on (fade + arrow), and the footer's link groups open on a tap. */
(() => {
  const phone = matchMedia('(max-width: 760px)');

  /* ---- WhatsApp: out of the way while scrolling down ---- */
  // The footer is sticky behind the page and slides out from under it at the end, so "over the footer" means the page above it has
  // scrolled up past the bottom of the screen.
  const wa = document.getElementById('waBtn'), foot = document.querySelector('.vf');
  if (wa) {
    let lastY = scrollY, down = false;
    const above = foot && document.querySelector('main');
    const overFoot = () => !!above && above.getBoundingClientRect().bottom < innerHeight - 40;
    const set = () => wa.classList.toggle('wa--tuck', phone.matches && ((down && scrollY > 240) || overFoot()));
    addEventListener('scroll', () => {
      const y = scrollY;
      if (Math.abs(y - lastY) < 8) return;
      down = y > lastY; lastY = y; set();
    }, { passive: true });
    phone.addEventListener('change', set);
  }

  /* ---- One control bar for every sideways row on phones (user 2026-11-16: "for every carousel use and place the same arrows and
     indicators"): under the row, previous arrow, a dot per card, next arrow, as the hero and the banners under it have. A dot takes you
     to its card; the arrows step one card; the current card's dot is the long one; the arrows dim at the row's ends. The rows' own side
     arrows are hidden on phones (css/mobile-fixes.css). ---- */
  const CHEV = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  // loop: the row repeats its cards (copies marked by the class given) so it can run on for ever; the dots then stand for the real
  // cards, the current one whichever copy is showing, and the arrows never dim.
  const pager = ({ row, items, label, tone, after, loop }) => {
    if (!row) return;
    const bar = document.createElement('div');
    bar.className = `mpg mpg--${tone}`;
    bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', `Choose ${label}`);
    bar.innerHTML = `<button type="button" class="mpg__btn mpg__btn--prev" aria-label="Previous ${label}">${CHEV('M15 6L9 12L15 18')}</button>` +
      `<span class="mpg__dots"></span><button type="button" class="mpg__btn mpg__btn--next" aria-label="Next ${label}">${CHEV('M9 6L15 12L9 18')}</button>`;
    (after || row).insertAdjacentElement('afterend', bar);
    const prev = bar.querySelector('.mpg__btn--prev'), next = bar.querySelector('.mpg__btn--next'), dotsBox = bar.querySelector('.mpg__dots');
    const list = () => items().filter(el => el.getBoundingClientRect().width > 0);
    const start = () => row.getBoundingClientRect().left + (parseFloat(getComputedStyle(row).scrollPaddingLeft) || 0);
    const atEnd = () => row.scrollLeft >= row.scrollWidth - row.clientWidth - 2;
    const realN = els => (loop ? els.filter(el => !el.classList.contains(loop)).length : els.length) || 1;
    const current = els => {
      if (!loop && atEnd()) return els.length - 1;
      const s = start(); let best = 0, gap = Infinity;
      els.forEach((el, k) => { const g = Math.abs(el.getBoundingClientRect().left - s); if (g < gap) { gap = g; best = k; } });
      return best;
    };
    const go = (n, dot) => {
      const els = list(); if (!els.length) return;
      let el = els[Math.max(0, Math.min(els.length - 1, n))];
      if (loop && dot) {   // the copy of that card nearest to where the row is now
        const N = realN(els), s = start();
        el = els.filter((_, k) => k % N === n).sort((a, b) => Math.abs(a.getBoundingClientRect().left - s) - Math.abs(b.getBoundingClientRect().left - s))[0] || el;
      }
      row.scrollTo({ left: row.scrollLeft + el.getBoundingClientRect().left - start(), behavior: smooth ? 'smooth' : 'auto' });
    };
    let count = -1;
    const sync = () => {
      const els = list();
      if (realN(els) !== count) {
        count = realN(els);
        dotsBox.innerHTML = els.map((_, k) => `<button type="button" aria-label="${label} ${k + 1} of ${count}"></button>`).join('');
      }
      const k = current(els) % count, off = row.classList.contains('is-open');
      [...dotsBox.children].forEach((d, j) => { d.classList.toggle('is-on', j === k); if (j === k) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      prev.disabled = off || (!loop && (row.scrollLeft <= 2 || k === 0));
      next.disabled = off || (!loop && atEnd());
      bar.hidden = off || count < 2 || row.scrollWidth <= row.clientWidth + 2;
    };
    prev.addEventListener('click', () => go(current(list()) - 1));
    next.addEventListener('click', () => go(current(list()) + 1));
    dotsBox.addEventListener('click', e => { const d = e.target.closest('button'); if (d) go([...dotsBox.children].indexOf(d), true); });
    let raf = 0;
    const later = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; sync(); }); };
    row.addEventListener('scroll', later, { passive: true });
    addEventListener('resize', later); addEventListener('load', later);
    if ('ResizeObserver' in window) new ResizeObserver(later).observe(row);
    new MutationObserver(later).observe(row, { attributes: true, subtree: true, attributeFilter: ['class', 'aria-hidden', 'hidden', 'style'] });
    phone.addEventListener('change', later);
    sync();
  };
  const q = s => document.querySelector(s);
  const after = (row, wrap) => (row && row.closest(wrap)) || row;
  pager({ row: q('#story .cmp__track'), items: () => [...document.querySelectorAll('#story .cmp__track > .cmp__p')], label: 'reason', tone: 'dark', after: after(q('#story .cmp__track'), '.mcar') });
  pager({ row: q('#price'), items: () => [...document.querySelectorAll('#price > *')], label: 'batch', tone: 'light', after: after(q('#price'), '.brow') });
  pager({ row: q('#resources .rk'), items: () => [...document.querySelectorAll('#resources .rk > .rk__card')], label: 'resource', tone: 'light', after: after(q('#resources .rk'), '.mcar') });
  // Free resources as Kevin rebuilt it (folders in a sideways row, 2026-11-16)
  pager({ row: q('#resources .sm__grid--res'), items: () => [...document.querySelectorAll('#resources .sm__grid--res > .sm__card')], label: 'resource', tone: 'light', after: after(q('#resources .sm__grid--res'), '.mcar') });

  /* Life at Vajiram & Ravi as Kevin rebuilt it (a spotlight row that moves by itself rather than scrolling, js/life-gallery.js): the same
     bar, driven through the gallery's own controls. The arrows press its previous / next buttons (hidden on phones), a dot clicks its
     card (a click on a side card brings it to the middle), and the lit dot is the card in the middle (.is-on). */
  const lg = document.getElementById('lifeGal'), lgTrack = lg && lg.querySelector('.lg__track');
  if (lg && lgTrack && lg.querySelector('.lg__prev')) {
    const bar = document.createElement('div');
    bar.className = 'mpg mpg--dark'; bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'Choose photo');
    bar.innerHTML = `<button type="button" class="mpg__btn mpg__btn--prev" aria-label="Previous photo">${CHEV('M15 6L9 12L15 18')}</button>` +
      `<span class="mpg__dots"></span><button type="button" class="mpg__btn mpg__btn--next" aria-label="Next photo">${CHEV('M9 6L15 12L9 18')}</button>`;
    (lg.querySelector('.lg__rail') || lgTrack).insertAdjacentElement('afterend', bar);
    const dotsBox = bar.querySelector('.mpg__dots');
    const cards = () => [...lgTrack.querySelectorAll('.lg__slide')].filter(c => !c.hidden && getComputedStyle(c).display !== 'none');
    let count = -1;
    const sync = () => {
      const cs = cards();
      if (cs.length !== count) { count = cs.length; dotsBox.innerHTML = cs.map((_, k) => `<button type="button" aria-label="Photo ${k + 1} of ${count}"></button>`).join(''); }
      const k = cs.findIndex(c => c.classList.contains('is-on'));
      [...dotsBox.children].forEach((d, j) => { d.classList.toggle('is-on', j === k); if (j === k) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      bar.hidden = count < 2;
    };
    bar.querySelector('.mpg__btn--prev').addEventListener('click', () => lg.querySelector('.lg__prev').click());
    bar.querySelector('.mpg__btn--next').addEventListener('click', () => lg.querySelector('.lg__next').click());
    dotsBox.addEventListener('click', e => { const d = e.target.closest('button'); if (!d) return; const c = cards()[[...dotsBox.children].indexOf(d)]; if (c) c.click(); });
    let raf = 0;
    new MutationObserver(() => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; sync(); }); }).observe(lgTrack, { attributes: true, subtree: true, attributeFilter: ['class', 'hidden'] });
    sync();
  }

  /* ---- Programme tabs on phones: they don't all fit, so the bar runs off the edge with a fade and an arrow (css/mobile-fixes.css);
     the arrow slides the bar on, and a chosen tab near an edge is brought fully into view ---- */
  const tabsWrap = document.querySelector('#courses .ptabs'), tabs = document.getElementById('ptabs');
  if (tabsWrap && tabs) {
    tabsWrap.insertAdjacentHTML('beforeend', `<button type="button" class="ptabs__more" aria-label="More programme types" tabindex="-1">${CHEV('M9 6L15 12L9 18')}</button>`);
    const moreBtn = tabsWrap.querySelector('.ptabs__more');
    const ends = () => {
      tabsWrap.classList.toggle('can-left', phone.matches && tabs.scrollLeft > 2);
      tabsWrap.classList.toggle('can-right', phone.matches && tabs.scrollLeft < tabs.scrollWidth - tabs.clientWidth - 2);
    };
    moreBtn.addEventListener('click', () => tabs.scrollBy({ left: tabs.clientWidth * .6, behavior: smooth ? 'smooth' : 'auto' }));
    tabs.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || !phone.matches) return;
      const l = b.offsetLeft, r = l + b.offsetWidth, room = 56;
      if (r > tabs.scrollLeft + tabs.clientWidth - room) tabs.scrollTo({ left: r - tabs.clientWidth + room, behavior: smooth ? 'smooth' : 'auto' });
      else if (l < tabs.scrollLeft + 24) tabs.scrollTo({ left: Math.max(0, l - 24), behavior: smooth ? 'smooth' : 'auto' });
    });
    tabs.addEventListener('scroll', ends, { passive: true });
    addEventListener('resize', ends); addEventListener('load', ends);
    if ('ResizeObserver' in window) new ResizeObserver(ends).observe(tabs);
    phone.addEventListener('change', ends);
    ends();
  }

  /* ---- Footer: a tap opens a group of links ---- */
  document.querySelectorAll('.vf__col').forEach((col, i) => {
    const h = col.querySelector('.vf__h'), list = col.querySelector(':scope > ul');
    if (!h || !list) return;
    list.id = list.id || `vfList${i}`;
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'vf__fold';
    btn.setAttribute('aria-controls', list.id);
    btn.innerHTML = h.innerHTML;
    h.replaceChildren(btn);
    col.classList.add('has-fold');
    const sync = () => btn.setAttribute('aria-expanded', String(!phone.matches || col.classList.contains('is-open')));
    btn.addEventListener('click', () => { if (!phone.matches) return; col.classList.toggle('is-open'); sync(); });
    phone.addEventListener('change', sync);
    sync();
  });
})();
