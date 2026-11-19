/* The footer's curtain, the reference build's (https://vajiram-ravi.abhishek-ps.workers.dev/; user 2026-11-18, "use the same footer and
   the animation along with it"; css/footer-ref.css). On screens wider than a phone the footer stays pinned to the bottom of the window,
   behind the page, and is uncovered as the page scrolls up off it. --foot-p runs 0 to 1 as it is uncovered: the footer settles from 92%
   to full size and a dark veil over it lifts. --foot-off lets a footer taller than the window be pinned by its bottom edge so all of it
   can be reached. The gold frame fades and settles in once the footer is in view (.fb-anim.is-in).
   (The homepage's js/footer-curtain.js does the pinning alone; this page uses this file instead.) */
(() => {
  const foot = document.querySelector('footer.vf'), main = document.querySelector('main');
  if (!foot || !main) return;
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wide = matchMedia('(min-width: 761px)');
  root.classList.add('foot-curtain');

  let zoomT = 0;
  const update = () => {
    const vh = innerHeight, fh = foot.offsetHeight;
    root.style.setProperty('--foot-off', Math.min(0, vh - fh) + 'px');
    if (!wide.matches) { foot.style.setProperty('--foot-p', 1); return; }
    // how much of the footer the page has uncovered: the window below the page's bottom edge, out of the footer's visible height
    const shown = vh - main.getBoundingClientRect().bottom, room = Math.min(fh, vh);
    const p = Math.max(0, Math.min(1, shown / room));
    foot.style.setProperty('--foot-p', p.toFixed(4));
    if (p > 0 && p < 1) { foot.classList.add('vf--zooming'); clearTimeout(zoomT); zoomT = setTimeout(() => foot.classList.remove('vf--zooming'), 400); }
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  addEventListener('load', update);
  if (wide.addEventListener) wide.addEventListener('change', update);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
  update();

  // the frame fades and settles in once the footer comes into view
  const frame = foot.querySelector('.foot__frame.fb-anim');
  if (frame) {
    if (reduce || !('IntersectionObserver' in window)) frame.classList.add('is-in');
    else {
      const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { frame.classList.add('is-in'); io.disconnect(); } }, { threshold: .05 });
      io.observe(foot);
    }
  }
})();
