/* Course finder page (course-finder.html). Started again on 2026-11-17/18 (user: "keep the nav and the orange and white and footer, delete
   the rest", then "rebuild the categories like this", a coursera.org "Online degrees" block): under the head, one section per category,
   each a heading, a row of chips that filter it (its subjects, or its modes and medium) and a grid of course cards, four across, with
   "Show N more" under the first row. A card: the course's banner picture, the Vajiram & Ravi emblem and name, the course's name, and its
   mode and length; it opens the course's page on vajiramandravi.com. Data: js/data/courses.js (window.CF_DATA). The nav has its own script
   (js/site-nav.js). The earlier finder (book shelf, filters, tickets, detail panel) is in the history: commits 7fd3cd6 and 6d3d24f. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const D = window.CF_DATA;

  /* ---------- the head's stats (the homepage hero's style): counted from the course data, counting up once on load ---------- */
  const tally = $('#cfTally');
  if (tally && D) {
    const products = D.courses.reduce((n, c) => n + c.v.length, 0);
    const categories = D.families.filter(f => f.k !== 'gs-2yr').length;   // GS Foundation's two lengths count as one category
    const STATS = [[products, 'Courses to choose from'], [categories, 'Categories, Prelims to Interview'], [D.subjects.length, 'Optional subjects taught']];
    tally.innerHTML = STATS.map(([a, b], i) => `<li class="cf-stat" style="--i:${i}"><span class="cf-stat__num"><b class="cf-stat__fig" data-n="${a}">${a}</b><span class="cf-stat__fig cf-stat__room" aria-hidden="true">${a}</span></span><span class="cf-stat__t">${b}</span></li>`).join('');
    if (!reduce) $$('.cf-stat__fig[data-n]', tally).forEach((el, i) => {
      const to = +el.dataset.n, t0 = performance.now() + 250 + i * 120, dur = 1100;
      el.textContent = '0';
      const step = t => { const k = Math.min(1, Math.max(0, (t - t0) / dur)); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }

  /* ---------- the categories ---------- */
  const list = $('#cfList');
  if (list && D) {
    const TREE = [{ k: 'gs', label: 'GS Foundation', kids: ['gs-11', 'gs-2yr'] }]
      .concat(D.families.filter(f => f.k !== 'gs-11' && f.k !== 'gs-2yr').map(f => ({ k: f.k, label: f.label, kids: [f.k] })));
    const subLabel = Object.fromEntries(D.subjects.map(s => [s.k, s.label]));
    // what each category is and who it is for (user 2026-11-18): the first line is the homepage's (js/content.js CAT_D) where it has
    // one; the rest is drawn from the "who should join" and opening copy on the category's course pages (js/data/courses.js who, intro)
    const ABOUT = {
      gs: ['The whole General Studies syllabus for Prelims and Mains, taught together, over 11 months or 2 years.',
        'Final-year students and graduates starting the UPSC CSE. The 2-year Fledgling suits those still in college who want a steadier pace from no prior base.'],
      optional: ['Two papers, 500 marks, taught by a specialist in your optional subject.',
        'Mains aspirants who have chosen, or are choosing, their optional, in any of 13 subjects.'],
      csat: ['Prelims Paper II. Qualifying at 33%, but it has to be cleared.',
        'Prelims aspirants who want to cover the CSAT basics on schedule, learn the shortcuts and cut their negative marks.'],
      interview: ['Mock boards with detailed feedback, for the 275-mark personality test.',
        'Candidates who have cleared the UPSC CSE or IFoS Mains and are preparing for the interview.'],
      mentorship: ['A personal mentor shapes your strategy and keeps your plan on track, week by week, in English or Hindi.',
        'Aspirants who have covered the syllabus or a foundation course but are not turning it into marks, and repeat candidates.'],
      'mains-ts': ['Write to time, then read what an evaluator would change. English and Hindi.',
        'First-time aspirants building answer-writing habits, repeat candidates fixing a Mains score, and seniors who have written Mains before.'],
      'prelims-ts': ['Full-length tests with the reasoning behind every answer, plus current affairs.',
        'Prelims aspirants who want to practise time management and accuracy under exam conditions.'],
      'optional-ts': ['Answer writing for your optional, evaluated paper by paper.',
        'Mains aspirants who want regular tests and evaluation in their optional, Paper I and Paper II.'],
      module: ['Short modules on one part of the syllabus: Economics, Ethics (GS Paper IV) and SMART current affairs, plus the Ranker’s Programme.',
        'Aspirants who want to strengthen one subject or their current affairs, or to reassess and improve after an attempt.'],
      crash: ['A short, intensive course in your optional: concept classes alongside a test series.',
        'Mains aspirants close to the exam who want to revise their optional quickly and practise answer writing.'],
      enrichment: ['Answer-writing programmes for your optional: previous years’ questions, weekly tests and evaluation.',
        'Aspirants who know their optional’s content and want sharper, more analytical answers.'],
      ifos: ['Forestry and Geology, the Indian Forest Service optionals, as courses and test series.',
        'Indian Forest Service (IFoS) Mains aspirants who take Forestry or Geology.'],
      postal: ['Vajiram & Ravi’s printed study material, subject by subject: polity, history, society, international relations and more.',
        'Aspirants preparing on their own who want the institute’s notes.']
    };
    const NEW = new Set(['interview']);   // shown as new (user 2026-11-17, "let's say Interview Guidance is a new course")
    // Iconoir's nav-arrow-left and nav-arrow-right
    const CHEV = d => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d < 0 ? 'M15 6L9 12L15 18' : 'M9 6L15 12L9 18'}"/></svg>`;
    const modeTxt = v => v.k === 'classroom' ? 'Classroom' : v.k === 'online' ? 'LIVE-Online' : 'Classroom & LIVE-Online';
    const LOGO = '<img class="cf-k__logo" src="assets/img/brand/emblem.png" alt="" width="28" height="28">';

    const fold = s => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
    const famLabel = Object.fromEntries(D.families.map(f => [f.k, f.label]));
    const card = (c, v, t) => {
      const meta = [modeTxt(v), v.dur, v.l === 'hi' ? '<span lang="hi">हिंदी</span>' : ''].filter(Boolean).join(' · ');
      // what the search looks through: the course's name, its category, its subject, its mode, and its medium
      const q = fold([v.t, t.label, famLabel[c.f], subLabel[c.s], modeTxt(v), v.l === 'hi' ? 'hindi हिंदी' : 'english'].join(' '));
      return `<li class="cf-k" data-mode="${v.k}" data-lang="${v.l}" data-sub="${c.s || ''}" data-q="${esc(q)}"><a class="cf-k__a" href="${esc(v.u)}" target="_blank" rel="noopener">
        <span class="cf-k__pic"><img src="${v.i}" alt="" loading="lazy" decoding="async" width="450" height="300"></span>
        <span class="cf-k__b">
          <span class="cf-k__by">${LOGO}<span>Vajiram &amp; Ravi</span></span>
          <span class="cf-k__t">${esc(v.t)}</span>
          <span class="cf-k__m">${meta}</span>
        </span>
        <span class="cf-k__ft">${v.feeShort ? `<span class="cf-k__fee">${esc(v.feeShort)}<small>incl. GST</small></span>` : ''}<span class="cf-k__go">View course</span></span>
      </a></li>`;
    };
    // the chips: a category taught by subject is split by subject (mode and medium are the bar's tabs, for every category at once)
    const chipsFor = items => {
      const subs = [...new Set(items.map(([c]) => c.s).filter(Boolean))];
      return subs.length > 1 ? subs.sort((a, b) => subLabel[a].localeCompare(subLabel[b])).map(s => [`sub:${s}`, subLabel[s]]) : [];
    };
    list.innerHTML = TREE.map(t => {
      const items = D.courses.filter(c => t.kids.includes(c.f)).flatMap(c => c.v.map(v => [c, v]));
      if (!items.length) return '';
      const chips = chipsFor(items);
      const car = `<div class="cf-car">
          <ul class="cf-grid">${items.map(([c, v]) => card(c, v, t)).join('')}</ul>
          <button type="button" class="cf-arw cf-arw--prev" data-dir="-1" aria-label="Previous ${esc(t.label)} courses" hidden>${CHEV(-1)}</button>
          <button type="button" class="cf-arw cf-arw--next" data-dir="1" aria-label="More ${esc(t.label)} courses" hidden>${CHEV(1)}</button>
        </div>`;
      // GS Foundation, the flagship (user 2026-11-18, "highlight GS since it is their flagship course"; coursera.org's featured
      // certificate rows as the reference): a banner on the homepage's "Our flagship programme" ground, its introduction on the left
      // and its courses sliding on the right
      if (t.k === 'gs') {
        return `<section class="cf-sec cf-feat" id="cat-gs" aria-labelledby="cath-gs">
        <div class="cf-feat__cuts" aria-hidden="true"><img class="cut--l" src="assets/img/photos/collage.png" alt="" decoding="async"><img class="cut--r" src="assets/img/photos/collage.png" alt="" decoding="async"></div>
        <div class="cf-feat__intro">
          <div class="lbl lbl--w cf-feat__lbl"><span class="lbl__t">Our flagship programme</span></div>
          <h2 class="cf-sec__h" id="cath-gs">${esc(t.label)}</h2>
          <p class="cf-sec__d">${esc(ABOUT.gs[0])}</p>
          <p class="cf-sec__who"><b>Who it’s for</b> ${esc(ABOUT.gs[1])}</p>
        </div>
        ${car}
      </section>`;
      }
      return `<section class="cf-sec" id="cat-${t.k}" aria-labelledby="cath-${t.k}">
        <h2 class="cf-sec__h" id="cath-${t.k}">${esc(t.label)}${NEW.has(t.k) ? ' <span class="cf-new">New</span>' : ''}</h2>
        ${ABOUT[t.k] ? `<div class="cf-sec__about"><p class="cf-sec__d">${esc(ABOUT[t.k][0])}</p><p class="cf-sec__who"><b>Who it’s for</b> ${esc(ABOUT[t.k][1])}</p></div>` : ''}
        ${chips.length ? `<div class="cf-chips" role="group" aria-label="Show ${esc(t.label)} courses">
          <button type="button" class="cf-chip" data-f="" aria-pressed="true">All</button>${chips.map(([f, l]) => `<button type="button" class="cf-chip" data-f="${f}" aria-pressed="false">${esc(l)}</button>`).join('')}
        </div>` : ''}
        ${car}
      </section>`;
    }).join('');

    // the bar's search and tabs filter every category; a category with nothing left is hidden, and its subject chips with nothing left too
    const state = { q: [], mode: '', lang: '' };
    const passes = k => (!state.mode || k.dataset.mode === state.mode || k.dataset.mode === 'both')
      && (!state.lang || k.dataset.lang === state.lang) && state.q.every(w => k.dataset.q.includes(w));
    // each section's courses sit in one row that scrolls sideways (user 2026-11-18, a udemy.com course row as the reference): round
    // arrow buttons at its two ends, each shown only while there is more that way
    const arrows = sec => {
      const tr = $('.cf-grid', sec), max = tr.scrollWidth - tr.clientWidth;
      $('.cf-arw--prev', sec).hidden = tr.scrollLeft <= 2;
      $('.cf-arw--next', sec).hidden = tr.scrollLeft >= max - 2;
    };
    const layout = sec => {
      const all = $$('.cf-k', sec), ok = all.filter(passes);
      $$('.cf-chip[data-f^="sub:"]', sec).forEach(c => { c.hidden = !ok.some(k => `sub:${k.dataset.sub}` === c.dataset.f); });
      const row = $('.cf-chips', sec);
      if (row) row.hidden = $$('.cf-chip[data-f^="sub:"]:not([hidden])', sec).length < 2;   // one subject left: nothing to choose between
      const on = $('.cf-chip[aria-pressed="true"]', sec);
      if (row && row.hidden && on && on.dataset.f) on.hidden = true;
      if (on && on.hidden) { $$('.cf-chip', sec).forEach(c => c.setAttribute('aria-pressed', String(!c.dataset.f))); sec.dataset.f = ''; }
      const f = sec.dataset.f || '', [key, val] = f.split(':');
      const match = ok.filter(k => !f || k.dataset[key] === val);
      all.forEach(k => { k.hidden = !match.includes(k); });
      sec.hidden = !ok.length;
      const tr = $('.cf-grid', sec); tr.scrollLeft = 0;
      arrows(sec);
      return ok.length;
    };
    const count = $('#cfCount'), empty = $('#cfEmpty');
    const layoutAll = () => {
      const n = $$('.cf-sec', list).reduce((s, sec) => s + layout(sec), 0);
      const first = $('.cf-sec:not([hidden])', list);
      $$('.cf-sec', list).forEach(s => s.classList.toggle('is-first', s === first));
      if (empty) empty.hidden = n > 0;
      if (count) count.textContent = n ? `${n} course${n === 1 ? '' : 's'} shown` : 'No courses match.';
    };
    layoutAll();
    list.addEventListener('click', e => {
      const chip = e.target.closest('.cf-chip');
      if (chip) {
        const sec = chip.closest('.cf-sec');
        $$('.cf-chip', sec).forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
        sec.dataset.f = chip.dataset.f; layout(sec); return;
      }
      const arw = e.target.closest('.cf-arw');
      if (arw) {   // one screenful of cards at a time
        const tr = $('.cf-grid', arw.closest('.cf-sec'));
        tr.scrollBy({ left: +arw.dataset.dir * tr.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
    $$('.cf-sec', list).forEach(sec => $('.cf-grid', sec).addEventListener('scroll', () => arrows(sec), { passive: true }));
    addEventListener('resize', () => $$('.cf-sec', list).forEach(arrows));

    /* ---------- the bar: sticks under the nav, or at the top while the nav is slid away (.is-away, js/site-nav.js) ---------- */
    const bar = $('#cfBar'), navEl = $('#nav') || $('.rn'), q = $('#cfQ'), qx = $('#cfQx');
    const mark = document.createElement('div'); mark.className = 'cf-bar-mark'; mark.setAttribute('aria-hidden', 'true');
    if (bar) bar.before(mark);
    const navOff = () => (!navEl || navEl.classList.contains('is-away') || navEl.classList.contains('is-open')) ? 0
      : (parseFloat(getComputedStyle(navEl).top) || 0) + navEl.offsetHeight + 12;
    const pin = () => {
      if (!bar) return;
      const off = navOff();
      document.documentElement.style.setProperty('--cf-navoff', off + 'px');
      bar.classList.toggle('is-stuck', mark.getBoundingClientRect().top < off + 1);
    };
    addEventListener('scroll', pin, { passive: true }); addEventListener('resize', pin); pin();
    if (navEl) new MutationObserver(pin).observe(navEl, { attributes: true, attributeFilter: ['class'] });
    // after a change, a stuck bar brings the list back to its start, so the first results are in view
    const toStart = () => {
      if (!bar || !bar.classList.contains('is-stuck')) return;
      scrollTo({ top: mark.getBoundingClientRect().top + scrollY - navOff(), behavior: 'auto' });
    };
    const apply = () => { layoutAll(); toStart(); };
    if (q) q.addEventListener('input', () => {
      state.q = fold(q.value).split(/\s+/).filter(Boolean); qx.hidden = !q.value; apply();
    });
    if (q) q.addEventListener('keydown', e => { if (e.key === 'Escape' && q.value) { q.value = ''; q.dispatchEvent(new Event('input')); } });
    if (qx) qx.addEventListener('click', () => { q.value = ''; q.dispatchEvent(new Event('input')); q.focus(); });
    // the mode and medium tabs: the homepage's (js/life-gallery.js): the brand pill springs to the chosen tab; arrow keys move along
    const placeInd = (seg, instant) => {
      const ind = $('.cf-seg__ind', seg), sel = $('.cf-seg__b[aria-selected="true"]', seg); if (!ind || !sel) return;
      ind.classList.toggle('is-instant', !!instant);
      ind.style.transform = `translateX(${sel.offsetLeft}px)`; ind.style.width = sel.offsetWidth + 'px';
      if (instant) { void ind.offsetWidth; ind.classList.remove('is-instant'); }
    };
    const pickTab = (seg, b) => {
      $$('.cf-seg__b', seg).forEach(x => { const on = x === b; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
      placeInd(seg, reduce);
      state[seg.dataset.key] = b.dataset.v;
    };
    $$('.cf-seg').forEach(seg => {
      placeInd(seg, true);
      seg.addEventListener('click', e => { const b = e.target.closest('.cf-seg__b'); if (b) { pickTab(seg, b); apply(); } });
      seg.addEventListener('keydown', e => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
        const tabs = $$('.cf-seg__b', seg), k = tabs.findIndex(x => x.getAttribute('aria-selected') === 'true'), nx = tabs[(k + d + tabs.length) % tabs.length];
        pickTab(seg, nx); apply(); nx.focus(); e.preventDefault();
      });
    });
    addEventListener('resize', () => $$('.cf-seg').forEach(seg => placeInd(seg, true)));
    if (document.fonts) document.fonts.ready.then(() => $$('.cf-seg').forEach(seg => placeInd(seg, true)));
    const reset = $('#cfReset');
    if (reset) reset.addEventListener('click', () => {
      $$('.cf-seg').forEach(seg => pickTab(seg, $('.cf-seg__b', seg)));
      q.value = ''; state.q = []; qx.hidden = true; apply();
    });

    // the nav's course menus (js/site-nav.js) and #cat=… links scroll to that category's section, clear of the bar
    const go = (k, smooth = true) => {
      const id = k === 'all' ? null : (k === 'gs-11' || k === 'gs-2yr') ? 'gs' : k;
      const el = id ? $(`#cat-${id}`) : list;
      if (!el || el.hidden) return;
      const y = el.getBoundingClientRect().top + scrollY, down = y > scrollY;
      const top = y - (bar ? bar.offsetHeight : 0) - (down ? 0 : 70) - 24;   // going up the nav comes back above the bar
      scrollTo({ top, behavior: smooth && !reduce ? 'smooth' : 'auto' });
    };
    window.__cfSetCat = k => { history.replaceState(null, '', `#cat=${k}`); go(k); };
    const m = location.hash.match(/^#cat=([\w-]+)/);
    if (m) setTimeout(() => go(m[1], false), 0);
  }

  /* ---------- buttons: the homepage's rolling label and sliding arrows (from js/page-motion.js), for .bt buttons such as the nav menus' ---------- */
  const ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8h11"/><path d="M8.6 3.6C9.4 5.9 11.2 7.4 13.5 8 11.2 8.6 9.4 10.1 8.6 12.4"/></svg>';
  const enhance = el => {
    if (el.dataset.cta) return; el.dataset.cta = '1'; el.classList.add('cta');
    const sq = el.querySelector(':scope > .sq'), rest = [...el.childNodes].filter(n => n !== sq);
    const html = rest.map(n => n.nodeType === 1 ? n.outerHTML : n.textContent).join('').trim(); rest.forEach(n => n.remove());
    const label = document.createElement('span'); label.className = 'btn__label';
    label.innerHTML = `<span class="btn__t">${html}</span><span class="btn__t" aria-hidden="true">${html}</span>`;
    el.insertBefore(label, sq || null); if (sq) sq.innerHTML = ARROW + ARROW;
  };
  const scan = r => (r.matches && r.matches('.bt') ? [r] : []).concat(r.querySelectorAll ? [...r.querySelectorAll('.bt')] : []).forEach(enhance);
  scan(document);
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) scan(n); }))).observe(document.body, { childList: true, subtree: true });
})();
