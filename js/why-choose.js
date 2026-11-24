/* Why choose: the "by the numbers" strip counts up once, the first time it scrolls into view.
   The grids (.wc__cards, .wc__stats) rise in through the site's .rise primitive (js/content.js). */
(() => {
  const strip = document.getElementById('wcStats'); if (!strip) return;
  const nums = [...strip.querySelectorAll('[data-wc-count]')]; if (!nums.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;          // the markup already holds the final figures
  const run = () => nums.forEach((el, i) => {
    const to = +el.dataset.wcCount, t0 = performance.now() + i * 90, dur = 1300;
    const step = t => {
      const k = Math.max(0, Math.min(1, (t - t0) / dur));
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    el.textContent = '0'; requestAnimationFrame(step);
  });
  const io = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { run(); o.disconnect(); } }), { threshold: .3 });
  io.observe(strip);
})();
