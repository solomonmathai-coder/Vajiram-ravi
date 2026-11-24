/* Frame border round the "Our Popular Courses" banner (user 2026-11-23, trial; modelled on how React Bits' Frame Border behaves,
   which needs React/shadcn and a licence this static page doesn't have; this is our own canvas drawing):
   - a crisp 1.5px line just inside the banner's edge, blending two warm colours that slowly travel round it
   - a soft glow reaching ~110px inward from the line and fading to nothing, with flowing patches of light in it
   - three gentle swells of light drifting along the frame
   - on load the line draws itself in from the top centre, both ways round, then the glow fades in
   - a click on the banner (not on a card) sends twin pulses from the nearest edge that meet on the opposite side
   - hovering the banner speeds the flow up a little
   Drawn only while the banner is on screen and the tab is visible; a still frame for reduced motion. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const A = [194, 65, 12];        // colour A: brand orange (user 2026-11-23: darker than cream, then "a bit light"er than burnt orange)
  const B = [234, 88, 12];        // colour B: bright orange
  const LINE = 2, INSET = 1, GLOW = 1, GLOW_W = 110, NOISE = 0.6, NOISE_SCALE = 3;
  const SWELLS = 3, INTRO = 1300, GLOW_IN = 900;
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  const circ = (a, b) => { const d = Math.abs(a - b) % 1; return Math.min(d, 1 - d); };   // distance round the loop, 0..0.5

  const start = sec => {
    if (sec.querySelector('.cf-feat__frame')) return;
    const cv = document.createElement('canvas');
    cv.className = 'cf-feat__frame';
    cv.setAttribute('aria-hidden', 'true');
    sec.appendChild(cv);
    const cx = cv.getContext('2d');
    const g1 = document.createElement('canvas'), g1x = g1.getContext('2d');   // glow, drawn small
    const g2 = document.createElement('canvas'), g2x = g2.getContext('2d');   // glow, blurred
    const SC = 4;                                                             // the glow canvases are a quarter size

    let w = 0, h = 0, dpr = 1, rad = 16, pts = [], L = 1;
    // sample the rounded rectangle every ~3px, starting at the top centre and going clockwise; u = share of the way round
    const sample = () => {
      const i = INSET + LINE / 2, x0 = i, y0 = i, x1 = w - i, y1 = h - i, r = Math.max(0, rad - i);
      const segs = [];
      const line = (ax, ay, bx, by) => segs.push(t => [lerp(ax, bx, t), lerp(ay, by, t)], Math.hypot(bx - ax, by - ay));
      const arc = (cxp, cyp, a0, a1) => segs.push(t => { const a = lerp(a0, a1, t); return [cxp + r * Math.cos(a), cyp + r * Math.sin(a)]; }, Math.abs(a1 - a0) * r);
      const P = Math.PI;
      line(w / 2, y0, x1 - r, y0); arc(x1 - r, y0 + r, -P / 2, 0);
      line(x1, y0 + r, x1, y1 - r); arc(x1 - r, y1 - r, 0, P / 2);
      line(x1 - r, y1, x0 + r, y1); arc(x0 + r, y1 - r, P / 2, P);
      line(x0, y1 - r, x0, y0 + r); arc(x0 + r, y0 + r, P, P * 1.5);
      line(x0 + r, y0, w / 2, y0);
      pts = []; let s = 0;
      for (let k = 0; k < segs.length; k += 2) {
        const f = segs[k], len = segs[k + 1], n = Math.max(1, Math.round(len / 3));
        for (let j = 0; j < n; j++) { const [x, y] = f(j / n); pts.push({ x, y, s: s + len * j / n }); }
        s += len;
      }
      L = s; pts.forEach(p => { p.u = p.s / L; });
      pts.push({ ...pts[0], s: L, u: 1 });
    };
    const size = () => {
      const r = sec.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      rad = parseFloat(getComputedStyle(sec).borderTopLeftRadius) || 16;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      g1.width = g2.width = Math.ceil(w / SC); g1.height = g2.height = Math.ceil(h / SC);
      sample();
    };

    // light at a point of the frame: base line, flowing noise, drifting swells, click pulses
    const pulses = [];
    const light = (u, ft, now) => {
      const n = 0.5 + 0.25 * Math.sin(2 * Math.PI * u * NOISE_SCALE * 2 + ft * 0.9) + 0.25 * Math.sin(2 * Math.PI * u * NOISE_SCALE * 3.3 - ft * 1.3);
      let b = 0.55 * (1 - NOISE + NOISE * n * 1.4);
      for (let k = 0; k < SWELLS; k++) { const d = circ(u, (k / SWELLS + ft * 0.025) % 1); b += 0.75 * Math.exp(-Math.pow(d / 0.06, 2)); }
      for (const p of pulses) {
        const t = (now - p.t) / 1000, reach = t * 0.32;               // share of the loop each pulse has travelled
        if (reach > 0.5) continue;
        const amp = 1.2 * (1 - reach * 1.2);
        b += amp * Math.exp(-Math.pow(circ(u, (p.u + reach) % 1) / 0.03, 2));
        b += amp * Math.exp(-Math.pow(circ(u, (p.u - reach + 1) % 1) / 0.03, 2));
      }
      return b;
    };
    const colour = (u, ft) => mix(A, B, 0.5 + 0.5 * Math.sin(2 * Math.PI * (u - ft * 0.04)));

    let t0 = 0, last = 0, ft = 0, speed = 1, target = 1;
    const draw = now => {
      if (!t0) { t0 = now; last = now; }
      const dt = Math.min(now - last, 50) / 1000; last = now;
      speed += (target - speed) * Math.min(1, dt * 3);
      ft += dt * speed;
      const el = reduce ? 1e9 : now - t0;
      const drawn = Math.min(1, el / INTRO), ease = 1 - Math.pow(1 - drawn, 3);   // how much of the line is drawn in
      const glowIn = Math.max(0, Math.min(1, (el - INTRO * 0.8) / GLOW_IN));
      for (let i = pulses.length - 1; i >= 0; i--) if (now - pulses[i].t > 1800) pulses.splice(i, 1);

      cx.clearRect(0, 0, w, h);
      // glow (user 2026-11-23, "I don't see any glow": it was ~14% strong): two passes laid inside the banner, a wide soft one
      // reaching ~110px in and a tight bright one hugging the line; each is the frame stroked thick on a small canvas, blurred
      const pass = (width, blurPx, alpha) => {
        g1x.setTransform(1 / SC, 0, 0, 1 / SC, 0, 0);
        g1x.clearRect(0, 0, w, h);
        g1x.lineWidth = width; g1x.lineCap = 'round';
        for (let i = 0; i < pts.length - 1; i += 2) {
          const p = pts[i], q = pts[Math.min(i + 2, pts.length - 1)];
          const b = light(p.u, ft, now), c = colour(p.u, ft);
          g1x.strokeStyle = `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${Math.min(1, b)})`;
          g1x.beginPath(); g1x.moveTo(p.x, p.y); g1x.lineTo(q.x, q.y); g1x.stroke();
        }
        g2x.clearRect(0, 0, g2.width, g2.height);
        g2x.filter = `blur(${blurPx / SC}px)`;
        g2x.drawImage(g1, 0, 0);
        g2x.filter = 'none';
        cx.save();
        cx.beginPath(); cx.roundRect(INSET, INSET, w - INSET * 2, h - INSET * 2, rad); cx.clip();
        cx.globalAlpha = alpha * glowIn;
        cx.drawImage(g2, 0, 0, w, h);
        cx.restore();
      };
      if (glowIn > 0) {
        pass(GLOW_W * 0.9, GLOW_W * 0.4, 0.8 * GLOW);
        pass(22, 10, 0.75 * GLOW);
      }
      // the line, drawn in from the top centre both ways during the intro
      cx.lineWidth = LINE; cx.lineCap = 'round';
      for (let i = 0; i < pts.length - 1; i++) {
        const p = pts[i], q = pts[i + 1];
        if (Math.min(p.u, 1 - p.u) > ease * 0.5) continue;
        const b = light(p.u, ft, now), c = colour(p.u, ft);
        const hot = Math.max(0, b - 1) * 0.6, cc = mix(c, [251, 146, 60], Math.min(1, hot));   // swells and pulses brighten towards a hot orange
        cx.strokeStyle = `rgba(${cc[0] | 0}, ${cc[1] | 0}, ${cc[2] | 0}, ${Math.min(1, 0.35 + b * 0.65)})`;
        cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(q.x, q.y); cx.stroke();
      }
    };

    size();
    addEventListener('resize', () => { size(); if (reduce) draw(performance.now()); }, { passive: true });
    addEventListener('load', size); setTimeout(size, 600);
    if (reduce) { draw(performance.now()); return; }

    // hover speeds the flow up; a click on the banner itself sends twin pulses from the nearest point of the frame
    sec.addEventListener('pointerenter', () => { target = 1.8; });
    sec.addEventListener('pointerleave', () => { target = 1; });
    sec.addEventListener('pointerdown', e => {
      if (e.target.closest('.cf-k, a, button')) return;
      const r = sec.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      let best = pts[0], bd = Infinity;
      for (const p of pts) { const d = (p.x - x) ** 2 + (p.y - y) ** 2; if (d < bd) { bd = d; best = p; } }
      pulses.push({ u: best.u, t: performance.now() });
    });

    let raf = 0, on = false;
    const frame = now => { raf = requestAnimationFrame(frame); draw(now); };
    const run = yes => {
      if (yes === on) return;
      on = yes;
      if (on) { last = performance.now(); raf = requestAnimationFrame(frame); } else cancelAnimationFrame(raf);
    };
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
