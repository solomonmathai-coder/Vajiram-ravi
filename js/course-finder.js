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
    const STATS = [[products, 'Courses to choose from'], [categories, 'Categories, Prelims to Interview'], [D.subjects.length, 'Optional subjects taught']];
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
    const NEW = new Set(['interview']);   // shown as new (user 2026-11-17, "let's say Interview Guidance is a new course")
    // Iconoir's nav-arrow-left and nav-arrow-right
    const CHEV = d => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d < 0 ? 'M15 6L9 12L15 18' : 'M9 6L15 12L9 18'}"/></svg>`;
    const modeTxt = v => v.k === 'classroom' ? 'Classroom' : v.k === 'online' ? 'LIVE-Online' : 'Classroom & LIVE-Online';

    const fold = s => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
    const famLabel = Object.fromEntries(D.families.map(f => [f.k, f.label]));
    /* ---------- each category's book beside its heading (user 2026-11-18, "use the books we used in the home and show it near the heading
       and the subheading"): the homepage's cloth-bound programme books (js/programme-shelf.js, css/programme-shelf.css), as course
       finder v1 drew them (commit 6d3d24f): its cloth colours, pressed motif, gold frame, name and emblem; it stands a little turned
       toward the reader, with a band of light crossing it now and then ---------- */
    const FOIL = '#f6c77a';
    const COVER = {
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
      return `<span class="cf-bk ps-book${small ? ' cf-bk--sm' : ''}" aria-hidden="true"><span class="cf-bk__body">
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
      </span></span>`;
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
    const LOGO = '<img class="cf-k__logo" src="assets/img/brand/emblem.png" alt="" width="28" height="28">';
    // the course's length, on its own line with a clock (user 2026-11-18, "introduce course duration to the cards"), as its page gives it,
    // tidied: "02 Months" to "2 Months", "24 weeks" to "24 Weeks", date ranges shortened ("1 Oct – 30 Nov 2026"); where the page gives
    // none (48 courses) the card says so rather than guess
    const CLOCK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6L12 12L18 12"/><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/></svg>';
    const MON = { january: 'Jan', february: 'Feb', march: 'Mar', april: 'Apr', may: 'May', june: 'Jun', july: 'Jul', august: 'Aug', september: 'Sep', october: 'Oct', november: 'Nov', december: 'Dec' };
    const durTxt = d => String(d || '').trim()
      .replace(/\b0(\d)\b/g, '$1')                                            // 02 Months, 01 October
      .replace(/(\d)(?:st|nd|rd|th)\b/g, '$1')                                // 16th November
      .replace(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/gi, m => MON[m.toLowerCase()])
      .replace(/\s+to\s+/gi, ' – ')
      .replace(/^(\d+) (\w{3}) (\d{4}) – (\d+) (\w{3}) \3$/, '$1 $2 – $4 $5 $3')   // one year written once
      .replace(/\b(days?|weeks?|months?|years?)\b/gi, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
    const card = (c, v, t) => {
      const meta = [modeTxt(v), v.l === 'hi' ? '<span lang="hi">हिंदी</span>' : ''].filter(Boolean).join(' · ');
      const dur = durTxt(v.dur);
      // what the search looks through: the course's name, its category, its subject, its mode, its medium and its length
      const q = fold([v.t, t.label, famLabel[c.f], subLabel[c.s], modeTxt(v), v.l === 'hi' ? 'hindi हिंदी' : 'english', dur].join(' '));
      const b = badgeOf(c, v);
      return `<li class="cf-k" data-mode="${v.k}" data-lang="${v.l}" data-sub="${c.s || ''}" data-q="${esc(q)}"><a class="cf-k__a" href="${esc(v.u)}" target="_blank" rel="noopener">
        <span class="cf-k__pic"><img src="${v.i}" alt="" loading="lazy" decoding="async" width="450" height="300">${b ? `<span class="cf-badge cf-badge--${b}">${BADGE[b].label}</span>` : ''}</span>
        <span class="cf-k__b">
          <span class="cf-k__by">${LOGO}<span>Vajiram &amp; Ravi</span></span>
          <span class="cf-k__t">${esc(v.t)}</span>
          <span class="cf-k__dur${dur ? '' : ' is-none'}">${CLOCK}<span>${dur ? esc(dur) : 'Duration on the course page'}</span></span>
          <span class="cf-k__m">${meta}</span>
        </span>
        <span class="cf-k__ft">${v.feeShort ? `<span class="cf-k__fee">${esc(v.feeShort)}<small>incl. GST</small></span>` : ''}<span class="cf-k__go">View course</span></span>
      </a></li>`;
    };
    // the chips: a category taught by subject is split by subject (mode and medium are the bar's tabs, for every category at once)
    const chipsFor = items => {
      const subs = [...new Set(items.map(([c]) => c.s).filter(Boolean))];
      return subs.length > 1 ? subs.sort((a, b) => subLabel[a].localeCompare(subLabel[b])).map(s => [`sub:${s}`, subLabel[s]]) : [];
    };
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
      const chips = chipsFor(items);
      const car = `<div class="cf-car">
          <ul class="cf-grid">${items.map(([c, v]) => card(c, v, t)).join('')}</ul>
          <button type="button" class="cf-arw cf-arw--prev" data-dir="-1" aria-label="Previous ${esc(t.label)} courses" hidden>${CHEV(-1)}</button>
          <button type="button" class="cf-arw cf-arw--next" data-dir="1" aria-label="More ${esc(t.label)} courses" hidden>${CHEV(1)}</button>
        </div>`;
      // GS Foundation, the flagship (user 2026-11-18, "highlight GS since it is their flagship course"; coursera.org's featured
      // certificate rows as the reference): a banner on the homepage's "Our flagship programme" ground, its introduction on the left
      // and its courses sliding on the right
      if (t.k === 'gs') {
        return `<section class="cf-sec cf-feat" id="cat-gs" aria-labelledby="cath-gs">
        <div class="cf-feat__cuts" aria-hidden="true"><img class="cut--l" src="assets/img/photos/collage.png" alt="" decoding="async"><img class="cut--r" src="assets/img/photos/collage.png" alt="" decoding="async"></div>
        <div class="cf-feat__intro">
          <div class="lbl lbl--w cf-feat__lbl"><span class="lbl__t">Our flagship programme</span></div>
          <div class="cf-feat__head">${bookFor('gs', t.label, items.length, true)}<h2 class="cf-sec__h" id="cath-gs"><span class="cf-sec__name">${esc(t.label)}</span><span class="cf-sec__n" data-total="${items.length}">${items.length} ${items.length === 1 ? 'course' : 'courses'}</span></h2></div>
          <p class="cf-sec__d">${esc(ABOUT.gs[0])}</p>
          <p class="cf-sec__who"><b>Who it’s for</b> ${esc(ABOUT.gs[1])}</p>
        </div>
        ${car}
      </section>`;
      }
      return `<section class="cf-sec" id="cat-${t.k}" aria-labelledby="cath-${t.k}">
        <div class="cf-sec__top">${bookFor(t.k, t.label, items.length)}<div class="cf-sec__txt">
        <h2 class="cf-sec__h" id="cath-${t.k}"><span class="cf-sec__name">${esc(t.label)}</span>${NEW.has(t.k) ? ' <span class="cf-new">New</span>' : ''}<span class="cf-sec__n" data-total="${items.length}">${items.length} ${items.length === 1 ? 'course' : 'courses'}</span></h2>
        ${ABOUT[t.k] ? `<div class="cf-sec__about"><p class="cf-sec__d">${esc(ABOUT[t.k][0])}</p><p class="cf-sec__who"><b>Who it’s for</b> ${esc(ABOUT[t.k][1])}</p></div>` : ''}
        </div></div>
        ${chips.length ? `<div class="cf-chips" role="group" aria-label="Show ${esc(t.label)} courses">
          <button type="button" class="cf-chip" data-f="" aria-pressed="true">All</button>${chips.map(([f, l]) => `<button type="button" class="cf-chip" data-f="${f}" aria-pressed="false">${esc(l)}</button>`).join('')}
        </div>` : ''}
        ${car}
      </section>`;
    });
    list.innerHTML = secHTML.filter(Boolean).map((h, i) => i === 5 ? h + HELP : h).join('');

    // the bar's search and tabs filter every category; a category with nothing left is hidden, and its subject chips with nothing left too
    const state = { q: [], mode: '', lang: '' };
    const passes = k => (!state.mode || k.dataset.mode === state.mode || k.dataset.mode === 'both')
      && (!state.lang || k.dataset.lang === state.lang) && state.q.every(w => k.dataset.q.includes(w));
    // each section's courses sit in one row that scrolls sideways (user 2026-11-18, a udemy.com course row as the reference): round
    // arrow buttons at its two ends, each shown only while there is more that way
    const arrows = sec => {
      const tr = $('.cf-grid', sec), max = tr.scrollWidth - tr.clientWidth;
      $('.cf-arw--prev', sec).hidden = tr.scrollLeft <= 2;
      $('.cf-arw--next', sec).hidden = tr.scrollLeft >= max - 2;
    };
    const layout = sec => {
      const all = $$('.cf-k', sec), ok = all.filter(passes);
      $$('.cf-chip[data-f^="sub:"]', sec).forEach(c => { c.hidden = !ok.some(k => `sub:${k.dataset.sub}` === c.dataset.f); });
      const row = $('.cf-chips', sec);
      if (row) row.hidden = $$('.cf-chip[data-f^="sub:"]:not([hidden])', sec).length < 2;   // one subject left: nothing to choose between
      const on = $('.cf-chip[aria-pressed="true"]', sec);
      if (row && row.hidden && on && on.dataset.f) on.hidden = true;
      if (on && on.hidden) { $$('.cf-chip', sec).forEach(c => c.setAttribute('aria-pressed', String(!c.dataset.f))); sec.dataset.f = ''; }
      const f = sec.dataset.f || '', [key, val] = f.split(':');
      const match = ok.filter(k => !f || k.dataset[key] === val);
      all.forEach(k => { k.hidden = !match.includes(k); });
      sec.hidden = !ok.length;
      const cnt = $('.cf-sec__n', sec);
      if (cnt) { const all = +cnt.dataset.total, n = ok.length; cnt.textContent = n === all ? `${all} ${all === 1 ? 'course' : 'courses'}` : `${n} of ${all} courses`; }
      const tr = $('.cf-grid', sec); tr.scrollLeft = 0;
      arrows(sec);
      return ok.length;
    };
    const count = $('#cfCount'), empty = $('#cfEmpty');
    const layoutAll = () => {
      const n = $$('.cf-sec', list).reduce((s, sec) => s + layout(sec), 0);
      const first = $('.cf-sec:not([hidden])', list);
      $$('.cf-sec', list).forEach(s => s.classList.toggle('is-first', s === first));
      if (empty) empty.hidden = n > 0;
      const help = $('#cfHelp'); if (help) help.hidden = !n;
      if (count) count.textContent = n ? `${n} course${n === 1 ? '' : 's'} shown` : 'No courses match.';
    };
    layoutAll();

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
    list.addEventListener('click', e => {
      const chip = e.target.closest('.cf-chip');
      if (chip) {
        const sec = chip.closest('.cf-sec');
        $$('.cf-chip', sec).forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
        sec.dataset.f = chip.dataset.f; layout(sec); return;
      }
      const arw = e.target.closest('.cf-arw');
      if (arw) {   // one screenful of cards at a time
        const tr = $('.cf-grid', arw.closest('.cf-sec'));
        tr.scrollBy({ left: +arw.dataset.dir * tr.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
    $$('.cf-sec', list).forEach(sec => $('.cf-grid', sec).addEventListener('scroll', () => arrows(sec), { passive: true }));
    addEventListener('resize', () => $$('.cf-sec', list).forEach(arrows));

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
    const reset = $('#cfReset');
    if (reset) reset.addEventListener('click', () => {
      $$('.cf-seg').forEach(seg => pickTab(seg, $('.cf-seg__b', seg)));
      q.value = ''; state.q = []; qx.hidden = true; apply();
    });

    // the nav's course menus (js/site-nav.js) and #cat=… links scroll to that category's section, clear of the bar
    const go = (k, smooth = true) => {
      const id = k === 'all' ? null : (k === 'gs-11' || k === 'gs-2yr') ? 'gs' : k;
      const el = id ? $(`#cat-${id}`) : list;
      if (!el || el.hidden) return;
      const y = el.getBoundingClientRect().top + scrollY, down = y > scrollY;
      const top = y - (bar ? bar.offsetHeight : 0) - (down ? 0 : 70) - 24;   // going up the nav comes back above the bar
      scrollTo({ top, behavior: smooth && !reduce ? 'smooth' : 'auto' });
    };
    window.__cfSetCat = k => { history.replaceState(null, '', `#cat=${k}`); go(k); };
    const m = location.hash.match(/^#cat=([\w-]+)/);
    if (m) setTimeout(() => go(m[1], false), 0);
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
