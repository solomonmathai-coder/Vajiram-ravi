/* Contact us: the campus photos (#cmGal, the compact layout of 2026-11-16, css/contact-compact.css). The photos cross-fade on their own,
   one every 5 s, while the gallery is on screen; the pointer over it holds the current one. The caption under the photo and the dots
   follow; a dot, or the arrows that appear on hover (user 2026-11-13: "when hovered there should be navigation buttons"), goes to a
   photo and starts its 5 s again. With prefers-reduced-motion the photos do not change on their own; the dots and arrows still work. */
(() => {
  const gal = document.getElementById('cmGal'); if (!gal) return;
  const slides = [...gal.querySelectorAll('.cx__ph')], dots = [...gal.querySelectorAll('.cx__dots button')], cap = gal.querySelector('.cx__cap');
  if (slides.length < 2) return;
  const auto = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T = 5000;
  let i = 0, seen = false, held = false, timer = 0;

  const run = () => { clearTimeout(timer); if (auto && seen && !held && !document.hidden) timer = setTimeout(() => show(i + 1), T); };
  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('is-on', k === i); s.toggleAttribute('aria-hidden', k !== i); });
    dots.forEach((d, k) => { d.classList.toggle('is-on', k === i); if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    if (cap) cap.textContent = slides[i].dataset.cap || '';
    run();
  }

  // previous / next (the banner carousel's chevrons)
  const arrow = (cls, label, d) => `<button type="button" class="cx__nav ${cls}" aria-label="${label}"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="${d}"/></svg></button>`;
  gal.insertAdjacentHTML('beforeend', arrow('cx__nav--prev', 'Previous photo', 'M15 6L9 12L15 18') + arrow('cx__nav--next', 'Next photo', 'M9 6L15 12L9 18'));
  gal.querySelector('.cx__nav--prev').addEventListener('click', () => show(i - 1));
  gal.querySelector('.cx__nav--next').addEventListener('click', () => show(i + 1));
  dots.forEach((d, k) => d.addEventListener('click', () => show(k)));

  gal.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { held = true; run(); } });
  gal.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { held = false; run(); } });
  document.addEventListener('visibilitychange', run);
  new IntersectionObserver(es => { seen = es[0].isIntersecting; run(); }, { threshold: .3 }).observe(gal);
})();
