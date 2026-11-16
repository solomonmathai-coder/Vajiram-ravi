/* More rank holders (#toppers .dr; styles in css/podium.css). Year tabs (2025 back to 2016) over a row of diamonds that drifts left
   in an endless loop.
   - The year: the tabs choose whose diamonds show, from window.NP_ARCHIVE (js/data/toppers-archive.js; programme names from
     window.TOPPERS, js/data/toppers.js, where the archive has none). 2025 leaves out ranks 1 to 3 (they stand on the podium above);
     other years show everyone. The page starts with 2025 written in index.html, so it reads without this script.
   - The loop: when a year's diamonds are wider than the view, the list is copied once (the copy hidden from screen readers and out of
     the tab order) and the track slides by half its width, so the copy takes the original's place without a jump; the pace is steady
     (about 34px a second) whatever the number, and it can be dragged (the loop, below). When they all fit, they stand still, centred.
     It stops while the mouse is over it, while it is off screen and while the tab is hidden. With prefers-reduced-motion it never
     drifts (it scrolls by hand).
   - 2025 (written in index.html) has each rank holder's portrait, ranks 4 to 18, as on the reference build (user 2026-11-16); the
     other years, built here, still show one placeholder portrait. */
(() => {
  const dr = document.querySelector('#toppers .dr'); if (!dr) return;
  const track = dr.querySelector('.dr__track'), view = dr.querySelector('.dr__view'), head = document.getElementById('drHead');
  const tabs = [...dr.querySelectorAll('.dr__tab')];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PIC = 'assets/img/toppers/portrait/placeholder-man.png';
  const data = window.NP_ARCHIVE;

  /* ---------- the data, tidied as the rest of the page tidies it ---------- */
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const tidyProg = p => p.replace(/^&\s*/, '').trim()
    .replace(/^IGP$/i, 'Interview Guidance Programme').replace(/\bIGP\b/g, 'Interview Guidance Programme')
    .replace(/Interview Guidance Program\b/gi, 'Interview Guidance Programme').replace(/Prelims Cum Mains/g, 'Prelims-cum-Mains');
  const progs = s => (s || '').split(/,(?![^(]*\))|\s&\s/).map(tidyProg).filter(Boolean);
  const titleWord = w => /^[A-Z]{3,}$/.test(w) ? w[0] + w.slice(1).toLowerCase() : w;
  const tidyName = n => n.replace(/\s*-\s*Rank\s*\d+$/i, '').replace(/^[^A-Za-z]+|[^A-Za-z.]+$/g, '').replace(/\.$/, '').split(' ').map(titleWord).join(' ');
  const extra = {};
  (window.TOPPERS || []).forEach(t => { if (t.c && t.r) extra[t.y + '-' + t.r] = t.c; });

  const card = (y, t) => {
    const P = progs(t.programmes || extra[y + '-' + t.rank]);
    const lab = P.slice(0, 2).map(esc).join('&nbsp;&middot; ') + (P.length > 2 ? ` +${P.length - 2} more` : '');
    return `<li class="dr__item">
      <div class="dr__fig"><span class="dr__gem" aria-hidden="true"><i></i></span><span class="dr__pic"><img src="${PIC}" alt="" width="360" height="360" decoding="async"></span></div>
      <p class="dr__n" aria-hidden="true"><small>AIR</small> ${t.rank}</p>
      <h4 class="dr__name">${esc(tidyName(t.name))}<span class="pd__vh">, All India Rank ${t.rank}</span></h4>
      ${lab ? `<p class="dr__prog">${lab}</p>` : ''}
    </li>`;
  };
  const render = y => {
    const list = ((data && data.ARCHIVE[y]) || []).slice().sort((a, b) => a.rank - b.rank).filter(t => y !== 2025 || t.rank > 3);
    track.innerHTML = list.map(t => card(y, t)).join('');
    head.textContent = y === 2025 ? 'Ranks 4 to 18, CSE 2025' : `Rank holders, CSE ${y}`;
    dr.setAttribute('aria-label', y === 2025 ? 'More UPSC CSE 2025 rank holders' : `UPSC CSE ${y} rank holders`);
  };

  /* ---------- the loop ----------
     Driven from here, not by a CSS animation, so it can be dragged (user 2026-11-16, "the user should be able to drag through this"):
     the row drifts left at SPEED px a second; a mouse or finger on it takes hold and moves it with the hand (a sideways drag; an
     up-and-down swipe still scrolls the page), a flick carries on and slows to a stop, then the drift goes on from there. It holds
     while the mouse rests over it, off screen and in a hidden tab. One copy of the list follows the original, so moving by the list's
     width looks the same, and the row is kept within that span either way. */
  const SPEED = 34;
  let looping = false, loopW = 0, off = 0, vel = 0, hover = false, drag = null, raf = 0, last = 0, moved = false;
  const wrap = () => { if (!loopW) return; let m = off % loopW; if (m > 0) m -= loopW; off = m; };
  const apply = () => { track.style.transform = looping ? `translate3d(${off.toFixed(2)}px, 0, 0)` : ''; };
  const live = () => looping && !dr.classList.contains('is-off');
  const tick = now => {
    raf = 0;
    if (!live()) { last = 0; return; }
    const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now;
    if (!drag) {
      if (Math.abs(vel) > 8) { off += vel * dt; vel *= Math.exp(-dt * 3.2); }
      else { vel = 0; if (!hover) off -= SPEED * dt; }
      wrap(); apply();
    }
    raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf && live()) { last = 0; raf = requestAnimationFrame(tick); } };
  const layout = () => {
    track.querySelectorAll('[data-copy]').forEach(c => c.remove());
    track.classList.remove('is-loop', 'is-still', 'is-drag');
    looping = false; off = 0; vel = 0; apply();
    if (still) return;
    const fits = track.scrollWidth <= view.clientWidth;
    if (fits) { track.classList.add('is-still'); return; }
    [...track.children].forEach(li => { const c = li.cloneNode(true); c.dataset.copy = ''; c.setAttribute('aria-hidden', 'true'); c.inert = true; track.appendChild(c); });
    loopW = track.scrollWidth / 2; looping = true;
    track.classList.add('is-drag'); apply(); kick();
  };
  view.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hover = true; });
  view.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hover = false; });
  view.addEventListener('pointerdown', e => {
    if (!looping || (e.pointerType === 'mouse' && e.button !== 0)) return;
    drag = { id: e.pointerId, x: e.clientX, off, lx: e.clientX, lt: performance.now(), vx: 0 }; vel = 0; moved = false;
  });
  view.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    if (!moved && Math.abs(dx) < 4) return;
    if (!moved) { moved = true; view.setPointerCapture(e.pointerId); view.classList.add('is-grabbing'); }
    const now = performance.now(), v = (e.clientX - drag.lx) / Math.max(.001, (now - drag.lt) / 1000);
    drag.vx = drag.vx * .3 + v * .7; drag.lx = e.clientX; drag.lt = now;
    off = drag.off + dx; wrap(); apply();
  });
  const release = e => {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    if (moved) vel = performance.now() - drag.lt < 90 ? Math.max(-1800, Math.min(1800, drag.vx)) : 0;
    drag = null; view.classList.remove('is-grabbing'); kick();
  };
  view.addEventListener('pointerup', release);
  view.addEventListener('pointercancel', release);
  view.addEventListener('lostpointercapture', release);
  // a drag that ends over a card is not a click on it
  view.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  view.addEventListener('dragstart', e => e.preventDefault());

  /* ---------- the tabs ---------- */
  let year = 2025, swapT = 0;
  // on narrow screens the row of years scrolls: keep the chosen one in the middle of it (the row only, never the page)
  const row = dr.querySelector('.dr__tabs');
  // the brand pill under the chosen year, as in the Programmes tabs (js/content.js placeInd)
  row.insertAdjacentHTML('beforeend', '<span class="seg__ind" aria-hidden="true"></span>');
  const ind = row.querySelector('.seg__ind');
  const placeInd = instant => {
    const t = tabs.find(x => x.getAttribute('aria-selected') === 'true'); if (!t) return;
    if (instant) ind.style.transition = 'none';
    ind.style.transform = `translateX(${t.offsetLeft}px)`; ind.style.width = t.offsetWidth + 'px';
    if (instant) { void ind.offsetWidth; ind.style.transition = ''; }
  };
  placeInd(true); row.classList.add('has-ind');
  if ('ResizeObserver' in window) new ResizeObserver(() => placeInd(false)).observe(row);
  const centre = smooth => { const t = tabs.find(x => x.getAttribute('aria-selected') === 'true'); if (!t || row.scrollWidth <= row.clientWidth) return;
    const x = row.scrollLeft + t.getBoundingClientRect().left - row.getBoundingClientRect().left;
    row.scrollTo({ left: x - (row.clientWidth - t.offsetWidth) / 2, behavior: smooth && !still ? 'smooth' : 'auto' }); };
  const choose = (tab, focus) => {
    const y = +tab.textContent.trim(); if (y === year) return;
    year = y;
    tabs.forEach(t => { const on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
    view.setAttribute('aria-labelledby', tab.id);
    if (focus) tab.focus();
    placeInd(false); centre(true);
    view.classList.add('is-sw'); clearTimeout(swapT);
    swapT = setTimeout(() => { render(y); layout(); view.classList.remove('is-sw'); }, still ? 0 : 280);
  };
  if (data) {
    tabs.forEach(t => t.addEventListener('click', () => choose(t)));
    row.addEventListener('keydown', e => {
      const shown = tabs.filter(t => !t.hidden);   // only the years on show (the older ones wait behind "View all")
      const i = shown.indexOf(document.activeElement); if (i < 0) return;
      const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: shown.length - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault(); choose(shown[(to + shown.length) % shown.length], true);
    });
    // "View all" (user 2026-11-15): the five latest years show; this brings in the older ones, and "Show fewer" puts them away again
    // (choosing the latest year if one of the older ones was chosen)
    const all = dr.querySelector(".dr__all"), older = tabs.filter(t => t.classList.contains("dr__tab--old"));
    if (all && older.length) all.addEventListener("click", () => {
      const open = all.getAttribute("aria-expanded") !== "true";
      older.forEach(t => { t.hidden = !open; });
      all.setAttribute("aria-expanded", open);
      all.querySelector(".dr__all-t").textContent = open ? "Show fewer" : "View all";
      if (!open && older.some(t => t.getAttribute("aria-selected") === "true")) choose(tabs[0]);
      requestAnimationFrame(() => { placeInd(true); centre(true); });
    });
    else if (all) all.hidden = true;
  } else (dr.querySelector(".dr__bar") || row).hidden = true;   // no data, no years to choose from

  layout(); centre(false);
  let rt = 0; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { layout(); centre(false); }, 150); });
  let seen = false;
  const sync = () => { dr.classList.toggle('is-off', !seen || document.hidden); kick(); };
  new IntersectionObserver(es => { seen = es[0].isIntersecting; sync(); }, { rootMargin: '100px 0px' }).observe(dr);
  document.addEventListener('visibilitychange', sync);
  sync();
})();
