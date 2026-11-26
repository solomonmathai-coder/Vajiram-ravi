/*
 * The homepage's programmes as notices on a cork notice board (ours, over Kevin's page; 25 Nov 2026; styles in
 * css/notices.css), set under the boarding passes for the client to compare: the board every coaching institute has
 * by its door. The same eight programmes (js/passes.js shares his list) are pinned as paper notices, two rows of four,
 * each held by a strip of tape in its programme's colour carrying its category, with his emblem, the programme's name
 * and his books' "View course" button (his course-finder link; a click anywhere on the notice follows it). Under the
 * pointer a notice straightens and lifts off the board. Desktop and tablet widths (768px up).
 */
(function () {
  var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M2.5 8h11"></path><path d="M8.6 3.6C9.4 5.9 11.2 7.4 13.5 8 11.2 8.6 9.4 10.1 8.6 12.4"></path></svg>';
  /* each notice pinned a little askew, and a little off the line */
  var TILT = [-2.2, 1.4, -0.9, 2, 1.3, -1.8, 2.3, -1.2];
  var DROP = [0, 10, -4, 6, 8, -6, 2, 10];
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  /* his books' button, as his markup (white, its arrow in an orange disc), so it looks and moves as his */
  function button(p, cls) {
    return '<a class="btn btn--white btn--xs btn--disc ' + cls + '" href="' + p.href + '" aria-label="View course: ' + esc(p.n) + '">' +
      '<span class="btn__label"><span class="btn__t">View course</span><span class="btn__t" aria-hidden="true">View course</span></span>' +
      '<span class="btn__disc" aria-hidden="true">' + ARROW + ARROW + '<span class="btn__spin"></span></span></a>';
  }

  function init() {
    var data = window.vrProgrammes, after = document.getElementById("passes"), shelf = document.getElementById("courses");
    if (!data || !after || !shelf || document.getElementById("notices") || !matchMedia("(min-width: 768px)").matches) return;
    var P = data.list;
    var emblems = [].slice.call(shelf.querySelectorAll("svg.emblem"));
    var lbl = shelf.querySelector(".lbl");

    var s = document.createElement("section");
    s.id = "notices";
    s.className = "vn";
    s.setAttribute("aria-labelledby", "vnH");
    s.innerHTML =
      '<p class="vp-tag">Option · notice board</p>' +
      '<div class="vn-in">' +
        '<header class="vn-hd"></header>' +
        '<div class="vn-board"><ul class="vn-cork"></ul></div>' +
      "</div>";
    var hd = s.querySelector(".vn-hd");
    if (lbl) { var l = lbl.cloneNode(true); l.classList.add("in"); hd.appendChild(l); }
    var h = document.createElement("h2");
    h.id = "vnH";
    h.className = "h2 h2--sec vn-h";
    h.textContent = "Programmes for every stage of UPSC.";
    hd.appendChild(h);

    var cork = s.querySelector(".vn-cork");
    P.forEach(function (p, i) {
      var li = document.createElement("li");
      li.className = "vn-note";
      li.style.cssText = "--c1:" + p.c[0] + ";--c2:" + p.c[1] + ";--c3:" + p.c[2] + ";--r:" + TILT[i % 8] + "deg;--y:" + DROP[i % 8] + "px";
      li.innerHTML =
        '<span class="vn-tape">' + esc(p.cat) + "</span>" +
        '<span class="vn-em" aria-hidden="true"></span>' +
        '<span class="vn-txt"><h3 class="vn-name">' + esc(p.n) + "</h3>" + button(p, "vn-go") + "</span>";
      var em = emblems[i];
      if (em) li.querySelector(".vn-em").appendChild(em.cloneNode(true));
      /* the whole notice follows its button */
      li.addEventListener("click", function (e) { if (!e.target.closest("a")) li.querySelector("a").click(); });
      cork.appendChild(li);
    });

    after.parentNode.insertBefore(s, after.nextSibling);
  }

  function start() { setTimeout(init, 700); }   /* after js/passes.js has set its section and the shared list */
  if (document.readyState === "complete") start();
  else addEventListener("load", start);
})();
