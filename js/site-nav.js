/* The course finder's nav (css/ref-nav.css): the reference build's bar and behaviour (vajiram-ravi.abhishek-ps.workers.dev, user
   2026-11-17, "use the same nav bar and its behaviour").
   - Fixed and never hidden, contents always dark; the white panel clear at the top of the page (.is-top), shown once scrolled (2026-11-20).
   - "All courses" and "Study materials" open the homepage's mega menus (hover with a mouse, click or Enter, ArrowDown into the first link;
     one at a time; an outside click, focus leaving or Escape closes them; the page blurs behind). On this page a programme in "All
     courses" opens that category on the shelf (js/course-finder.js window.__cfSetCat); the counts are this page's.
   - Links that do not fit the bar go into "More".
   - The menu button opens the drawer (under 1024px; under 761px it also holds the language switch and "Let's talk").
   - EN / हिं swaps the nav's labels (js/lang-switch.js's words), sets <html lang> and is remembered. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const nav = $('#nav'); if (!nav) return;
  const SITE = 'https://vajiramandravi.com/';
  const root = document.documentElement;
  const drawer = $('#drawer'), burger = $('#burger');

  /* ---------- the reference build's current behaviour (user 2026-11-20, "use the same nav behaviour as the nav in this link"): fixed at
     the top and never hidden; its contents always dark (.is-scrolled: the dark logo, ink links, the orange "Let's talk"); within the first
     48px of the page the white panel behind it is clear (.is-top, the reference's #nav[data-top]), and past that it fades in with its
     shadow (css/course-finder.css) ---------- */
  nav.classList.remove('is-open', 'is-away');
  nav.classList.add('is-scrolled');
  let tick = false;
  const top = () => { tick = false; nav.classList.toggle('is-top', scrollY < 48); };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(top); } }, { passive: true });
  top();

  /* ---------- the drawer ---------- */
  const setDrawer = open => { if (!drawer || !burger) return; drawer.hidden = !open; burger.setAttribute('aria-expanded', open); burger.classList.toggle('x', open); };
  if (burger) burger.addEventListener('click', () => setDrawer(drawer.hidden));
  if (drawer) $$('a', drawer).forEach(a => a.addEventListener('click', () => setDrawer(false)));

  /* ---------- the mega menus ---------- */
  const megas = [];
  document.body.insertAdjacentHTML('beforeend', '<div class="mega-scrim" aria-hidden="true"></div>');
  const navMega = (wrap, btn) => {
    const set = open => {
      if (open) { megas.forEach(m => m !== api && m.set(false)); setMore(false); }
      wrap.classList.toggle('open', open); btn.setAttribute('aria-expanded', open);
      root.classList.toggle('mega-open', $$('.rn .explore.open').length > 0);
    };
    let t;
    btn.addEventListener('click', () => set(!wrap.classList.contains('open')));
    wrap.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { clearTimeout(t); set(true); } });
    wrap.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') t = setTimeout(() => set(false), 160); });
    document.addEventListener('click', e => { if (!wrap.contains(e.target)) set(false); });
    wrap.addEventListener('focusout', e => { if (!wrap.contains(e.relatedTarget)) set(false); });
    btn.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); set(true); const a = $('.mega__a', wrap); if (a) a.focus(); } });
    const api = { set }; megas.push(api); return api;
  };
  const closeAll = () => megas.forEach(m => m.set(false));

  const D = window.CF_DATA;
  const CAT_OF = { gs: ['gs-11', 'gs-2yr'] };
  const countIn = k => D ? D.courses.filter(c => (CAT_OF[k] || [k]).includes(c.f)).reduce((n, c) => n + c.v.length, 0) : 0;
  const total = D ? D.courses.reduce((n, c) => n + c.v.length, 0) : 0;
  const plural = n => n + (n === 1 ? ' course' : ' courses');
  const P = {
    gs: ['UPSC GS Foundation Course', 'The whole General Studies syllabus for Prelims and Mains together.'],
    optional: ['Optional Subject Programme', 'Two papers, 500 marks, taught by a specialist in your optional subject.'],
    csat: ['CSAT Course', 'Prelims Paper II. Qualifying at 33%, but it has to be cleared.'],
    interview: ['Interview Guidance Programme', 'Mock boards with detailed feedback, for the 275-mark personality test.'],
    mentorship: ['Mentorship Programme', 'A mentor keeps your plan on track, week by week, in English or Hindi.'],
    'mains-ts': ['Mains Test Series', 'Write to time, then read what an evaluator would change. English and Hindi.'],
    'prelims-ts': ['Prelims Test Series', 'Full-length tests with the reasoning behind every answer, plus current affairs.'],
    'optional-ts': ['Optional Test Series', 'Answer writing for your optional, evaluated paper by paper.']
  };
  const STAGES = [['Foundation', ['gs']], ['Prelims', ['prelims-ts', 'csat']], ['Mains', ['mains-ts', 'optional', 'optional-ts']], ['Interview', ['interview']], ['Mentorship', ['mentorship']]];
  const ARW = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg>';
  const mega = $('#mega');
  if (mega) mega.innerHTML = `<div class="mega__stages">${STAGES.map(([k, cats], i) => `<section class="mega__col" style="--i:${i}">
      <p class="mega__k"><b>${String(i + 1).padStart(2, '0')}</b>${k}</p>
      <ul>${cats.map(c => `<li><a class="mega__a" href="#cat=${c}" data-cf-cat="${c}"><span class="mega__t">${esc(P[c][0])}</span><span class="mega__d">${esc(P[c][1])}</span><span class="mega__n">${plural(countIn(c))}</span></a></li>`).join('')}</ul>
    </section>`).join('')}</div>
    <aside class="mega__aside">
      <p class="mega__k">Not sure where to start?</p>
      <p class="mega__p">A counsellor will match you to a programme for your stage, with no pressure to enrol.</p>
      <a class="bt bt--brand mega__cta" href="index.html#contact">Talk to a counsellor<span class="sq sq--52 sq--white"></span></a>
      <a class="mega__all" href="#cat=all" data-cf-cat="all">Browse all ${total} courses${ARW}</a>
    </aside>`;
  const SM = [
    ['Current affairs', [['Daily current affairs', 'Prelims, Mains and Quest articles', 'Daily'], ['The Recitals', 'The monthly current affairs magazine', 'Monthly'],
      ['Editorial analysis', 'The day’s editorials, explained', 'Daily'], ['Daily quiz', 'Ten quick questions on the news', 'Daily']]],
    ['Practice', [['Previous year papers', 'Prelims and Mains, with answer keys'], ['Answer writing practice', 'A Mains question to write each day'],
      ['Model answers for Mains', 'Mains 2026, paper by paper'], ['Essay topics', 'Past and probable essay themes']]],
    ['Study material', [['GS postal books', 'Printed General Studies material'], ['NCERT notes', 'The basics every paper builds on'],
      ['Government schemes', 'Schemes and missions, summed up'], ['Ethics case studies', 'GS Paper IV cases, with approaches']]],
    ['Exam guide', [['Syllabus & exam pattern', 'Each stage, and how it is marked'], ['UPSC Calendar 2027', 'Every date, the age limit, eligibility'],
      ['Optional subjects list', 'All optionals, and how to choose'], ['Interview guidance tips', 'Preparing for the Personality Test']]]
  ];
  // the menu's headlines; they used to be read from the footer's "Latest current affairs" card, which the footer no longer has
  // (user 2026-11-20, "remove these from the footer"), so they live here now
  const CA = 'https://vajiramandravi.com/current-affairs/';
  const HEADS = [['Mains', 'Supreme Court redefines the meaning of ‘industry’', CA + 'upsc-mains-current-affairs/'],
    ['Mains', 'NITI Aayog flags gap between education and employment', CA + 'upsc-mains-current-affairs/'],
    ['Prelims', 'Thiksey Monastery', CA + 'upsc-prelims-current-affairs/']];
  const heads = HEADS.map(([k, t, href]) =>
    `<li><a class="mega__h" href="${href}" target="_blank" rel="noopener"><span class="mega__hk">${esc(k)}</span><span class="mega__ht">${esc(t)}</span></a></li>`).join('');
  const megaSm = $('#megaSm');
  if (megaSm) megaSm.innerHTML = `<div class="mega__stages">${SM.map(([k, items], i) => `<section class="mega__col${i ? '' : ' mega__col--feat'}" style="--i:${i}">
    <p class="mega__k"><b>${String(i + 1).padStart(2, '0')}</b>${esc(k)}${i ? '' : '<span class="mega__live"><i aria-hidden="true"></i>Live</span>'}</p>
    <ul>${items.map(([t, d, n]) => `<li><a class="mega__a" href="${SITE}" target="_blank" rel="noopener"><span class="mega__t">${esc(t)}</span><span class="mega__d">${n ? `<b class="mega__f">${esc(n)}</b>` : ''}${esc(d)}</span></a></li>`).join('')}</ul>
  </section>`).join('')}</div>
  <aside class="mega__aside" style="--i:${SM.length}">
    <p class="mega__k">Today’s headlines</p>
    ${heads ? `<ul class="mega__heads">${heads}</ul>` : ''}
    <a class="bt bt--brand mega__cta" href="index.html#resources">Explore free resources<span class="sq sq--52 sq--white"></span></a>
    <a class="mega__all" href="${SITE}" target="_blank" rel="noopener">View all study materials${ARW}</a>
  </aside>`;
  if ($('#explore') && $('#exploreBtn')) navMega($('#explore'), $('#exploreBtn'));
  if ($('#studyNav') && $('#studyBtn')) navMega($('#studyNav'), $('#studyBtn'));
  if ($('#toppersNav') && $('#toppersBtn')) navMega($('#toppersNav'), $('#toppersBtn'));   // the Toppers page's Toppers menu
  $$('.mega__a, .mega__cta, .mega__all').forEach(a => a.addEventListener('click', closeAll));
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-cf-cat]'); if (!a || !window.__cfSetCat) return;
    e.preventDefault(); closeAll(); setDrawer(false); window.__cfSetCat(a.dataset.cfCat);
  });

  /* ---------- "More": the plain links that do not fit move into it, from the end ---------- */
  const more = $('#navMore'), moreBtn = $('#moreBtn'), links = $('.rn__links');
  const setMore = open => { if (!more) return; more.classList.toggle('is-open', open); moreBtn.setAttribute('aria-expanded', open); };
  const fit = () => {
    if (!more || !links) return;
    const movable = $$('.rn__links > a.rn__a[data-more]');
    movable.forEach(a => a.classList.remove('is-over')); $$('li[data-more]', more).forEach(li => { li.hidden = true; }); more.hidden = true;
    if (getComputedStyle(links).display === 'none') return;
    const room = () => nav.getBoundingClientRect().width - $('.rn__logo').getBoundingClientRect().width - $('.rn__end').getBoundingClientRect().width - 14 - 32;
    const over = () => links.scrollWidth > room();
    if (!over()) return;
    more.hidden = false;
    for (let i = movable.length - 1; i >= 0 && over(); i--) {
      movable[i].classList.add('is-over'); const li = $(`li[data-more="${movable[i].dataset.more}"]`, more); if (li) li.hidden = false;
    }
  };
  if (moreBtn) moreBtn.addEventListener('click', e => { e.stopPropagation(); closeAll(); setMore(!more.classList.contains('is-open')); });
  document.addEventListener('click', e => { if (more && !more.contains(e.target)) setMore(false); });
  if (more) $$('a', more).forEach(a => a.addEventListener('click', () => setMore(false)));
  addEventListener('resize', fit);
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(fit); fit();

  addEventListener('keydown', e => { if (e.key === 'Escape') { closeAll(); setDrawer(false); setMore(false); } });

  /* ---------- EN / हिं (the words from js/lang-switch.js) ---------- */
  const HI = { 'All courses': 'सभी कोर्स', 'Toppers': 'टॉपर्स', 'Study materials': 'अध्ययन सामग्री', 'UPSC exam': 'UPSC परीक्षा', 'Upcoming batches': 'आगामी बैच',
    'FAQs': 'सामान्य प्रश्न', 'Contact us': 'संपर्क करें', "Let's talk": 'बात करें', 'More': 'और' };
  const KEY = 'vr-lang';
  const targets = () => $$('.rn__links .rn__a, .rn__more-t, .rn-more a, #drawer > a, .rn__talk-t');
  targets().forEach(el => { if (!el.dataset.en) el.dataset.en = el.textContent.trim(); });
  const sws = $$('.rn-lang');
  const apply = (lang, animate) => {
    root.lang = lang;
    sws.forEach(sw => { sw.dataset.cur = lang; $$('.rn-lang__b', sw).forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang)); });
    targets().forEach(el => {
      const t = lang === 'hi' ? (HI[el.dataset.en] || el.dataset.en) : el.dataset.en;
      if (el.textContent.trim() === t) return;
      el.textContent = t;
      if (animate && el.animate) el.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'ease-out' });
    });
    requestAnimationFrame(fit);
  };
  let saved = 'en'; try { saved = localStorage.getItem(KEY) === 'hi' ? 'hi' : 'en'; } catch (e) {}
  apply(saved, false);
  sws.forEach(sw => $$('.rn-lang__b', sw).forEach(b => b.addEventListener('click', () => {
    const lang = b.dataset.lang; if (sw.dataset.cur === lang) return;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply(lang, true);
  })));
})();
