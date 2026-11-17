/* Course finder page (course-finder.html, 2026-11-17). Reworks the "UPSC Course Finder" reference artifact in version 8's look, laid
   out after the user's Figma reference (VAR 4181:260, a MasterClass catalogue): the categories across the top, here as the homepage's
   cloth-bound programme books standing on a walnut plank (one per category; arrows on hover, and the row drags or swipes sideways); a Filters panel on the
   left with collapsible checkbox groups (Mode, Medium) and "Clear filters (n)"; the courses on the right, one card
   per product (a programme offered both in Classroom and LIVE-Online, or in English and Hindi, is two cards); a detail panel for each
   course with its batch facts, what it includes and who it is for. Data: js/data/courses.js (window.CF_DATA). The category, filters
   and open course live in the URL hash, so a filtered list or a course can be linked to. */
(() => {
  const D = window.CF_DATA; if (!D) return;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FAM = D.families, SUB = D.subjects, ALL = D.courses;
  const famLabel = Object.fromEntries(FAM.map(f => [f.k, f.label]));
  const subLabel = Object.fromEntries(SUB.map(s => [s.k, s.label]));

  /* Iconoir icons (iconoir.com), inline so they take the text colour */
  const I = {
    arrow: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8h11"/><path d="M8.6 3.6C9.4 5.9 11.2 7.4 13.5 8 11.2 8.6 9.4 10.1 8.6 12.4"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.758 17.243 12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"/></svg>',
    ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3h-6m6 0-9 9m9-9v6"/><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/></svg>',
    chev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>',
    cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4V2m0 2v2m0-2h-4.5M3 10v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9H3Z"/><path d="M3 10V6a2 2 0 0 1 2-2h2m0-2v4m14 4V6a2 2 0 0 0-2-2h-.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v6h6"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"/></svg>',
    hourglass: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 2h14M5 22h14M7 2v4.5L12 12l5-5.5V2M7 22v-4.5L12 12l5 5.5V22"/></svg>',
    board: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11M2 21h20M8 21l1-4h6l1 4"/></svg>',
    rupee: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12M6 8.5h12M13.5 20 6 13h3c4.5 0 6-2.25 6-4.5S13.5 4 9 4"/></svg>'
  };

  /* GS Foundation reads as one category with its two lengths beneath it (as in the reference) */
  const TREE = [{ k: 'gs', label: 'GS Foundation', kids: ['gs-11', 'gs-2yr'] }];
  FAM.forEach(f => { if (f.k !== 'gs-11' && f.k !== 'gs-2yr') TREE.push({ k: f.k, label: f.label, kids: [f.k] }); });
  const KID = { 'gs-11': '11 Months', 'gs-2yr': '2 Years' };
  const famToCat = {}; TREE.forEach(t => t.kids.forEach(k => { famToCat[k] = t.k; }));
  const catLabel = k => (TREE.find(t => t.k === k) || {}).label || famLabel[k] || '';

  /* ---------- dates and fees, as the course pages give them ---------- */
  const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  const parseDate = s => {
    const m = /(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+),?\s+(\d{4})/.exec(s || ''); if (!m) return null;
    const mo = MONTHS.findIndex(x => x.startsWith(m[2].toLowerCase().slice(0, 3))); return mo < 0 ? null : new Date(+m[3], mo, +m[1]);
  };
  const today = new Date(); today.setHours(0, 0, 0, 0);
  /* a start date already gone by is said so ("Started"), not shown as if it were coming */
  /* dates written "28 OCT 2026" (user 2026-11-17). A course page may list several batches ("1st March 2026 (Batch 2) | 1st April 2026
     (Batch 3)") or add a note ("( Batch XXII )"): the card shows the next date to come (or the last, if all have passed), the detail panel
     every date with its note. */
  const MON3 = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const fmtDate = d => `${d.getDate()} ${MON3[d.getMonth()]} ${d.getFullYear()}`;
  const startOf = v => {
    if (!v.start) return { txt: '', full: '', past: false, known: false };
    const parts = v.start.split('|').map(p => { const n = /\(([^)]*)\)/.exec(p); return { d: parseDate(p), note: n ? n[1].replace(/\s+/g, ' ').trim() : '' }; });
    const dated = parts.filter(p => p.d);
    if (!dated.length) { const t = /announc/i.test(v.start) ? 'To be announced' : v.start.trim(); return { txt: t, full: t, past: false, known: false }; }
    const next = dated.filter(p => p.d >= today).sort((a, b) => a.d - b.d)[0], pick = next || dated[dated.length - 1];
    const d = pick.d;
    return { txt: fmtDate(d), full: dated.map(p => fmtDate(p.d) + (p.note ? ` (${p.note})` : '')).join(' · '), past: !next, known: true,
      day: d.getDate(), mon: MON3[d.getMonth()], year: d.getFullYear(), iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` };
  };
  const feeNum = v => v.feeShort ? +v.feeShort.replace(/[^\d]/g, '') : null;
  const modeTxt = v => v.k === 'classroom' ? 'Classroom' : v.k === 'online' ? 'LIVE-Online' : 'Classroom & LIVE-Online';

  /* ---------- the filters: checkbox groups; within a group any ticked option may match, across groups all must ---------- */
  const GROUPS = [
    { k: 'mode', label: 'Mode', opts: [['classroom', 'Classroom'], ['online', 'LIVE-Online']], test: (v, o) => v.k === o || v.k === 'both' },
    { k: 'lang', label: 'Medium', opts: [['en', 'English'], ['hi', 'हिंदी']], test: (v, o) => v.l === o }
  ];
  const DEF = () => ({ cat: 'gs', mode: [], lang: [] });   // GS Foundation shown first; there is no "All courses" book (user 2026-11-17)
  let state = DEF(), open = '';
  // both groups start open; one the visitor folds stays folded (the Subject, Batch and Fee groups were removed, user 2026-11-17)
  const toggled = {};
  const isOpenG = k => k in toggled ? toggled[k] : true;

  const famsOf = cat => cat === 'all' ? null : (TREE.find(t => t.k === cat) || { kids: [cat] }).kids;
  const subjectsIn = cat => { const f = famsOf(cat); return SUB.filter(x => ALL.some(c => (!f || f.includes(c.f)) && c.s === x.k)); };
  /* the products of a course that pass everything except (optionally) one group, for that group's counts */
  const pass = (c, v, skip) => GROUPS.every(g => g.k === skip || !state[g.k].length || state[g.k].some(o => g.test(v, o, c)));
  const hits = (c, cat = state.cat, skip) => { const f = famsOf(cat); if (f && !f.includes(c.f)) return null; const v = c.v.filter(x => pass(c, x, skip)); return v.length ? v : null; };
  const countFor = (cat, skip) => ALL.reduce((n, c) => n + ((hits(c, cat, skip) || []).length), 0);
  const nFilters = () => GROUPS.reduce((n, g) => n + state[g.k].length, 0);

  /* ---------- the category books (the homepage's cloth covers: js/programme-shelf.js, css/programme-shelf.css) ---------- */
  const FOIL = '#f6c77a';
  const COVER = {
    all: { light: '#4a3b31', base: '#33281f', deep: '#1c1510', emblem: 'layers', art: 'arcs' },
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
    layers: '<path d="m24 15 9 4.5-9 4.5-9-4.5 9-4.5Z"/><path d="m15 24 9 4.5 9-4.5M15 28.5 24 33l9-4.5"/>',
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
      arcs: () => [m('s110', { tag: 'circle', cx: 22, cy: 104, r: 48, fill: soft, opacity: .35 }), m('s118', { tag: 'circle', cx: 22, cy: 104, r: 32, fill: soft, opacity: .5 }), m('ur', { tag: 'circle', cx: 66, cy: 62, r: 9, fill: accent })],
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
  const SW = 12;   // spine width on these smaller covers
  // categories marked new (user 2026-11-17, "let's say Interview Guidance is a new course"): a NEW seal on the cover (its 4-second
  // turn and flash were later removed: it behaves like the other books). Every book is built as a solid: front, back cover,
  // spine, page block and top edge, so the turn shows its depth ("the book looks kind of 2D when rotating").
  const NEW_CATS = new Set(['interview']);
  // the seal: a scalloped rosette, a dashed ring, NEW and two small stars
  const seal = (() => {
    const pts = []; for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2, r = i % 2 ? 26 : 29; pts.push(`${(30 + r * Math.cos(a)).toFixed(2)},${(30 + r * Math.sin(a)).toFixed(2)}`); }
    return `<svg class="cf-seal" viewBox="0 0 60 60" aria-hidden="true"><defs><linearGradient id="cfSealG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFB547"/><stop offset=".45" stop-color="#FF6A1A"/><stop offset="1" stop-color="#D6301A"/></linearGradient></defs>
      <polygon points="${pts.join(' ')}" fill="url(#cfSealG)"/><circle cx="30" cy="30" r="21" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1" stroke-dasharray="2 2.2"/>
      <text x="30" y="34.2" text-anchor="middle" font-family="IBM Plex Sans, Arial, sans-serif" font-size="11.5" font-weight="700" letter-spacing="1.2" fill="#fff">NEW</text>
      <path d="M30 13.5l1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3z M30 40.5l1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3z" fill="#FFE7B0"/></svg>`;
  })();
  const book = (k, label, n) => {
    const c = COVER[k] || COVER.all, frame = `top:8px;right:8px;bottom:8px;left:${SW + 7}px`;
    const isNew = NEW_CATS.has(k);
    // every book is a solid (back cover, spine, page block, top edge behind its front), so it shows its depth when it turns: the new
    // ones every 4 seconds, and any book as it becomes the chosen one (user 2026-11-17)
    const solid = `<span class="cf-3d cf-3d--back" aria-hidden="true" style="background:linear-gradient(220deg, ${c.light}, ${c.base} 50%, ${c.deep})"></span>
        <span class="cf-3d cf-3d--spine" aria-hidden="true" style="background:linear-gradient(90deg, ${c.deep}, ${c.base} 45%, ${c.deep})"><i></i><i></i></span>
        <span class="cf-3d cf-3d--pages" aria-hidden="true"></span><span class="cf-3d cf-3d--top" aria-hidden="true"></span>${isNew ? `
        <span class="cf-3d cf-3d--seal" aria-hidden="true">${seal}</span>` : ''}`;
    return `<button type="button" class="cf-book ps-book${isNew ? ' cf-book--new' : ''}" data-v="${k}" aria-pressed="${state.cat === k}"${n ? '' : ' data-none'}${isNew ? ` aria-label="${esc(label)}, new"` : ''}>
      <span class="cf-book__body">
        <span class="ps-extras" aria-hidden="true"><span class="ps-foot"></span><span class="ps-back" style="background-color:${c.deep}"></span><span class="ps-pages"></span></span>${solid}
        <span class="ps-front" style="background-color:${c.base};background-image:linear-gradient(140deg, ${c.light} 0%, ${c.base} 48%, ${c.deep} 100%)">
          <span class="ps-front__geo" aria-hidden="true">${geo(c.art, FOIL, '#fff3dc')}</span>
          <span class="ps-cloth" aria-hidden="true"></span><span class="ps-grain" aria-hidden="true"></span>
          <span class="ps-spine" aria-hidden="true" style="width:${SW}px;background:linear-gradient(90deg, rgb(0 0 0 / .38), ${c.deep} 38%, ${c.base} 80%, rgb(0 0 0 / .2))"></span>
          <span class="ps-hinge" aria-hidden="true" style="left:${SW}px"></span><span class="ps-light" aria-hidden="true"></span>
          <span class="ps-frame" aria-hidden="true" style="${frame}"><span></span></span>
          <span class="ps-face" style="${frame}">
            <span class="ps-face__name">${esc(label)}</span>
            <span class="ps-face__rule" aria-hidden="true"><i></i><b></b><i></i></span>
            <span class="ps-face__em" aria-hidden="true">${emblem(c.emblem, 46)}</span>
            <span class="ps-face__foot"><span class="ps-face__cat cf-book__n">${n} ${n === 1 ? 'course' : 'courses'}</span><span class="ps-face__open" aria-hidden="true">${state.cat === k ? 'Showing' : 'Show courses'}</span></span>
          </span>
          <span class="ps-shine" aria-hidden="true"></span>
        </span>
      </span>
    </button>`;
  };
  const booksBox = $('#cfBooks'), rail = $('#cfShelf');
  booksBox.addEventListener('animationend', e => { if (e.animationName === 'cf-pick-flip') e.target.closest('.cf-book')?.classList.remove('is-flip'); });
  const paintBooks = () => {
    // once built, the books are updated where they stand (count, chosen, empty), so the chosen one's tilt eases over rather than
    // jumping in on every filter change
    const built = $$('.cf-book', booksBox);
    if (built.length) {
      built.forEach(b => {
        const k = b.dataset.v, n = countFor(k), on = state.cat === k;
        // a book becoming the chosen one turns a full circle on its upright axis (user 2026-11-17, "when moving from one programme to the
        // next the book should also do a horizontal flip")
        if (on && b.getAttribute('aria-pressed') !== 'true' && !reduce) { b.classList.remove('is-flip'); void b.offsetWidth; b.classList.add('is-flip'); clearTimeout(b._flipT); b._flipT = setTimeout(() => b.classList.remove('is-flip'), 1100); }
        b.setAttribute('aria-pressed', on); b.toggleAttribute('data-none', !n);
        $('.cf-book__n', b).textContent = `${n} ${n === 1 ? 'course' : 'courses'}`;
        $('.ps-face__open', b).textContent = on ? 'Showing' : 'Show courses';
      });
      arrows(); return;
    }
    booksBox.innerHTML = TREE.map(t => book(t.k, t.label, countFor(t.k))).join('') + '<span class="ps-plank cf-plank" aria-hidden="true"><span class="ps-plank__top"></span><span class="ps-plank__front"></span></span>';
    arrows();
  };
  /* the arrows, shown over the shelf on hover (css): each moves the row along by most of its width, and is disabled (hidden) at the end
     it points to */
  const arrows = () => { const max = rail.scrollWidth - rail.clientWidth - 16;   // 16px of slack: the books' snap points keep the row a few pixels off either end
    $$('.cf-arw').forEach(b => { b.disabled = +b.dataset.dir < 0 ? rail.scrollLeft <= 16 : rail.scrollLeft >= max; }); };
  rail.addEventListener('scroll', arrows, { passive: true }); addEventListener('resize', arrows);
  $$('.cf-arw').forEach(b => b.addEventListener('click', () => rail.scrollBy({ left: +b.dataset.dir * rail.clientWidth * .8, behavior: reduce ? 'auto' : 'smooth' })));
  /* with a mouse the row can also be dragged sideways; a drag of more than a few pixels does not count as a click on the book it
     started on */
  let drag = null, dragged = false;
  rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button !== 0) return; drag = { x: e.clientX, left: rail.scrollLeft }; dragged = false; });
  addEventListener('pointermove', e => {
    if (!drag) return; const dx = e.clientX - drag.x;
    if (!dragged && Math.abs(dx) > 5) { dragged = true; rail.classList.add('is-drag'); }
    if (dragged) rail.scrollLeft = drag.left - dx;
  });
  addEventListener('pointerup', () => { if (!drag) return; drag = null; rail.classList.remove('is-drag'); });
  rail.addEventListener('click', e => { if (dragged) { e.stopPropagation(); e.preventDefault(); dragged = false; } }, true);
  rail.addEventListener('dragstart', e => e.preventDefault());
  const showBook = () => { const b = $(`.cf-book[aria-pressed="true"]`, booksBox); if (!b) return;
    const r = b.getBoundingClientRect(), rr = rail.getBoundingClientRect();
    if (r.left < rr.left || r.right > rr.right) rail.scrollBy({ left: r.left - rr.left - (rr.width - r.width) / 2, behavior: reduce ? 'auto' : 'smooth' }); };

  /* ---------- the Filters panel ---------- */
  const groupsBox = $('#cfGroups');
  const paintFilters = () => {
    groupsBox.innerHTML = GROUPS.filter(g => !g.shown || g.shown(state.cat)).map(g => {
      const subs = g.k === 'sub' ? new Set(subjectsIn(state.cat).map(s => s.k)) : null;
      const opts = g.opts.filter(([o]) => !subs || subs.has(o));
      const isOpen = isOpenG(g.k);
      return `<section class="cf-fg${isOpen ? ' is-open' : ''}" data-g="${g.k}">
        <h3 class="cf-fg__h"><button type="button" class="cf-fg__btn" aria-expanded="${isOpen}" aria-controls="cff-${g.k}">${g.label}${state[g.k].length ? `<span class="cf-fg__n">${state[g.k].length}</span>` : ''}${I.chev}</button></h3>
        <ul class="cf-fg__list" id="cff-${g.k}">${opts.map(([o, l]) => {
          const on = state[g.k].includes(o);
          // how many courses this option would show, given the other groups' choices
          const n = ALL.reduce((a, c) => a + ((hits(c, 'all', g.k) || []).filter(v => g.test(v, o, c)).length), 0);
          return `<li><label class="cf-ck${n || on ? '' : ' is-none'}"><input type="checkbox" data-g="${g.k}" value="${o}"${on ? ' checked' : ''}><span class="cf-ck__box" aria-hidden="true">${I.check}</span><span class="cf-ck__l"${o === 'hi' ? ' lang="hi"' : ''}>${esc(l)}</span><span class="cf-ck__n">${n}</span></label></li>`;
        }).join('')}</ul>
      </section>`;
    }).join('');
    const nf = nFilters(); $('#cfNF').textContent = nf; $('.cf-filters [data-clear]').hidden = !nf;
    $('.cf-filters__tog span').textContent = (groupsBox.classList.contains('is-shown') ? 'Hide filters' : 'Show filters') + (nf ? ` (${nf})` : '');
  };
  groupsBox.addEventListener('click', e => {
    const b = e.target.closest('.cf-fg__btn'); if (!b) return;
    const g = b.closest('.cf-fg'), on = !g.classList.contains('is-open');
    g.classList.toggle('is-open', on); b.setAttribute('aria-expanded', on); toggled[g.dataset.g] = on; if (window.__cfFit) window.__cfFit();
  });
  groupsBox.addEventListener('change', e => {
    const i = e.target.closest('input[type="checkbox"]'); if (!i) return;
    const list = state[i.dataset.g]; const at = list.indexOf(i.value);
    if (i.checked && at < 0) list.push(i.value); if (!i.checked && at >= 0) list.splice(at, 1);
    render({ keepFocus: `input[data-g="${i.dataset.g}"][value="${i.value}"]` }); keepPlace();
  });
  $('.cf-filters__tog').addEventListener('click', e => {
    const on = !groupsBox.classList.contains('is-shown'); groupsBox.classList.toggle('is-shown', on); e.currentTarget.setAttribute('aria-expanded', on); paintFilters();
  });

  /* ---------- a course card: the homepage's "Next batches" ticket (css/v49.css .inv--ticket; user 2026-11-17, "use the same card we used
     for the upcoming batches"), its head the course's banner picture (user 2026-11-17, "the image should be placed in here"), edge to
     edge; then, in order of weight (user 2026-11-17, "fix the hierarchy"): the category, the course's name, and its four facts in a
     2 x 2 grid (starts, mode, fee, length), the start date in the category's colour (its book's cloth on the shelf); the tear line, and
     "View details" on the stub. The whole ticket opens the course's detail panel. ---------- */
  const MODE_SHORT = v => v.k === 'classroom' ? 'Classroom' : v.k === 'online' ? 'LIVE-Online' : 'Classroom & Online';
  const card = (c, v) => {
    const s = startOf(v), cat = famToCat[c.f], tint = (COVER[cat] || COVER.all).base;
    const fact = (k, val, cls = '') => `<div class="cf-tf${cls}"><dt>${k}</dt><dd${val ? '' : ' data-none'}>${val || '—'}</dd></div>`;
    const start = s.known ? `<time datetime="${s.iso}">${s.day} ${s.mon} ${s.year}</time>` : esc(s.txt || '');
    return `<article class="inv inv--ticket cf-ticket${s.past ? ' is-past' : ''}" data-id="${v.id}" style="--ticket:${tint}">
      <div class="inv__frame">
        <div class="cf-ticket__pic"><img src="${v.i}" alt="" loading="lazy" decoding="async" width="450" height="300"></div>
        <div class="ticket__body">
          <span class="inv__tag">${esc(c.s ? subLabel[c.s] + ' · ' : '')}${esc(catLabel(cat))}${KID[c.f] ? ' · ' + KID[c.f] : ''}${v.l === 'hi' ? ' · <span lang="hi">हिंदी</span>' : ''}</span>
          <h3><button type="button" class="cf-open" data-id="${v.id}">${esc(v.t)}</button></h3>
          <dl class="cf-tfacts">
            ${fact(s.past ? 'Started' : 'Starts', start, ' cf-tf--when' + (s.known ? '' : ' is-tba'))}
            ${fact('Mode', MODE_SHORT(v))}
            ${fact('Fee', esc(v.feeShort))}
            ${fact('Duration', esc(v.dur))}
          </dl>
        </div>
        <div class="ticket__stub"><span class="inv__reg" aria-hidden="true">View details<span class="sq sq--38 sq--brand"></span></span></div>
      </div>
    </article>`;
  };

  $('#cfOut').addEventListener('pointermove', e => { const t = e.target.closest('.cf-ticket'); if (!t || e.pointerType !== 'mouse') return; const r = t.getBoundingClientRect();
    t.style.setProperty('--tx', ((e.clientX - r.left) / r.width - .5).toFixed(3)); t.style.setProperty('--ty', ((e.clientY - r.top) / r.height - .5).toFixed(3)); });
  $('#cfOut').addEventListener('pointerout', e => { const t = e.target.closest('.cf-ticket'); if (t && !t.contains(e.relatedTarget)) { t.style.setProperty('--tx', 0); t.style.setProperty('--ty', 0); } });

  /* ---------- results ---------- */
  /* one continuous list (user 2026-11-17, "when I reach the end of the four course cards the next set of programmes should come"): every
     category in the shelf's order, each under its own heading, all its courses (as the Mode and Medium filters leave them). The book of
     the category being read is the chosen one, following the scroll (spy, below); choosing a book glides to its category. */
  const out = $('#cfOut'), empty = $('#cfEmpty');
  const render = ({ keepFocus } = {}) => {
    paintBooks(); paintFilters();
    const rows = ALL.map(c => [c, hits(c, 'all')]).filter(r => r[1]);
    const n = rows.reduce((a, r) => a + r[1].length, 0);
    $('#cfCount').innerHTML = n ? `Showing <b>${n}</b> ${n === 1 ? 'course' : 'courses'}` : '';
    empty.hidden = n > 0;
    const groups = TREE.map(t => ({ t, list: rows.filter(r => t.kids.includes(r[0].f)).flatMap(r => r[1].map(v => [r[0], v])) })).filter(g => g.list.length);
    out.innerHTML = groups.map(({ t, list }) => `<section class="cf-group" id="cfs-${t.k}" data-cat="${t.k}" aria-labelledby="cfg-${t.k}">
        <div class="cf-group__h"><h2 class="lbl cf-group__lbl" id="cfg-${t.k}"><span class="lbl__t">${esc(t.label)}</span></h2><span class="cf-group__n">${list.length} ${list.length === 1 ? 'course' : 'courses'}</span></div>
        <div class="cf-grid">${list.map(([c, v]) => card(c, v)).join('')}</div></section>`).join('');
    writeHash();
    if (keepFocus) { const f = $(keepFocus, groupsBox); if (f) f.focus({ preventScroll: true }); }
  };
  // choose a category: its book is chosen and the list glides to its section
  const setCat = k => {
    state.cat = k; paintBooks(); writeHash();
    const b = $(`.cf-book[data-v="${k}"]`, booksBox); if (b) b.focus({ preventScroll: true }); showBook();
    toCat(k);
  };

  /* ---------- the URL hash ---------- */
  const writeHash = () => {
    const p = [];
    if (state.cat !== DEF().cat) p.push('cat=' + state.cat);
    GROUPS.forEach(g => { if (state[g.k].length) p.push(g.k + '=' + state[g.k].join(',')); });
    if (open) p.push('course=' + open);
    history.replaceState(null, '', location.pathname + location.search + (p.length ? '#' + p.join('&') : ''));
  };
  const readHash = () => {
    (location.hash || '').slice(1).split('&').forEach(b => { const [k, v] = b.split('='); if (v === undefined) return;
      const val = decodeURIComponent(v);
      if (k === 'cat') state.cat = TREE.some(t => t.k === val) ? val : DEF().cat; else if (k === 'course') open = val;
      else { const g = GROUPS.find(x => x.k === k); if (g) state[k] = val.split(',').filter(o => g.opts.some(([x]) => x === o)); } });
  };

  /* ---------- the detail panel ---------- */
  const dlg = $('#cfDlg'), dlgIn = $('#cfDlgIn');
  const find = id => { for (const c of ALL) for (const v of c.v) if (v.id === id) return [c, v]; return null; };
  const detail = id => {
    const hit = find(id); if (!hit) return false;
    const [c, v] = hit, s = startOf(v), byLang = c.v.length > 1 && c.v[0].l !== c.v[1].l;
    const twin = c.v.length > 1 ? `<div class="cf-twin" role="group" aria-label="${byLang ? 'Medium' : 'Mode'}">${c.v.map(x => `<button type="button" data-twin="${x.id}" aria-pressed="${x.id === v.id}"${byLang && x.l === 'hi' ? ' lang="hi"' : ''}>${byLang ? (x.l === 'hi' ? 'हिंदी' : 'English') : modeTxt(x)}</button>`).join('')}</div>` : '';
    const row = (ic, k, val, cls = '') => `<div class="cf-df${cls}"><span class="cf-df__ic">${ic}</span><dt>${k}</dt><dd${val ? '' : ' data-none'}>${val ? esc(val) : 'To be announced'}</dd></div>`;
    const list = (h, items) => items && items.length ? `<section class="cf-ds"><h3>${h}</h3><ul class="cf-dl">${items.map(x => `<li>${I.check}<span>${esc(x)}</span></li>`).join('')}</ul></section>` : '';
    dlgIn.innerHTML = `
      <div class="cf-d__top">
        <button type="button" class="cf-d__x" data-close aria-label="Close">${I.x}</button>
        <div class="cf-d__pic"><img src="${v.i}" alt="" width="450" height="300"></div>
      </div>
      <div class="cf-d__body">
        <p class="cf-d__k">${esc(c.s ? subLabel[c.s] + ' · ' : '')}${esc(catLabel(famToCat[c.f]))}${KID[c.f] ? ' · ' + KID[c.f] : ''}</p>
        <h2 class="cf-d__h" id="cfDlgH">${esc(v.t)}</h2>
        <div class="cf-d__chips"><span class="cf-chip">${modeTxt(v)}</span><span class="cf-chip"${v.l === 'hi' ? ' lang="hi"' : ''}>${v.l === 'hi' ? 'हिंदी माध्यम' : 'English medium'}</span></div>
        ${twin}
        <dl class="cf-dfacts">
          ${row(I.cal, s.past ? 'Batch started' : 'Batch starts', s.full, s.past ? ' is-past' : '')}
          ${row(I.board, 'Mode', v.mode)}
          ${row(I.hourglass, 'Duration', v.dur)}
          ${row(I.clock, 'Class timings', v.time)}
          ${row(I.rupee, 'Fee', v.fee, ' cf-df--wide')}
        </dl>
        ${s.past ? '<p class="cf-d__note">This batch has started. Ask a counsellor about the next one.</p>' : ''}
        ${v.stats && v.stats.length ? `<ul class="cf-dstats">${v.stats.map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('')}</ul>` : ''}
        ${v.intro && v.intro.length ? `<section class="cf-ds"><h3>About the course</h3><p>${esc(v.intro[0])}</p></section>` : ''}
        ${list('What you get', v.feat)}
        ${list('Who should join', v.who)}
        <p class="cf-d__src">Batch details as published on <a href="${esc(v.u)}" target="_blank" rel="noopener">the course page</a>.</p>
      </div>
      <div class="cf-d__foot">
        <a class="bt bt--brand" href="index.html#contact">Enquire about this course<span class="sq"></span></a>
        <a class="cf-d__ext" href="${esc(v.u)}" target="_blank" rel="noopener">Full course page${I.ext}</a>
      </div>`;
    return true;
  };
  const openCourse = (id, from) => {
    if (!detail(id)) return; open = id; writeHash();
    if (!dlg.open) { dlg._from = from || document.activeElement; dlg.showModal(); document.documentElement.classList.add('cf-locked'); }
    dlgIn.scrollTop = 0;
  };
  const closeCourse = () => { if (!dlg.open) return; dlg.classList.add('is-out'); setTimeout(() => { dlg.classList.remove('is-out'); dlg.close(); }, 260); };
  dlg.addEventListener('close', () => { open = ''; writeHash(); document.documentElement.classList.remove('cf-locked'); const f = dlg._from; if (f && f.isConnected) f.focus({ preventScroll: true }); });
  dlg.addEventListener('cancel', e => { e.preventDefault(); closeCourse(); });
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('[data-close]')) { closeCourse(); return; }
    const t = e.target.closest('[data-twin]'); if (t && t.getAttribute('aria-pressed') !== 'true') { const y = dlgIn.scrollTop; detail(t.dataset.twin); open = t.dataset.twin; writeHash(); dlgIn.scrollTop = y; $(`[data-twin="${t.dataset.twin}"]`, dlgIn).focus(); }
  });

  /* ---------- events ---------- */
  booksBox.addEventListener('click', e => { const b = e.target.closest('.cf-book'); if (b) setCat(b.dataset.v); });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-clear]')) { GROUPS.forEach(g => { state[g.k] = []; }); render(); keepPlace(); return; }
    const cd = e.target.closest('.cf-ticket'); if (cd && !e.target.closest('a')) openCourse(cd.dataset.id, $('.cf-open', cd));
  });

  /* ---------- tally under the heading (counted from the data) ---------- */
  const products = ALL.reduce((n, c) => n + c.v.length, 0);
  // the homepage hero's stat style (css/hero-v6.css .hx__stats): the figure in the title face, its line beside it, gold diamonds
  // between; the figures count up once on load (user 2026-11-17, "create this as stats")
  const STATS = [[products, 'Courses to choose from'], [TREE.length, 'Categories, Prelims to Interview'], [SUB.length, 'Optional subjects taught']];
  $('#cfTally').innerHTML = STATS.map(([a, b], i) => `<li class="cf-stat" style="--i:${i}"><span class="cf-stat__num"><b class="cf-stat__fig" data-n="${a}">${a}</b><span class="cf-stat__fig cf-stat__room" aria-hidden="true">${a}</span></span><span class="cf-stat__t">${b}</span></li>`).join('');
  if (!reduce) $$('.cf-stat__fig[data-n]').forEach((el, i) => {
    const to = +el.dataset.n, t0 = performance.now() + 250 + i * 120, dur = 1100;
    el.textContent = '0';
    const step = t => { const k = Math.min(1, Math.max(0, (t - t0) / dur)); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });

  /* ---------- a glide down (or up) to the shelf: the page's own eased scroll, as the homepage moves with Lenis rather than the browser's
     smooth scrolling (which some embedded views do not animate); a wheel or touch stops it ---------- */
  // while the page scrolls itself the nav holds its state (js/site-nav.js reads window.__cfGliding): were it to slide in or out on the
  // way, the shelf under it would move and the first courses would end up behind the shelf (user 2026-11-17, "the course card seems
  // to be cropped")
  let glideRaf = 0;
  const glideEnd = () => requestAnimationFrame(() => requestAnimationFrame(() => { window.__cfGliding = false; }));
  const glide = target => {
    const to = Math.max(0, Math.min(Math.round(target), document.documentElement.scrollHeight - innerHeight)), from = scrollY, dist = to - from;
    cancelAnimationFrame(glideRaf);
    window.__cfGliding = true;
    if (reduce || Math.abs(dist) < 4) { scrollTo({ top: to, behavior: 'instant' }); glideEnd(); return; }
    const dur = Math.min(900, 380 + Math.abs(dist) * .35), t0 = performance.now();
    const stop = () => { cancelAnimationFrame(glideRaf); removeEventListener('wheel', stop); removeEventListener('touchstart', stop); glideEnd(); };
    addEventListener('wheel', stop, { passive: true }); addEventListener('touchstart', stop, { passive: true });
    const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      scrollTo({ top: from + dist * e, behavior: 'instant' }); if (k < 1) glideRaf = requestAnimationFrame(step); else stop(); };
    glideRaf = requestAnimationFrame(step);
  };

  /* ---------- the shelf sticks to the top while the courses scroll (user 2026-11-17, "this should stick to the top", then "should not
     pin, it should stay sticky"): the "Categories" heading scrolls away and the books and the plank stay at the top as they
     are, under the nav (or at the top of the screen while the nav is slid away), on a cream band (.is-stuck). --cf-hd is the heading's
     height, by which the shelf sits higher than the nav's foot; --cf-stack is where the shelf ends, for the filter column under it.
     Choosing a book while it sticks brings the list back to its first course. ---------- */
  const shelf = $('.cf-shelf'), body = $('.cf-body'), navEl = $('#nav');
  const mark = document.createElement('div'); mark.className = 'cf-shelf-mark'; mark.setAttribute('aria-hidden', 'true'); shelf.before(mark);
  let stuck = false, pinTick = false;
  const navOff = () => {
    if (!navEl || navEl.classList.contains('is-away')) return 0;
    return (parseFloat(getComputedStyle(navEl).top) || 0) + navEl.offsetHeight + 16;   // the bar's panel reaches 8px below it
  };
  const pin = () => {
    pinTick = false;
    const off = navOff(), hd = rail.getBoundingClientRect().top - shelf.getBoundingClientRect().top;
    const root = document.documentElement.style;
    root.setProperty('--cf-navoff', off + 'px'); root.setProperty('--cf-hd', hd + 'px');
    stuck = mark.getBoundingClientRect().top <= off - hd + 1;
    shelf.classList.toggle('is-stuck', stuck);
    root.setProperty('--cf-stack', (stuck ? shelf.getBoundingClientRect().bottom : off) + 'px');
  };
  /* the filter column (user 2026-11-17, "the banner is moving under the filter"): the Filters panel and the counsellor card stay in view
     together under the shelf, nothing passing under anything. Where the full card does not fit below the panel once the shelf sticks
     (with the nav shown), the card turns compact: one row, the icon, "Talk to a counsellor", the number and a round button
     (.is-compact); where even that does not fit, the card is left out of the column (.is-tight; "Let's talk" in the nav remains).
     Decided from the most room the shelf can take, on load, on resize and when a filter group folds, so it does not change while
     scrolling. */
  const side = $('.cf-side'), filtersEl = $('.cf-filters'), helpEl = $('.cf-help');
  const fitSide = () => {
    if (!side || !filtersEl || !helpEl) return;
    side.classList.remove('is-tight'); helpEl.classList.remove('is-compact');
    if (innerWidth <= 900) return;
    const hd = rail.getBoundingClientRect().top - shelf.getBoundingClientRect().top;
    const navMax = navEl ? (parseFloat(getComputedStyle(navEl).top) || 0) + navEl.offsetHeight + 16 : 0;
    const room = innerHeight - (navMax + shelf.offsetHeight - hd) - 32;
    const need = () => filtersEl.offsetHeight + 16 + helpEl.offsetHeight;
    if (need() <= room) return;
    helpEl.classList.add('is-compact');
    if (need() <= room) return;
    helpEl.classList.remove('is-compact'); side.classList.add('is-tight');
  };
  const pinSoon = () => { if (!pinTick) { pinTick = true; requestAnimationFrame(pin); } };
  window.__cfFit = () => { fitSide(); pinSoon(); };
  addEventListener('scroll', pinSoon, { passive: true }); addEventListener('resize', () => { fitSide(); pinSoon(); });
  if (navEl) new MutationObserver(pinSoon).observe(navEl, { attributes: true, attributeFilter: ['class'] });
  pin(); fitSide();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitSide);
  const stackPx = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cf-stack')) || 0;
  // back to the first course, under the pinned strip
  // a category's section, its heading just under the shelf as it stands once stuck (with the nav as it is now; worked out, not read from
  // --cf-stack, which can be mid-transition)
  const stackStuck = () => navOff() + shelf.offsetHeight - (rail.getBoundingClientRect().top - shelf.getBoundingClientRect().top);
  const sectionTop = k => { const sec = document.getElementById('cfs-' + k); return sec ? sec.getBoundingClientRect().top + scrollY - stackStuck() - 12 : null; };
  // pin() first, so the shelf stands where the nav's state says before the target is worked out
  const toCat = k => { pin(); const y = sectionTop(k); if (y !== null) glide(y); };
  const jumpTo = k => { pin(); const y = sectionTop(k); if (y === null) return; window.__cfGliding = true; scrollTo({ top: Math.max(0, y), behavior: 'instant' }); glideEnd(); };
  // after the list is rebuilt by a filter, the category being read stays where it was (only once the shelf is stuck: above that the list
  // starts in place anyway)
  const keepPlace = () => { if (stuck) jumpTo(state.cat); };

  /* the spy: the section whose heading has passed under the shelf (or the last, at the foot of the page) is the one being read; its book
     is chosen and brought into view on the shelf. Quiet while the page glides itself. */
  let spyTick = false;
  const spy = () => {
    spyTick = false;
    if (window.__cfGliding) return;
    const secs = $$('.cf-group', out); if (!secs.length) return;
    // the line a heading must pass: just under the shelf where it stands now (or under the nav, while the shelf is still lower down)
    const line = Math.max(navOff(), shelf.getBoundingClientRect().bottom) + 80;
    let cur = secs[0];
    secs.forEach(sec => { if (sec.getBoundingClientRect().top <= line) cur = sec; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = secs[secs.length - 1];
    const k = cur.dataset.cat;
    if (k && k !== state.cat) { state.cat = k; paintBooks(); writeHash(); showBook(); }
  };
  addEventListener('scroll', () => { if (!spyTick) { spyTick = true; requestAnimationFrame(spy); } }, { passive: true });
  // down (or up) to the shelf where it stands, full size, under the nav
  const toShelf = () => glide(mark.getBoundingClientRect().top + scrollY - 76);

  /* ---------- the nav's "All courses" menu opens a category here (js/site-nav.js) ---------- */
  window.__cfSetCat = k => {
    // "all" (the nav's "View all courses", the phone menu's "All courses"): to the shelf, to choose a category
    if (k === 'all') { toShelf(); return; }
    if (!TREE.some(t => t.k === k)) return;
    setCat(k);
  };

  /* ---------- CTA buttons: the homepage's rolling label and sliding arrows (from js/page-motion.js) ---------- */
  const enhance = el => {
    if (el.dataset.cta) return; el.dataset.cta = '1'; el.classList.add('cta');
    const sq = el.querySelector(':scope > .sq'), rest = [...el.childNodes].filter(n => n !== sq);
    const html = rest.map(n => n.nodeType === 1 ? n.outerHTML : n.textContent).join('').trim(); rest.forEach(n => n.remove());
    const label = document.createElement('span'); label.className = 'btn__label';
    label.innerHTML = `<span class="btn__t">${html}</span><span class="btn__t" aria-hidden="true">${html}</span>`;
    el.insertBefore(label, sq || null); if (sq) sq.innerHTML = I.arrow + I.arrow;
  };
  const SEL = '.bt, .talk, .inv__reg';
  const scan = r => (r.matches && r.matches(SEL) ? [r] : []).concat(r.querySelectorAll ? [...r.querySelectorAll(SEL)] : []).forEach(enhance);
  scan(document);
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) scan(n); }))).observe(document.body, { childList: true, subtree: true });

  readHash(); render(); requestAnimationFrame(() => { showBook(); if (state.cat !== DEF().cat) { pin(); jumpTo(state.cat); } });
  if (open) openCourse(open);
})();
