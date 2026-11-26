// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): lib/data/batches.js. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
// The upcoming batches (Batches, the hero's batch slide, the contact form).

export const BFAM = {
  gs:     { t: 'General Studies', c: '#C64613' },
  pre:    { t: 'Prelims',         c: '#B47A20' },
  ca:     { t: 'Current affairs', c: '#9D485B' },
  mains:  { t: 'Mains',           c: '#326F66' },
  mentor: { t: 'Mentorship',      c: '#3F5B87' }
};

export const BATCHES = [
  { n: 'GS Comprehensive', fam: 'gs', full: '11-Month Prelims cum Mains General Studies Comprehensive Programme', d: '29 Jan', tgt: 'CSE 2027', what: 'The full GS syllabus for Prelims and Mains, in 11 months.', chip: 'Flagship', hi: true },
  { n: 'Prelims CAMP', fam: 'pre', full: 'Prelims CAMP, Batch 3', d: '3 Jan', tgt: 'CSE 2027', what: 'Prelims revision camp, batch 3.', chip: 'Limited seats' },
  { n: 'SMART Prelims', fam: 'ca', full: 'SMART Prelims Current Affairs Programme 2026', d: '17 Jan', tgt: 'CSE 2027', what: 'Current affairs for Prelims.' },
  { n: 'SMART', fam: 'ca', full: 'SMART Current Affairs Programme 2026', d: '17 Jan', tgt: 'CSE 2026', what: 'Current affairs for Prelims and Mains.', chip: 'Limited seats' },
  { n: 'GS 2-Year Fledgling', fam: 'gs', full: 'General Studies PCM 2-year Fledgling Programme 2028', d: '5 Feb', tgt: 'CSE 2028', what: 'The GS programme over two years, for college students.' },
  { n: 'PowerUp Prelims Tests', fam: 'pre', full: 'PowerUp Prelims Test Series 2027', d: '8 Feb', tgt: 'CSE 2027', what: 'Full-length Prelims tests with the reasoning behind every answer.' },
  { n: 'Sure Shot Mains', fam: 'mains', full: 'Sure Shot Mains Test Series 2027', d: '22 Feb', tgt: 'CSE 2027', what: 'Mains answer writing, evaluated, in English and Hindi.', chip: 'Limited seats' },
  { n: 'StepUp Mentorship', fam: 'mentor', full: 'StepUp Mentorship Programme 2027', d: '15 Jan', tgt: 'CSE 2027', what: 'A mentor keeps your plan on track, week by week.' }
];

export const BYEAR = 2027;
