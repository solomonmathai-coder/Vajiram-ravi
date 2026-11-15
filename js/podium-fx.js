/* Toppers: keeps the animated light behind the three (index.html .pd__fx, css/podium.css) from running through the name tags
   (user 2026-11-15: "the animation is interfering with the name tags"). Cuts a soft oval hole in the light's mask around each rank's
   tag (.pd__lbl), measured from the layout and redone whenever the row changes size, so the light fades out before the words and
   picks up after them. (The gold wave strands it also used to draw were removed, user 2026-11-15.) */
(function () {
  var scene = document.querySelector('.pd__scene');
  var fx = scene && scene.querySelector('.pd__fx');
  if (!fx) return;
  var tags = scene.querySelectorAll('.pd__lbl');
  var fade = 'linear-gradient(180deg, transparent 0, #000 22%)';   // the top fade, as in podium.css

  function cut() {
    var box = fx.getBoundingClientRect();
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
    fx.style.webkitMaskImage = m; fx.style.maskImage = m;
    fx.style.webkitMaskComposite = masks.map(function () { return 'source-in'; }).join(', ');
    fx.style.maskComposite = masks.map(function () { return 'intersect'; }).join(', ');
    fx.style.webkitMaskRepeat = 'no-repeat'; fx.style.maskRepeat = 'no-repeat';
  }

  var queued = false;
  function update() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; cut(); });
  }
  update();
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(scene);
  else window.addEventListener('resize', update);
  window.addEventListener('load', update);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
  // after the row's reveal slides it into place
  scene.addEventListener('transitionend', function (e) { if (e.target.classList && e.target.classList.contains('pd__row')) update(); });
})();
