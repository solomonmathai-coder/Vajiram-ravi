/* The course detail page (course-detail.html, branch kevin-course-detail-page, 2026-11-26): the section tray that sticks under the
   nav and follows the reading position, the toppers row's arrows, the counsellor form, the phone dock with Join now, and the
   reveal on scroll. The nav and footer are js/site-nav.js and js/footer-ref.js, as on the homepage. */
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

  // ---------- the section tray: sticks under the nav (.is-stuck draws its cream band), marks the section being read with the sliding
  // orange highlight, scrolls itself on phones so the marked one stays in view, and fades at an end with more beyond it
  const bar = $('#cdTabs'), tray = $('.cd-tabs__tray'), ind = $('.cd-tabs__ind');
  const links = tray ? $$('a', tray) : [];
  const secs = links.map(a => $(a.hash));
  let cur = null;
  const edges = () => {
    const max = tray.scrollWidth - tray.clientWidth;
    tray.classList.toggle('is-more-l', max > 1 && tray.scrollLeft > 2);
    tray.classList.toggle('is-more-r', max > 1 && tray.scrollLeft < max - 2);
  };
  const place = () => {
    if (!cur) { ind.style.opacity = '0'; return; }
    ind.style.opacity = '1'; ind.style.width = `${cur.offsetWidth}px`; ind.style.transform = `translateX(${cur.offsetLeft}px)`;
  };
  const mark = a => {
    if (a === cur) return;
    links.forEach(l => { if (l === a) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current'); });
    cur = a; place();
    if (a && tray.scrollWidth > tray.clientWidth) tray.scrollTo({ left: a.offsetLeft - (tray.clientWidth - a.offsetWidth) / 2, behavior: smooth() });
  };
  const line = () => bar.offsetHeight + 24;   // the reading line: just under the stuck tray
  const onScroll = () => {
    if (!bar) return;
    bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= 0.5);
    let on = null;
    secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= line()) on = links[i]; });
    const last = secs[secs.length - 1];
    if (last && last.getBoundingClientRect().bottom < line()) on = null;   // past the FAQs
    mark(on);
  };
  if (bar && tray) {
    links.forEach((a, i) => a.addEventListener('click', e => {
      const s = secs[i]; if (!s) return;
      e.preventDefault();
      scrollTo({ top: scrollY + s.getBoundingClientRect().top - (bar.offsetHeight - 2), behavior: smooth() });
      history.replaceState(null, '', a.hash);
    }));
    tray.addEventListener('scroll', edges, { passive: true });
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', () => { place(); edges(); onScroll(); });
    if (document.fonts) document.fonts.ready.then(() => { place(); edges(); });
    onScroll(); edges();
    requestAnimationFrame(() => requestAnimationFrame(() => tray.classList.add('is-ready')));
  }

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

  // ---------- the counsellor form (the homepage's): checks each field, says what is missing, then thanks the aspirant. It posts to
  // data-endpoint once one is set; until then (a design build) it only shows the thank-you, as the homepage's form does
  const form = $('#cdForm');
  if (form) {
    const f = { name: $('#fName'), email: $('#fEmail'), phone: $('#fPhone') }, q = $('#fQuery'), err = $('#fErr'), btn = $('#fBtn');
    const MSG = { fName: 'Please tell us your name.', fEmail: 'Please enter a valid email address.', fPhone: 'Please enter a 10-digit Indian mobile number.' };
    f.phone.addEventListener('input', () => { f.phone.value = f.phone.value.replace(/\D/g, '').replace(/^(91|0)(?=\d{10})/, '').slice(0, 10); });
    Object.values(f).forEach(el => el.addEventListener('input', () => { if (el.checkValidity()) { el.removeAttribute('aria-invalid'); if (!$('[aria-invalid]', form)) err.textContent = ''; } }));
    const send = (url, data) => url ? fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => { if (!r.ok) throw new Error(r.status); })
                                   : new Promise(r => setTimeout(r, 500));
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (btn.classList.contains('is-loading')) return;
      $$('[aria-invalid]', form).forEach(el => el.removeAttribute('aria-invalid'));
      f.name.value = f.name.value.trim(); f.email.value = f.email.value.trim();
      const bad = Object.values(f).find(el => !el.checkValidity());
      if (bad) { bad.setAttribute('aria-invalid', 'true'); err.textContent = MSG[bad.id]; bad.focus(); return; }
      err.textContent = ''; btn.classList.add('is-loading'); btn.firstChild.textContent = 'Sending… ';
      try {
        await send(form.dataset.endpoint, { name: f.name.value, email: f.email.value, phone: '+91' + f.phone.value, query: q.value.trim(), source: 'course-detail: UPSC GS Course 2028' });
        $('#okName').textContent = `, ${f.name.value.split(/\s+/)[0]}`;
        $('#okMsg').textContent = `A counsellor will call you on +91 ${f.phone.value}.`;
        form.classList.add('done');
      } catch (_) {
        err.textContent = 'That didn’t go through. Please try again, or call 080-6220-6330.';
      } finally { btn.classList.remove('is-loading'); btn.firstChild.textContent = 'Book a free session'; }
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
