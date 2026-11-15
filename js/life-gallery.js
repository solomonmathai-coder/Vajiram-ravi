/* Life at Vajiram & Ravi (#lifeGal; styles in css/life-gallery.css): a row of photo and video cards that scrolls sideways, snaps to
   a card and loops: copies of the shown cards sit before and after them, and whenever the row comes to rest among the copies it is
   moved, unseen, by exactly one set to the same picture among the originals. Tabs above it show all the cards, only the images or
   only the videos (the copies are made again for each). The arrows move it a card at a time. It moves on by itself every 3.5 s while
   in view; it keeps going under the pointer and after a click, holds while keyboard focus is in it or the tab is hidden, and waits a
   full turn after someone scrolls it by hand. A video card plays muted and looping while most of it is on screen. With
   prefers-reduced-motion nothing moves or plays on its own. A video with an empty data-src is a placeholder: its poster stands in. */
(() => {
  const gal = document.getElementById('lifeGal'); if (!gal) return;
  const track = gal.querySelector('.lg__track'); if (!track) return;
  const slides = [...track.querySelectorAll('.lg__slide')]; if (slides.length < 2) return;
  const auto = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T = 3500;
  let inView = false, kbFocus = false, timer = 0, settle = 0, moving = false, jumping = false;
  let setW = 0;   // the width of one set of the shown cards, gaps included

  slides.forEach((s, k) => s.style.setProperty('--td', Math.min(k, 4) * 0.08 + 's'));

  // where the row must scroll to for a card to sit at its start (the track's padding lines the first child up with the heading)
  const cards = () => [...track.children].filter(s => !s.hidden);
  const rel = s => s.offsetLeft - cards()[0].offsetLeft;
  const firstOriginal = () => slides.find(s => !s.hidden);

  // ---- the loop: copies of the shown cards either side ----
  const build = () => {
    track.querySelectorAll('.is-copy').forEach(c => c.remove());
    const shown = slides.filter(s => !s.hidden); if (!shown.length) { setW = 0; return; }
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const last = shown[shown.length - 1];
    setW = last.offsetLeft + last.offsetWidth + gap - shown[0].offsetLeft;
    // enough copies each side that a screen's width of cards is always there to scroll into
    const n = Math.max(1, Math.ceil(track.clientWidth / setW));
    // the copies show the same files as the originals (already fetched), so they need not wait to come near the screen
    const copy = s => { const c = s.cloneNode(true); c.classList.add('is-copy'); c.setAttribute('aria-hidden', 'true'); c.inert = true; c.querySelectorAll('img').forEach(i => { i.loading = 'eager'; }); return c; };
    for (let k = 0; k < n; k++) {
      track.prepend(...shown.map(copy));
      track.append(...shown.map(copy));
    }
    track.scrollTo({ left: rel(shown[0]), behavior: 'auto' });
    watchVideos();
  };
  // back among the originals, to the same picture (one set over looks exactly the same)
  const normalise = () => {
    if (!setW) return;
    const base = rel(firstOriginal()), x = track.scrollLeft;
    if (x >= base - 2 && x < base + setW - 2) return;
    jumping = true;
    track.scrollTo({ left: base + ((((x - base) % setW) + setW) % setW), behavior: 'auto' });
  };

  const to = left => { moving = true; track.scrollTo({ left, behavior: auto ? 'smooth' : 'auto' }); };
  // cards differ in width (videos are wider), so step by each card's own position; each step starts from among the originals, so
  // there is always a card to go to either side
  const next = () => { normalise(); const x = track.scrollLeft, p = cards().map(rel).find(v => v > x + 4); if (p !== undefined) to(p); };
  const prev = () => { normalise(); const x = track.scrollLeft, b = cards().map(rel).filter(v => v < x - 4); if (b.length) to(b[b.length - 1]); };

  const schedule = () => {
    clearTimeout(timer);
    if (!auto || !inView || document.hidden || kbFocus) return;
    timer = setTimeout(() => { next(); schedule(); }, T);
  };

  gal.querySelector('.lg__next').addEventListener('click', () => { next(); schedule(); });
  gal.querySelector('.lg__prev').addEventListener('click', () => { prev(); schedule(); });
  gal.addEventListener('keydown', e => {
    if (e.target.closest('.lg__rail')) {
      if (e.key === 'ArrowRight') { next(); schedule(); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { prev(); schedule(); e.preventDefault(); }
    }
  });
  // once the row comes to rest it is put back among the originals; a scroll by hand (swipe, trackpad) also restarts the count
  track.addEventListener('scroll', () => {
    if (jumping) { jumping = false; return; }
    clearTimeout(settle);
    settle = setTimeout(() => { normalise(); if (!moving) schedule(); moving = false; }, 140);
  }, { passive: true });

  // videos (copies included): play while most of the card is on screen and the gallery is in view
  let vids = [];
  const syncVideos = () => vids.forEach(o => {
    if (!o.src) return;
    if (auto && inView && o.seen && !document.hidden) { if (!o.v.src) o.v.src = o.src; o.v.play().catch(() => {}); }
    else o.v.pause();
  });
  const vio = new IntersectionObserver(es => {
    es.forEach(e => { const o = vids.find(x => x.v === e.target); if (o) o.seen = e.isIntersecting; });
    syncVideos();
  }, { root: track, threshold: .6 });
  function watchVideos() {
    vio.disconnect();
    vids.forEach(o => o.v.pause());
    vids = cards().map(s => s.querySelector('video')).filter(Boolean).map(v => ({ v, src: (v.dataset.src || '').trim(), seen: false }));
    vids.forEach(o => vio.observe(o.v));
  }

  // All / Images / Videos: the brand pill slides to the chosen tab; the row fades out, keeps only those cards (with their copies),
  // starts again from the first and fades back in
  const tabBar = gal.querySelector('.lg__tabs');
  if (tabBar) {
    const tabs = [...tabBar.querySelectorAll('.lg__tab')], ind = tabBar.querySelector('.lg__ind');
    let cur = 'all', swapT = 0;
    const placeInd = instant => {
      const sel = tabs.find(b => b.getAttribute('aria-selected') === 'true'); if (!sel) return;
      ind.classList.toggle('is-instant', !!instant);
      ind.style.transform = `translateX(${sel.offsetLeft}px)`; ind.style.width = sel.offsetWidth + 'px';
      if (instant) { void ind.offsetWidth; ind.classList.remove('is-instant'); }
    };
    const apply = f => {
      slides.forEach(s => { const v = s.classList.contains('lg__slide--vid'); s.hidden = f === 'img' ? v : f === 'vid' ? !v : false; });
      build();
    };
    const pick = f => {
      if (f === cur) return;
      cur = f;
      tabs.forEach(b => { const on = b.dataset.f === f; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
      placeInd(!auto);
      clearTimeout(swapT);
      if (!auto) { apply(f); schedule(); return; }
      track.classList.add('is-sw');
      swapT = setTimeout(() => { apply(f); track.classList.remove('is-sw'); syncVideos(); schedule(); }, 200);
    };
    tabBar.addEventListener('click', e => { const b = e.target.closest('.lg__tab'); if (b) pick(b.dataset.f); });
    tabBar.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
      const k = tabs.findIndex(b => b.dataset.f === cur), nx = tabs[(k + d + tabs.length) % tabs.length];
      pick(nx.dataset.f); nx.focus(); e.preventDefault();
    });
    placeInd(true);
    // web fonts and resizes change the label widths; the pill follows
    if ('ResizeObserver' in window) new ResizeObserver(() => placeInd(false)).observe(tabBar);
  }

  // the card widths follow the screen, so the copies are made again when it changes size
  let rw = track.clientWidth, rT = 0;
  addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { if (track.clientWidth !== rw) { rw = track.clientWidth; build(); } }, 150); });

  build();
  new IntersectionObserver(es => {
    inView = es[0].isIntersecting;
    if (inView) gal.classList.add('is-in');
    syncVideos(); schedule();
  }, { threshold: .3 }).observe(track);
  document.addEventListener('visibilitychange', () => { syncVideos(); schedule(); });
  // only someone reading with the keyboard holds it; a mouse click keeps it going
  gal.addEventListener('focusin', e => { kbFocus = e.target.matches(':focus-visible'); schedule(); });
  gal.addEventListener('focusout', e => { if (!gal.contains(e.relatedTarget)) { kbFocus = false; schedule(); } });
  if (!auto) gal.classList.add('is-in');
})();
