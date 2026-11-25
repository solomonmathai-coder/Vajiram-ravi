/* "A decade of AIR 1s" on the Toppers page (user 2026-11-25, "we should also showcase this idea of AIR 1 as a carousel on the top
   with wreaths", after the homepage's Toppers reel): every year's All India Rank 1 from js/data/toppers-live.js, newest first, each
   shield in the next Batches colour on a gold laurel wreath, AIR 1, the name, then the year and programmes. The row drifts left in a
   seamless loop (a copy of the row follows it), can be dragged, and holds under the pointer, off screen and in a hidden tab; with
   reduced motion it stands still and can still be dragged. */
(() => {
  const D = window.TOPPERS_LIVE, track = document.getElementById('tpAir1'); if (!D || !track) return;
  const view = track.parentElement;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const PHOTO = 'assets/img/toppers/', TONES = ['gs', 'pre', 'ca', 'mains', 'mentor'];
  const tags = prog => !prog ? [] : prog.split(/,(?![^(]*\))|\s&\s/).map(t => t.trim().replace(/^&\s*/, ''))
    .filter(Boolean).map(t => /^IGP$|^Interview Guidance Program(me)?$/i.test(t) ? 'Interview Guidance' : t);

  const ones = D.rows.filter(r => r[1] === 1).sort((a, b) => b[0] - a[0])
    .map(([y, , name, prog, , file, cut]) => ({ y, name, prog, photo: PHOTO + file, cut: cut ? PHOTO + cut : '' }));
  track.innerHTML = ones.map((p, i) => `<li class="tp-ri tp-a1">
      <div class="tp-shield tp-shield--${TONES[i % TONES.length]}"><span class="tp-a1__laurel" aria-hidden="true"></span><span class="tp-shield__gem" aria-hidden="true"></span>
        <span class="tp-shield__pic"><img${p.cut ? '' : ' class="is-boxed"'} src="${esc(p.cut || p.photo)}" alt="" loading="lazy" decoding="async" draggable="false"></span></div>
      <span class="tp-card__air"><small>AIR</small> 1</span>
      <span class="tp-a1__yr">UPSC CSE ${p.y}</span>
      <span class="tp-ri__name">${esc(p.name)}</span>
    </li>`).join('');
  const sr = document.getElementById('tpAir1Sr');
  if (sr) sr.textContent = ones.map(p => `${p.y}: ${p.name}`).join('; ');

  // the loop: copies of the row after it (enough to fill the window), the track moved left by the time and wrapped every row's width
  const SPEED = 36;   // px a second
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let setW = 0, x = 0, drag = null, hover = false, seen = true, last = 0;
  const build = () => {
    track.querySelectorAll('.tp-a1[data-copy]').forEach(li => li.remove());
    const items = [...track.children], first = items[0], end = items[items.length - 1];
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    setW = end.offsetLeft + end.offsetWidth + gap - first.offsetLeft;
    for (let k = 0, n = Math.ceil(view.clientWidth / setW) + 1; k < n; k++)
      items.forEach(li => { const c = li.cloneNode(true); c.dataset.copy = ''; c.setAttribute('aria-hidden', 'true'); c.inert = true; track.appendChild(c); });
  };
  const wrap = v => { const w = setW || 1; return ((v % w) - w) % w; };
  const tick = t => {
    const dt = last ? Math.min(.05, (t - last) / 1000) : 0; last = t;
    if (!drag && !hover && seen && !document.hidden && !reduce.matches) x -= SPEED * dt;
    x = wrap(x); track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    requestAnimationFrame(tick);
  };
  build(); requestAnimationFrame(tick);

  view.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hover = true; });
  view.addEventListener('pointerleave', () => { hover = false; });
  view.addEventListener('pointerdown', e => {
    if (e.button) return;
    drag = { x0: e.clientX, start: x, id: e.pointerId }; view.classList.add('is-drag');
  });
  addEventListener('pointermove', e => { if (drag && e.pointerId === drag.id) x = drag.start + (e.clientX - drag.x0); });
  const end = () => { if (drag) { drag = null; view.classList.remove('is-drag'); } };
  addEventListener('pointerup', end); addEventListener('pointercancel', end);
  if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(en => { seen = en.isIntersecting; })).observe(view);
  let raf = 0;
  addEventListener('resize', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(build); });
})();
