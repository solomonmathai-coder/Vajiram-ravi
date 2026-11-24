/* Course finder page (course-finder.html). Started again on 2026-11-17/18 (user: "keep the nav and the orange and white and footer, delete
   the rest", then "rebuild the categories like this", a coursera.org "Online degrees" block): under the head, one section per category,
   each a heading, a row of chips that filter it (its subjects, or its modes and medium) and a grid of course cards, four across, with
   "Show N more" under the first row. A card: the course's banner picture, the Vajiram & Ravi emblem and name, the course's name, and its
   mode and length; it opens the course's page on vajiramandravi.com. Data: js/data/courses.js (window.CF_DATA). The nav has its own script
   (js/site-nav.js). The earlier finder (book shelf, filters, tickets, detail panel) is in the history: commits 7fd3cd6 and 6d3d24f. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const D = window.CF_DATA;

  /* ---------- the head's stats (the homepage hero's style): counted from the course data, counting up once on load ---------- */
  const tally = $('#cfTally');
  if (tally && D) {
    const products = D.courses.reduce((n, c) => n + c.v.length, 0);
    const categories = D.families.filter(f => f.k !== 'gs-2yr').length;   // GS Foundation's two lengths count as one category
    const STATS = [[products, 'Courses'], [categories, 'Categories'], [D.subjects.length, 'Optional subjects']];   // short labels (user 2026-11-21)
    tally.innerHTML = STATS.map(([a, b], i) => `<li class="cf-stat" style="--i:${i}"><span class="cf-stat__num"><b class="cf-stat__fig" data-n="${a}">${a}</b><span class="cf-stat__fig cf-stat__room" aria-hidden="true">${a}</span></span><span class="cf-stat__t">${b}</span></li>`).join('');
    if (!reduce) $$('.cf-stat__fig[data-n]', tally).forEach((el, i) => {
      const to = +el.dataset.n, t0 = performance.now() + 250 + i * 120, dur = 1100;
      el.textContent = '0';
      const step = t => { const k = Math.min(1, Math.max(0, (t - t0) / dur)); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }

  /* ---------- the categories ---------- */
  const list = $('#cfList');
  if (list && D) {
    const TREE = [{ k: 'gs', label: 'GS Foundation', kids: ['gs-11', 'gs-2yr'] }]
      .concat(D.families.filter(f => f.k !== 'gs-11' && f.k !== 'gs-2yr').map(f => ({ k: f.k, label: f.label, kids: [f.k] })));
    const subLabel = Object.fromEntries(D.subjects.map(s => [s.k, s.label]));
    // what each category is and who it is for (user 2026-11-18): the first line is the homepage's (js/content.js CAT_D) where it has
    // one; the rest is drawn from the "who should join" and opening copy on the category's course pages (js/data/courses.js who, intro)
    const ABOUT = {
      gs: ['The whole General Studies syllabus for Prelims and Mains, taught together, over 11 months or 2 years.',
        'Final-year students and graduates starting the UPSC CSE. The 2-year Fledgling suits those still in college who want a steadier pace from no prior base.'],
      optional: ['Two papers, 500 marks, taught by a specialist in your optional subject.',
        'Mains aspirants who have chosen, or are choosing, their optional, in any of 13 subjects.'],
      csat: ['Prelims Paper II. Qualifying at 33%, but it has to be cleared.',
        'Prelims aspirants who want to cover the CSAT basics on schedule, learn the shortcuts and cut their negative marks.'],
      interview: ['Mock boards with detailed feedback, for the 275-mark personality test.',
        'Candidates who have cleared the UPSC CSE or IFoS Mains and are preparing for the interview.'],
      mentorship: ['A personal mentor shapes your strategy and keeps your plan on track, week by week, in English or Hindi.',
        'Aspirants who have covered the syllabus or a foundation course but are not turning it into marks, and repeat candidates.'],
      'mains-ts': ['Write to time, then read what an evaluator would change. English and Hindi.',
        'First-time aspirants building answer-writing habits, repeat candidates fixing a Mains score, and seniors who have written Mains before.'],
      'prelims-ts': ['Full-length tests with the reasoning behind every answer, plus current affairs.',
        'Prelims aspirants who want to practise time management and accuracy under exam conditions.'],
      'optional-ts': ['Answer writing for your optional, evaluated paper by paper.',
        'Mains aspirants who want regular tests and evaluation in their optional, Paper I and Paper II.'],
      module: ['Short modules on one part of the syllabus: Economics, Ethics (GS Paper IV) and SMART current affairs, plus the Ranker’s Programme.',
        'Aspirants who want to strengthen one subject or their current affairs, or to reassess and improve after an attempt.'],
      crash: ['A short, intensive course in your optional: concept classes alongside a test series.',
        'Mains aspirants close to the exam who want to revise their optional quickly and practise answer writing.'],
      enrichment: ['Answer-writing programmes for your optional: previous years’ questions, weekly tests and evaluation.',
        'Aspirants who know their optional’s content and want sharper, more analytical answers.'],
      ifos: ['Forestry and Geology, the Indian Forest Service optionals, as courses and test series.',
        'Indian Forest Service (IFoS) Mains aspirants who take Forestry or Geology.'],
      postal: ['Vajiram & Ravi’s printed study material, subject by subject: polity, history, society, international relations and more.',
        'Aspirants preparing on their own who want the institute’s notes.']
    };
    const NEW = new Set([]);   // categories marked new; Interview Guidance was (user 2026-11-17), its badge removed (user 2026-11-21)
    // Iconoir's nav-arrow-left and nav-arrow-right
    // the reference build's arrow (vajiram-ravi.abhishek-ps.workers.dev, user 2026-11-20): a straight shaft with a gently curved head on a
    // 16-unit grid, mirrored for "previous"; two copies, one slides out as the other slides in on hover (its .btn__icon--swap)
    const TEER = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2.5 8h11"/><path d="M8.6 3.6C9.4 5.9 11.2 7.4 13.5 8 11.2 8.6 9.4 10.1 8.6 12.4"/></svg>';
    const CHEV = d => `<span class="cf-arw__i${d < 0 ? ' cf-arw__i--flip' : ''}" aria-hidden="true">${TEER}${TEER}</span>`;
    const modeTxt = v => v.k === 'classroom' ? 'Classroom' : v.k === 'online' ? 'LIVE-Online' : 'Classroom & LIVE-Online';

    const fold = s => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
    const famLabel = Object.fromEntries(D.families.map(f => [f.k, f.label]));
    /* ---------- each category's book beside its heading (user 2026-11-18, "use the books we used in the home and show it near the heading
       and the subheading"): the homepage's cloth-bound programme books (js/programme-shelf.js, css/programme-shelf.css), as course
       finder v1 drew them (commit 6d3d24f): its cloth colours, pressed motif, gold frame, name and emblem; it stands a little turned
       toward the reader, with a band of light crossing it now and then ---------- */
    const FOIL = '#f6c77a';
    const COVER = {
      top: { light: '#4a3b31', base: '#33281f', deep: '#1c1510', emblem: 'layers', art: 'arcs' },
      gs: { light: '#d9581c', base: '#c2410c', deep: '#8f3010', emblem: 'books', art: 'bars' },
      optional: { light: '#c0362c', base: '#a3231c', deep: '#701510', emblem: 'quill', art: 'circles' },
      csat: { light: '#2e6a80', base: '#1f4a5f', deep: '#14323f', emblem: 'abacus', art: 'grid' },
      interview: { light: '#5e5f63', base: '#4a4b4e', deep: '#303133', emblem: 'mic', art: 'arches' },
      mentorship: { light: '#b88a2e', base: '#9a7020', deep: '#6b4c12', emblem: 'compass', art: 'orbit' },
      'mains-ts': { light: '#a3545c', base: '#873f48', deep: '#5e2a31', emblem: 'pen', art: 'lines' },
      'prelims-ts': { light: '#7a3556', base: '#5e2742', deep: '#3f192c', emblem: 'target', art: 'target' },
      'optional-ts': { light: '#4f7d5a', base: '#3b6345', deep: '#26422d', emblem: 'sprout', art: 'steps' },
      module: { light: '#4b5d8a', base: '#3a4a72', deep: '#26314f', emblem: 'blocks', art: 'quarters' },
      crash: { light: '#336650', base: '#264f3e', deep: '#18352a', emblem: 'hourglass', art: 'diamonds' },
      enrichment: { light: '#5b4486', base: '#45336b', deep: '#2b1f48', emblem: 'bolt', art: 'chevrons' },
      ifos: { light: '#5d6b34', base: '#485428', deep: '#2f3819', emblem: 'tree', art: 'triangles' },
      postal: { light: '#9b6a43', base: '#7d5233', deep: '#553621', emblem: 'books', art: 'circles' }
    };
    const DRAW = {   // the emblems, line drawings on 48 x 48 (from js/programme-shelf.js)
      layers: '<path d="m24 15 9 4.5-9 4.5-9-4.5 9-4.5Z"/><path d="m15 24 9 4.5 9-4.5M15 28.5 24 33l9-4.5"/>',
      books: '<path d="M24 17c-2.6-1.8-6-2.4-10-2.2v16c4-.2 7.4.4 10 2.2 2.6-1.8 6-2.4 10-2.2v-16c-4-.2-7.4.4-10 2.2Z"/><path d="M24 17v16M17 20.5h3.5M17 24h3.5M27.5 20.5H31M27.5 24H31"/>',
      abacus: '<rect x="15" y="15" width="18" height="18" rx="2"/><path d="M15 21h18M15 27h18"/><circle cx="20" cy="21" r="1.6"/><circle cx="26" cy="21" r="1.6"/><circle cx="23" cy="27" r="1.6"/><circle cx="29" cy="27" r="1.6"/>',
      quill: '<path d="M33 15c-7 1-12 6-14 14l-1.5 4.5"/><path d="M33 15c-1 6-4.5 10.5-11 12.5"/><path d="M21 30.5h8"/>',
      target: '<circle cx="24" cy="24" r="9"/><circle cx="24" cy="24" r="5"/><circle cx="24" cy="24" r="1.4"/><path d="m24 24 8-8M29 16h3v3"/>',
      pen: '<path d="M15 31h9M15 27h6M15 23h5"/><path d="m27 29.5 6.5-6.5a1.8 1.8 0 0 0-2.5-2.5L24.5 27 24 30Z"/>',
      compass: '<circle cx="24" cy="24" r="9"/><path d="m27.8 20.2-2.3 5.3-5.3 2.3 2.3-5.3 5.3-2.3Z"/>',
      mic: '<rect x="20.5" y="14" width="7" height="12" rx="3.5"/><path d="M17 23.5a7 7 0 0 0 14 0M24 30.5V34M20.5 34h7"/>',
      sprout: '<path d="M24 33V22"/><path d="M24 24c0-5-3.5-8-9-8 0 5 3.5 8 9 8Z"/><path d="M24 27c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5Z"/><path d="M17 33h14"/>',
      bolt: '<path d="M26 14 18 26h6l-2 9 8-12h-6l2-9Z"/>',
      blocks: '<rect x="15" y="25" width="8" height="8" rx="1.2"/><rect x="25" y="25" width="8" height="8" rx="1.2"/><rect x="20" y="15" width="8" height="8" rx="1.2"/>',
      hourglass: '<path d="M17 14h14M17 34h14"/><path d="M18.5 14c0 5 5.5 6.5 5.5 10s-5.5 5-5.5 10h11c0-5-5.5-6.5-5.5-10s5.5-5 5.5-10"/>',
      tree: '<path d="M24 34v-6"/><path d="M24 14l-7 10h4l-5 6h16l-5-6h4Z"/>'
    };
    const emblem = (kind, size) => `<svg class="ps-emblem" viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true"><g class="ps-emblem__ring"><circle cx="24" cy="24" r="21.5" stroke-width=".9" stroke-dasharray="1.2 2.4"/></g><circle cx="24" cy="24" r="18.5" stroke-width=".9"/><g class="ps-emblem__draw">${DRAW[kind] || DRAW.books}</g></svg>`;
    const geo = (kind, accent, soft) => {   // the pressed motifs, on 100 x 100 (from js/programme-shelf.js)
      const m = (cls, a) => `<${a.tag || 'rect'} data-m="${cls}" ${Object.entries(a).filter(([k]) => k !== 'tag').map(([k, v]) => `${k}="${v}"`).join(' ')}/>`;
      const P = {
        arcs: () => [m('s110', { tag: 'circle', cx: 22, cy: 104, r: 48, fill: soft, opacity: .35 }), m('s118', { tag: 'circle', cx: 22, cy: 104, r: 32, fill: soft, opacity: .5 }), m('ur', { tag: 'circle', cx: 66, cy: 62, r: 9, fill: accent })],
        bars: () => [m('l14', { x: 52, y: 45, width: 60, height: 13, rx: 6.5, fill: accent }), m('r8', { x: 22, y: 62, width: 90, height: 16, rx: 8, fill: soft, opacity: .75 }), m('l10', { x: 30, y: 82, width: 80, height: 14, rx: 7, fill: soft, opacity: .45 })],
        circles: () => [m('s112', { tag: 'circle', cx: 98, cy: 84, r: 44, fill: soft, opacity: .55 }), m('u6', { tag: 'circle', cx: 20, cy: 104, r: 36, fill: soft, opacity: .45 }), m('ul', { tag: 'circle', cx: 62, cy: 68, r: 16, fill: accent })],
        grid: () => [0, 1, 2].flatMap(r => [0, 1, 2].map(c => m(r === 1 && c === 1 ? 'rot-c' : 'rot', { x: 48 + c * 20, y: 46 + r * 20, width: 15, height: 15, rx: 2.5, fill: r === 1 && c === 1 ? accent : soft, opacity: r === 1 && c === 1 ? 1 : .6 }))),
        arches: () => [m('r8', { tag: 'path', d: 'M8 104 V82 A22 22 0 0 1 30 60 H30 V104 Z', fill: soft, opacity: .6 }), m('l8', { tag: 'path', d: 'M108 104 V82 A22 22 0 0 0 86 60 H86 V104 Z', fill: soft, opacity: .8 }), m('s16', { tag: 'circle', cx: 58, cy: 76, r: 4, fill: accent })],
        lines: () => [m('sx', { x: 30, y: 44, width: 34, height: 8, rx: 2.5, fill: accent }), ...[[57, 22], [70, 44], [83, 20]].map(([y, w]) => m('sx', { x: 30, y, width: w, height: 8, rx: 2.5, fill: soft, opacity: .75 }))],
        target: () => [m('s108', { tag: 'circle', cx: 58, cy: 76, r: 34, fill: soft, opacity: .35 }), m('s112', { tag: 'circle', cx: 58, cy: 76, r: 23, fill: soft, opacity: .5 }), m('s116', { tag: 'circle', cx: 58, cy: 76, r: 13, fill: soft, opacity: .7 }), m('s13', { tag: 'circle', cx: 58, cy: 76, r: 6, fill: accent })],
        quarters: () => [m('u6', { tag: 'path', d: 'M30 104 V92 A26 26 0 0 1 56 66 V104 Z', fill: soft, opacity: .6 }), m('u10', { tag: 'path', d: 'M80 104 V90 A24 24 0 0 1 104 66 V104 Z', fill: soft, opacity: .75 }), m('dl', { tag: 'circle', cx: 76, cy: 46, r: 3.5, fill: accent })],
        steps: () => [m('u6', { x: 38, y: 82, width: 20, height: 26, rx: 3, fill: soft, opacity: .45 }), m('u10', { x: 61, y: 66, width: 20, height: 42, rx: 3, fill: soft, opacity: .65 }), m('u14', { x: 84, y: 50, width: 20, height: 58, rx: 3, fill: accent })],
        chevrons: () => [0, 1, 2].map(k => m('r14', { tag: 'path', d: `M${36 + k * 20} 62 l16 16 -16 16 h9 l16 -16 -16 -16 Z`, fill: k === 2 ? accent : soft, opacity: k === 2 ? 1 : .45 + k * .2 })),
        orbit: () => [m('s110', { tag: 'circle', cx: 70, cy: 80, r: 26, fill: 'none', stroke: soft, 'stroke-width': 5, opacity: .6 }), m('s116', { tag: 'circle', cx: 70, cy: 80, r: 12, fill: soft, opacity: .55 }), m('or', { tag: 'circle', cx: 46, cy: 62, r: 6, fill: accent })],
        diamonds: () => [m('rot', { tag: 'path', d: 'M58 54 76 72 58 90 40 72 Z', fill: soft, opacity: .55 }), m('rot', { tag: 'path', d: 'M84 70 98 84 84 98 70 84 Z', fill: soft, opacity: .75 }), m('rot-c', { tag: 'path', d: 'M86 44 94 52 86 60 78 52 Z', fill: accent })],
        triangles: () => [m('u6', { tag: 'path', d: 'M36 108 56 64 76 108 Z', fill: soft, opacity: .5 }), m('u10', { tag: 'path', d: 'M64 108 84 70 104 108 Z', fill: soft, opacity: .72 }), m('s16', { tag: 'path', d: 'M56 52 61 42 66 52 Z', fill: accent })]
      };
      return `<svg class="ps-geo" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${(P[kind] || P.bars)().join('')}</svg>`;
    };
    const SW = 11;   // the spine's width on these small covers
    // every book is built as a solid (back cover, spine, page block and top edge behind its front, as course finder v1's were), so it
    // shows its depth when it turns: it does a full horizontal flip as its section comes into view and when it is hovered (user 2026-11-18)
    const bookFor = (k, label, n, small) => {
      const c = COVER[k]; if (!c) return '';
      const frame = `top:7px;right:7px;bottom:7px;left:${SW + 6}px`;
      // a small book (the rail's, the Top Picks banner's) is the full-size book drawn whole and scaled down as one (user 2026-11-18, "use a
      // scaled down version of the book rather than adding text on top of them"), inside a box the size of the result
      return `${small ? '<span class="cf-bk-mini">' : ''}<span class="cf-bk ps-book${small ? ' cf-bk--full' : ''}" aria-hidden="true"><span class="cf-bk__body">
        <span class="ps-extras"><span class="ps-foot"></span><span class="ps-back" style="background-color:${c.deep}"></span><span class="ps-pages"></span></span>
        <span class="cf-3d cf-3d--back" style="background:linear-gradient(220deg, ${c.light}, ${c.base} 50%, ${c.deep})"></span>
        <span class="cf-3d cf-3d--spine" style="background:linear-gradient(90deg, ${c.deep}, ${c.base} 45%, ${c.deep})"><i></i><i></i></span>
        <span class="cf-3d cf-3d--pages"></span><span class="cf-3d cf-3d--top"></span>
        <span class="ps-front" style="background-color:${c.base};background-image:linear-gradient(140deg, ${c.light} 0%, ${c.base} 48%, ${c.deep} 100%)">
          <span class="ps-front__geo">${geo(c.art, FOIL, '#fff3dc')}</span>
          <span class="ps-cloth"></span><span class="ps-grain"></span>
          <span class="ps-spine" style="width:${SW}px;background:linear-gradient(90deg, rgb(0 0 0 / .38), ${c.deep} 38%, ${c.base} 80%, rgb(0 0 0 / .2))"></span>
          <span class="ps-hinge" style="left:${SW}px"></span><span class="ps-light"></span>
          <span class="ps-frame" style="${frame}"><span></span></span>
          <span class="ps-face" style="${frame}">
            <span class="ps-face__name">${esc(label)}</span>
            <span class="ps-face__rule"><i></i><b></b><i></i></span>
            <span class="ps-face__em">${emblem(c.emblem, 34)}</span>
            <span class="ps-face__foot"><span class="ps-face__cat">${n} ${n === 1 ? 'course' : 'courses'}</span></span>
          </span>
          <span class="ps-shine"></span>
        </span>
      </span></span>${small ? '</span>' : ''}`;
    };
    /* ---------- a course card (user 2026-11-18, "the hierarchy of this card is better"): the course's picture, the Vajiram & Ravi line,
       the course's name, its mode and length; then, from the homepage's "Next batches" ticket, only its dashed tear line and the round
       cuts at both edges; and below them the fee and "View course". A course marked new, bestseller or trending carries a label on
       its picture. ---------- */
    // the badges (user 2026-11-18). New: Interview Guidance (the user's, 2026-11-17). Trending: the two courses in the homepage's
    // "What's trending" carousel (index.html #trending: the 11-month GS Comprehensive and PowerUp Prelims Test Series 2027).
    // Bestseller: none yet; to be given by the user (never guessed). One badge a card: new, then bestseller, then trending.
    const BADGE = {
      new: { label: 'New', test: (c) => c.f === 'interview' },
      bestseller: { label: 'Bestseller', test: () => false },
      trending: { label: 'Trending', test: (c, v) => c.f === 'gs-11' || /^powerup prelims test series/i.test(v.t) }
    };
    const badgeOf = (c, v) => Object.keys(BADGE).find(k => BADGE[k].test(c, v)) || '';
    // (the Vajiram & Ravi line with its logo was taken off the cards, user 2026-11-18, "let's remove the Vajiram and Ravi logo")
    // the course's length, on its own line with a clock (user 2026-11-18, "introduce course duration to the cards"), as its page gives it,
    // tidied: "02 Months" to "2 Months", "24 weeks" to "24 Weeks", date ranges shortened ("1 Oct – 30 Nov 2026"); where the page gives
    // none (48 courses) the card says so rather than guess
    const CLOCK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6L12 12L18 12"/><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/></svg>';
    const MON = { january: 'Jan', february: 'Feb', march: 'Mar', april: 'Apr', may: 'May', june: 'Jun', july: 'Jul', august: 'Aug', september: 'Sep', october: 'Oct', november: 'Nov', december: 'Dec' };
    const durTxt = d => String(d || '').trim()
      .replace(/\b0(\d)\b/g, '$1')                                            // 02 Months, 01 October
      .replace(/(\d)(?:st|nd|rd|th)\b/g, '$1')                                // 16th November
      .replace(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/gi, m => MON[m.toLowerCase()])
      .replace(/\s+to\s+/gi, ' – ')
      .replace(/^(\d+) (\w{3}) (\d{4}) – (\d+) (\w{3}) \3$/, '$1 $2 – $4 $5 $3')   // one year written once
      .replace(/\b(days?|weeks?|months?|years?)\b/gi, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
    // the target exam year, for the Target year filter: the year in the course's name (its page's title), e.g. "UPSC GS Course 2028"
    const yearsOf = v => [...new Set([...(v.h1 + ' ' + v.t).matchAll(/\b(202[6-9])\b/g)].map(m => m[1]))];
    // the course page's facts box on the card (user 2026-11-18, "add these to the card and let's not show the price"): the date of
    // commencement, the mode, the duration and the course time, each with its Iconoir icon (calendar, presentation, hourglass, clock);
    // a fact the page does not give is said so in grey, never guessed
    // the card icons at stroke 2 (user 2026-11-21, "we can update icon weight to 2"; was Iconoir's 1.5)
    const ico = d => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d.map(p => `<path d="${p}"/>`).join('')}</svg>`;
    const I_CAL = ico(['M15 4V2M15 4V6M15 4H10.5M3 10V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V10H3Z', 'M3 10V6C3 4.89543 3.89543 4 5 4H7', 'M7 2V6', 'M21 10V6C21 4.89543 20.1046 4 19 4H18.5']);
    const I_DUR = ico(['M12 12C15.866 12 19 8.86599 19 5H5C5 8.86599 8.13401 12 12 12ZM12 12C15.866 12 19 15.134 19 19H5C5 15.134 8.13401 12 12 12Z', 'M5 2L12 2L19 2', 'M5 22H12L19 22']);
    const MON3 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    // the date of commencement: the next one the page gives, or the last if every one has passed ("Started …")
    const startTxt = v => {
      const ds = [...String(v.start || '').matchAll(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+),?\s+(\d{4})/g)]
        .map(m => { const mo = MONTHS.indexOf(m[2].toLowerCase()); return mo < 0 ? null : new Date(+m[3], mo, +m[1]); }).filter(Boolean);
      if (!ds.length) return /announc/i.test(v.start || '') ? 'Start date to be announced' : '';
      const next = ds.filter(d => d >= today).sort((a, b) => a - b)[0], d = next || ds[ds.length - 1];
      return `${next ? 'Starts' : 'Started'} ${d.getDate()} ${MON3[d.getMonth()]} ${d.getFullYear()}`;
    };
    const fact = (icon, txt, none, cls = '') => `<span class="cf-k__f${txt ? '' : ' is-none'}${cls}">${icon}<span>${txt || none}</span></span>`;
    // the course time (back on the card, user 2026-11-18, "let's bring back time"), tidied: "02:30 PM to 05:00 PM" to "2:30 PM to 5:00 PM",
    // anything in brackets left to the course page; its icon is Iconoir's clock
    const I_TIME = CLOCK;
    // the arrow in the "View course" disc: the reference build's (TEER); two, one slides out as the other slides in
    const GO_ARW = TEER;
    // the mode under the time (user 2026-11-18, "the card should also mention if it's live or classroom under the time"): Iconoir's
    // presentation board for Classroom (and for courses run both ways), its video camera for LIVE-Online
    const I_ROOM = ico(['M22 4.6V17.4C22 17.7314 21.7314 18 21.4 18H2.6C2.26863 18 2 17.7314 2 17.4V4.6C2 4.26863 2.26863 4 2.6 4H21.4C21.7314 4 22 4.26863 22 4.6Z', 'M8.5 21.5L12 18L15.5 21.5', 'M12 2V4', 'M9 12V14', 'M12 10V14', 'M15 8V14']);
    // the fee (user 2026-11-24, "add an icon for fees and add fees in every card"; it was left off on 2026-11-18): the course page's
    // short fee ("₹1,80,000"), "incl. GST" when the page says so; a course whose page gives none says "Fee on request".
    // Its icon is the Indian rupee sign (user 2026-11-24; was Iconoir's coins). Iconoir has no rupee, so this is Lucide's
    // indian-rupee (ISC licence), drawn on the same 24px grid with the same round 2px stroke as the other card icons
    // scaled up from Lucide's 12x18 to 13x20 so it stands as tall as the hourglass (y 2-22) and reads the same size as the others
    const I_FEE = ico(['M5.5 2h13', 'M5.5 7.56h13', 'M5.5 13.11l9.21 8.89', 'M5.5 13.11h3.25', 'M8.75 13.11c7.22 0 7.22-11.11 0-11.11']);
    // the ₹ in the amount is left to screen readers (.vh): the icon already shows it
    const feeTxt = v => v.feeShort ? `${esc(v.feeShort).replace(/^₹\s*/, '<span class="vh">₹</span>')}${/gst/i.test(v.fee || '') ? ' <small class="cf-k__gst">incl. GST</small>' : ''}` : '';
    const I_LIVE = ico(['M15 12V16.4C15 16.7314 14.7314 17 14.4 17H3.6C3.26863 17 3 16.7314 3 16.4V7.6C3 7.26863 3.26863 7 3.6 7H14.4C14.7314 7 15 7.26863 15 7.6V12ZM15 12L20.0159 7.82009C20.4067 7.49443 21 7.77232 21 8.28103V15.719C21 16.2277 20.4067 16.5056 20.0159 16.1799L15 12Z']);
    // how often the classes meet (user 2026-11-18, "the time should also mention if it is weekly or daily"), read from the course's page:
    // "6 days a week" is Mon–Sat, "every day" / "per class, daily" is Daily, weekends, weekly; DUMMY.freq stands in where it says nothing
    const freqOf = v => {
      const s = [v.time, v.intro, JSON.stringify(v.feat || ''), JSON.stringify(v.stats || '')].join(' ').toLowerCase();
      if (/6 days a week|six days a week/.test(s)) return 'Mon–Sat';
      if (/weekend|saturday and sunday|saturdays and sundays/.test(s)) return 'Weekends';
      if (/every ?day|per class, daily|daily classes/.test(s)) return 'Daily';
      if (/weekly|once a week|every week/.test(s)) return 'Weekly';
      return '';
    };
    // "2:30 PM to 5:00 PM" to "2:30–5:00 PM"; "11:00 AM to 1:30 PM" to "11:00 AM–1:30 PM"
    const compactTime = s => {
      const m = s.match(/^(\d{1,2}:\d{2})\s*(AM|PM)\s*(?:to|-|–)\s*(\d{1,2}:\d{2})\s*(AM|PM)$/i);
      if (!m) return s;
      return m[2].toUpperCase() === m[4].toUpperCase() ? `${m[1]}–${m[3]} ${m[4].toUpperCase()}` : `${m[1]} ${m[2].toUpperCase()}–${m[3]} ${m[4].toUpperCase()}`;
    };
    const timeTxt = v => {
      const s = String(v.time || '').replace(/\(.*$/, '').trim();
      if (!s) return '';
      if (/announc/i.test(s)) return 'Timing to be announced';
      return s.replace(/\b0(\d):/g, '$1:').replace(/\s+/g, ' ');
    };
    // DUMMY CONTENT (user 2026-11-18, "let's use dummy content"): where a course's page gives no start date, duration or course time, the
    // card shows a stand-in from the table below instead of "… on the course page". These are NOT real facts: replace them with the real
    // ones before launch. A card using any of them carries data-dummy="start dur time freq" (whichever apply); the real facts are untouched.
    const DUMMY = {
      start: ['Starts 5 Dec 2026', 'Starts 12 Dec 2026', 'Starts 5 Jan 2027', 'Starts 19 Jan 2027', 'Starts 2 Feb 2027', 'Starts 16 Feb 2027'],
      dur: { optional: '20 Weeks', interview: '6 Weeks', mentorship: '4 Months', 'mains-ts': '6 Months', 'prelims-ts': '5 Months', 'optional-ts': '6 Months',
        module: '3 Months', crash: '2 Months', enrichment: '3 Months', ifos: '5 Months', postal: '12 Months', csat: '3.5 Months', gs: '11 Months' },
      time: { classes: ['7:30 AM to 10:00 AM', '11:00 AM to 1:30 PM', '2:30 PM to 5:00 PM', '5:30 PM to 8:00 PM'], tests: '9:30 AM to 12:30 PM' },
      freq: { classes: 'Mon–Sat', tests: 'Weekly, Sun', guided: 'Weekly' }
    };
    const TESTS = new Set(['mains-ts', 'prelims-ts', 'optional-ts']);
    let dummyN = 0;   // turns through the stand-in dates and class times, so neighbouring cards differ
    // CATEGORIES ARE TOPPED UP WITH STAND-IN BADGES AND AN UPCOMING BATCH (user 2026-11-18, "every category should have a new, trending, bestseller
    // and upcoming courses"). The real badges (BADGE above) come first; where a category still lacks New, Trending or Bestseller, a DUMMY
    // one goes to a course in it with no badge yet, spread along its row (or, in a category with fewer courses than badges, a second
    // badge on a course). A category whose every batch has started gets a DUMMY next batch on its first course. Cards carrying either
    // have "badge" / "start" in data-dummy. These are NOT real: replace them with the real ones before launch.
    const KINDS = ['new', 'bestseller', 'trending'];
    const BADGES = new Map(), FORCE_START = new Set();
    for (const c of D.courses) for (const v of c.v) { const b = badgeOf(c, v); BADGES.set(v.id, b ? [b] : []); }
    const DUM_BADGE = new Set();
    // TRIMMED (user 2026-11-21, "trim the badges", with only the chips a category has courses for now shown): a category no longer gets
    // all three; it is topped up only with the kinds listed for it here (DUMMY still), on top of its real ones, so the chip rows vary.
    // A category not listed gets none beyond its real badges. Our Top Picks still gets all three.
    const WANT = { gs: ['bestseller'], optional: ['bestseller'], csat: ['new'], 'mains-ts': ['bestseller', 'trending'],
      'prelims-ts': ['bestseller'], 'optional-ts': ['new'], enrichment: ['new'], postal: ['bestseller'] };   // Trending taken off Mentorship and Module Courses (user 2026-11-21)
    const topUp = (vs, want = KINDS) => {
      const missing = want.filter(k => !vs.some(v => BADGES.get(v.id).includes(k)));
      missing.forEach((k, i) => {
        const free = vs.filter(v => !BADGES.get(v.id).length);
        const pick = free.length ? free[Math.floor(i * free.length / missing.length) % free.length]
          : [...vs].sort((a, b) => BADGES.get(a.id).length - BADGES.get(b.id).length)[0];
        BADGES.get(pick.id).push(k); DUM_BADGE.add(pick.id);
      });
    };
    for (const tr of TREE) {
      const vs = D.courses.filter(c => tr.kids.includes(c.f)).flatMap(c => c.v);
      if (!vs.length) continue;
      topUp(vs, WANT[tr.k] || []);
      // a category with no batch still to start: its first course gets a stand-in date (an empty start gets one anyway)
      if (!vs.some(v => { const s = startTxt(v); return !s || /^Starts/.test(s); })) FORCE_START.add(vs[0].id);
    }
    const TOP_IDS = ['courses-upsc-gs-course', 'courses-upsc-gs-online-course', 'courses-prelims-test-series-powerup', 'courses-prelims-test-series-camp',
      'courses-upsc-module-courses-prelims-current-affairs-programme', 'courses-upsc-module-courses-current-affairs-course'];
    topUp(TOP_IDS.map(id => D.courses.flatMap(c => c.v).find(v => v.id === id)).filter(Boolean));
    for (const v of BADGES.values()) v.sort((a, b) => KINDS.indexOf(a) - KINDS.indexOf(b));
    // the start as a number (20261127) to put the Upcoming chip's courses in date order; a date to be announced goes last
    const startKey = s => { const m = String(s).match(/(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/); return m ? +m[3] * 10000 + (MON3.indexOf(m[2]) + 1) * 100 + +m[1] : 99999999; };
    const card = (c, v, t) => {
      const dur = durTxt(v.dur);
      // what the search looks through: the course's name, its category, its subject, its mode, its medium and its length
      const q = fold([v.t, t.label, famLabel[c.f], subLabel[c.s], modeTxt(v), v.l === 'hi' ? 'hindi हिंदी' : 'english', dur].join(' '));
      const bs = BADGES.get(v.id) || [];
      // the facts, real where the course page gives them, else the dummy stand-ins (see DUMMY)
      const fam = t.k === 'top' ? (TREE.find(x => x.kids.includes(c.f)) || {}).k : t.k;
      const dum = [], n = dummyN++;
      let st = FORCE_START.has(v.id) ? '' : startTxt(v); if (!st) { st = DUMMY.start[n % DUMMY.start.length]; dum.push('start'); }
      // the start date split into its label and its date, for the block that leads the facts
      const sm = st.match(/^(Starts|Started)\s+(.+)$/), sLbl = sm ? (sm[1] === 'Started' ? 'Batch started' : 'Batch starts') : 'Batch starts', sVal = sm ? sm[2] : 'To be announced';
      let du = dur; if (!du) { du = DUMMY.dur[fam] || '3 Months'; dum.push('dur'); }
      let tm = timeTxt(v); if (!tm) { tm = TESTS.has(fam) ? DUMMY.time.tests : DUMMY.time.classes[n % DUMMY.time.classes.length]; dum.push('time'); }
      let fq = freqOf(v); if (!fq) { fq = TESTS.has(fam) ? DUMMY.freq.tests : (fam === 'mentorship' || fam === 'interview') ? DUMMY.freq.guided : DUMMY.freq.classes; dum.push('freq'); }
      if (!/announc/i.test(tm)) tm = `${fq} · ${compactTime(tm)}`;
      if (DUM_BADGE.has(v.id)) dum.push('badge');
      // (the mode, left off on 2026-11-18, is back under the time, also 2026-11-18)
      return `<li class="cf-k" data-mode="${v.k}" data-lang="${v.l}" data-sub="${c.s || ''}" data-badge="${bs.join(' ')}" data-up="${sm && sm[1] === 'Starts' ? 1 : 0}" data-start="${startKey(sVal)}" data-yr="${yearsOf(v).join(' ')}"${dum.length ? ` data-dummy="${dum.join(' ')}"` : ''} data-q="${esc(q)}"><a class="cf-k__a" href="${esc(v.u)}" target="_blank" rel="noopener">
        <span class="cf-k__pic"><img src="${v.i}" alt="" loading="lazy" decoding="async" width="450" height="300"></span>
        <span class="cf-k__b">
          <span class="cf-k__t">${esc(v.t)}</span>
          ${bs.length ? `<span class="cf-k__tags">${bs.map(x => `<span class="cf-badge cf-badge--${x}">${BADGE[x].label}</span>`).join('')}</span>` : ''}
          <span class="cf-k__facts">
            ${fact(I_DUR, esc(du), '')}
            ${fact(I_TIME, esc(tm), '')}
            ${fact(v.k === 'online' ? I_LIVE : I_ROOM, modeTxt(v), '')}
            ${fact(I_FEE, feeTxt(v), 'Fee on request', ' cf-k__f--fee')}
          </span>
        </span>
        <span class="cf-k__ft"><span class="cf-k__start">${I_CAL}<span><small>${sLbl}</small><b>${esc(sVal)}</b></span></span><span class="cf-k__go"><span class="cf-go__l"><span class="cf-go__t">View course</span><span class="cf-go__t" aria-hidden="true">View course</span></span><span class="cf-go__d" aria-hidden="true">${GO_ARW}${GO_ARW}</span></span></span>
      </a></li>`;
    };
    // the chips (user 2026-11-18, "change this to new, trending, bestseller, apply this to all categories"; they were the subjects): the
    // same four in every category, filtering it by the cards' badges; a chip with nothing behind it is greyed out and cannot be chosen
    // Upcoming (user 2026-11-18, "add an upcoming chip too"): the courses whose next batch has yet to start (the card's "Batch starts" date)
    const CHIPS = [['badge:new', 'New'], ['badge:trending', 'Trending'], ['badge:bestseller', 'Bestseller'], ['up:1', 'Upcoming']];
    const chipRow = t => `<div class="cf-chips" role="group" aria-label="Show ${esc(t.label)} courses">
          <button type="button" class="cf-chip" data-f="" aria-pressed="true">All</button>${CHIPS.map(([f, l]) => `<button type="button" class="cf-chip" data-f="${f}" aria-pressed="false">${esc(l)}</button>`).join('')}
        </div>`;
    // a banner in the middle of the list offering a counsellor (user 2026-11-18, "add a banner in the middle to talk to a counselor", then
    // "take a look at the banner in the home page and update it"): the homepage's own (index.html #courses .prog__help, css/ref-port.css):
    // a white card with a thin orange inner rule, the headset (Iconoir's headset-help) in an orange disc, the question, the number and
    // hours, and "Get expert guidance"
    const HELP = `<aside class="cf-help" id="cfHelp" aria-labelledby="cfHelpH">
        <span class="cf-help__ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.4998L3.51493 11.6211C2.62459 11.8437 2 12.6436 2 13.5614V15.4382C2 16.356 2.62459 17.1559 3.51493 17.3785L5.25448 17.8134C5.63317 17.9081 6 17.6217 6 17.2313V11.7683C6 11.3779 5.63317 11.0915 5.25448 11.1862L4 11.4998ZM4 11.4998V11C4 6.58172 7.58172 3 12 3C16.4183 3 20 6.58172 20 11V11.4998M20 11.4998L20.4851 11.6211C21.3754 11.8437 22 12.6436 22 13.5614V15.4382C22 16.356 21.3754 17.1559 20.4851 17.3785L20 17.4998M20 11.4998L18.7455 11.1862C18.3668 11.0915 18 11.3779 18 11.7683V17.2313C18 17.6217 18.3668 17.9081 18.7455 17.8134L20 17.4998M15 20.5H18C19.1046 20.5 20 19.6046 20 18.5V18V17.4998M15 20.5C15 19.6716 14.3284 19 13.5 19H10.5C9.67157 19 9 19.6716 9 20.5C9 21.3284 9.67157 22 10.5 22H13.5C14.3284 22 15 21.3284 15 20.5Z"/></svg></span>
        <div class="cf-help__tx">
          <h2 class="cf-help__h" id="cfHelpH">Not sure which programme is right for you?</h2>
          <p class="cf-help__p">Speak with our academic counsellors. <a href="tel:+918062206330">080-6220-6330</a><span class="cf-help__hrs"><i aria-hidden="true"> · </i>Mon – Sat, 9 AM – 7 PM</span></p>
        </div>
        <a class="bt bt--brand cf-help__cta" href="index.html#contact">Get expert guidance<span class="sq"></span></a>
      </aside>`;
    const secHTML = TREE.map(t => {
      const items = D.courses.filter(c => t.kids.includes(c.f)).flatMap(c => c.v.map(v => [c, v]));
      if (!items.length) return '';
      const car = `<div class="cf-car">
          <ul class="cf-grid">${items.map(([c, v]) => card(c, v, t)).join('')}</ul>
          <button type="button" class="cf-arw cf-arw--prev" data-dir="-1" aria-label="Previous ${esc(t.label)} courses" hidden>${CHEV(-1)}</button>
          <button type="button" class="cf-arw cf-arw--next" data-dir="1" aria-label="More ${esc(t.label)} courses" hidden>${CHEV(1)}</button>
        </div>`;
      return `<section class="cf-sec" id="cat-${t.k}" aria-labelledby="cath-${t.k}">
        <div class="cf-sec__top">${bookFor(t.k, t.label, items.length)}<div class="cf-sec__txt">
        <h2 class="cf-sec__h" id="cath-${t.k}"><span class="cf-sec__name">${esc(t.label)}</span>${NEW.has(t.k) ? ' <span class="cf-new">New</span>' : ''}<span class="cf-sec__n" data-total="${items.length}">${items.length} ${items.length === 1 ? 'course' : 'courses'}</span></h2>
        ${ABOUT[t.k] ? `<div class="cf-sec__about"><p class="cf-sec__d">${esc(ABOUT[t.k][0])}</p><p class="cf-sec__who"><b>Who it’s for</b> ${esc(ABOUT[t.k][1])}</p></div>` : ''}
        </div></div>
        ${chipRow(t)}
        ${car}
      </section>`;
    });
    // Vajiram's Top Picks (user 2026-11-18, "change our flagship courses to Vajiram's top picks; this section will show some of the top
    // picks and best selling courses"): the banner on the homepage's flagship ground, now ahead of every category, holding the courses
    // the homepage itself puts forward: the flagship GS programme (index.html #gs, both modes), "What's trending" (index.html #trending:
    // PowerUp Prelims Test Series) and the "Next batches" tickets from the Figma (Prelims CAMP, SMART Prelims, SMART). Bestsellers join
    // when the user names them (BADGE.bestseller in js/course-finder.js). The cards also stay in their own categories.
    // (TOP_IDS is set with the badges, above the cards, so Our Top Picks gets all three badges too)
    const famOf = f => TREE.find(x => x.kids.includes(f));
    const tops = TOP_IDS.map(id => { for (const c of D.courses) { const v = c.v.find(x => x.id === id); if (v) return [c, v]; } return null; }).filter(Boolean);
    const TOP_T = { k: 'top', label: 'Our Popular Courses' };   // was "Vajiram's Top Picks" (2026-11-18), "Our Top Picks"; heading "Top Picks" with a count badge (user 2026-11-21)
    const TOP_HTML = tops.length ? `<section class="cf-sec cf-feat" id="cat-top" data-top="1" aria-labelledby="cath-top">
        <div class="cf-feat__flow" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
        <div class="cf-feat__cuts" aria-hidden="true"><img class="cut--l" src="assets/img/photos/collage.png" alt="" decoding="async"><img class="cut--r" src="assets/img/photos/collage.png" alt="" decoding="async"></div>
        <div class="cf-feat__intro">
          <span class="cf-feat__lockup"><span class="cf-feat__brand"><img class="cf-feat__logo" src="assets/img/brand/emblem.png" alt="Vajiram &amp; Ravi" width="222" height="227" decoding="async"></span></span>   <!-- the Vajiram & Ravi emblem over the eyebrow (user 2026-11-21) -->
          <h2 class="cf-sec__h cf-feat__h" id="cath-top"><span class="cf-sec__name">Our Popular Courses</span></h2>
          <p class="cf-feat__sub">Our best and most popular courses, the ones aspirants join year after year. Unsure where to begin your UPSC preparation? Start here.</p>
        </div>
        <div class="cf-car">
          <ul class="cf-grid">${tops.map(([c, v]) => card(c, v, famOf(c.f) || TOP_T)).join('')}</ul>
          <button type="button" class="cf-arw cf-arw--prev" data-dir="-1" aria-label="Previous popular courses" hidden>${CHEV(-1)}</button>
          <button type="button" class="cf-arw cf-arw--next" data-dir="1" aria-label="More popular courses" hidden>${CHEV(1)}</button>
          <div class="cf-dots" aria-label="Popular courses pages" hidden></div>   <!-- carousel dots under the cards (review 2026-11-24) -->
        </div>
      </section>` : '';
    list.innerHTML = '<nav class="cf-rail" id="cfRail" aria-label="Course categories"></nav><div class="cf-list__main">'
      + TOP_HTML + secHTML.filter(Boolean).join('') + HELP + '</div>';   // the counsellor banner after the last category (user 2026-11-18, "move this banner to the bottom"; it sat after the 6th)
    // each card's place in its row, so a chip can put the row back after Upcoming has sorted it
    list.querySelectorAll('.cf-grid').forEach(g => [...g.children].forEach((k, i) => { k.dataset.i = i; }));
    // no All / New / Trending / Bestseller / Upcoming chips in any category (user 2026-11-24, "just remove it from all"); the
    // search and the mode, medium and target-year filters in the bar still narrow every category
    list.querySelectorAll('.cf-chips').forEach(row => row.remove());

    // the bar's search and tabs filter every category; a category with nothing left is hidden, and its subject chips with nothing left too
    // (Duration, Class time and Fee were filters too, removed by the user on 2026-11-18; Mode and Medium are dropdowns beside Target year)
    const state = { q: [], mode: '', lang: '', yr: '' };
    const FILTERS = [
      { key: 'yr', label: 'Target year', opts: [['2026', 'CSE 2026'], ['2027', 'CSE 2027'], ['2028', 'CSE 2028']],
        test: (k, v) => k.dataset.yr.split(' ').includes(v) }
    ];
    const passes = k => (!state.mode || k.dataset.mode === state.mode || k.dataset.mode === 'both')
      && (!state.lang || k.dataset.lang === state.lang) && state.q.every(w => k.dataset.q.includes(w))
      && FILTERS.every(f => !state[f.key] || f.test(k, state[f.key]));
    // each section's courses sit in one row that scrolls sideways (user 2026-11-18, a udemy.com course row as the reference): round
    // arrow buttons at its two ends, each shown only while there is more that way
    // how far one dot moves the row: as many whole cards as fit (two on desktop, one on phones), from the cards' spacing
    const pageStep = tr => {
      const ks = $$('.cf-k:not([hidden])', tr), pitch = ks.length > 1 ? ks[1].offsetLeft - ks[0].offsetLeft : tr.clientWidth;
      const per = Math.max(1, Math.floor((tr.clientWidth + 8) / pitch));
      return { pitch, w: per * pitch };
    };
    const arrows = sec => {
      const tr = $('.cf-grid', sec), max = tr.scrollWidth - tr.clientWidth;
      $('.cf-arw--prev', sec).hidden = tr.scrollLeft <= 2;
      $('.cf-arw--next', sec).hidden = tr.scrollLeft >= max - 2;
      // carousel dots (Popular Courses): one per screenful the arrows step through, the current one drawn as a pill
      const dots = $('.cf-dots', sec);
      if (dots) {
        const step = pageStep(tr), shown = $$('.cf-k:not([hidden])', tr).length;
        const pages = max <= 2 ? 1 : Math.max(2, Math.ceil(shown * step.pitch / step.w - .05));
        const at = tr.scrollLeft >= max - 2 ? pages - 1 : Math.min(pages - 1, Math.round(tr.scrollLeft / step.w));
        if (dots.children.length !== pages) dots.innerHTML = Array.from({ length: pages }, (_, i) =>
          `<button type="button" class="cf-dot" data-page="${i}" aria-label="Page ${i + 1} of ${pages}"></button>`).join('');
        dots.hidden = pages < 2;
        [...dots.children].forEach((d, i) => d.setAttribute('aria-current', String(i === at)));
      }
      // Top Picks: the card cut by the row's right edge fades out across the part still showing (user 2026-11-21, the card's
      // own opacity through a gradient mask, no overlay); --vis is how much of it shows. The card cut by the left edge once the
      // row is scrolled does the same, mirrored (.is-peek-l)
      if (sec.dataset.top) {
        const { left: L, right: R } = tr.getBoundingClientRect();
        $$('.cf-k', tr).forEach(k => {
          const r = k.getBoundingClientRect(), on = !k.hidden;
          const pr = on && r.left < R - 1 && r.right > R + 1, pl = on && !pr && r.left < L - 1 && r.right > L + 1;
          k.classList.toggle('is-peek', pr); k.classList.toggle('is-peek-l', pl);
          if (pr || pl) k.style.setProperty('--vis', `${Math.round(pr ? R - r.left : r.right - L)}px`); else k.style.removeProperty('--vis');
        });
      }
    };
    const layout = sec => {
      const all = $$('.cf-k', sec), ok = all.filter(passes);
      // a badge chip with no such course left (after the search and tabs) is greyed out; if it was the chosen one, All is chosen again
      const has = (k, ck, cv) => (k.dataset[ck] || '').split(' ').includes(cv);
      $$('.cf-chip[data-f*=":"]', sec).forEach(c => { const [ck, cv] = c.dataset.f.split(':'); c.disabled = !ok.some(k => has(k, ck, cv)); });
      // only the chips this category has courses for are shown (user 2026-11-21, "lets only the chips that are available for that
      // catagory"); with none of them left, "All" alone says nothing, so the row goes too
      const fchips = $$('.cf-chip[data-f*=":"]', sec);
      fchips.forEach(c => { c.hidden = c.disabled; });
      const crow = $('.cf-chips', sec); if (crow) crow.hidden = fchips.every(c => c.disabled);
      const on = $('.cf-chip[aria-pressed="true"]', sec);
      if (on && on.disabled) { $$('.cf-chip', sec).forEach(c => c.setAttribute('aria-pressed', String(!c.dataset.f))); sec.dataset.f = ''; }
      const f = sec.dataset.f || '', [key, val] = f.split(':');
      const match = ok.filter(k => !f || has(k, key, val));
      // Upcoming (user 2026-11-18, "show the course that starts first to the current date"): its courses in date order, the soonest
      // first; any other chip puts the row back in its own order
      const grid = $('.cf-grid', sec);
      [...all].sort((a, b) => f === 'up:1' ? (+a.dataset.start - +b.dataset.start) || (a.dataset.i - b.dataset.i) : a.dataset.i - b.dataset.i).forEach(k => grid.appendChild(k));
      all.forEach(k => { k.hidden = !match.includes(k); });
      sec.hidden = !ok.length;
      const cnt = $('.cf-sec__n', sec);
      if (cnt) { const all = +cnt.dataset.total, n = ok.length; cnt.textContent = n === all ? `${all} ${all === 1 ? 'course' : 'courses'}` : `${n} of ${all} courses`; }
      // Top Picks carries its number in the headline, "Our 6 Top Picks" (user 2026-11-20, "remove this and incorperate the 6 courses in
      // the main headline"), counting the picks the search and filters leave
      const num = $('.cf-feat__num', sec);
      if (num) { num.textContent = ok.length; $('.cf-feat__pl', sec).textContent = ok.length === 1 ? 'Pick' : 'Picks'; }
      const tr = $('.cf-grid', sec); tr.scrollLeft = 0;
      even(sec);
      arrows(sec);
      return ok.length;
    };
    // every card in a section keeps the height of its tallest course, shown or not (user 2026-11-21: switching chips in Top Picks
    // changed the card height); measured with all the cards in, then the filter's hidden state put back. --kh is the min-height
    const even = sec => {
      if (sec.hidden) return;
      const grid = $('.cf-grid', sec), all = $$('.cf-k', grid), was = all.map(k => k.hidden);
      grid.style.removeProperty('--kh');
      all.forEach(k => { k.hidden = false; });
      const h = Math.max(0, ...all.map(k => k.getBoundingClientRect().height));
      all.forEach((k, i) => { k.hidden = was[i]; });
      if (h) grid.style.setProperty('--kh', `${Math.ceil(h)}px`);
    };
    const count = $('#cfCount'), empty = $('#cfEmpty');
    const layoutAll = () => {
      const n = $$('.cf-sec', list).reduce((s, sec) => { const m = layout(sec); return s + (sec.dataset.top ? 0 : m); }, 0);
      const first = $('.cf-sec:not([hidden])', list);
      $$('.cf-sec', list).forEach(s => s.classList.toggle('is-first', s === first));
      if (empty) empty.hidden = n > 0;
      const help = $('#cfHelp'); if (help) help.hidden = !n;
      if (count) count.textContent = n ? `${n} course${n === 1 ? '' : 's'} shown` : 'No courses match.';
      list.dispatchEvent(new Event('cf:layout'));
    };
    layoutAll();

    // the cards' entrance (user 2026-11-18, "when the screen loads every card in the view port should do a horizontal flip ... smooth and
    // subtle"): each card in view on load turns in on its upright axis, one after another, top row first and left to right. Marked before
    // the first paint so none shows early; the class comes off when its turn ends (a timer too, in case the animation never reports)
    if (!reduce) {
      const vh = innerHeight, seen = $$('.cf-k', list).filter(k => {
        if (k.hidden || k.closest('.cf-sec').hidden) return false;
        const r = k.getBoundingClientRect(), g = k.closest('.cf-grid').getBoundingClientRect();
        return r.width && r.top < vh && r.bottom > 0 && r.left < g.right - 8 && r.right > g.left + 8;
      }).sort((a, b) => { const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return (ra.top - rb.top) || (ra.left - rb.left); });
      seen.forEach((k, i) => {
        const ms = 120 + i * 80;
        k.style.setProperty('--fd', ms + 'ms'); k.classList.add('is-flipin');
        const done = () => { k.classList.remove('is-flipin'); clearTimeout(k._fi); };
        $('.cf-k__a', k).addEventListener('animationend', done, { once: true }); k._fi = setTimeout(done, ms + 1400);
      });
    }

    // the cards tilt toward the pointer like the homepage's batch tickets (js/content.js): where the pointer is sets the tilt and the glare
    if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
      list.addEventListener('pointermove', e => {
        const k = e.target.closest('.cf-k'); if (!k) return;
        const r = k.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        k.style.setProperty('--tx', (px - .5).toFixed(3)); k.style.setProperty('--ty', (py - .5).toFixed(3));
        k.style.setProperty('--gx', (px * 100).toFixed(0) + '%'); k.style.setProperty('--gy', (py * 100).toFixed(0) + '%');
      });
      list.addEventListener('pointerout', e => { const k = e.target.closest('.cf-k'); if (k && !k.contains(e.relatedTarget)) { k.style.setProperty('--tx', 0); k.style.setProperty('--ty', 0); } });
    }

    // the books' horizontal flip (user 2026-11-18, "it should do the horizontal flip"): a full turn on the upright axis, once as each
    // section comes into view and again whenever a book is hovered; .is-flip comes off when the turn ends (a timer too, in case
    // the animation never reports, as in a hidden tab)
    const flip = b => {
      if (reduce || b.classList.contains('is-flip')) return;
      b.classList.add('is-flip');
      const done = () => { b.classList.remove('is-flip'); clearTimeout(b._ft); };
      b.addEventListener('animationend', done, { once: true }); b._ft = setTimeout(done, 1200);
    };
    $$('.cf-bk', list).forEach(b => b.addEventListener('mouseenter', () => flip(b)));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); setTimeout(() => flip(e.target), 250); } }), { threshold: .6 });
      $$('.cf-bk', list).forEach(b => io.observe(b));
    }
    // the Top Picks book turns again every 4s (user 2026-11-21), only while it is on screen and the tab is showing
    const topBk = $('.cf-feat__book .cf-bk', list);
    if (topBk && !reduce) {
      let seen = !('IntersectionObserver' in window);
      if (!seen) new IntersectionObserver(es => { seen = es[0].isIntersecting; }).observe(topBk);
      setInterval(() => { if (seen && !document.hidden) flip(topBk); }, 4000);
    }
    list.addEventListener('click', e => {
      const chip = e.target.closest('.cf-chip');
      if (chip) {
        const sec = chip.closest('.cf-sec');
        $$('.cf-chip', sec).forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
        sec.dataset.f = chip.dataset.f; layout(sec); return;
      }
      const dot = e.target.closest('.cf-dot');
      if (dot) {   // a dot scrolls the row to that screenful
        const tr = $('.cf-grid', dot.closest('.cf-sec'));
        tr.scrollTo({ left: Math.min(+dot.dataset.page * pageStep(tr).w, tr.scrollWidth - tr.clientWidth), behavior: reduce ? 'auto' : 'smooth' });
        return;
      }
      const arw = e.target.closest('.cf-arw');
      if (arw) {   // one screenful of cards at a time
        const tr = $('.cf-grid', arw.closest('.cf-sec'));
        tr.scrollBy({ left: +arw.dataset.dir * tr.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
    $$('.cf-sec', list).forEach(sec => $('.cf-grid', sec).addEventListener('scroll', () => arrows(sec), { passive: true }));
    addEventListener('resize', () => $$('.cf-sec', list).forEach(s => { even(s); arrows(s); }));
    if (document.fonts) document.fonts.ready.then(() => $$('.cf-sec', list).forEach(even));   // card heights settle once the web fonts are in

    /* ---------- the bar: sticks under the nav, or at the top while the nav is slid away (.is-away, js/site-nav.js) ---------- */
    const bar = $('#cfBar'), navEl = $('#nav') || $('.rn'), q = $('#cfQ'), qx = $('#cfQx');
    const mark = document.createElement('div'); mark.className = 'cf-bar-mark'; mark.setAttribute('aria-hidden', 'true');
    if (bar) bar.before(mark);
    const navOff = () => (!navEl || navEl.classList.contains('is-away') || navEl.classList.contains('is-open')) ? 0
      : (parseFloat(getComputedStyle(navEl).top) || 0) + navEl.offsetHeight + 12;
    const pin = () => {
      if (!bar) return;
      const off = navOff();
      document.documentElement.style.setProperty('--cf-navoff', off + 'px');
      bar.classList.toggle('is-stuck', mark.getBoundingClientRect().top < off + 1);
    };
    addEventListener('scroll', pin, { passive: true }); addEventListener('resize', pin); pin();
    if (navEl) new MutationObserver(pin).observe(navEl, { attributes: true, attributeFilter: ['class'] });
    // after a change, a stuck bar brings the list back to its start, so the first results are in view
    const toStart = () => {
      if (!bar || !bar.classList.contains('is-stuck')) return;
      scrollTo({ top: mark.getBoundingClientRect().top + scrollY - navOff(), behavior: 'auto' });
    };
    const apply = () => { layoutAll(); toStart(); };
    if (q) q.addEventListener('input', () => {
      state.q = fold(q.value).split(/\s+/).filter(Boolean); qx.hidden = !q.value; apply();
    });
    if (q) q.addEventListener('keydown', e => { if (e.key === 'Escape' && q.value) { q.value = ''; q.dispatchEvent(new Event('input')); } });
    if (qx) qx.addEventListener('click', () => { q.value = ''; q.dispatchEvent(new Event('input')); q.focus(); });
    // the mode and medium tabs: the homepage's (js/life-gallery.js): the brand pill springs to the chosen tab; arrow keys move along
    const placeInd = (seg, instant) => {
      const ind = $('.cf-seg__ind', seg), sel = $('.cf-seg__b[aria-selected="true"]', seg); if (!ind || !sel) return;
      ind.classList.toggle('is-instant', !!instant);
      ind.style.transform = `translateX(${sel.offsetLeft}px)`; ind.style.width = sel.offsetWidth + 'px';
      if (instant) { void ind.offsetWidth; ind.classList.remove('is-instant'); }
    };
    const pickTab = (seg, b) => {
      $$('.cf-seg__b', seg).forEach(x => { const on = x === b; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
      placeInd(seg, reduce);
      state[seg.dataset.key] = b.dataset.v;
    };
    $$('.cf-seg').forEach(seg => {
      placeInd(seg, true);
      seg.addEventListener('click', e => { const b = e.target.closest('.cf-seg__b'); if (b) { pickTab(seg, b); apply(); } });
      seg.addEventListener('keydown', e => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
        const tabs = $$('.cf-seg__b', seg), k = tabs.findIndex(x => x.getAttribute('aria-selected') === 'true'), nx = tabs[(k + d + tabs.length) % tabs.length];
        pickTab(seg, nx); apply(); nx.focus(); e.preventDefault();
      });
    });
    addEventListener('resize', () => $$('.cf-seg').forEach(seg => placeInd(seg, true)));
    if (document.fonts) document.fonts.ready.then(() => $$('.cf-seg').forEach(seg => placeInd(seg, true)));
    /* ---------- the bar's filters: duration, target year, class time and fee (user 2026-11-18), dropdowns beside the Mode and Medium
       tabs. Each option shows how many courses it holds (counted once, across the categories); a course that does not state that fact
       is left out while the filter is set. "Clear filters" appears while any is set. ---------- */
    const cards = $$('.cf-sec:not([data-top]) .cf-k', list);
    // Mode and Medium as dropdowns too (user 2026-11-18, "all filters can be drop down"; they were tabs)
    const DROPS = [
      { key: 'mode', label: 'Mode', opts: [['classroom', 'Classroom'], ['online', 'LIVE-Online']], test: (k, v) => k.dataset.mode === v || k.dataset.mode === 'both' },
      { key: 'lang', label: 'Medium', opts: [['en', 'English'], ['hi', 'हिंदी']], test: (k, v) => k.dataset.lang === v }
    ].concat(FILTERS);
    const CHEV_D = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9L12 15L18 9"/></svg>';
    const filt = $('#cfFilt');
    if (filt) {
      // Iconoir's xmark-circle (solid)
      const X_CIRCLE = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM9.70164 8.64124C9.40875 8.34835 8.93388 8.34835 8.64098 8.64124C8.34809 8.93414 8.34809 9.40901 8.64098 9.7019L10.9391 12L8.64098 14.2981C8.34809 14.591 8.34809 15.0659 8.64098 15.3588C8.93388 15.6517 9.40875 15.6517 9.70164 15.3588L11.9997 13.0607L14.2978 15.3588C14.5907 15.6517 15.0656 15.6517 15.3585 15.3588C15.6514 15.0659 15.6514 14.591 15.3585 14.2981L13.0604 12L15.3585 9.7019C15.6514 9.40901 15.6514 8.93414 15.3585 8.64124C15.0656 8.34835 14.5907 8.34835 14.2978 8.64124L11.9997 10.9393L9.70164 8.64124Z"/></svg>';
      // .cf-sel__o is the field's outline with a gap cut for the name (a fieldset and its legend), so the name sits on the bar's own
      // paper rather than on a patch painted to hide the line (user 2026-11-20, "there is some kind of box behind the dropdown")
      filt.innerHTML = DROPS.map(f => `<label class="cf-sel" data-key="${f.key}"><fieldset class="cf-sel__o" aria-hidden="true"><legend>${f.label}</legend></fieldset><span class="cf-sel__l">${f.label}</span><select data-key="${f.key}"><option value="">Any</option>${f.opts.map(([v, l]) => {
        const n = cards.filter(k => f.test(k, v)).length;
        return `<option value="${v}"${n ? '' : ' disabled'}>${l} (${n})</option>`;
      }).join('')}</select>${CHEV_D}<button type="button" class="cf-sel__x" data-key="${f.key}" aria-label="Clear ${f.label}">${X_CIRCLE}</button></label>`).join('') + '<button type="button" class="cf-filt__clear" id="cfFiltX" hidden>Clear filters</button>';
      // a picked dropdown swaps its chevron for a clear button (user 2026-11-18, a "Blog ⊗" chip as the reference) that empties just that one
      filt.addEventListener('click', e => {
        const x = e.target.closest('.cf-sel__x');
        // the split-button field (user 2026-11-21): a click anywhere on it, its name or its chevron segment, opens the menu, not only a
        // click on the choice itself
        if (!x) { const lab = e.target.closest('.cf-sel'); if (lab && e.target.tagName !== 'SELECT') { const s = $('select', lab); try { s.showPicker(); } catch (_) { s.focus(); } } return; }
        e.preventDefault();
        const s = $(`select[data-key="${x.dataset.key}"]`, filt);
        state[x.dataset.key] = ''; s.value = ''; sync(); apply(); s.focus();
      });
      const sync = () => {
        $$('.cf-sel', filt).forEach(l => l.classList.toggle('is-on', !!state[l.dataset.key]));
        $('#cfFiltX').hidden = !DROPS.some(f => state[f.key]);
      };
      filt.addEventListener('change', e => { const s = e.target.closest('select'); if (!s) return; state[s.dataset.key] = s.value; sync(); apply(); });
      $('#cfFiltX').addEventListener('click', () => { clearFilters(); apply(); });
      window.__cfSyncFilt = sync;
    }
    function clearFilters() {
      DROPS.forEach(f => { state[f.key] = ''; });
      $$('#cfFilt select').forEach(s => { s.value = ''; });
      if (window.__cfSyncFilt) window.__cfSyncFilt();
    }
    const reset = $('#cfReset');
    if (reset) reset.addEventListener('click', () => {
      $$('.cf-seg').forEach(seg => pickTab(seg, $('.cf-seg__b', seg)));
      clearFilters();
      q.value = ''; state.q = []; qx.hidden = true; apply();
    });

    // the nav's course menus (js/site-nav.js) and #cat=… links scroll to that category's section, clear of the bar
    const go = (k, smooth = true) => {
      const id = k === 'all' ? null : (k === 'gs-11' || k === 'gs-2yr') ? 'gs' : k;   // GS Foundation is its own section again
      const el = id ? $(`#cat-${id}`) : list;
      if (!el || el.hidden) return;
      const y = el.getBoundingClientRect().top + scrollY;
      // clear of the fixed nav AND the sticky search bar under it (the bar's sticky top is the nav's height)
      const off = bar ? (parseFloat(getComputedStyle(bar).top) || 0) + bar.offsetHeight : 0;
      const top = y - off - 24;
      // 'instant', not 'auto': the page sets scroll-behavior: smooth, which made link jumps a slow glide that stopped short
      scrollTo({ top, behavior: smooth && !reduce ? 'smooth' : 'instant' });
    };
    window.__cfSetCat = k => { history.replaceState(null, '', `#cat=${k}`); go(k); };
    const m = location.hash.match(/^#cat=([\w-]+)/);
    // a #cat= link from another page: jump now, then again once images and fonts have settled the layout (they push sections down),
    // unless the visitor has scrolled in between (user 2026-11-23: links from the homepage nav landed past their section)
    if (m) {
      let moved = false; const mark = () => { moved = true; };
      setTimeout(() => { go(m[1], false); setTimeout(() => addEventListener('wheel', mark, { once: true, passive: true }), 50); }, 0);
      const again = () => { if (!moved) go(m[1], false); };
      addEventListener('load', again, { once: true });
      if (document.fonts) document.fonts.ready.then(again);
      setTimeout(again, 900); setTimeout(again, 1800);
    }

    /* ---------- the category rail (user 2026-11-18, a wireframe: "an indicator for the user to find the categories ... when the user
       hovers over it they can see all the other categories, and by clicking on one they can go to it"): a slim column on the left of
       the course list, held halfway down the screen. A short line for every section, the one being read longer and in the brand colour,
       and beside them the book of the category being read, which flips as it changes. Hovering the rail (or pressing the book) opens a
       list of every category, its cloth colour and its number of courses; choosing one scrolls to it. On tablets and phones it floats at the screen's left edge and opens with a tap. ---------- */
    const rail = $('#cfRail');
    if (rail) {
      const secs = $$('.cf-sec', list).map(s => {
        const k = s.id.slice(4), name = k === 'top' ? 'Our Popular Courses' : $('.cf-sec__name', s).textContent.trim(), n = +($('.cf-sec__n', s) || {}).dataset?.total || $$('.cf-k', s).length;
        return { k, s, name, n, book: k === 'top' ? 'Top Picks' : (TREE.find(t => t.k === k) || {}).label || name };
      });
      rail.innerHTML = `<div class="cf-rail__in">
          <button type="button" class="cf-rail__btn" aria-expanded="false" aria-controls="cfRailPanel"><span class="vh">Categories, now showing: </span><span class="cf-rail__now"></span><ol class="cf-rail__ticks" aria-hidden="true">${secs.map(x => `<li data-k="${x.k}"></li>`).join('')}</ol></button>
          <div class="cf-rail__panel" id="cfRailPanel">
            <p class="cf-rail__h">Categories</p>
            <ul>${secs.map(x => `<li><button type="button" class="cf-rail__go" data-k="${x.k}"><i style="background:${(COVER[x.k] || COVER.top).base}"></i><span>${esc(x.name)}</span><b>${x.n}</b></button></li>`).join('')}</ul>
          </div>
        </div>`;
      const btn = $('.cf-rail__btn', rail), nowTxt = $('.cf-rail__now', rail);
      let cur = '';
      const show = k => {
        if (k === cur) return; cur = k;
        const x = secs.find(y => y.k === k); if (!x) return;
        $$('.cf-rail__ticks li', rail).forEach(li => li.classList.toggle('is-on', li.dataset.k === k));
        $$('.cf-rail__go', rail).forEach(b => b.toggleAttribute('aria-current', b.dataset.k === k));
        nowTxt.textContent = x.name;
      };
      // which section is being read: the last one whose top has passed a line just under the sticky bar
      const spy = () => {
        // measured at the rail's own book (user 2026-11-18, "the book should change to the GS book when it reaches the GS headline and
        // stay until the divider line"): a section is the current one from when its heading comes level with the book until the next
        // section's top, its divider line, gets there
        const rb = btn.getBoundingClientRect(), line = rb.height ? rb.top + rb.height / 2 : (bar ? bar.getBoundingClientRect().bottom : 0) + 140;   // (measured at the book until it left the rail, 2026-11-18)
        let k = secs[0].k;
        for (const x of secs) { if (x.s.hidden) continue; if (x.s.getBoundingClientRect().top <= line) k = x.k; else break; }
        show(k);
        // the list's sections hidden by the filters are dimmed in the panel
        $$('.cf-rail__go', rail).forEach(b => { b.disabled = $('#cat-' + b.dataset.k).hidden; });
        $$('.cf-rail__ticks li', rail).forEach(li => li.classList.toggle('is-off', $('#cat-' + li.dataset.k).hidden));
        // on tablets and phones the rail floats at the screen's edge (user 2026-11-19, "bring the same line indicator in mobile as
        // well"), shown only while the course list is what's being read
        const lr = list.getBoundingClientRect(), mid = innerHeight / 2;
        rail.classList.toggle('is-shown', lr.top < mid && lr.bottom > mid);
        if (!rail.classList.contains('is-shown')) open(false);
      };
      // (openedAt: a tap fires focus, which opens the list, and then click; the click must not close it again straight away)
      let openedAt = 0;
      const open = on => {
        if (on && !rail.classList.contains('is-open')) openedAt = performance.now();
        rail.classList.toggle('is-open', on); btn.setAttribute('aria-expanded', String(on));
        if (on) fit();
      };
      // the open list stays between the sticky search bar and the bottom of the screen (user 2026-11-21: it opened centred on the
      // lines and its top half went under the bar): --py nudges it from that centred spot, --ph caps its height (it scrolls)
      const panel = $('.cf-rail__panel', rail), barEl = $('#cfBar'), navEl2 = $('#nav');
      const fit = () => {
        if (!panel || !panel.offsetParent) return;
        panel.style.removeProperty('--ph'); panel.classList.remove('is-capped');
        const gap = 12, top = Math.max(0, barEl ? barEl.getBoundingClientRect().bottom : 0, navEl2 ? navEl2.getBoundingClientRect().bottom : 0) + gap;
        const room = innerHeight - gap - top, h = Math.min(panel.offsetHeight, room);
        if (panel.offsetHeight > room) { panel.style.setProperty('--ph', `${Math.max(160, room)}px`); panel.classList.add('is-capped'); }
        const cb = panel.offsetParent.getBoundingClientRect(), mid = cb.top + panel.offsetTop;   // where top:50% puts its centre
        const want = Math.min(Math.max(mid - h / 2, top), innerHeight - gap - h);
        panel.style.setProperty('--py', `${Math.round(want - (mid - h / 2))}px`);
      };
      addEventListener('scroll', () => { if (rail.classList.contains('is-open')) fit(); }, { passive: true });
      addEventListener('scroll', spy, { passive: true }); addEventListener('resize', spy);
      list.addEventListener('cf:layout', spy);
      spy(); rail.classList.add('is-ready');
      // the list opens only from the lines (user 2026-11-18, "the list should only open when hovered over the lines"): hovering them,
      // or tabbing to them; it stays open while the pointer crosses the book to it, and closes when the pointer leaves the rail
      btn.addEventListener('mouseenter', () => open(true));
      btn.addEventListener('focus', () => open(true));
      btn.addEventListener('click', () => { if (performance.now() - openedAt > 400) open(!rail.classList.contains('is-open')); });
      // a tap anywhere else closes it (touch screens have no pointer leaving the rail)
      document.addEventListener('pointerdown', e => { if (rail.classList.contains('is-open') && !rail.contains(e.target)) open(false); });
      rail.addEventListener('mouseleave', () => open(false));
      // (only when focus moves to something else on the page: the window losing focus is no reason to close it)
      rail.addEventListener('focusout', e => { if (e.relatedTarget && !rail.contains(e.relatedTarget)) open(false); });
      rail.addEventListener('keydown', e => { if (e.key === 'Escape') { open(false); btn.focus(); } });
      rail.addEventListener('click', e => { const g = e.target.closest('.cf-rail__go'); if (!g) return; open(false); window.__cfSetCat(g.dataset.k); });
    }
  }

  /* ---------- buttons: the homepage's rolling label and sliding arrows (from js/page-motion.js), for .bt buttons such as the nav menus' ---------- */
  const ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8h11"/><path d="M8.6 3.6C9.4 5.9 11.2 7.4 13.5 8 11.2 8.6 9.4 10.1 8.6 12.4"/></svg>';
  const enhance = el => {
    if (el.dataset.cta) return; el.dataset.cta = '1'; el.classList.add('cta');
    const sq = el.querySelector(':scope > .sq'), rest = [...el.childNodes].filter(n => n !== sq);
    const html = rest.map(n => n.nodeType === 1 ? n.outerHTML : n.textContent).join('').trim(); rest.forEach(n => n.remove());
    const label = document.createElement('span'); label.className = 'btn__label';
    label.innerHTML = `<span class="btn__t">${html}</span><span class="btn__t" aria-hidden="true">${html}</span>`;
    el.insertBefore(label, sq || null); if (sq) sq.innerHTML = ARROW + ARROW;
  };
  const scan = r => (r.matches && r.matches('.bt') ? [r] : []).concat(r.querySelectorAll ? [...r.querySelectorAll('.bt')] : []).forEach(enhance);
  scan(document);
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) scan(n); }))).observe(document.body, { childList: true, subtree: true });
})();
