/*
 * The homepage's programmes as a class timetable on a classroom blackboard (ours, over Kevin's page; 25 Nov 2026;
 * styles in css/chalkboard.css), set under the notice board for the client to compare. The same eight programmes
 * (js/passes.js shares his list) are chalked up as periods in four columns, one for each of his categories
 * (Foundation, Optional, Tests, Guidance), each period with his emblem in chalk and the programme's name. Under the
 * pointer (or the keyboard) a period is ringed in chalk and his books' "View course" button shows (his course-finder
 * link; a click anywhere on the period follows it). Desktop and tablet widths (768px up).
 */
(function () {
  var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<path d="M2.5 8h11"></path><path d="M8.6 3.6C9.4 5.9 11.2 7.4 13.5 8 11.2 8.6 9.4 10.1 8.6 12.4"></path></svg>';
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  /* his books' button, as his markup (white, its arrow in an orange disc), so it looks and moves as his */
  function button(p) {
    return '<a class="btn btn--white btn--xs btn--disc vc-go" href="' + p.href + '" aria-label="View course: ' + esc(p.n) + '">' +
      '<span class="btn__label"><span class="btn__t">View course</span><span class="btn__t" aria-hidden="true">View course</span></span>' +
      '<span class="btn__disc" aria-hidden="true">' + ARROW + ARROW + '<span class="btn__spin"></span></span></a>';
  }

  function init() {
    var data = window.vrProgrammes, shelf = document.getElementById("courses");
    var after = document.getElementById("notices") || document.getElementById("passes");
    if (!data || !after || !shelf || document.getElementById("chalk") || !matchMedia("(min-width: 768px)").matches) return;
    var P = data.list, CATS = data.cats;
    var emblems = [].slice.call(shelf.querySelectorAll("svg.emblem"));
    var lbl = shelf.querySelector(".lbl");

    var s = document.createElement("section");
    s.id = "chalk";
    s.className = "vc";
    s.setAttribute("aria-labelledby", "vcH");
    s.innerHTML =
      '<p class="vp-tag">Option · chalkboard timetable</p>' +
      '<div class="vc-in">' +
        '<header class="vc-hd"></header>' +
        '<div class="vc-board"><div class="vc-slate"></div>' +
          '<span class="vc-ledge" aria-hidden="true"><i class="vc-chalk"></i><i class="vc-chalk vc-chalk--y"></i><i class="vc-duster"></i></span>' +
        "</div>" +
      "</div>";
    var hd = s.querySelector(".vc-hd");
    if (lbl) { var l = lbl.cloneNode(true); l.classList.add("in"); hd.appendChild(l); }
    var h = document.createElement("h2");
    h.id = "vcH";
    h.className = "h2 h2--sec vc-h";
    h.textContent = "Programmes for every stage of UPSC.";
    hd.appendChild(h);

    /* one column for each category, its periods under it */
    var slate = s.querySelector(".vc-slate");
    CATS.forEach(function (c) {
      var col = document.createElement("div");
      col.className = "vc-col";
      col.innerHTML = '<h3 class="vc-cat">' + esc(c) + '</h3><ul class="vc-list"></ul>';
      var list = col.querySelector(".vc-list");
      P.forEach(function (p, i) {
        if (p.cat !== c) return;
        var li = document.createElement("li");
        li.className = "vc-period";
        li.innerHTML =
          '<span class="vc-em" aria-hidden="true"></span>' +
          '<span class="vc-txt"><span class="vc-name">' + esc(p.n) + "</span>" + button(p) + "</span>";
        var em = emblems[i];
        if (em) li.querySelector(".vc-em").appendChild(em.cloneNode(true));
        li.addEventListener("click", function (e) { if (!e.target.closest("a")) li.querySelector("a").click(); });
        list.appendChild(li);
      });
      slate.appendChild(col);
    });

    after.parentNode.insertBefore(s, after.nextSibling);
  }

  function start() { setTimeout(init, 900); }   /* after js/notices.js has set its section */
  if (document.readyState === "complete") start();
  else addEventListener("load", start);
})();
