/* Life at Vajiram & Ravi (#lifeGal; styles in css/life-gallery.css): a row of photo and video cards that scrolls sideways, snaps to
   a card and loops: copies of the shown cards sit before and after them, and whenever the row comes to rest among the copies it is
   moved, unseen, by exactly one set to the same picture among the originals. Tabs above it show all the cards, only the images or
   only the videos (the copies are made again for each). The arrows move it a card at a time. It glides on by itself, slowly and
   without stopping, while in view (the drift, below). A video card plays muted and looping while most of it is on screen. With
   prefers-reduced-motion nothing moves or plays on its own. A video with an empty data-src is a placeholder: its poster stands in. */
(() => {
  const gal = document.getElementById('lifeGal'); if (!gal) return;
  const track = gal.querySelector('.lg__track'); if (!track) return;
  const slides = [...track.querySelectorAll('.lg__slide')]; if (slides.length < 2) return;
  const auto = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let inView = false, settle = 0, moveT = 0, moving = false, jumping = false;
  let setW = 0, baseX = 0;   // the width of one set of the shown cards, gaps included

  slides.forEach((s, k) => s.style.setProperty('--td', Math.min(k, 4) * 0.08 + 's'));

  // where the row must scroll to for a card to sit at its start (the track's padding lines the first child up with the heading)
  const cards = () => [...track.children].filter(s => !s.hidden);
  // the curved row (user 2026-11-16) centres a card, so this is the scroll that brings a card's middle to the middle of the row
  const rel = s => s.offsetLeft - cards()[0].offsetLeft + (parseFloat(getComputedStyle(track).paddingLeft) || 0) + s.offsetWidth / 2 - track.clientWidth / 2;
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
    baseX = rel(shown[0]); px = track.scrollLeft; lastSet = px;
    watchVideos();
    curve();
  };
  // ---- the curve (user 2026-11-16, after a curved image gallery): the row is seen as the inside of a cylinder. Each card is turned
  // towards the middle and brought closer the further its centre is from the middle of the row (t: -1 at the left edge, 0 in the
  // middle, 1 at the right edge), so the middle card is the smallest and flat-on, and the ones at the edges are larger and angled in,
  // their outer sides tallest. The cards stay where the row lays them out; only how they are drawn changes, as the row scrolls. ----
  const ANG = 30, NEAR = 150, PERSP = 1300;   // degrees of turn, px brought closer, and the viewing distance, at the row's edges
  let cf = 0;
  function curve() {
    cf = 0;
    const all = [...track.children].filter(s => !s.hidden); if (!all.length) return;
    const half = track.clientWidth / 2, x0 = all[0].offsetLeft, pad = parseFloat(getComputedStyle(track).paddingLeft) || 0, sl = track.scrollLeft;
    const pos = all.map(s => s.offsetLeft - x0 + pad + s.offsetWidth / 2 - sl);   // read every position first, then draw
    all.forEach((s, k) => {
      const t = Math.max(-1.6, Math.min(1.6, (pos[k] - half) / half));
      s.style.transform = `perspective(${PERSP}px) translateZ(${(t * t * NEAR).toFixed(1)}px) rotateY(${(-t * ANG).toFixed(2)}deg)`;
    });
  }
  track.addEventListener('scroll', () => { if (!cf) cf = requestAnimationFrame(curve); }, { passive: true });

  // back among the originals, to the same picture (one set over looks exactly the same)
  const normalise = () => {
    if (!setW) return;
    const base = rel(firstOriginal()), x = track.scrollLeft;
    if (x >= base - 2 && x < base + setW - 2) return;
    jumping = true;
    track.scrollTo({ left: base + ((((x - base) % setW) + setW) % setW), behavior: 'auto' });
  };

  const to = left => { moving = true; clearTimeout(moveT); moveT = setTimeout(() => { moving = false; }, 1200);   // the drift waits for the glide (at most 1.2 s)
    track.scrollTo({ left, behavior: auto ? 'smooth' : 'auto' }); };
  // cards differ in width (videos are wider), so step by each card's own position; each step starts from among the originals, so
  // there is always a card to go to either side
  // the row drifts, so it is usually between two cards: an arrow goes to the next card more than half a card away, never a nudge
  const next = () => { normalise(); const x = track.scrollLeft, h = cards()[0].offsetWidth / 2, p = cards().map(rel).find(v => v > x + h); if (p !== undefined) to(p); };
  const prev = () => { normalise(); const x = track.scrollLeft, h = cards()[0].offsetWidth / 2, b = cards().map(rel).filter(v => v < x - h); if (b.length) to(b[b.length - 1]); };

  // ---- the drift (user 2026-11-16, "keep the carousel running at a slow speed without stopping"): instead of a step every few
  // seconds, the row glides left without a pause, SPEED px a second, round and round (one set on, it is moved back by one set, which
  // looks the same). It stops while the mouse is over the row (user 2026-11-16, "should stop moving when hovered"), so a picture can
  // be looked at, and glides on from there when the mouse leaves. It gives way only while something else moves the row: an arrow's
  // glide to a card, or a hand on it (a drag, a swipe, a trackpad), and carries on from wherever that leaves it. It rests while the
  // gallery is off screen or the tab is hidden (nobody sees it), and never runs with prefers-reduced-motion. ----
  const SPEED = 26;
  let px = 0, lastSet = -1, held = false, hovered = false, raf = 0, prevT = 0;
  const drift = now => {
    raf = 0;
    if (!auto || !inView || document.hidden) { prevT = 0; return; }
    const dt = prevT ? Math.min(64, now - prevT) : 0; prevT = now;
    if (!moving && !held && !hovered && setW) {
      if (Math.abs(track.scrollLeft - lastSet) > 1.5) px = track.scrollLeft;   // moved by hand or by an arrow since: carry on from there
      px += SPEED * dt / 1000;
      if (px >= baseX + setW) px -= setW;
      else if (px < baseX) px += setW;
      jumping = false;
      track.scrollLeft = px; lastSet = track.scrollLeft;
      curve();
    }
    raf = requestAnimationFrame(drift);
  };
  const schedule = () => { if (!raf && auto && inView && !document.hidden) { prevT = 0; raf = requestAnimationFrame(drift); } };
  const rail = gal.querySelector('.lg__rail') || track;   // the row and its arrows
  rail.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hovered = true; });
  rail.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hovered = false; });
  track.addEventListener('pointerdown', () => { held = true; });
  addEventListener('pointerup', () => { held = false; });
  addEventListener('pointercancel', () => { held = false; });
  track.addEventListener('touchstart', () => { held = true; }, { passive: true });
  track.addEventListener('touchend', () => { setTimeout(() => { held = false; }, 600); }, { passive: true });   // let a flick's glide finish

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
  addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { if (track.clientWidth !== rw) { rw = track.clientWidth; build(); } else curve(); }, 150); });

  build();
  new IntersectionObserver(es => {
    inView = es[0].isIntersecting;
    if (inView) gal.classList.add('is-in');
    syncVideos(); schedule();
  }, { threshold: .3 }).observe(track);
  document.addEventListener('visibilitychange', () => { syncVideos(); schedule(); });
  // only someone reading with the keyboard holds it; a mouse click keeps it going

  if (!auto) gal.classList.add('is-in');
})();
