/* Toppers: the animated light behind the three (index.html .pd__fx and .pd__waves, css/podium.css).
   1. Draws the gold waves (user 2026-11-15, after a sketch: "let the waves curve around the toppers"): a side's strands stand in
      the space outside rank 2's (or rank 3's) crest, from above the crests to below the names, bowed out like a bracket and
      crossing as they go, measured from where the crests actually are. Each strand is that curve offset by a sine; eight frames of
      the sine's phase become an SMIL animation of the path, so the strands roll and twist slowly. Redrawn whenever the row changes
      size; drawn still for people who ask for reduced motion.
   2. Keeps the light from running through the name tags (user: "the animation is interfering with the name tags"): cuts a soft oval
      hole in each layer's mask around each rank's tag (.pd__lbl). */
(function () {
  var scene = document.querySelector('.pd__scene');
  if (!scene) return;
  var NS = 'http://www.w3.org/2000/svg';
  var layers = scene.querySelectorAll('.pd__fx, .pd__waves');
  var tags = scene.querySelectorAll('.pd__lbl');
  var waves = scene.querySelector('.pd__waves');
  var still = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  var fade = 'linear-gradient(180deg, transparent 0, #000 22%)';   // the top fade, as in podium.css

  /* ---------- the waves ---------- */
  // the strands of a side (user's sketch, 2026-11-15: two wavy lines a side, standing outside the side crests, crossing as they go):
  // offset from the side's curve (px), sway (px), waves along the curve, phase, width, opacity, colour, seconds a roll.
  // The two bright strands are half a wave apart, so they cross; five fainter ones weave round them (user: "add more waves").
  var STRANDS = [[0, 16, 1.6, 0, 2, .95, '#FFE2A6', 11], [0, 16, 1.6, Math.PI, 1.5, .85, '#FFD98E', 11],
                 [-12, 11, 2.2, .9, .9, .6, '#FFF4DC', 14], [12, 11, 2.2, 2.5, .9, .55, '#FFE2A6', 14],
                 [-22, 8, 1.3, 1.7, .6, .4, '#FFF4DC', 17], [22, 8, 1.3, 4, .6, .4, '#FFD98E', 17],
                 [6, 13, 2.8, 3.3, .7, .45, '#FFCF7A', 12]];

  function rel(el, box) { var r = el.getBoundingClientRect(); return { l: r.left - box.left, r: r.right - box.left, t: r.top - box.top, b: r.bottom - box.top, cx: (r.left + r.right) / 2 - box.left, h: r.height }; }

  // a Catmull-Rom curve through the key points, sampled finely, then resampled to n points evenly along its length
  function curve(keys, n) {
    var P = [keys[0]].concat(keys, [keys[keys.length - 1]]), fine = [], i, j, t;
    for (i = 1; i < P.length - 2; i++) for (j = 0; j < 40; j++) {
      t = j / 40;
      fine.push([0, 1].map(function (k) {
        var p0 = P[i - 1][k], p1 = P[i][k], p2 = P[i + 1][k], p3 = P[i + 2][k];
        return .5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (3 * p1 - p0 - 3 * p2 + p3) * t * t * t);
      }));
    }
    fine.push(keys[keys.length - 1]);
    var len = [0];
    for (i = 1; i < fine.length; i++) len.push(len[i - 1] + Math.hypot(fine[i][0] - fine[i - 1][0], fine[i][1] - fine[i - 1][1]));
    var L = len[len.length - 1], out = [], k = 0;
    for (i = 0; i < n; i++) {
      var s = L * i / (n - 1);
      while (k < len.length - 2 && len[k + 1] < s) k++;
      var f = (s - len[k]) / ((len[k + 1] - len[k]) || 1);
      out.push({ x: fine[k][0] + (fine[k + 1][0] - fine[k][0]) * f, y: fine[k][1] + (fine[k + 1][1] - fine[k][1]) * f, s: s });
    }
    out.forEach(function (p, i) {   // unit normals, from the neighbours
      var a = out[Math.max(0, i - 1)], b = out[Math.min(n - 1, i + 1)], dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
      p.nx = -dy / l; p.ny = dx / l;
    });
    out.L = L;
    return out;
  }
  // smooth path through points (Catmull-Rom as cubic Béziers)
  function pathOf(X, Y) {
    var n = X.length, d = 'M' + X[0].toFixed(1) + ' ' + Y[0].toFixed(1);
    function g(A, i) { return A[Math.max(0, Math.min(n - 1, i))]; }
    for (var j = 0; j < n - 1; j++) {
      d += 'C' + (X[j] + (g(X, j + 1) - g(X, j - 1)) / 6).toFixed(1) + ' ' + (Y[j] + (g(Y, j + 1) - g(Y, j - 1)) / 6).toFixed(1) + ' ' +
        (X[j + 1] - (g(X, j + 2) - X[j]) / 6).toFixed(1) + ' ' + (Y[j + 1] - (g(Y, j + 2) - Y[j]) / 6).toFixed(1) + ' ' +
        X[j + 1].toFixed(1) + ' ' + Y[j + 1].toFixed(1);
    }
    return d;
  }
  function ribbon(group, base, lines, sign, moving) {
    lines.forEach(function (ln) {
      var off = ln[0], A = ln[1], P = base.L / ln[2], ph = ln[3], frames = [], F = moving ? 8 : 1;
      for (var f = 0; f < F; f++) {
        var phi = ph + f * 2 * Math.PI / 8, X = [], Y = [];
        base.forEach(function (p) {
          var e = off * sign + A * (.35 + .65 * Math.sin(Math.PI * p.s / base.L)) * Math.sin(2 * Math.PI * p.s / P + phi);   // calmer at the ends
          X.push(p.x + p.nx * e); Y.push(p.y + p.ny * e);
        });
        frames.push(pathOf(X, Y));
      }
      var el = document.createElementNS(NS, 'path');
      el.setAttribute('class', 'pd__wave'); el.setAttribute('d', frames[0]);
      el.setAttribute('stroke', ln[6]); el.setAttribute('stroke-width', ln[4]); el.setAttribute('stroke-opacity', ln[5]);
      if (moving) {
        var an = document.createElementNS(NS, 'animate');
        an.setAttribute('attributeName', 'd'); an.setAttribute('dur', ln[7] + 's'); an.setAttribute('repeatCount', 'indefinite');
        an.setAttribute('values', frames.concat(frames[0]).join(';'));
        el.appendChild(an);
      }
      group.appendChild(el);
    });
  }
  function draw() {
    if (!waves) return;
    var box = waves.getBoundingClientRect(), W = box.width, H = box.height;
    if (!W || !H) return;
    waves.setAttribute('viewBox', '0 0 ' + W.toFixed(1) + ' ' + H.toFixed(1));
    var fr = waves.querySelector('.pd__waves-fade');
    fr.setAttribute('x', 0); fr.setAttribute('y', -50); fr.setAttribute('width', W); fr.setAttribute('height', H + 100);
    var mk = waves.querySelector('#pdSides');
    mk.setAttribute('x', 0); mk.setAttribute('y', -50); mk.setAttribute('width', W); mk.setAttribute('height', H + 100);

    var cols = { l: scene.querySelector('.pd__col--2'), r: scene.querySelector('.pd__col--3') };
    var top = scene.querySelector('.pd__col--1 .pd__fig');
    var moving = !(still && still.matches);
    var lowest = 0;
    tags.forEach(function (t) { lowest = Math.max(lowest, rel(t, box).b); });
    var yTop = (top ? rel(top, box).t : 120) - 50, yBot = lowest + 50;   // from above the highest crest to below every name
    // the strands' ends fade out softly (user: "make the ends of it smooth"): a mask from just above their top to just below their foot
    [fr, mk].forEach(function (el) { el.setAttribute('y', yTop - 30); el.setAttribute('height', yBot - yTop + 60); });
    ['l', 'r'].forEach(function (side) {
      var g = waves.querySelector('.pd__side[data-side="' + side + '"]');
      while (g.firstChild) g.removeChild(g.firstChild);
      var col = cols[side];
      if (!col) return;
      var s = side === 'l' ? -1 : 1;                        // which way is out
      // the crest's outer edge, laurels and name included
      var edge = s < 0 ? Infinity : -Infinity;
      col.querySelectorAll('.pd__fig, .pd__gem, .pd__laurel, .pd__lbl').forEach(function (el) {
        var r = rel(el, box); if (r.r - r.l > 0) edge = s < 0 ? Math.min(edge, r.l) : Math.max(edge, r.r);
      });
      var room = Math.max(24, s < 0 ? edge : W - edge);     // the space between it and the page's edge
      function at(f) { return s < 0 ? room * f : W - room * f; }   // a point that far across the space, from the page's edge
      // a bracket: in near the crest at the top, bowed out towards the page's edge halfway down, in again at the foot
      var keys = [[at(.86), yTop], [at(.5), yTop + (yBot - yTop) * .22], [at(.24), yTop + (yBot - yTop) * .5],
                  [at(.5), yTop + (yBot - yTop) * .8], [at(.92), yBot]];
      ribbon(g, curve(keys, 34), STRANDS, s, moving);
    });
  }

  /* ---------- the holes round the name tags ---------- */
  function cutOne(el) {
    var box = el.getBoundingClientRect();
    if (!box.width) return;
    var masks = [];
    tags.forEach(function (t) {
      var r = t.getBoundingClientRect();
      if (!r.width) return;
      var x = r.left - box.left + r.width / 2, y = r.top - box.top + r.height / 2;
      var rx = r.width * .78, ry = r.height * .62 + 30;   // a little wider and taller than the words, for a soft edge
      masks.push('radial-gradient(' + rx.toFixed(1) + 'px ' + ry.toFixed(1) + 'px at ' + x.toFixed(1) + 'px ' + y.toFixed(1) +
        'px, transparent 68%, rgba(0,0,0,.55) 84%, #000 100%)');
    });
    masks.push(fade);
    var m = masks.join(', ');
    el.style.webkitMaskImage = m; el.style.maskImage = m;
    el.style.webkitMaskComposite = masks.map(function () { return 'source-in'; }).join(', ');
    el.style.maskComposite = masks.map(function () { return 'intersect'; }).join(', ');
    el.style.webkitMaskRepeat = 'no-repeat'; el.style.maskRepeat = 'no-repeat';
  }

  var queued = false, lastW = 0, lastH = 0;
  function update(force) {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      layers.forEach(cutOne);
      var r = scene.getBoundingClientRect();
      if (force === true || Math.abs(r.width - lastW) > .5 || Math.abs(r.height - lastH) > .5) { lastW = r.width; lastH = r.height; draw(); }
    });
  }
  update(true);
  if ('ResizeObserver' in window) new ResizeObserver(function () { update(); }).observe(scene);
  else window.addEventListener('resize', function () { update(); });
  window.addEventListener('load', function () { update(true); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { update(true); });
  scene.addEventListener('transitionend', function (e) { if (e.target.classList && e.target.classList.contains('pd__row')) update(true); });   // after the row's reveal slides it into place
  if (still && still.addEventListener) still.addEventListener('change', function () { update(true); });
})();
