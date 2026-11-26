/*
 * The homepage's programmes as boarding passes (ours, over Kevin's page; 25 Nov 2026; styles in css/passes.css), set
 * under his book shelf (#courses) for the client to compare. The same eight programmes, their categories, colours,
 * emblems and course-finder links as his books (read from his script's list and his page), each drawn as a pass for
 * the journey from aspirant to civil servant: an airline-style band (Vajiram & Ravi, since 1976, the category), the
 * route ASP → IAS, the programme's name and the courses it holds, the fields (courses, mode, boarding: CSE 2027), and a
 * perforated stub with the emblem, a barcode and "View course". Under the pointer the pass lifts and its stub starts to
 * tear away. His tabs (All, Foundation, Optional, Tests, Guidance) filter the passes. Desktop and tablet widths (768px up).
 */
(function () {
  /* his programmes (his script's list, in his order) */
  var P = [
    { n: "UPSC GS foundation course – PCM", code: "GS", cat: "Foundation", count: 4, courses: ["1-year GS foundation course", "2-year GS foundation course"], line: "1-year and 2-year General Studies programmes that take you from the basics to Prelims and Mains.", href: "/courses#cat=gs", c: ["#d9581c", "#c2410c", "#8f3010"] },
    { n: "CSAT course", code: "CSAT", cat: "Foundation", count: 2, courses: ["CSAT course"], line: "Prepare for Prelims Paper II and clear the 33% qualifying mark with confidence.", href: "/courses#cat=csat", c: ["#2e6a80", "#1f4a5f", "#14323f"] },
    { n: "Optional subject programme", code: "OPT", cat: "Optional", count: 26, courses: ["Anthropology", "Sociology", "+11 more subjects"], line: "Coaching in 13 optional subjects, from Anthropology to Sociology, in classroom and LIVE-Online.", href: "/courses#cat=optional", c: ["#c0362c", "#a3231c", "#701510"] },
    { n: "Optional test series", code: "OTS", cat: "Optional", count: 16, courses: ["Year-long optional test series", "Optional Mains test series"], line: "Year-long and Mains test series to practise answer writing in your optional subject.", href: "/courses#cat=optional-ts", c: ["#336650", "#264f3e", "#18352a"] },
    { n: "Prelims test series", code: "PTS", cat: "Tests", count: 7, courses: ["PowerUp test series", "Prelims CAMP", "Current affairs tests"], line: "PowerUp test series, Prelims CAMP and current affairs tests to get Prelims-ready.", href: "/courses#cat=prelims-ts", c: ["#7a3556", "#5e2742", "#3f192c"] },
    { n: "Mains test series", code: "MTS", cat: "Tests", count: 11, courses: ["Sure Shot test series", "Mains CAMP", "Essay tests"], line: "Sure Shot test series, Mains CAMP and Essay tests to sharpen your answer writing.", href: "/courses#cat=mains-ts", c: ["#a3545c", "#873f48", "#5e2a31"] },
    { n: "Mentorship programme", code: "MNT", cat: "Guidance", count: 6, courses: ["StepUp mentorship"], line: "StepUp mentorship pairs regular tests with a personal mentor, from Prelims to Mains.", href: "/courses#cat=mentorship", c: ["#b8673a", "#9b5029", "#6e3519"] },
    { n: "Interview guidance programme", code: "IGP", cat: "Guidance", count: 2, courses: ["UPSC CSE interview guidance", "IFoS interview guidance"], line: "Guidance for the UPSC CSE and IFoS interviews once you have cleared Mains.", href: "/courses#cat=interview", c: ["#5e5f63", "#4a4b4e", "#303133"] }
  ];
  var CATS = ["Foundation", "Optional", "Tests", "Guidance"];
  window.vrProgrammes = { list: P, cats: CATS };   /* shared with js/boxes.js */

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  /* a barcode of the programme's own: bar widths from its name */
  function barcode(s) {
    var x = 0, out = "", h = 0;
    for (var i = 0; i < s.length * 3 && x < 116; i++) {
      h = (h * 31 + s.charCodeAt(i % s.length) + i) % 997;
      var w = 1 + (h % 3), gap = 1 + ((h >> 2) % 3);
      out += '<rect x="' + x + '" y="0" width="' + w + '" height="34"/>';
      x += w + gap;
    }
    return '<svg class="vp-bar" viewBox="0 0 ' + x + ' 34" preserveAspectRatio="none" aria-hidden="true">' + out + "</svg>";
  }

  function init() {
    var shelf = document.getElementById("courses");
    if (!shelf || document.getElementById("passes") || !matchMedia("(min-width: 768px)").matches) return;
    var emblems = [].slice.call(shelf.querySelectorAll("svg.emblem"));
    var lbl = shelf.querySelector(".lbl");
    var h2 = shelf.querySelector(".prog__shelf-h");

    var s = document.createElement("section");
    s.id = "passes";
    s.className = "vp";
    s.setAttribute("aria-labelledby", "vpH");
    s.innerHTML =
      '<p class="vp-tag">Option · boarding passes</p>' +
      '<div class="vp-in">' +
        '<header class="vp-hd"></header>' +
        '<div class="vp-tabs" role="tablist" aria-label="Programme type"><span class="vp-ind" aria-hidden="true"></span></div>' +
        '<ul class="vp-grid"></ul>' +
      "</div>";
    var hd = s.querySelector(".vp-hd");
    if (lbl) {
      var l = lbl.cloneNode(true);
      l.classList.add("in");   /* his reveal script (fading parts in as they come into view) does not reach ours */
      hd.appendChild(l);
    }
    var h = document.createElement("h2");
    h.id = "vpH";
    h.className = "h2 h2--sec vp-h";
    h.textContent = h2 ? h2.textContent : "Programmes for every stage of UPSC.";
    hd.appendChild(h);
    var intro = document.createElement("p");
    intro.className = "vp-intro";
    intro.textContent = "Every programme is a pass for the same journey, from aspirant to civil servant. Choose where you board.";
    hd.appendChild(intro);

    var grid = s.querySelector(".vp-grid");
    P.forEach(function (p, i) {
      var li = document.createElement("li");
      li.className = "vp-pass";
      li.setAttribute("data-cat", p.cat);
      li.style.cssText = "--c1:" + p.c[0] + ";--c2:" + p.c[1] + ";--c3:" + p.c[2] + ";--i:" + i;
      li.innerHTML =
        '<a class="vp-main" href="' + p.href + '" tabindex="-1" aria-hidden="true">' +
          '<span class="vp-band"><span class="vp-air">Vajiram &amp; Ravi <i>Since 1976</i></span><span class="vp-cat">' + esc(p.cat) + "</span></span>" +
          '<span class="vp-body">' +
            '<span class="vp-route"><b>ASP</b><span class="vp-path"><i></i></span><b>IAS</b></span>' +
            '<span class="vp-route-t"><span>Aspirant</span><span>Civil servant</span></span>' +
            '<span class="vp-name">' + esc(p.n) + "</span>" +
            '<span class="vp-incl">' + p.courses.map(esc).join('<i aria-hidden="true">·</i>') + "</span>" +
            '<span class="vp-fields">' +
              "<span><small>Courses</small>" + p.count + "</span>" +
              "<span><small>Mode</small>Classroom · LIVE-Online</span>" +
              "<span><small>Boarding</small>UPSC CSE 2027</span>" +
            "</span>" +
          "</span>" +
        "</a>" +
        '<span class="vp-stub">' +
          '<span class="vp-stub-band">' + esc(p.code) + "</span>" +
          '<span class="vp-em"></span>' +
          barcode(p.n) +
          '<a class="vp-go" href="' + p.href + '">View course <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5"/></svg><span class="vh"> · ' + esc(p.n) + "</span></a>" +
        "</span>";
      var em = emblems[i];
      if (em) li.querySelector(".vp-em").appendChild(em.cloneNode(true));
      /* the whole pass follows its link */
      li.addEventListener("click", function (e) {
        if (!e.target.closest("a.vp-go")) li.querySelector("a.vp-go").click();
      });
      grid.appendChild(li);
    });

    /* the tabs: all, and each category with its count */
    var tabs = s.querySelector(".vp-tabs"), ind = s.querySelector(".vp-ind");
    var btns = ["All"].concat(CATS).map(function (c) {
      var n = c === "All" ? P.length : P.filter(function (p) { return p.cat === c; }).length;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "vp-t";
      b.setAttribute("role", "tab");
      b.innerHTML = esc(c) + "<small>" + n + "</small>";
      b.addEventListener("click", function () { pick(c); });
      tabs.insertBefore(b, ind);
      return { c: c, b: b };
    });
    function pick(c) {
      btns.forEach(function (x) {
        var on = x.c === c;
        x.b.setAttribute("aria-selected", on ? "true" : "false");
        if (on) { ind.style.width = x.b.offsetWidth + "px"; ind.style.transform = "translateX(" + x.b.offsetLeft + "px)"; }
      });
      [].forEach.call(grid.children, function (li) {
        li.hidden = c !== "All" && li.getAttribute("data-cat") !== c;
      });
    }
    shelf.parentNode.insertBefore(s, shelf.nextSibling);
    pick("All");
    addEventListener("resize", function () {
      var on = btns.filter(function (x) { return x.b.getAttribute("aria-selected") === "true"; })[0];
      if (on) pick(on.c);
    });
  }

  function start() { setTimeout(init, 400); }
  if (document.readyState === "complete") start();
  else addEventListener("load", start);
})();
