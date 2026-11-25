/* The Toppers page (toppers.html, branch kevin-toppers): browse the UPSC toppers year by year (user 2026-11-25, "browse by year").
   Data: js/data/toppers-live.js (every topper on the live page vajiramandravi.com/ias-selections-from-vajiram/, local photos).
   A row of year tabs (sticky under the nav); the chosen year shows its headline (how many ranks, in the top 10 / 20 / 50), its top
   three as large cards, then everyone else in a grid. The year is kept in the address (#year=2024) so it can be linked and shared. */
(() => {
  const D = window.TOPPERS_LIVE; if (!D) return;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const PHOTO = 'assets/img/toppers/';

  const people = D.rows.map(([y, rank, name, prog, , file, cut]) => ({ y, rank, name, prog, photo: PHOTO + file, cut: cut ? PHOTO + cut : '' }));
  const years = [...new Set(people.map(p => p.y))].sort((a, b) => b - a);
  const byYear = y => people.filter(p => p.y === y).sort((a, b) => a.rank - b.rank);

  // programmes as short tags: split the published list, "IGP" / "Interview Guidance Program" read as Interview Guidance
  const tags = prog => !prog ? [] : prog.split(/,(?![^(]*\))|\s&\s/).map(t => t.trim().replace(/^&\s*/, ''))
    .filter(Boolean).map(t => /^IGP$|^Interview Guidance Program(me)?$/i.test(t) ? 'Interview Guidance' : t);
  const within = max => max <= 10 ? 10 : max <= 20 ? 20 : max <= 50 ? 50 : 100;

  const tagList = (prog, max) => {
    const t = tags(prog); if (!t.length) return '';
    const shown = max ? t.slice(0, max) : t, more = t.length - shown.length;
    return `<ul class="tp-tags">${shown.map(x => `<li>${esc(x)}</li>`).join('')}${more > 0 ? `<li class="tp-tags__more" title="${esc(t.slice(shown.length).join(', '))}">+${more} more</li>` : ''}</ul>`;
  };
  // V1's crest shield (user 2026-11-25, "use this shield design", from the Toppers lab): the silver shield (figma/shield2-silver.svg)
  // with its orange field; a cut-out portrait (2025) rises out of it, clipped to the shield below the top; a photo with its own
  // background (earlier years) sits framed in the field instead (.is-boxed)
  const shield = p => `<div class="tp-shield"><span class="tp-shield__gem" aria-hidden="true"></span>
      <span class="tp-shield__pic"><img${p.cut ? '' : ' class="is-boxed"'} src="${esc(p.cut || p.photo)}" alt="${esc(p.name)}" loading="lazy" decoding="async"></span></div>`;
  const card = (p, big) => `<li class="tp-card${big ? ' tp-card--big' : ''}">
      ${shield(p)}
      <p class="tp-card__air"><small>AIR</small> ${p.rank}</p>
      <h3 class="tp-card__name">${esc(p.name)}<span class="vh">, All India Rank ${p.rank}, UPSC CSE ${p.y}</span></h3>
      ${tagList(p.prog, big ? 0 : 2)}
    </li>`;

  const tabs = $('#tpYears'), panel = $('#tpYear');
  // the homepage's year tabs (user 2026-11-25, "this is how the tab should look like"): a peach tray, the years as plain labels, and an
  // orange highlight that slides to the chosen one (.tp-years__ind); each year's count is said to screen readers only
  tabs.innerHTML = '<span class="tp-years__ind" aria-hidden="true"></span>' + years.map(y => `<button type="button" role="tab" class="tp-yr" id="tpTab${y}" aria-controls="tpYear" aria-selected="false" data-y="${y}">${y}<span class="vh">, ${byYear(y).length} toppers</span></button>`).join('');
  const ind = tabs.querySelector('.tp-years__ind');
  const slide = () => { const b = tabs.querySelector('[aria-selected="true"]'); if (!b) return; ind.style.width = `${b.offsetWidth}px`; ind.style.transform = `translateX(${b.offsetLeft - 4}px)`; };
  addEventListener('resize', slide);
  if (document.fonts) document.fonts.ready.then(slide);

  const show = (y, focus) => {
    const list = byYear(y), top = list.slice(0, 3), rest = list.slice(3), max = Math.max(...list.map(p => p.rank));
    [...tabs.children].forEach(b => { const on = +b.dataset.y === y; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    panel.setAttribute('aria-labelledby', `tpTab${y}`);
    panel.innerHTML = `
      <header class="tp-yhead">
        <h2 class="tp-yhead__h">UPSC CSE ${y}</h2>
        <p class="tp-yhead__stat"><b>${list.length}</b> ranks in the top ${within(max)}${list[0] && list[0].rank === 1 ? `, including <b>AIR 1</b>` : ''}</p>
      </header>
      <ol class="tp-top">${top.map(p => card(p, true)).join('')}</ol>
      ${rest.length ? `<ol class="tp-grid">${rest.map(p => card(p, false)).join('')}</ol>` : ''}`;
    slide();
    const sel = tabs.querySelector('[aria-selected="true"]');
    if (sel && tabs.scrollWidth > tabs.clientWidth) tabs.scrollTo({ left: sel.offsetLeft - 16, behavior: 'smooth' });
  };

  const fromHash = () => { const m = location.hash.match(/year=(\d{4})/); return m && years.includes(+m[1]) ? +m[1] : years[0]; };
  const pick = (y, focus) => { history.replaceState(null, '', `#year=${y}`); show(y, focus); };
  tabs.addEventListener('click', e => { const b = e.target.closest('.tp-yr'); if (b) pick(+b.dataset.y); });
  // (the highlight appears in place on load, then slides from there on)
  requestAnimationFrame(() => requestAnimationFrame(() => tabs.classList.add('is-ready')));
  tabs.addEventListener('keydown', e => {   // arrow keys move between the year tabs
    const i = years.indexOf(+(e.target.dataset.y || 0)); if (i < 0) return;
    const j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? years.length - 1 : -2;
    if (j === -2) return; e.preventDefault(); pick(years[Math.max(0, Math.min(years.length - 1, j))], true);
  });
  addEventListener('hashchange', () => show(fromHash()));
  show(fromHash());

  // the year bar knows when it is stuck under the nav (its ground then runs up behind the nav, css .is-stuck)
  const bar = $('.tp-bar');
  if (bar) {
    const stuck = () => bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= parseFloat(getComputedStyle(bar).top) + 1);
    addEventListener('scroll', stuck, { passive: true }); addEventListener('resize', stuck); stuck();
  }

  // the hero's totals
  const tot = $('#tpTotal'); if (tot) tot.textContent = people.length;
  const span = $('#tpSpan'); if (span) span.textContent = `${years[years.length - 1]}–${years[0]}`;
})();
