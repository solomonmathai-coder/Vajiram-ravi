/*
 * The homepage's toppers section, a second version under Kevin's for the client to compare (ours, over his page;
 * 24 Nov 2026; styles in css/toppers-oneview.css). His section stays first, as it is: two showcases one above the
 * other, the 2025 carousel and the decade panel (year tabs, one topper large in laurels beside the list of names).
 * This version keeps both, each as he drew it, and shows them in one frame as two scenes: under his heading a switch
 * ("2025 results · 36/50" / "A decade of ranks · 2015–24") shows either his 2025 carousel or his decade panel, at its
 * own size, in the same place, sliding the way the switch moves.
 * It is built in a copy of his section, set under it. His scripts do not reach the copy, so this one runs its parts:
 * the carousel (sliding by CSS), the year tabs, the list of names (click one, or let it move on every 4.5s, a fine line
 * filling across the name shown) and the topper shown large, with the real photograph we hold for each earlier topper
 * (his list gives them all one placeholder portrait of a man), or the institute's emblem where we have none (2015).
 * Desktop widths only; phones see his section alone.
 */
(function () {
  var PHOTOS = {"2016-1":"/assets/img/toppers/2016-1-nandini-kr.jpg","2016-10":"/assets/img/toppers/2016-10-bilal-mohi-ud-din-bhat.jpg","2016-2":"/assets/img/toppers/2016-2-anmol-sher-singh.jpg","2016-6":"/assets/img/toppers/2016-6-kothamasu-dinesh-kumar.jpg","2016-7":"/assets/img/toppers/2016-7-anand-vardhan.jpg","2016-8":"/assets/img/toppers/2016-8-shweta-chauhan.jpg","2016-9":"/assets/img/toppers/2016-9-sumansourav-mohanty.jpg","2017-1":"/assets/img/toppers/2017-1-durishetty-anudeep.jpg","2017-10":"/assets/img/toppers/2017-10-abhishek-surana.jpg","2017-2":"/assets/img/toppers/2017-2-anu-kumari.jpg","2017-3":"/assets/img/toppers/2017-3-sachin-gupta.jpg","2017-4":"/assets/img/toppers/2017-4-atul-prakash.jpg","2017-5":"/assets/img/toppers/2017-5-pratham-kaushik.jpg","2017-6":"/assets/img/toppers/2017-6-koya-sree-harsha.jpg","2017-7":"/assets/img/toppers/2017-7-ayush-sinha.jpg","2018-1":"/assets/img/toppers/2018-1-kanishak-kataria.jpg","2018-10":"/assets/img/toppers/2018-10-tanmay-vashistha-sharma.jpg","2018-2":"/assets/img/toppers/2018-2-akshat-jain.jpg","2018-3":"/assets/img/toppers/2018-3-junaid-ahmad.jpg","2018-4":"/assets/img/toppers/2018-4-shreyans-kumat.jpg","2018-7":"/assets/img/toppers/2018-7-karnati-varun-reddy.jpg","2018-8":"/assets/img/toppers/2018-8-vaishali-singh.jpg","2018-9":"/assets/img/toppers/2018-9-gunjan-dwivedi.jpg","2019-1":"/assets/img/toppers/2019-1-pradeep-singh.jpg","2019-4":"/assets/img/toppers/2019-4-himanshu-jain.jpg","2019-6":"/assets/img/toppers/2019-6-vishakha-yadav.jpg","2019-8":"/assets/img/toppers/2019-8-abhishek-saraf.jpg","2019-9":"/assets/img/toppers/2019-9-ravi-jain.jpg","2020-1":"/assets/img/toppers/2020-1-shubham-kumar.jpg","2020-10":"/assets/img/toppers/2020-10-satyam-gandhi.jpg","2020-2":"/assets/img/toppers/2020-2-jagrati-awasthi.jpg","2020-3":"/assets/img/toppers/2020-3-ankita-jain.jpg","2020-5":"/assets/img/toppers/2020-5-mamta-yadav.jpg","2020-9":"/assets/img/toppers/2020-9-apala-mishra.jpg","2021-1":"/assets/img/toppers/2021-1-shruti-sharma.jpg","2021-10":"/assets/img/toppers/2021-10-harkeerat-singh-randhawa.jpg","2021-12":"/assets/img/toppers/2021-12-yasharth-shekhar.jpg","2021-14":"/assets/img/toppers/2021-14-abhinav-j-jain-rank-14.jpg","2021-15":"/assets/img/toppers/2021-15-yaswanth-kumar-reddy.jpg","2021-16":"/assets/img/toppers/2021-16-anshu-priya.jpg","2021-2":"/assets/img/toppers/2021-2-ankita-agarwal.jpg","2021-20":"/assets/img/toppers/2021-20-arpit-chauhan.jpg","2021-3":"/assets/img/toppers/2021-3-gamini-singla.jpg","2021-4":"/assets/img/toppers/2021-4-aishwarya-verma.jpg","2021-6":"/assets/img/toppers/2021-6-yaksh-chaudhary.jpg","2021-7":"/assets/img/toppers/2021-7-samyak-s-jain.jpg","2021-9":"/assets/img/toppers/2021-9-preetam-kumar.jpg","2022-1":"/assets/img/toppers/2022-1-ishita-kishore.webp","2022-10":"/assets/img/toppers/2022-10-rahul-srivastava.webp","2022-12":"/assets/img/toppers/2022-12-abhinav-siwach.webp","2022-13":"/assets/img/toppers/2022-13-vidushi-singh.webp","2022-14":"/assets/img/toppers/2022-14-kritika-goyal.webp","2022-15":"/assets/img/toppers/2022-15-swati-sharma.webp","2022-16":"/assets/img/toppers/2022-16-shishir-kumar-singh.webp","2022-18":"/assets/img/toppers/2022-18-siddharth-shukla.webp","2022-19":"/assets/img/toppers/2022-19-laghima-tiwari.webp","2022-2":"/assets/img/toppers/2022-2-garima-lohia.webp","2022-20":"/assets/img/toppers/2022-20-anoushka-sharma.webp","2022-3":"/assets/img/toppers/2022-3-uma-harathi-n.webp","2022-4":"/assets/img/toppers/2022-4-smriti-mishra.webp","2022-5":"/assets/img/toppers/2022-5-mayur-hazarika.webp","2022-9":"/assets/img/toppers/2022-9-kanika-goyal.webp","2023-1":"/assets/img/toppers/2023-1-aditya-srivastava.webp","2023-10":"/assets/img/toppers/2023-10-aishwaryam-prajapati.webp","2023-13":"/assets/img/toppers/2023-13-medha-anand.webp","2023-15":"/assets/img/toppers/2023-15-kunal-rastogi.webp","2023-16":"/assets/img/toppers/2023-16-ayan-jain.webp","2023-17":"/assets/img/toppers/2023-17-swati-sharma.webp","2023-18":"/assets/img/toppers/2023-18-wardah-khan.webp","2023-19":"/assets/img/toppers/2023-19-shivam-kumar.webp","2023-2":"/assets/img/toppers/2023-2-animesh-pradhan.webp","2023-20":"/assets/img/toppers/2023-20-akash-verma.webp","2023-21":"/assets/img/toppers/2023-21-pururaj-singh-solanki.webp","2023-23":"/assets/img/toppers/2023-23-saurabh-sharma.webp","2023-24":"/assets/img/toppers/2023-24-prajnanandan-giri.webp","2023-25":"/assets/img/toppers/2023-25-ritika-verma.webp","2023-26":"/assets/img/toppers/2023-26-rupal-rana.webp","2023-27":"/assets/img/toppers/2023-27-nandala-saikiran.webp","2023-28":"/assets/img/toppers/2023-28-pawan-kumar-goel.webp","2023-29":"/assets/img/toppers/2023-29-saloni-chhabra.webp","2023-3":"/assets/img/toppers/2023-3-donuru-ananya-reddy.webp","2023-31":"/assets/img/toppers/2023-31-vishnu-sasikumar.webp","2023-32":"/assets/img/toppers/2023-32-arjun-gupta.webp","2023-34":"/assets/img/toppers/2023-34-zufishan-haque.webp","2023-35":"/assets/img/toppers/2023-35-abhinav-jain.webp","2023-36":"/assets/img/toppers/2023-36-ayushi-pradhan.webp","2023-37":"/assets/img/toppers/2023-37-tejas-agnihotri.webp","2023-38":"/assets/img/toppers/2023-38-animesh-verma.webp","2023-39":"/assets/img/toppers/2023-39-deepti-rohilla.webp","2023-44":"/assets/img/toppers/2023-44-akanchha-singh.webp","2023-45":"/assets/img/toppers/2023-45-ramya-r.webp","2023-46":"/assets/img/toppers/2023-46-bhawesh.webp","2023-47":"/assets/img/toppers/2023-47-basant-singh.webp","2023-48":"/assets/img/toppers/2023-48-anshul-hindal.webp","2023-5":"/assets/img/toppers/2023-5-ruhani.webp","2023-50":"/assets/img/toppers/2023-50-k-n-chandana-jahnavi.webp","2023-6":"/assets/img/toppers/2023-6-srishti-dabas.webp","2023-8":"/assets/img/toppers/2023-8-ashish-kumar.webp","2023-9":"/assets/img/toppers/2023-9-nausheen.webp","2024-1":"/assets/img/toppers/2024-1-shakti-dubey.webp","2024-10":"/assets/img/toppers/2024-10-mayank-tripathi.webp","2024-12":"/assets/img/toppers/2024-12-ashi-sharma.webp","2024-14":"/assets/img/toppers/2024-14-abhishek-vashishtha.webp","2024-15":"/assets/img/toppers/2024-15-banna-venkatesh.webp","2024-16":"/assets/img/toppers/2024-16-madhav-agarwal.webp","2024-17":"/assets/img/toppers/2024-17-sanskriti-trivedy.webp","2024-18":"/assets/img/toppers/2024-18-saumya-mishra.webp","2024-19":"/assets/img/toppers/2024-19-vibhor-bhardwaj.webp","2024-2":"/assets/img/toppers/2024-2-harshita-goyal.webp","2024-21":"/assets/img/toppers/2024-21-divyank-gupta.webp","2024-22":"/assets/img/toppers/2024-22-riya-saini.webp","2024-23":"/assets/img/toppers/2024-23-b-sivachandran.webp","2024-24":"/assets/img/toppers/2024-24-r-rangamanju.webp","2024-26":"/assets/img/toppers/2024-26-shivansh-subhash-jagade.webp","2024-3":"/assets/img/toppers/2024-3-dongre-archit-parag.webp","2024-30":"/assets/img/toppers/2024-30-panchal-smit-hasmukhbhai.webp","2024-31":"/assets/img/toppers/2024-31-shreya-tyagi.webp","2024-32":"/assets/img/toppers/2024-32-utkarsh-yadav.webp","2024-33":"/assets/img/toppers/2024-33-alfred-thomas.webp","2024-34":"/assets/img/toppers/2024-34-abhi-jain.webp","2024-35":"/assets/img/toppers/2024-35-shreyak-garg.webp","2024-36":"/assets/img/toppers/2024-36-muskan-srivastava.webp","2024-37":"/assets/img/toppers/2024-37-shobhika-pathak.webp","2024-39":"/assets/img/toppers/2024-39-monica-r.webp","2024-4":"/assets/img/toppers/2024-4-shah-margi-chirag.webp","2024-40":"/assets/img/toppers/2024-40-iram-choudhary.webp","2024-41":"/assets/img/toppers/2024-41-sachin-basavaraj-guttur.webp","2024-42":"/assets/img/toppers/2024-42-pavithra-p.webp","2024-43":"/assets/img/toppers/2024-43-avdhija-gupta.webp","2024-46":"/assets/img/toppers/2024-46-ravula-jayasimha-reddy.webp","2024-47":"/assets/img/toppers/2024-47-nandanaa-g-p.webp","2024-48":"/assets/img/toppers/2024-48-ritika-rath.webp","2024-49":"/assets/img/toppers/2024-49-sourav-sinha.webp","2024-5":"/assets/img/toppers/2024-5-aakash-garg.webp","2024-50":"/assets/img/toppers/2024-50-ankur-tripathi.webp","2024-6":"/assets/img/toppers/2024-6-komal-punia.webp","2024-7":"/assets/img/toppers/2024-7-aayushi-bansal.webp"};
  var MARK = "/assets/img/programmes/logo-mark-160.webp";
  var MQ = "(min-width: 1024px)";
  var HOLD = 4500;
  var still = false;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function $(r, q) { return r.querySelector(q); }
  function $$(r, q) { return [].slice.call(r.querySelectorAll(q)); }

  /* a copy of his section, its inner ids made its own, set after his */
  function copy(s0, key, tag) {
    var s = s0.cloneNode(true);
    s.classList.add("tp1-sec", "tp1-" + key);
    s.classList.remove("anim-off");   /* his script pauses his section's animation off screen with this; it does not reach the copy */
    ["pdH", "drHead", "tpList", "drList"].forEach(function (id) {
      var e = $(s, "#" + id);
      if (e) e.id = id + "-" + key;
    });
    s.setAttribute("aria-labelledby", "pdH-" + key);
    $$(s, "canvas").forEach(function (c) { c.remove(); });
    /* his reveal script (it fades each part in as it comes into view) does not reach the copy: show its parts */
    $$(s, ".rv, .rise, .sg").forEach(function (e) { e.classList.add("in"); });
    var lst = $(s, ".tp-list");
    if (lst) lst.classList.remove("is-clamped");
    var more = $(s, ".tp-more-wrap");
    if (more) more.remove();
    if (tag) s.insertBefore(el("p", "tp1-tag", tag), s.firstChild);
    s0.parentNode.insertBefore(s, s0.nextSibling);
    return s;
  }

  /* his carousel, moving by itself (it holds the toppers twice; this slides one round's length, round and round) */
  function marquee(track) {
    track.removeAttribute("style");
    track.classList.remove("is-drag", "is-loop");
    track.classList.add("tp1-marq-x");
  }

  /* the decade panel: tabs, list and the topper shown large */
  function decade(s) {
    var tabs = $$(s, ".tp-yrs .tab");
    var ind = $(s, ".tp-yrs .tabs__ind");
    var frame = $(s, ".tp-frame");
    var head = $(frame, "[data-year-head]");
    var lst = $(frame, ".tp-list");
    var pane = $(frame, ".tp-pane");
    var shot = $(pane, "[data-shot]");
    var back = $(pane, "[data-shot-back]");
    if (back) back.remove();
    var mark = el("img", "tp1-mark");
    mark.src = MARK;
    mark.alt = "";
    mark.hidden = true;
    shot.parentNode.appendChild(mark);
    var rank = $(pane, "[data-rank]"), name = $(pane, "[data-name]"), cap = $(pane, "[data-cap]");
    var year = null, rows = [], on = 0, since = 0, paused = false, seen = false;

    function place(t) {
      if (!ind || !t.offsetWidth) return;
      ind.style.width = t.offsetWidth + "px";
      ind.style.transform = "translateX(" + t.offsetLeft + "px)";
    }
    function run(row) {
      $$(lst, ".tp1-run").forEach(function (b) { b.remove(); });
      if (!still && row) row.appendChild(el("i", "tp1-run"));
    }
    function feature(i, smooth) {
      if (!rows.length) return;
      on = (i + rows.length) % rows.length;
      rows.forEach(function (r, k) {
        if (k === on) r.setAttribute("aria-current", "true");
        else r.removeAttribute("aria-current");
      });
      run(rows[on]);   /* a fine line across the name shown, filling until the list moves on */
      var d = rows[on].dataset, src = PHOTOS[year + "-" + d.r];
      function fill() {
        rank.textContent = d.r;
        name.textContent = d.n;
        cap.textContent = d.c || "UPSC CSE " + year;
        shot.classList.remove("is-pad", "is-back");
        shot.classList.toggle("is-boxed", !!src);
        shot.hidden = !src;
        mark.hidden = !!src;
        if (src) { shot.src = src; shot.alt = d.n; shot.removeAttribute("loading"); }
      }
      if (smooth && !still) {
        pane.classList.add("is-swap");
        setTimeout(function () { fill(); pane.classList.remove("is-swap"); }, 220);
      } else fill();
      /* keep it in view in the list, without moving the page */
      var r = rows[on], top = r.offsetTop - lst.offsetTop;
      if (top < lst.scrollTop || top + r.offsetHeight > lst.scrollTop + lst.clientHeight) {
        lst.scrollTo({ top: Math.max(0, top - lst.clientHeight / 2 + r.offsetHeight / 2), behavior: smooth && !still ? "smooth" : "auto" });
      }
    }
    function select(y) {
      year = y;
      tabs.forEach(function (t) {
        var sel = t.getAttribute("data-tab") === y;
        t.setAttribute("aria-selected", sel ? "true" : "false");
        t.tabIndex = sel ? 0 : -1;
        if (sel) place(t);
      });
      $$(lst, "ul[data-y]").forEach(function (ul) { ul.hidden = ul.getAttribute("data-y") !== y; });
      $$(lst, ".tp-row[aria-current]").forEach(function (r) { r.removeAttribute("aria-current"); });
      rows = $$(lst, 'ul[data-y="' + y + '"] .tp-row');
      head.textContent = rows.length + (rows.length === 1 ? " Rank" : " Ranks") + ", UPSC CSE " + y;
      lst.scrollTop = 0;
      feature(0, false);
      since = performance.now();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t.getAttribute("data-tab")); });
      t.addEventListener("keydown", function (e) {
        var k = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!k) return;
        e.preventDefault();
        var n = tabs[(i + k + tabs.length) % tabs.length];
        select(n.getAttribute("data-tab"));
        n.focus();
      });
    });
    lst.addEventListener("click", function (e) {
      var r = e.target.closest(".tp-row");
      if (r && rows.indexOf(r) > -1) { feature(rows.indexOf(r), true); since = performance.now(); }
    });
    lst.addEventListener("keydown", function (e) {
      var r = e.target.closest(".tp-row");
      if (r && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); feature(rows.indexOf(r), true); since = performance.now(); }
    });
    if (!still) {
      new IntersectionObserver(function (e) { seen = e[0].isIntersecting; since = performance.now(); }, { threshold: 0.3 }).observe(frame);
      frame.addEventListener("pointerenter", function () { paused = true; frame.classList.add("is-paused"); });
      frame.addEventListener("pointerleave", function () {
        paused = false;
        frame.classList.remove("is-paused");
        since = performance.now();
        run(rows[on]);   /* the line starts again with the wait */
      });
      setInterval(function () {
        if (!seen || paused || document.hidden || rows.length < 2 || performance.now() - since < HOLD) return;
        if (frame.closest('[aria-hidden="true"]')) return;   /* its scene is not shown */
        feature(on + 1, true);
        since = performance.now();
      }, 250);
    }
    var t0 = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
    select(t0.getAttribute("data-tab"));
    return {
      place: function () { var t = tabs.filter(function (x) { return x.getAttribute("aria-selected") === "true"; })[0]; if (t) place(t); },
      restart: function () { since = performance.now(); run(rows[on]); }
    };
  }

  /* one frame, two scenes */
  function build(s) {
    var hd = $(s, ".pd__hd");
    var dec = $(s, ".tp-record > div > div:first-child");
    var h3 = $(dec, "h3");
    var yrs = $(s, ".tp-yrs");
    var frame = $(s, ".tp-frame");
    var cta = $(s, ".dr__cta");
    var cap = $(s, ".dr > .dr__h");
    var strip = $(s, ".dr > .dr__view");
    /* "For a decade…" becomes the heading's introduction, as every other section has one */
    if (h3) {
      var intro = el("p", "intro tpb-sub");
      intro.textContent = h3.textContent;
      hd.appendChild(intro);
      h3.remove();
    }

    /* the switch: his tabs' look, two halves naming the showcases */
    var sw = yrs.cloneNode(true);
    sw.classList.remove("tp-yrs");
    sw.classList.add("tpb-switch");
    var list = $(sw, ".tabs__list");
    list.setAttribute("aria-label", "Show");
    var proto = $(list, ".tab");
    $$(list, ".tab").forEach(function (t) { t.remove(); });
    var ind = $(list, ".tabs__ind");
    var btns = [["1", "2025 results"], ["2", "A decade of ranks"]].map(function (n) {
      var b = proto.cloneNode(true);
      b.setAttribute("data-scene", n[0]);
      b.removeAttribute("data-tab");
      b.removeAttribute("aria-controls");
      b.textContent = n[1];
      list.insertBefore(b, ind);
      return b;
    });

    /* the scenes: his 2025 carousel; his decade panel as he drew it (his year tabs over his framed panel) */
    var stage = el("div", "tpb-stage");
    var one = el("div", "tpb-scene");
    var two = el("div", "tpb-scene");
    one.setAttribute("data-scene", "1");
    two.setAttribute("data-scene", "2");
    one.appendChild(cap);
    one.appendChild(strip);
    two.appendChild(yrs);
    two.appendChild(frame);
    stage.appendChild(one);
    stage.appendChild(two);
    marquee($(strip, ".dr__track"));
    hd.parentNode.insertBefore(sw, hd.nextSibling);
    sw.parentNode.insertBefore(stage, sw.nextSibling);
    stage.parentNode.insertBefore(cta, stage.nextSibling);
    $(s, ".dr").hidden = true;
    var dec2 = decade(s);

    /* the stage is as tall as the scene shown (easing between the two by CSS) */
    function fit() {
      var sc = stage.querySelector(".tpb-scene.is-on");
      if (sc) stage.style.height = sc.offsetHeight + "px";
    }
    addEventListener("resize", fit);

    function show(n) {
      btns.forEach(function (b) {
        var on = b.getAttribute("data-scene") === n;
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.tabIndex = on ? 0 : -1;
        if (on && ind) { ind.style.width = b.offsetWidth + "px"; ind.style.transform = "translateX(" + b.offsetLeft + "px)"; }
      });
      stage.setAttribute("data-on", n);   /* the scenes slide the way the switch moves */
      [one, two].forEach(function (sc) {
        var on = sc.getAttribute("data-scene") === n;
        sc.classList.toggle("is-on", on);
        sc.inert = !on;
        sc.setAttribute("aria-hidden", on ? "false" : "true");
      });
      fit();
      if (n === "2") requestAnimationFrame(function () { dec2.place(); dec2.restart(); });
    }
    btns.forEach(function (b, i) {
      b.addEventListener("click", function () { show(b.getAttribute("data-scene")); });
      b.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        var n = btns[1 - i];
        show(n.getAttribute("data-scene"));
        n.focus();
      });
    });
    show("1");
    return dec2;
  }

  function init() {
    var s0 = document.querySelector("section#toppers:not(.tp1-sec)");
    if (!s0 || document.querySelector(".tp1-sec") || !matchMedia(MQ).matches) return;
    if (!$(s0, ".tp-frame") || !$(s0, ".dr__view") || !$(s0, ".tp-pane")) return;
    still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var d = build(copy(s0, "b", ""));
    addEventListener("resize", d.place);
    /* the new version replaces his on desktop: his is set aside (hidden, its id given up so the nav's #toppers lands
       on the new one); phones never reach here and keep his */
    /* (the shields' shapes are clip paths defined in his section; a hidden one stops drawing them, so they move out first) */
    $$(s0, "svg.pd__defs").forEach(function (d) { document.body.appendChild(d); });
    s0.id = "toppers-his";
    s0.classList.add("tp1-his");
    s0.hidden = true;
  }

  function start() { setTimeout(init, 400); }
  if (document.readyState === "complete") start();
  else addEventListener("load", start);
})();
