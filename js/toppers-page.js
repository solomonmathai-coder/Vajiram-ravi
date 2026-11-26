/* The Toppers page (toppers.html, branch kevin-toppers). Three kinds of toppers, as in the live site's Toppers menu (user 2026-11-25,
   "there are 3 toppers categories, you can show this in the tab"): CSE toppers, IFoS toppers and toppers' answer sheets, picked with
   the category tabs in the hero; each is then browsed year by year with the year tray (user 2026-11-25, "browse by year").
   Data: js/data/toppers-live.js (CSE, local photos) and js/data/toppers-extra.js (IFoS and the answer sheets, files on the live CDN).
   The choice is kept in the address (#cse/2024, #ifos/2023, #sheets/2025; the older #year=2024 still works) so it can be shared. */
(() => {
  const D = window.TOPPERS_LIVE, X = window.TOPPERS_EXTRA || { ifos: [], sheets: [], cdn: '' }; if (!D) return;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const PHOTO = 'assets/img/toppers/';
  const cdn = f => !f ? '' : /^https?:/.test(f) ? f : X.cdn + f;

  // (Toppers' Answer Sheets was a third category; removed 2026-11-25 at the user's request, "remove this". Its data stays in
  // js/data/toppers-extra.js, and the card and layout code for it below is unused for now)
  const CATS = {
    cse: { label: 'CSE Toppers', chip: 'UPSC CSE results', exam: 'UPSC CSE',
      people: D.rows.map(([y, rank, name, prog, , file, cut]) => ({ y, rank, name, prog, photo: PHOTO + file, cut: cut ? PHOTO + cut : '' })) },
    ifos: { label: 'IFoS Toppers', chip: 'UPSC IFoS results', exam: 'UPSC IFoS',
      people: X.ifos.map(([y, rank, name, prog, photo]) => ({ y, rank, name, prog, photo: cdn(photo), cut: '' })) },
  };
  Object.values(CATS).forEach(c => { c.years = [...new Set(c.people.map(p => p.y))].sort((a, b) => b - a); });
  const byYear = (c, y) => c.people.filter(p => p.y === y).sort((a, b) => a.rank - b.rank);

  // programmes as one plain line under the name (user 2026-11-25, "the course name should not be inside a badge"), the courses
  // separated by middle dots; "IGP" / "Interview Guidance Program" read as Interview Guidance; the small cards cut it at two lines
  const tags = prog => !prog ? [] : prog.split(/,(?![^(]*\))|\s&\s/).map(t => t.trim().replace(/^&\s*/, ''))
    .filter(Boolean).map(t => /^IGP$|^Interview Guidance Program(me)?$/i.test(t) ? 'Interview Guidance' : t);
  const tagList = (prog, clamp) => {
    const t = tags(prog); if (!t.length) return '';
    return `<p class="tp-prog${clamp ? ' tp-prog--clamp' : ''}"${clamp ? ` title="${esc(t.join(', '))}"` : ''}>${t.map(esc).join('<span aria-hidden="true"> · </span><span class="vh">, </span>')}</p>`;
  };
  const within = max => [10, 20, 30, 50, 100, 1000].find(n => max <= n);

  // V1's crest shield (user 2026-11-25, "use this shield design", from the Toppers lab): a cut-out portrait (CSE 2025) rises out of
  // the shield; a photo with its own background sits framed in the orange field instead (.is-boxed)
  const shield = p => `<div class="tp-shield"><span class="tp-shield__gem" aria-hidden="true"></span>
      <span class="tp-shield__pic"><img${p.cut ? '' : ' class="is-boxed"'} src="${esc(p.cut || p.photo)}" alt="${esc(p.name)}" loading="lazy" decoding="async"></span></div>`;
  const card = (c, p, big) => `<li class="tp-card${big ? ' tp-card--big' : ''}">
      ${shield(p)}
      <p class="tp-card__air"><small>AIR</small> ${p.rank}</p>
      <h3 class="tp-card__name">${esc(p.name)}<span class="vh">, All India Rank ${p.rank}, ${c.exam} ${p.y}</span></h3>
      ${tagList(p.prog, !big)}
    </li>`;
  // ---------- the spotlight + name list (user 2026-11-25, the staging homepage's Toppers record as the reference, "spotlight + list"):
  // inside an open-top orange bracket, the chosen topper large on the left (the shield on a silver laurel, then AIR, name and
  // programmes) and every topper of the year in a scrolling list on the right; the spotlight steps down the list by itself (a thin bar
  // fills on the current row; held while the pointer is over the panel, the page is hidden or the panel is off screen); choosing a
  // row shows that topper. Phones: no spotlight, the rows carry a small round photo instead ----------
  // the reel (user 2026-11-25, "lets use this approach", above the spotlight): every topper of the year as a running row of shields
  // with AIR, name and programme under each, as the homepage's 2025 reel; it can be dragged, holds under the pointer, and choosing a
  // shield shows that topper in the spotlight below
  // the shields take the Batches card colours in turn, as the homepage's Toppers since Abhishek's 9cefb6e (user 2026-11-25, "in the
  // home page we have updated the bg colour for the topper, lets make those changes in our toppers page too")
  const TONES = ['gs', 'pre'];   // orange and mustard in turn, as the homepage since ca9eef1 (user 2026-11-25, "use alternating colour like these")
  // every AIR 1 stands on the gold laurel wreath, as in the AIR 1 row above (user 2026-11-25, "all the AIR 1 should have a wreath")
  const reelItem = (p, i) => `<li class="tp-ri${p.rank === 1 ? ' tp-ri--one' : ''}" data-i="${i}"><div class="tp-ri__b">
      <div class="tp-shield tp-shield--${TONES[i % TONES.length]}">${p.rank === 1 ? '<span class="tp-a1__laurel" aria-hidden="true"></span>' : ''}<span class="tp-shield__gem" aria-hidden="true"></span><span class="tp-shield__pic"><img${p.cut ? '' : ' class="is-boxed"'} src="${esc(p.cut || p.photo)}" alt="" loading="lazy" decoding="async" draggable="false"></span></div>
      <span class="tp-card__air"><small>AIR</small> ${p.rank}</span>
      <span class="tp-ri__name">${esc(p.name)}</span>
      ${p.prog ? `<span class="tp-ri__prog">${esc(tags(p.prog).join(' · '))}</span>` : ''}
    </div></li>`;
  // the drum (user 2026-11-25, "a scroll effect like this", React Bits' 3D Text Reveal as the reference; our own code): the year's top
  // ten as big lines on a 3D cylinder in a pinned stretch of the page; scrolling turns the cylinder so the lines roll up into view one
  // after another, then the page moves on to the grid. A plain list for reduced motion
  // the shields themselves on the drum (user 2026-11-25, "I want this to scroll like that", the grid of toppers on the 3D Text Reveal's
  // turning cylinder): on wide screens every topper of the year stands in rows of shields around a 3D cylinder in a pinned stretch of
  // the page, and scrolling turns it so the rows roll up into view one after another (the row facing you at its natural size). Phones,
  // small tablets and years with a single row keep the plain grid, as does reduced motion
  const DRUM_GAP = 30;   // degrees between rows
  const perRow = () => innerWidth >= 1200 ? 8 : innerWidth >= 900 ? 6 : 0;
  // the drum is switched off (user 2026-11-25, "lets remove the animation"): every year shows the plain grid of shields; the drum code
  // above and below stays, unused
  const useDrum = () => false;
  const drum = (c, y, list) => {
    const k = perRow(), rows = [];
    for (let i = 0; i < list.length; i += k) rows.push(list.slice(i, i + k));
    return `
      <section class="tp-drum" style="--n:${rows.length}" data-k="${k}" aria-label="${esc(c.exam)} ${y}: ${list.length} toppers">
        <div class="tp-drum__pin"><div class="tp-drum__stage"><ol class="tp-drum__cyl">${rows.map((row, i) => `<li class="tp-drum__line" style="--i:${i}"><ul class="tp-drum__row">${row.map((p, j) => reelItem(p, i * k + j)).join('')}</ul></li>`).join('')}</ol></div></div>
      </section>`;
  };
  const record = (c, y, list) => `
      <p class="tp-rule"><span>${list.length} Toppers, ${c.exam} ${y}</span></p>
      ${useDrum(list) ? drum(c, y, list) : `<div class="tp-reel"><ul class="tp-reel__track">${list.map(reelItem).join('')}</ul></div>`}`;
  const STEP = 4500;
  let recList = [], recAt = 0, recTimer = 0;
  const recShow = (i, scroll = true) => {
    const box = panel.querySelector('.tp-rec'); if (!box || !recList.length) return;
    recAt = (i + recList.length) % recList.length; const p = recList[recAt];
    const img = box.querySelector('[data-shot]');
    img.classList.toggle('is-boxed', !p.cut); img.src = p.cut || p.photo; img.alt = p.name;
    box.querySelector('[data-r]').textContent = p.rank; box.querySelector('[data-n]').textContent = p.name;
    const t = tags(p.prog), cap = box.querySelector('[data-c]'); cap.textContent = t.join(' · '); cap.hidden = !t.length;
    const rows = [...box.querySelectorAll('.tp-row')];
    rows.forEach((r, k) => { if (k === recAt) r.setAttribute('aria-current', 'true'); else r.removeAttribute('aria-current'); });
    const row = rows[recAt], ol = box.querySelector('.tp-list');
    if (scroll && row && ol.scrollHeight > ol.clientHeight) {   // keep the current row in view inside the list (not the page)
      const li = row.parentElement, top = li.offsetTop, h = li.offsetHeight;
      if (top < ol.scrollTop || top + h > ol.scrollTop + ol.clientHeight) ol.scrollTo({ top: top - (ol.clientHeight - h) / 2, behavior: 'smooth' });
    }
    // the bar on the current row fills over one step (restarted)
    rows.forEach(r => r.classList.remove('is-run')); void (row && row.offsetWidth); if (row) row.classList.add('is-run');
  };
  const recRun = () => {
    clearInterval(recTimer);
    recTimer = setInterval(() => {
      const fr = panel.querySelector('.tp-frame'); if (!fr) return;
      if (document.hidden || fr.matches(':hover') || fr.classList.contains('is-off') || matchMedia('(max-width: 900px)').matches) return;
      recShow(recAt + 1);
    }, STEP);
  };
  // ---------- the reel's motion: each topper appears once (no repeating copies: user 2026-11-25, "the heading says 36 but the carousel
  // has more"). It starts with AIR 1 at the left, drifts left to the year's last topper, rests, and drifts back, and so on; it can be
  // dragged (within its two ends), and holds under the pointer, off screen or in a hidden tab; a row that fits stands still, centred ----------
  const REEL_SPEED = 38, REEL_REST = 1600;   // px a second; ms resting at each end
  let reel = null;
  const reelStart = () => {
    const box = panel.querySelector('.tp-reel'); reel = null; if (!box) return;
    // no carousel any more (user 2026-11-25, "lets not use a carousel, let the user scroll, show all the toppers"): every topper of
    // the year stands in a wrapping grid (css .tp-reel.is-wall) and the page scrolls; the moving code below is left unused
    box.classList.add('is-wall'); box.querySelector('.tp-reel__track').style.transform = ''; balance(); return;
    const track = box.querySelector('.tp-reel__track');
    const fits = track.scrollWidth <= box.clientWidth;
    box.classList.toggle('is-still', fits);
    track.style.transform = '';
    if (fits) return;
    reel = { box, track, min: box.clientWidth - track.scrollWidth, x: 0, dir: -1, restUntil: performance.now() + REEL_REST, drag: null, moved: 0, hover: false, off: false };
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { if (reel && reel.box === box) reel.off = !es[0].isIntersecting; }).observe(box);
    box.onpointerenter = () => { if (reel) reel.hover = true; };
    box.onpointerleave = () => { if (reel) reel.hover = false; };
  };
  addEventListener('resize', () => { if (reel) reel.min = Math.min(0, reel.box.clientWidth - reel.track.scrollWidth); });
  const clampX = x => Math.max(reel.min, Math.min(0, x));
  // the drum turns with the scroll: progress through its pinned stretch (0 at its top meeting the window's top, 1 at its bottom meeting
  // the window's bottom) maps to the cylinder's turn, from just before the first line to just after the last; eased a little
  const drumState = { cur: null, target: null };
  const drumTick = () => {
    const d = panel.querySelector('.tp-drum'); if (!d) return;
    const cyl = d.querySelector('.tp-drum__cyl'), n = +getComputedStyle(d).getPropertyValue('--n') || 1;
    if (!d.dataset.r) {   // the radius that keeps one row's height (plus a gap) between neighbouring rows
      const rowH = Math.max(...[...cyl.children].map(li => li.offsetHeight));
      d.dataset.r = Math.round((rowH + 36) / (DRUM_GAP * Math.PI / 180));
      cyl.style.setProperty('--r', `${d.dataset.r}px`);
    }
    const r = d.getBoundingClientRect(), span = r.height - innerHeight;
    const p = span > 0 ? Math.max(0, Math.min(1, -r.top / span)) : 0;
    // no empty stretch at either end (user 2026-11-25, "fix the gap"): the first row faces you as the drum pins, the last as it lets go
    const from = 0, to = (n - 1) * DRUM_GAP, target = from + p * (to - from);
    drumState.cur = drumState.cur === null || Math.abs(drumState.cur - target) > 400 ? target : drumState.cur + (target - drumState.cur) * .14;
    cyl.style.transform = `translateZ(-${d.dataset.r}px) rotateX(${drumState.cur.toFixed(2)}deg)`;
    // each row fades as it turns away from the front
    cyl.querySelectorAll('.tp-drum__line').forEach(li => {
      const a = Math.abs(+li.style.getPropertyValue('--i') * DRUM_GAP - drumState.cur);
      li.style.opacity = Math.max(0, 1 - a / (DRUM_GAP * 2.1)).toFixed(3);
    });
  };
  // the layout (drum or grid, shields a row) depends on the window's width: redrawn when that changes enough
  // balanced rows (user 2026-11-25, "try to balance the layouts if the number of the toppers are low"): rather than full rows and a
  // lone straggler (8 as 7 + 1), the year's shields are spread over the fewest rows that hold them, as evenly as they go (8 as 4 + 4,
  // 13 as 7 + 6, 38 as 7 7 6 6 6 6); a zero-height break item (li.tp-br) ends each row. Worked out again when the window is resized
  const balance = () => {
    const track = panel.querySelector('.tp-reel.is-wall .tp-reel__track'); if (!track) return;
    track.querySelectorAll('.tp-br').forEach(b => b.remove());
    const items = [...track.querySelectorAll('.tp-ri')], n = items.length; if (!n) return;
    const gx = parseFloat(getComputedStyle(track).columnGap) || 0, w = items[0].offsetWidth;
    // eight a row at most (review 2026-11-26, "every row should have 8 toppers only"): full rows of eight, the rest centred on the
    // last row; fewer a row only where eight don't fit the window
    const fit = Math.max(1, Math.floor((track.clientWidth + gx) / (w + gx))), k = Math.min(8, fit);
    for (let at = k; at < n; at += k) {
      const br = document.createElement('li'); br.className = 'tp-br'; br.setAttribute('aria-hidden', 'true'); items[at - 1].after(br);
    }
  };
  let balRaf = 0;
  addEventListener('resize', () => { cancelAnimationFrame(balRaf); balRaf = requestAnimationFrame(balance); });
  let lastK = perRow();
  addEventListener('resize', () => { const k = perRow(); if (k !== lastK) { lastK = k; show(cur, curY); } });
  let last = 0;
  const tick = t => {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) drumTick();
    const dt = last ? Math.min(.05, (t - last) / 1000) : 0; last = t;
    if (reel && !reel.drag && !reel.hover && !reel.off && !document.hidden && t >= reel.restUntil && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reel.x += reel.dir * REEL_SPEED * dt;
      if (reel.x <= reel.min || reel.x >= 0) { reel.dir *= -1; reel.restUntil = t + REEL_REST; }   // rest at the end, then turn back
    }
    if (reel) { reel.x = clampX(reel.x); reel.track.style.transform = `translate3d(${reel.x.toFixed(2)}px,0,0)`; }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  // an answer sheet card: the topper and their rank, then a link per paper (opens the PDF in a new tab)
  const PDF = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>';
  const sheetCard = (c, p) => `<li class="tp-sheet">
      <p class="tp-sheet__air"><small>AIR</small> ${p.rank}</p>
      <h3 class="tp-sheet__name">${esc(p.name)}<span class="vh">, All India Rank ${p.rank}, ${c.exam} ${p.y}</span></h3>
      <ul class="tp-sheet__files">${p.files.map(f => `<li><a href="${esc(f.href)}" target="_blank" rel="noopener">${PDF}<span>${esc(f.label)}</span><span class="vh"> (PDF, opens in a new tab)</span></a></li>`).join('')}</ul>
    </li>`;

  // ---------- the category tabs (in the hero) and the year tray (sticky) ----------
  // (the CSE / IFoS tabs are out of the hero again, user 2026-11-26, "remove this"; the detached stand-in keeps the code working and
  // #ifos/2024 links still open the IFoS toppers)
  const cats = $('#tpCats') || document.createElement('div'), tabs = $('#tpYears'), panel = $('#tpYear'), chip = $('.tp-lbl__t');
  // (the spotlight's choosing, keys and off-screen pause, wired once the panel is known)
  // dragging (pointer) and choosing (a click that didn't drag)
  panel.addEventListener('pointerdown', e => {
    if (!reel || !e.target.closest('.tp-reel')) return;
    reel.drag = { x0: e.clientX, start: reel.x }; reel.moved = 0; reel.box.classList.add('is-drag');
  });
  addEventListener('pointermove', e => { if (!reel || !reel.drag) return; const dx = e.clientX - reel.drag.x0; reel.moved = Math.max(reel.moved, Math.abs(dx)); reel.x = reel.drag.start + dx; });
  addEventListener('pointerup', () => { if (reel && reel.drag) { const r = reel; r.drag = null; r.box.classList.remove('is-drag'); setTimeout(() => { r.moved = 0; }, 0); } });
  panel.addEventListener('click', e => {
    const b = e.target.closest('.tp-ri__b'); if (!b) return;
    if (reel && reel.moved > 6) { e.preventDefault(); return; }   // it was a drag, not a choice
    recShow(+b.closest('.tp-ri').dataset.i); recRun();
  }, true);

  panel.addEventListener('click', e => { const r = e.target.closest('.tp-row'); if (r) { recShow(+r.dataset.i, false); recRun(); } });
  panel.addEventListener('keydown', e => {   // up / down arrows move along the list
    const r = e.target.closest('.tp-row'); if (!r || !['ArrowDown', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault(); const rows = [...panel.querySelectorAll('.tp-row')], i = rows.indexOf(r) + (e.key === 'ArrowDown' ? 1 : -1);
    if (rows[i]) { rows[i].focus(); recShow(i); recRun(); }
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => en.target.classList.toggle('is-off', !en.isIntersecting)));
    new MutationObserver(() => { const fr = panel.querySelector('.tp-frame'); if (fr && !fr.dataset.io) { fr.dataset.io = '1'; io.observe(fr); } }).observe(panel, { childList: true });
  }

  cats.innerHTML = Object.entries(CATS).map(([k, c]) => `<button type="button" role="tab" class="tp-cat" id="tpCat-${k}" aria-selected="false" aria-controls="tpYear" data-k="${k}">${esc(c.label)}<span class="tp-cat__from"> from Vajiram</span></button>`).join('');
  let cur = 'cse', curY = 0;

  // the homepage's year tabs (user 2026-11-25, "this is how the tab should look like"): a peach tray, the years as plain labels, and an
  // orange highlight that slides to the chosen one (.tp-years__ind); each year's count is said to screen readers only
  const drawYears = () => {
    const c = CATS[cur];
    tabs.innerHTML = '<span class="tp-years__ind" aria-hidden="true"></span>' + c.years.map(y => `<button type="button" role="tab" class="tp-yr" id="tpTab${y}" aria-controls="tpYear" aria-selected="false" data-y="${y}">${y}<span class="vh">, ${byYear(c, y).length} ${c.sheets ? 'toppers with answer sheets' : 'toppers'}</span></button>`).join('');
  };
  const slide = () => { const ind = tabs.querySelector('.tp-years__ind'), b = tabs.querySelector('[aria-selected="true"]'); if (!ind || !b) return; ind.style.width = `${b.offsetWidth}px`; ind.style.transform = `translateX(${b.offsetLeft - 4}px)`; };
  addEventListener('resize', slide);
  if (document.fonts) document.fonts.ready.then(slide);

  const show = (k, y, focus) => {
    const catChanged = k !== cur || !tabs.children.length; cur = k; const c = CATS[k];
    if (!c.years.includes(y)) y = c.years[0]; curY = y;
    [...cats.children].forEach(b => { const on = b.dataset.k === k; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    if (catChanged) { tabs.classList.remove('is-ready'); drawYears(); requestAnimationFrame(() => requestAnimationFrame(() => tabs.classList.add('is-ready'))); }
    if (chip) chip.textContent = c.chip;
    [...tabs.querySelectorAll('.tp-yr')].forEach(b => { const on = +b.dataset.y === y; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on && focus === 'year') b.focus(); });
    if (focus === 'cat') $(`#tpCat-${k}`).focus();
    panel.setAttribute('aria-labelledby', `tpTab${y}`);
    const list = byYear(c, y);
    if (c.sheets) {
      clearInterval(recTimer); recList = []; reel = null;
      panel.innerHTML = `
        <p class="tp-rule"><span>${list.length} Toppers' Answer Sheets, ${y}</span></p>
        <ol class="tp-sheets">${list.map(p => sheetCard(c, p)).join('')}</ol>`;
    } else {
      // (the spotlight + name list below the grid was removed 2026-11-25 at the user's request, "remove it"; its code is unused)
      panel.innerHTML = record(c, y, list);
      clearInterval(recTimer); recList = []; reelStart(); drumState.cur = null;
    }
    slide();
    const sel = tabs.querySelector('[aria-selected="true"]');
    if (sel && tabs.scrollWidth > tabs.clientWidth) tabs.scrollTo({ left: sel.offsetLeft - 16, behavior: 'smooth' });
  };

  const fromHash = () => {
    const h = location.hash, m = h.match(/^#(cse|ifos)(?:\/(\d{4}))?/), old = h.match(/year=(\d{4})/);
    return m ? [m[1], +(m[2] || 0)] : old ? ['cse', +old[1]] : ['cse', 0];
  };
  // switching year from further down the list brings the page back to the top of the new list (user 2026-11-25, "when I switch the
  // tab at the very bottom of the toppers I should be taken to the top of the list"): the ruled line lands just under the stuck year
  // bar; nothing moves when the list's top is already in view
  const toListTop = () => {
    const bar = $('.tp-bar'), under = (parseFloat(getComputedStyle(bar).top) || 0) + bar.offsetHeight + 16;
    const y = scrollY + panel.getBoundingClientRect().top - under;
    if (scrollY > y + 1) scrollTo({ top: y, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  let navMark = () => {};   // (set by the nav's Toppers menu below)
  const pick = (k, y, focus) => { const was = curY; show(k, y, focus); history.replaceState(null, '', `#${cur}/${curY}`); if (curY !== was) toListTop(); navMark(); };
  cats.addEventListener('click', e => { const b = e.target.closest('.tp-cat'); if (b && b.dataset.k !== cur) pick(b.dataset.k, 0); });
  tabs.addEventListener('click', e => { const b = e.target.closest('.tp-yr'); if (b) pick(cur, +b.dataset.y); });
  // arrow keys move along either row of tabs
  const keys = (list, i, e) => { const j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? list.length - 1 : null; return j === null ? null : Math.max(0, Math.min(list.length - 1, j)); };
  tabs.addEventListener('keydown', e => { const ys = CATS[cur].years, i = ys.indexOf(+(e.target.dataset.y || 0)); if (i < 0) return; const j = keys(ys, i, e); if (j === null) return; e.preventDefault(); pick(cur, ys[j], 'year'); });
  cats.addEventListener('keydown', e => { const ks = Object.keys(CATS), i = ks.indexOf(e.target.dataset.k); if (i < 0) return; const j = keys(ks, i, e); if (j === null) return; e.preventDefault(); pick(ks[j], 0, 'cat'); });
  // ---------- the nav's Toppers menu, back on hover (review 2026-11-26, "where is the toppers list when it hovers" / "bring it back";
  // first: "it should behave like the rest of the tabs in the nav, see how All courses
  // works"): the same full-width panel as All courses and Study materials (css/v49.css .mega; opened, closed and the page dimmed by
  // js/site-nav.js). Three numbered columns: CSE toppers (all, then the latest three years with their AIR 1), IFoS toppers (all, then each
  // year), and the AIR 1s (the decade row, then the latest three AIR 1s with their programmes); on the right the counsellor card.
  // Choosing a link switches the list (or goes to the AIR 1 row) and closes the panel. The phone drawer lists CSE and IFoS under Toppers
  const all = sel => [...document.querySelectorAll(sel)];
  const megaWrap = $('#toppersNav'), megaBtn = $('#toppersBtn'), megaTp = $('#megaTp');
  const megaClose = () => {
    if (!megaWrap) return;
    megaWrap.classList.remove('open'); megaBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.toggle('mega-open', all('.rn .explore.open').length > 0);
  };
  // the kind of toppers being viewed is marked, in the panel and in the phone drawer
  navMark = () => all('[data-tp-k]').forEach(a => {
    const on = a.dataset.tpK === cur;
    if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
  });
  const scrollUnderNav = el => {
    const nav = $('#nav'), top = scrollY + el.getBoundingClientRect().top - ((nav && nav.getBoundingClientRect().bottom) || 76) - 8;
    scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const goTo = (k, y) => { pick(k, y || 0); megaClose(); const b = $('.tp-browse'); if (b) scrollUnderNav(b); };
  if (megaTp) {
    const span = c => `${c.years[c.years.length - 1]}\u2060–\u2060${c.years[0]}`;   // (word joiners keep the year range on one line)
    const item = (href, data, t, d, n) => `<li><a class="mega__a" href="${href}" ${data}><span class="mega__t">${esc(t)}</span><span class="mega__d">${esc(d)}</span>${n ? `<span class="mega__n">${esc(n)}</span>` : ''}</a></li>`;
    const C = CATS.cse, I = CATS.ifos;
    // just the two kinds of toppers (review 2026-11-26, "no need to mention all of this, just mention CSE and IFoS toppers")
    const cols = [
      ['CSE Toppers', [item('toppers.html#cse', 'data-tp-k="cse"', 'CSE Toppers from Vajiram', `UPSC Civil Services, ${span(C)}`, `${C.people.length} ranks`)]],
      ['IFoS Toppers', [item('toppers.html#ifos', 'data-tp-k="ifos"', 'IFoS Toppers from Vajiram', `Indian Forest Service, ${span(I)}`, `${I.people.length} ranks`)]],
    ];
    megaTp.innerHTML = `<div class="mega__stages">${cols.map(([k, items], i) => `<section class="mega__col" style="--i:${i}">
        <p class="mega__k"><b>${String(i + 1).padStart(2, '0')}</b>${esc(k)}</p><ul>${items.join('')}</ul></section>`).join('')}</div>`;   // (no counsellor card here: review 2026-11-26, "remove this")
  }
  document.addEventListener('click', e => {
    const go = e.target.closest('[data-tp-go="air1"]');
    if (go) { e.preventDefault(); megaClose(); const s = $('.tp-air1'); if (s) scrollUnderNav(s); return; }
    const a = e.target.closest('[data-tp-k]'); if (!a) return;
    e.preventDefault(); goTo(a.dataset.tpK, +a.dataset.tpY || 0);
  });
  // ---------- the nav as on Abhishek's homepage otherwise (review 2026-11-26, "match his nav"): a mouse click on All courses goes to the
  // course finder (hovering still opens its panel; touch and keyboard still open and close it) ----------
  const exploreBtn = $('#exploreBtn');
  if (exploreBtn) exploreBtn.addEventListener('click', e => {
    if (e.pointerType === 'mouse') { e.preventDefault(); e.stopImmediatePropagation(); location.href = 'course-finder.html'; }
  }, true);
  addEventListener('hashchange', () => { show(...fromHash()); navMark(); });
  show(...fromHash()); navMark();

  // the year bar knows when it is stuck under the nav (its ground then runs up behind the nav, css .is-stuck)
  const bar = $('.tp-bar');
  if (bar) {
    // and it slides away once the footer is showing (review 2026-11-26, "when I reach the footer the year tab should be hidden"): the
    // footer is revealed from under the page, so "showing" = the page's bottom edge has risen 120px or more above the window's bottom
    const main = $('main.tp');
    const stuck = () => {
      const on = bar.getBoundingClientRect().top <= parseFloat(getComputedStyle(bar).top) + 1;
      bar.classList.toggle('is-stuck', on);
      bar.classList.toggle('is-gone', on && innerHeight - main.getBoundingClientRect().bottom > 120);
    };
    addEventListener('scroll', stuck, { passive: true }); addEventListener('resize', stuck); stuck();
  }

  // the hero's totals (for screen readers)
  const tot = $('#tpTotal'); if (tot) tot.textContent = CATS.cse.people.length;
  const span = $('#tpSpan'); if (span) span.textContent = `${CATS.cse.years[CATS.cse.years.length - 1]}–${CATS.cse.years[0]}`;
})();
