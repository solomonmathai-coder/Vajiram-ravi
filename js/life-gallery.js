/* Life at Vajiram & Ravi (#lifeGal; styles in css/life-gallery.css): a spotlight row (user 2026-11-16, after paraform.com's recruiters
   row, without its outline). One card stands in the middle, large and clear, its caption over its foot; the others sit either side,
   smaller and dimmed, all on one centre line. The cards are placed here: the middle one at 0, the next at half its width + the gap +
   half a side card, and so on outwards, the row running round in a circle, so it never ends (a card that wraps from one end to the
   other does so off screen, without a move). Every 2 s the next card comes to the middle, while the row is in view, the tab is
   showing and the pointer is not over it; the arrows, the arrow keys, a click on a side card and a sideways swipe move it as well.
   All / Images / Videos show only those cards. A video card plays, muted and looping, while it is in the middle (once its data-src
   names a file; until then its poster stands in). Cards are landscape or portrait, each spaced by its own width. With
   prefers-reduced-motion nothing moves on its own. */
(() => {
  const gal = document.getElementById('lifeGal'); if (!gal) return;
  const track = gal.querySelector('.lg__track'); if (!track) return;
  const slides = [...track.querySelectorAll('.lg__slide')]; if (slides.length < 2) return;
  const rail = gal.querySelector('.lg__rail');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T = 2000;   // a new picture every 2 s (user 2026-11-16; it was 3.5 s)
  let shown = slides.slice(), cur = 0, timer = 0, inView = false, hover = false, kbFocus = false;

  const px = name => parseFloat(getComputedStyle(gal).getPropertyValue(name)) || 0;
  const sizes = () => {
    // the sizes may be in vw: read them off a probe (no transition, so the width is read as set)
    const probe = document.createElement('li'); probe.className = 'lg__slide'; probe.style.cssText = 'visibility:hidden;transition:none;transform:none';
    track.appendChild(probe);
    const aw = probe.getBoundingClientRect().width;
    probe.style.width = 'var(--sw)'; const sw = probe.getBoundingClientRect().width;
    probe.remove();
    return { aw, sw, gap: px('--gap') };
  };

  // place every shown card by its distance from the middle one, the shorter way round the circle. Cards are landscape or portrait
  // (user 2026-11-16), so each is spaced by its own width: the middle one at full size, the others at the side scale.
  let lastD = new Map();
  const place = () => {
    const n = shown.length, { aw, sw, gap } = sizes(), S = sw / aw;
    const W = s => s.offsetWidth;                    // layout width, before the scale
    const at = new Map([[shown[cur], { d: 0, x: 0 }]]);
    let x = 0, prev = shown[cur], half = W(prev) / 2;
    for (let d = 1; d <= Math.floor(n / 2); d++) {    // to the right
      const s = shown[(cur + d) % n]; x += half + gap + W(s) * S / 2; half = W(s) * S / 2; at.set(s, { d, x });
    }
    x = 0; half = W(shown[cur]) / 2;
    for (let d = 1; d <= Math.ceil(n / 2) - 1; d++) { // to the left
      const s = shown[((cur - d) % n + n) % n]; x -= half + gap + W(s) * S / 2; half = W(s) * S / 2; at.set(s, { d: -d, x });
    }
    shown.forEach(s => {
      const { d, x } = at.get(s);
      const prev = lastD.get(s);
      const jump = prev !== undefined && Math.abs(d - prev) > 1;   // wrapped round: no travel across the screen
      s.classList.toggle('is-jump', jump);
      s.style.setProperty('--x', x.toFixed(1) + 'px');
      s.style.setProperty('--s', d === 0 ? '1' : S.toFixed(4));
      s.classList.toggle('is-on', d === 0);
      s.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
      lastD.set(s, d);
    });
    if (shown.some(s => s.classList.contains('is-jump'))) requestAnimationFrame(() => requestAnimationFrame(() => shown.forEach(s => s.classList.remove('is-jump'))));
    syncVideos();
  };

  const go = k => { cur = ((k % shown.length) + shown.length) % shown.length; place(); schedule(); };
  const next = () => go(cur + 1), prev = () => go(cur - 1);

  const schedule = () => {
    clearTimeout(timer);
    if (still || !inView || document.hidden || hover || kbFocus) return;
    timer = setTimeout(next, T);
  };

  // arrows, keys, clicks on side cards, swipes
  gal.querySelector('.lg__next').addEventListener('click', next);
  gal.querySelector('.lg__prev').addEventListener('click', prev);
  rail.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { next(); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { prev(); e.preventDefault(); }
  });
  let sx = null, swiped = false;
  track.addEventListener('pointerdown', e => { sx = e.clientX; swiped = false; });
  track.addEventListener('pointerup', e => {
    if (sx === null) return;
    const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 40) { swiped = true; dx < 0 ? next() : prev(); }
  });
  track.addEventListener('pointercancel', () => { sx = null; });
  track.addEventListener('click', e => {
    if (swiped) { swiped = false; return; }
    const s = e.target.closest('.lg__slide'); if (!s || s.classList.contains('is-on')) return;
    const k = shown.indexOf(s); if (k >= 0) go(k);
  });
  rail.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hover = true; schedule(); } });
  rail.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { hover = false; schedule(); } });
  gal.addEventListener('focusin', e => { kbFocus = e.target.matches(':focus-visible'); schedule(); });
  gal.addEventListener('focusout', e => { if (!gal.contains(e.relatedTarget)) { kbFocus = false; schedule(); } });

  // videos: the middle card plays (when it has a file), the rest pause
  function syncVideos() {
    slides.forEach(s => {
      const v = s.querySelector('video'); if (!v) return;
      const src = (v.dataset.src || '').trim();
      if (src && s.classList.contains('is-on') && inView && !still && !document.hidden) { if (!v.src) v.src = src; v.play().catch(() => {}); }
      else v.pause();
    });
  }

  // All / Images / Videos: the pill slides to the chosen tab; the row fades out, keeps only those cards, starts from the first, fades in
  const tabBar = gal.querySelector('.lg__tabs');
  if (tabBar) {
    const tabs = [...tabBar.querySelectorAll('.lg__tab')], ind = tabBar.querySelector('.lg__ind');
    let f = 'all', swapT = 0;
    const placeInd = instant => {
      const sel = tabs.find(b => b.getAttribute('aria-selected') === 'true'); if (!sel) return;
      ind.classList.toggle('is-instant', !!instant);
      ind.style.transform = `translateX(${sel.offsetLeft}px)`; ind.style.width = sel.offsetWidth + 'px';
      if (instant) { void ind.offsetWidth; ind.classList.remove('is-instant'); }
    };
    const apply = to => {
      slides.forEach(s => { const v = s.classList.contains('lg__slide--vid'); s.hidden = to === 'img' ? v : to === 'vid' ? !v : false; });
      shown = slides.filter(s => !s.hidden); cur = 0; lastD = new Map();
      shown.forEach(s => s.classList.add('is-jump'));
      place(); schedule();
    };
    const pick = to => {
      if (to === f) return; f = to;
      tabs.forEach(b => { const on = b.dataset.f === to; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
      placeInd(still);
      clearTimeout(swapT);
      if (still) { apply(to); return; }
      track.classList.add('is-sw');
      swapT = setTimeout(() => { apply(to); track.classList.remove('is-sw'); }, 200);
    };
    tabBar.addEventListener('click', e => { const b = e.target.closest('.lg__tab'); if (b) pick(b.dataset.f); });
    tabBar.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
      const k = tabs.findIndex(b => b.dataset.f === f), nx = tabs[(k + d + tabs.length) % tabs.length];
      pick(nx.dataset.f); nx.focus(); e.preventDefault();
    });
    placeInd(true);
    if ('ResizeObserver' in window) new ResizeObserver(() => placeInd(false)).observe(tabBar);
  }

  // first placement without movement; again when the screen changes size (the card sizes follow it)
  shown.forEach(s => s.classList.add('is-jump'));
  place();
  requestAnimationFrame(() => requestAnimationFrame(() => slides.forEach(s => s.classList.remove('is-jump'))));
  let rT = 0; addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(place, 120); });

  new IntersectionObserver(es => {
    inView = es[0].isIntersecting;
    if (inView) gal.classList.add('is-in');
    syncVideos(); schedule();
  }, { threshold: .3 }).observe(track);
  document.addEventListener('visibilitychange', () => { syncVideos(); schedule(); });
  if (still) gal.classList.add('is-in');
})();
