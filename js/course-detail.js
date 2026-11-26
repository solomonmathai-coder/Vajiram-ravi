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
  const rv = $$('.cd [data-rv]');
  if ('IntersectionObserver' in window && !reduce.matches) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(el => io.observe(el));
  } else rv.forEach(el => el.classList.add('in'));

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
