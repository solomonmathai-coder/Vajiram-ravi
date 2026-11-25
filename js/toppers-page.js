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

  const CATS = {
    cse: { label: 'CSE Toppers', chip: 'UPSC CSE results', exam: 'UPSC CSE',
      people: D.rows.map(([y, rank, name, prog, , file, cut]) => ({ y, rank, name, prog, photo: PHOTO + file, cut: cut ? PHOTO + cut : '' })) },
    ifos: { label: 'IFoS Toppers', chip: 'UPSC IFoS results', exam: 'UPSC IFoS',
      people: X.ifos.map(([y, rank, name, prog, photo]) => ({ y, rank, name, prog, photo: cdn(photo), cut: '' })) },
    sheets: { label: "Toppers' Answer Sheets", chip: "Toppers' answer sheets", exam: 'UPSC CSE', sheets: true,
      people: X.sheets.map(([y, rank, name, files]) => ({ y, rank, name, files: files.map(([label, f]) => ({ label, href: cdn(f) })) })) },
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
  // an answer sheet card: the topper and their rank, then a link per paper (opens the PDF in a new tab)
  const PDF = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>';
  const sheetCard = (c, p) => `<li class="tp-sheet">
      <p class="tp-sheet__air"><small>AIR</small> ${p.rank}</p>
      <h3 class="tp-sheet__name">${esc(p.name)}<span class="vh">, All India Rank ${p.rank}, ${c.exam} ${p.y}</span></h3>
      <ul class="tp-sheet__files">${p.files.map(f => `<li><a href="${esc(f.href)}" target="_blank" rel="noopener">${PDF}<span>${esc(f.label)}</span><span class="vh"> (PDF, opens in a new tab)</span></a></li>`).join('')}</ul>
    </li>`;

  // ---------- the category tabs (in the hero) and the year tray (sticky) ----------
  const cats = $('#tpCats'), tabs = $('#tpYears'), panel = $('#tpYear'), chip = $('.tp-lbl__t');
  cats.innerHTML = Object.entries(CATS).map(([k, c]) => `<button type="button" role="tab" class="tp-cat" id="tpCat-${k}" aria-selected="false" aria-controls="tpYear" data-k="${k}">${esc(c.label)}</button>`).join('');
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
      panel.innerHTML = `
        <p class="tp-rule"><span>${list.length} Toppers' Answer Sheets, ${y}</span></p>
        <ol class="tp-sheets">${list.map(p => sheetCard(c, p)).join('')}</ol>`;
    } else {
      const top = list.slice(0, 3), rest = list.slice(3), max = Math.max(...list.map(p => p.rank));
      panel.innerHTML = `
        <p class="tp-rule"><span>${list.length}/${within(max)} Ranks, ${c.exam} ${y}</span></p>
        <ol class="tp-top">${top.map(p => card(c, p, true)).join('')}</ol>
        ${rest.length ? `<ol class="tp-grid">${rest.map(p => card(c, p, false)).join('')}</ol>` : ''}`;
    }
    slide();
    const sel = tabs.querySelector('[aria-selected="true"]');
    if (sel && tabs.scrollWidth > tabs.clientWidth) tabs.scrollTo({ left: sel.offsetLeft - 16, behavior: 'smooth' });
  };

  const fromHash = () => {
    const h = location.hash, m = h.match(/^#(cse|ifos|sheets)(?:\/(\d{4}))?/), old = h.match(/year=(\d{4})/);
    return m ? [m[1], +(m[2] || 0)] : old ? ['cse', +old[1]] : ['cse', 0];
  };
  const pick = (k, y, focus) => { show(k, y, focus); history.replaceState(null, '', `#${cur}/${curY}`); };
  cats.addEventListener('click', e => { const b = e.target.closest('.tp-cat'); if (b && b.dataset.k !== cur) pick(b.dataset.k, 0); });
  tabs.addEventListener('click', e => { const b = e.target.closest('.tp-yr'); if (b) pick(cur, +b.dataset.y); });
  // arrow keys move along either row of tabs
  const keys = (list, i, e) => { const j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? list.length - 1 : null; return j === null ? null : Math.max(0, Math.min(list.length - 1, j)); };
  tabs.addEventListener('keydown', e => { const ys = CATS[cur].years, i = ys.indexOf(+(e.target.dataset.y || 0)); if (i < 0) return; const j = keys(ys, i, e); if (j === null) return; e.preventDefault(); pick(cur, ys[j], 'year'); });
  cats.addEventListener('keydown', e => { const ks = Object.keys(CATS), i = ks.indexOf(e.target.dataset.k); if (i < 0) return; const j = keys(ks, i, e); if (j === null) return; e.preventDefault(); pick(ks[j], 0, 'cat'); });
  addEventListener('hashchange', () => show(...fromHash()));
  show(...fromHash());

  // the year bar knows when it is stuck under the nav (its ground then runs up behind the nav, css .is-stuck)
  const bar = $('.tp-bar');
  if (bar) {
    const stuck = () => bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= parseFloat(getComputedStyle(bar).top) + 1);
    addEventListener('scroll', stuck, { passive: true }); addEventListener('resize', stuck); stuck();
  }

  // the hero's totals (for screen readers)
  const tot = $('#tpTotal'); if (tot) tot.textContent = CATS.cse.people.length;
  const span = $('#tpSpan'); if (span) span.textContent = `${CATS.cse.years[CATS.cse.years.length - 1]}–${CATS.cse.years[0]}`;
})();
