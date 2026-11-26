// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): lib/data/hero.js. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
// The hero: the banner slides (HeroBanner.jsx) and the key figures under the intro (HeroIntro.jsx).

import { programmes } from './programmes';
import { BATCHES } from './batches';

export const STATS = [   // the About page's figures (data/about-page aboutHero.stats), 26 Nov 2026
  { fig: '50+', lines: ['Years', 'since 1976'] },
  { fig: '10/10', lines: ['Top ten ranks', 'in CSE 2025'] },
  { fig: '36/50', lines: ['Of the top 50', 'in CSE 2025'] },
  { fig: '30', lines: ['GS educators', 'and mentors'] },
];

export const EXAM = 'UPSC CSE 2025';

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const MONTHS = MONTH_NAMES.map(m => m.slice(0, 3));

export const batchDay = b => { const [d, m] = b.d.split(' '); return { day: +d, month: MONTHS.indexOf(m) }; };

export const byDate = (x, y) => { const a = batchDay(x), b = batchDay(y); return a.month - b.month || a.day - b.day; };

export const NEXT_BATCH = BATCHES.find(b => b.hi) || [...BATCHES].sort(byDate)[0];

export const longDate = b => { const { day, month } = batchDay(b); return `${day} ${MONTH_NAMES[month]}`; };

export const shortName = b => (b.fam === 'gs' ? 'GS' : b.n);

export const GS_PROGRAMME = programmes.find(x => x.name === 'UPSC GS foundation course – PCM');

export const AIR_1 = { rank: 1, name: 'Anuj Agnihotri', src: '/assets/img/hero-v6/slide-anuj-agnihotri.webp' };

export const GUIDANCE = { t: 'Get expert guidance', href: '#contact' };

export const HERO = [
  {
    key: 'results', kind: 'results', eyebrow: 'CSE 2025 results',
    headline: ['36 of the top 50', 'in UPSC CSE 2025', 'prepared with us.'],
    lead: 'All ten of the top ten ranks, and AIR 1 in every UPSC result since 2016.',
    btns: [{ t: 'See all results', href: 'https://vajiramandravi.com/ias-selections-from-vajiram/', ext: true }, { t: 'Meet the toppers', href: '#toppers' }],
    image: { src: '/assets/img/hero-v6/slide-results.webp', pos: '60% 35%', mpos: '58% 30%' },
  },
  {
    key: 'air-1', kind: 'topper', eyebrow: 'CSE 2025 results',
    topper: AIR_1,
    headline: ['Prepare for the UPSC with', 'the institute behind', 'India’s top rank-holders.'],
    lead: 'Since 1976: expert faculty, structured programmes and complete study resources.',
    btns: [{ t: 'Explore programmes', href: '#courses' }, GUIDANCE],
    image: { src: AIR_1.src },
  },
  {
    key: 'gs', kind: 'programme', programme: GS_PROGRAMME, eyebrow: `Programmes · ${GS_PROGRAMME.category}`,
    headline: ['Build your preparation', 'from the basics, with our', 'GS foundation course.'],
    lead: GS_PROGRAMME.line,
    btns: [{ t: 'Enrol now', href: '#contact', prog: GS_PROGRAMME.name }, { t: 'View course', href: GS_PROGRAMME.href || '#courses', ext: !!GS_PROGRAMME.href }],
    image: { src: '/assets/img/hero-v6/slide-gs-foundation.webp', pos: '80% 45%', mpos: '88% 40%' },
  },
  {
    key: 'batch', kind: 'batch', eyebrow: `Admissions open · ${NEXT_BATCH.tgt}`,
    headline: ['Admissions are open:', `the next ${shortName(NEXT_BATCH)} batch`, `starts ${longDate(NEXT_BATCH)}.`],
    lead: NEXT_BATCH.what,
    btns: [{ t: 'Enrol now', href: '#contact', prog: NEXT_BATCH.full }, { t: 'See all batches', href: '#batches' }],
    image: { src: '/assets/img/hero-v6/slide-batch.webp', pos: '80% 60%', mpos: '96% 55%' },
  },
  {
    key: 'campus', kind: 'campus', eyebrow: 'Since 1976 · New Delhi',
    headline: ['Five decades of', 'preparing India’s', 'civil servants.'],
    lead: 'At Gate 5 of Karol Bagh Metro, teaching UPSC aspirants in class and LIVE-Online.',
    btns: [{ t: 'Visit the campus', href: '#visit' }, GUIDANCE],
    image: { src: '/assets/img/hero-v6/slide-campus.webp', pos: '0% 0%', mpos: '52% 20%', wide: true },
  },
];

export const KIND_NAMES = { results: 'CSE 2025 results', batch: 'Upcoming batch', campus: 'Our campus' };
