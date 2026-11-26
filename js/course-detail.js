/* The course detail page (course-detail.html, branch kevin-course-detail-page, 2026-11-26): the counsellor form (the homepage's Talk
   to us), the phone dock with Join now, and the reveal on scroll (the toppers row's arrows are kept for a row with #cdRail, none now).
   The nav and footer are js/site-nav.js and js/footer-ref.js, as on the homepage. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const smooth = () => (reduce.matches ? 'auto' : 'smooth');

  // ---------- the nav: a mouse click on All courses goes to the course finder (hovering opens its panel; touch and keys open it)
  const exploreBtn = $('#exploreBtn');
  if (exploreBtn) exploreBtn.addEventListener('click', e => {
    if (e.pointerType === 'mouse') { e.preventDefault(); e.stopImmediatePropagation(); location.href = 'course-finder.html'; }
  }, true);

  // ---------- reveal on scroll
  const rv = $$('.cd [data-rv], .cd .rv, .cd .hx__stats');   // (.rv: the homepage components, as on his page; .hx__stats: his hero's numbers)
  if ('IntersectionObserver' in window && !reduce.matches) {
    const show = el => { el.classList.add('in'); if (el.classList.contains('hx__stats')) { el.classList.remove('is-pre'); el.classList.add('is-in'); } };
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(el => io.observe(el));
  } else rv.forEach(el => { el.classList.add('in'); el.classList.remove('is-pre'); el.classList.add('is-in'); });

  // ---------- the toppers row: the arrows move it by two portraits, and grey out at its ends
  const rail = $('#cdRail'), rb = $$('.cd-rail__b');
  if (rail && rb.length) {
    const step = () => { const c = $('.cd-tp', rail); return c ? (c.offsetWidth + 18) * 2 : 360; };
    const ends = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      rb.forEach(b => { b.disabled = +b.dataset.dir < 0 ? rail.scrollLeft <= 2 : rail.scrollLeft >= max - 2; });
    };
    rb.forEach(b => b.addEventListener('click', () => rail.scrollBy({ left: +b.dataset.dir * step(), behavior: smooth() })));
    rail.addEventListener('scroll', ends, { passive: true }); addEventListener('resize', ends); ends();
  }

  // ---------- the counsellor form: the homepage's Talk to us (components/sections/TalkToUs.jsx, initTalkToUs), its checks, messages and
  // behaviour: the programme and time pickers in the site's dropdown (js/custom-select.js), the mobile number cleaned as it is typed,
  // the first wrong field marked and named; with no endpoint set it says plainly that nothing was sent and gives the number to call
  const form = $('#cdForm');
  if (form) {
    const PHONE = '080-6220-6330';
    const MSG = {
      fName: 'Enter your name.',
      fPhone: 'Enter a 10-digit mobile number starting with 6, 7, 8 or 9.',
      fEmail: 'Enter an email like name@example.com, or leave it blank.',
      fProg: 'Choose a programme, or "Not sure yet".',
      fTime: 'Choose a time for the call.',
    };
    const field = Object.fromEntries(Object.keys(MSG).map(id => [id, $('#' + id)]));
    const { fName, fPhone, fTime } = field;
    const err = $('#fErr'), btn = $('#fBtn'), label = btn.firstChild;
    if (window.enhanceSelect) { window.enhanceSelect(field.fProg); window.enhanceSelect(fTime); }
    fPhone.addEventListener('input', () => { fPhone.value = fPhone.value.replace(/\D/g, '').replace(/^(91|0)(?=\d{10})/, '').slice(0, 10); });
    const send = async (url, body) => {
      if (!url) throw new Error('not-configured');
      const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), 12000);
      try {
        const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal });
        if (!r.ok) throw new Error('http-' + r.status);
      } finally { clearTimeout(t); }
    };
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (btn.disabled) return;
      $$('[aria-invalid]', form).forEach(el => el.removeAttribute('aria-invalid'));
      fName.value = fName.value.trim();
      const bad = Object.values(field).find(el => !el.checkValidity());
      if (bad) { bad.setAttribute('aria-invalid', 'true'); err.textContent = MSG[bad.id]; bad.focus(); return; }
      err.textContent = ''; btn.disabled = true; btn.classList.add('is-loading'); label.textContent = 'Sending… ';
      const data = { ...Object.fromEntries(new FormData(form)), phone: '+91' + fPhone.value, source: 'course-detail: UPSC GS Course 2028' };
      try {
        await send(form.dataset.endpoint, data);
        $('#okMsg').textContent = `A counsellor will call +91 ${fPhone.value} in the ${fTime.value.split(',')[0].toLowerCase()}.`;
        form.classList.add('done'); $('#fOk').focus();
      } catch (ex) {
        err.textContent = ex.message === 'not-configured'
          ? `Online booking isn’t connected yet, so nothing was sent. Please call ${PHONE}, Monday to Saturday, 9 am to 7 pm.`
          : `We couldn’t send your request. Try again, or call ${PHONE}.`;
      } finally { btn.disabled = false; btn.classList.remove('is-loading'); label.textContent = 'Book a free session'; }
    });
  }

  // ---------- the enrol cards' plan switch (review 2026-11-26, the shared design's): GS only or GS + CSAT; both cards (the hero's and
  // Admission's) follow, and the fee and the Enrol label change with the plan. Left and right arrows move along the switch
  const plans = $$('.cd-plan');
  const setPlan = name => {
    const pick = $(`.cd-plan .cd-seg__b[data-plan="${name}"]`); if (!pick) return;
    plans.forEach(g => $$('.cd-seg__b', g).forEach(b => {
      const on = b.dataset.plan === name;
      b.classList.toggle('is-on', on); b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1;
    }));
    $$('.cd-fee').forEach(f => { f.textContent = pick.dataset.fee; });
    $$('.cd-enrol').forEach(e => { e.textContent = `Enrol now: ${name}`; });
  };
  plans.forEach(g => {
    g.addEventListener('click', e => { const b = e.target.closest('.cd-seg__b'); if (b) setPlan(b.dataset.plan); });
    g.addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const bs = $$('.cd-seg__b', g), i = bs.findIndex(x => x.getAttribute('aria-checked') === 'true');
      const n = bs[(i + (e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length];
      setPlan(n.dataset.plan); n.focus();
    });
  });
  if (plans.length) setPlan('GS only');

  // ---------- tabs (What you get, the FAQs): the homepage's tray, the orange pill sliding to the chosen tab; click, or arrows / Home /
  // End along the tray, shows that tab's panel
  $$('.cd-tabs2').forEach(t => {
    const tray = $('.cd-tabs2__tray', t), ind = $('.cd-tabs2__ind', t), tabs = $$('[role="tab"]', t);
    const place = () => {
      const on = tabs.find(b => b.getAttribute('aria-selected') === 'true'); if (!on || !ind) return;
      ind.style.width = `${on.offsetWidth}px`; ind.style.height = `${on.offsetHeight}px`;
      ind.style.transform = `translate(${on.offsetLeft}px, ${on.offsetTop - 4}px)`;   // (both ways: on phones the tray is a grid)
    };
    const pick = (b, focus) => {
      tabs.forEach(x => {
        const on = x === b;
        x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
        const pnl = document.getElementById(x.getAttribute('aria-controls')); if (pnl) pnl.hidden = !on;
      });
      place();
      if (focus) b.focus();
      if (tray.scrollWidth > tray.clientWidth) tray.scrollTo({ left: b.offsetLeft - (tray.clientWidth - b.offsetWidth) / 2, behavior: smooth() });
    };
    tabs.forEach(b => b.addEventListener('click', () => pick(b)));
    tray.addEventListener('keydown', e => {
      const i = tabs.indexOf(document.activeElement); if (i < 0) return;
      const j = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length
        : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
      if (j === null) return;
      e.preventDefault(); pick(tabs[j], true);
    });
    addEventListener('resize', place);
    if (document.fonts) document.fonts.ready.then(place);
    place();
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('is-ready')));
  });

  // ---------- the homepage's tab bar (Abhishek's components/ui/Tabs.jsx, initTabs): the brand pill slides to the chosen tab (.has-ind on
  // the bar shows it), arrows / Home / End move along, the chosen tab is kept in view; each tab shows its own panel
  $$('.cd .tabs').forEach(bar => {
    const list = $('[role="tablist"]', bar), ind = $('.tabs__ind', list), all = $$('[role="tab"]', list);
    const current = () => all.find(t => t.getAttribute('aria-selected') === 'true');
    const place = () => { const t = current(); if (!t || !ind) return; ind.style.transform = `translateX(${t.offsetLeft}px)`; ind.style.width = `${t.offsetWidth}px`; bar.classList.add('has-ind'); };
    const centre = () => { const t = current(); if (!t || list.scrollWidth <= list.clientWidth) return;
      list.scrollTo({ left: list.scrollLeft + t.getBoundingClientRect().left - list.getBoundingClientRect().left - (list.clientWidth - t.offsetWidth) / 2, behavior: smooth() }); };
    const choose = (t, focus) => {
      all.forEach(x => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
        const pnl = document.getElementById(x.getAttribute('aria-controls')); if (pnl) pnl.hidden = !on; });
      place(); centre(); if (focus) t.focus();
    };
    all.forEach(t => t.addEventListener('click', () => choose(t)));
    list.addEventListener('keydown', e => {
      const i = all.indexOf(document.activeElement); if (i < 0) return;
      const j = e.key === 'ArrowRight' ? (i + 1) % all.length : e.key === 'ArrowLeft' ? (i - 1 + all.length) % all.length : e.key === 'Home' ? 0 : e.key === 'End' ? all.length - 1 : null;
      if (j === null) return; e.preventDefault(); choose(all[j], true);
    });
    addEventListener('resize', place); if (document.fonts) document.fonts.ready.then(place); place();
  });

  // ---------- the homepage's rails (Abhishek's components/ui/rail.js): the chevrons scroll one card and hide at their end of the row; on
  // phones the dots follow the card nearest the row's start, and a tap on a dot brings its card in
  $$('.cd .rail').forEach(rail => {
    const track = $('.rail__track', rail), prev = $('.cbtn--prev', rail), next = $('.cbtn--next', rail); if (!track) return;
    const cardStep = () => { const c = track.children; return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : track.clientWidth; };
    const sync = () => { const max = track.scrollWidth - track.clientWidth;
      if (prev) prev.style.visibility = track.scrollLeft <= 2 ? 'hidden' : '';
      if (next) next.style.visibility = track.scrollLeft >= max - 2 ? 'hidden' : ''; };
    if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -cardStep(), behavior: smooth() }));
    if (next) next.addEventListener('click', () => track.scrollBy({ left: cardStep(), behavior: smooth() }));
    track.addEventListener('keydown', e => { if (e.key === 'ArrowRight' && next) next.click(); if (e.key === 'ArrowLeft' && prev) prev.click(); });
    track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    addEventListener('resize', sync, { passive: true }); sync(); setTimeout(sync, 600);
    const dots = $$('.rail__dots > button', rail.closest('section') || rail), cards = [...track.children];
    if (dots.length) {
      const left = c => c.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
      const pad = () => parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
      let cur = -1, tick = 0;
      const mark = () => { tick = 0; const x = track.scrollLeft + pad(); let k = 0;
        cards.forEach((c, i) => { if (Math.abs(left(c) - x) < Math.abs(left(cards[k]) - x)) k = i; });
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) k = cards.length - 1;
        if (k === cur) return; cur = k;
        dots.forEach((d, i) => { if (i === k) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); }); };
      track.addEventListener('scroll', () => { if (!tick) tick = requestAnimationFrame(mark); }, { passive: true });
      dots.forEach((d, i) => d.addEventListener('click', () => track.scrollTo({ left: left(cards[i]) - pad(), behavior: smooth() })));
      addEventListener('resize', mark, { passive: true }); mark();
    }
  });

  // ---------- phones: the dock with Join now, once the ticket's Enroll now has gone by, until the closing card or the footer
  const dock = $('#cdDock'), tkJoin = $('#cdTkJoin'), ready = $('#ready'), foot = $('footer');
  if (dock && tkJoin) {
    const inView = el => { if (!el) return false; const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };
    let raf = 0;
    const set = () => {
      raf = 0;
      const on = tkJoin.getBoundingClientRect().bottom < 0 && !inView(ready) && !inView(foot);
      if (on === dock.classList.contains('is-on')) return;
      dock.classList.toggle('is-on', on); dock.setAttribute('aria-hidden', String(!on));
      const a = $('a', dock); if (a) a.tabIndex = on ? 0 : -1;
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(set); };
    addEventListener('scroll', ask, { passive: true }); addEventListener('resize', ask); set();
  }
})();
