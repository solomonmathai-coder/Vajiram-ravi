/* ASCII stream behind "Our Popular Courses" (user 2026-11-23, trial; modelled on the look of React Bits' ASCII Stream "funnel"
   preset, which needs React/shadcn and a licence this static page doesn't have; this is our own canvas drawing).
   A bright horizontal beam crosses the banner; from a point just left of the cards, ribbons of light fan out towards the left
   edge, bowing away from the beam, with rows of characters riding inside them that grow as the ribbons widen. Soft pulses
   drift along the ribbons and light the characters they pass, and a warm flare sits where the beam leaves the frame.
   Cream and pale-gold light, added onto the orange. Drawn only while the banner is on screen and the tab is visible; for
   reduced motion it draws one still frame. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GLYPHS = 'ABCEGKRSXZ0235689'.split('');
  const C1 = [255, 200, 140];     // first colour: the beam and inner ribbons (light orange, user 2026-11-23: no white)
  const C2 = [255, 166, 92];      // second colour: the outer ribbons deepen towards it (warm orange)
  const STREAMS = [-1.15, -0.66, -0.3, 0.32, 0.7, 1.2];   // where each ribbon ends at the right edge (share of the half-height); a slight skew, like the reference
  const ROWS = 3;
  const SPEED = 3;                // characters per second
  const rgba = (c, a) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

  const start = sec => {
    if (sec.querySelector('.cf-feat__stream')) return;
    const cv = document.createElement('canvas');
    cv.className = 'cf-feat__stream';
    cv.setAttribute('aria-hidden', 'true');
    const flow = sec.querySelector('.cf-feat__flow');
    flow ? flow.after(cv) : sec.prepend(cv);
    const cx = cv.getContext('2d');

    let w = 0, h = 0, dpr = 1, ox = 0, oy = 0, len = 1, text = null;
    // each row keeps its own strip of glyphs and its own speed (a little variance from row to row)
    const rows = STREAMS.flatMap((o, si) => Array.from({ length: ROWS }, (_, r) => ({
      si, r, o, v: SPEED * (0.85 + Math.random() * 0.3), g: Array.from({ length: 160 }, () => GLYPHS[(Math.random() * GLYPHS.length) | 0]),
    })));
    const fine = Array.from({ length: 22 }, (_, i) => (i / 21 * 2 - 1) * 1.35 + (Math.random() - 0.5) * 0.08);   // faint lines of light between the ribbons

    const size = () => {
      const r = sec.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const car = sec.querySelector('.cf-car'); const cr = car && car.getBoundingClientRect();
      ox = w * 0.22;                                         // the funnel point, about a fifth of the way across (as in the reference)
      oy = h * 0.5;                                          // the beam runs across the middle
      len = w - ox + 40;                                     // the ribbons run from there to the right edge
      const intro = sec.querySelector('.cf-feat__intro'); const ir = intro && intro.getBoundingClientRect();
      text = ir ? { x0: ir.left - r.left, y0: ir.top - r.top, x1: ir.right - r.left, y1: ir.bottom - r.top } : null;
    };
    // a ribbon's path: u = 0 at the funnel point, 1 at the right edge; it leaves along the beam, then bows away from it
    const at = (o, u) => [ox + u * len, oy + o * h * 0.5 * Math.pow(u, 1.55)];
    // a little quieter over the intro text so it stays readable
    const hush = (x, y) => {
      if (!text) return 1;
      const dx = Math.max(text.x0 - x, 0, x - text.x1), dy = Math.max(text.y0 - y, 0, y - text.y1);
      return 0.62 + 0.38 * Math.min(1, Math.hypot(dx, dy) / 40);
    };

    const draw = t => {
      cx.clearRect(0, 0, w, h);
      cx.globalCompositeOperation = 'source-over';   // plain painting keeps the oranges orange (adding light washed them to white)

      // fine lines of light
      for (const o of fine) {
        cx.beginPath();
        for (let u = 0; u <= 1.001; u += 0.04) { const [x, y] = at(o, u); u ? cx.lineTo(x, y) : cx.moveTo(x, y); }
        cx.strokeStyle = rgba(C1, 0.07); cx.lineWidth = 1; cx.stroke();
      }

      // ribbons: a soft sheet of light and a bright core line, warming towards the outer ones
      STREAMS.forEach(o => {
        const col = mix(C1, C2, Math.abs(o));
        for (const [lw, a] of [[30, 0.035], [12, 0.06], [3, 0.16], [1.2, 0.5]]) {
          cx.beginPath();
          for (let u = 0; u <= 1.001; u += 0.025) { const [x, y] = at(o, u); u ? cx.lineTo(x, y) : cx.moveTo(x, y); }
          const g = cx.createLinearGradient(ox, 0, w, 0);
          g.addColorStop(0, rgba(col, 0)); g.addColorStop(0.12, rgba(col, a)); g.addColorStop(0.85, rgba(col, a)); g.addColorStop(1, rgba(col, a * 0.4));
          cx.strokeStyle = g; cx.lineWidth = lw * (0.6 + Math.abs(o) * 0.6); cx.stroke();
        }
      });

      // the beam: a bright line right across, entering bright from the left edge and flaring warm at the right
      for (const [lw, a] of [[46, 0.05], [16, 0.12], [5, 0.35], [1.6, 0.95]]) {
        const g = cx.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, rgba(C1, a)); g.addColorStop(ox / w, rgba(C1, a * 0.85));
        g.addColorStop(0.6, rgba(C1, a * 0.45)); g.addColorStop(1, rgba(C2, a));
        cx.beginPath(); cx.moveTo(0, oy); cx.lineTo(w, oy); cx.strokeStyle = g; cx.lineWidth = lw; cx.stroke();
      }
      // warm flare where the beam leaves the frame (the right edge)
      const fl = cx.createRadialGradient(w, oy, 0, w, oy, 260);
      fl.addColorStop(0, rgba([255, 206, 150], 0.6)); fl.addColorStop(0.3, rgba([255, 176, 104], 0.24)); fl.addColorStop(1, rgba([255, 170, 90], 0));
      cx.fillStyle = fl; cx.fillRect(w - 260, oy - 260, 260, 520);
      // and a soft glow where it enters on the left, so that end isn't dull (user 2026-11-23, "the left end is a bit dark")
      const fe = cx.createRadialGradient(0, oy, 0, 0, oy, 110);
      fe.addColorStop(0, rgba(C1, 0.45)); fe.addColorStop(0.4, rgba(C1, 0.14)); fe.addColorStop(1, rgba(C1, 0));
      cx.fillStyle = fe; cx.fillRect(0, oy - 110, 110, 220);
      // softer behind the intro text (the beam crosses it), so the words stay readable
      if (text) {
        cx.globalCompositeOperation = 'destination-out';
        const pad = 28, x0 = text.x0 - pad, y0 = text.y0 - pad, x1 = text.x1 + pad, y1 = text.y1 + pad;
        const gx = cx.createLinearGradient(x0, 0, x1, 0);
        gx.addColorStop(0, 'rgba(0,0,0,0)'); gx.addColorStop(0.25, 'rgba(0,0,0,0.3)'); gx.addColorStop(0.8, 'rgba(0,0,0,0.3)');   // eased in, no step at its left edge gx.addColorStop(1, 'rgba(0,0,0,0)');
        cx.fillStyle = gx; cx.fillRect(x0, y0, x1 - x0, y1 - y0);
      }

      // characters riding the ribbons
      cx.globalCompositeOperation = 'source-over';
      cx.textAlign = 'center'; cx.textBaseline = 'middle';
      const secs = t / 1000;
      for (const row of rows) {
        const col = mix(C1, C2, Math.abs(row.o) * 0.8);
        const pulseAt = ((secs * 0.18 + row.si * 0.17) % 1.3) - 0.15;            // a highlight drifting along the ribbon
        let u = 0.06, i = 0;
        const travelled = secs * row.v;                                           // characters moved so far
        const frac = travelled % 1, whole = Math.floor(travelled);
        while (u < 1) {
          const fs = 8 + u * 9;                                                     // characters grow as the ribbon widens
          const step = (fs * 0.62 * 1.2) / len;
          const uu = u + frac * step;                                               // ride outwards (leftwards)
          const [x, y0] = at(row.o, uu);
          // rows sit side by side across the ribbon, further apart as it widens
          const [x2, y2] = at(row.o, uu + 0.01);
          const nx = -(y2 - y0), ny = x2 - x; const nl = Math.hypot(nx, ny) || 1;
          const off = (row.r - (ROWS - 1) / 2) * fs * (0.8 + uu * 0.9);
          const px = x + nx / nl * off, py = y0 + ny / nl * off;
          const pulse = Math.exp(-Math.pow((uu - pulseAt) / 0.07, 2));
          const edge = Math.min(1, uu / 0.12, (1 - uu) / 0.08);
          const a = (0.22 + 0.7 * pulse) * edge * hush(px, py);
          if (a > 0.02) {
            cx.font = `700 ${fs.toFixed(1)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
            cx.fillStyle = rgba(col, a);
            cx.fillText(row.g[(((i - whole) % 160) + 160) % 160], px, py);
          }
          u += step; i++;
        }
        if (Math.random() < 0.4 * 0.016 * row.g.length / 6) row.g[(Math.random() * row.g.length) | 0] = GLYPHS[(Math.random() * GLYPHS.length) | 0];   // a few change as they go
      }
    };

    let raf = 0, on = false;
    const frame = t => { raf = requestAnimationFrame(frame); draw(t); };
    const run = yes => {
      if (yes === on) return;
      on = yes;
      if (on) raf = requestAnimationFrame(frame); else cancelAnimationFrame(raf);
    };

    size();
    addEventListener('resize', () => { size(); if (reduce) draw(4000); }, { passive: true });
    addEventListener('load', size); setTimeout(size, 600);   // re-measure once the cards and fonts have settled
    if (reduce) { draw(4000); return; }
    let seen = false;
    new IntersectionObserver(es => { seen = es[0].isIntersecting; run(seen && !document.hidden); }).observe(sec);
    document.addEventListener('visibilitychange', () => run(seen && !document.hidden));
  };

  const find = () => { const sec = document.getElementById('cat-top'); if (sec) { start(sec); return true; } return false; };
  if (!find()) {
    const mo = new MutationObserver(() => { if (find()) mo.disconnect(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
