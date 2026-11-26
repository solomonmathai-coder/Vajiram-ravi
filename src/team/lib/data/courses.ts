// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): lib/data/courses.js. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
// The course catalogue: categories, their courses and one-line descriptions, grouped by exam stage.
// Shared by the nav's "All courses" menu, the course catalogue dialog (Programmes) and the contact form's programme list.

export const CATS = [
  { t: 'UPSC GS Foundation Course', courses: ['General Studies Prelims cum Mains 2027 (1 year)', 'GS PCM 2-Year Fledgling 2028', "Ranker's Programme", 'Economics Module 2027'] },
  { t: 'Optional Subject Programme', courses: ['Agriculture', 'Anthropology', 'Commerce & Accountancy', 'Economics', 'Geography', 'History', 'Law', 'Mathematics', 'Philosophy', 'PSIR', 'Psychology', 'Public Administration', 'Sociology'].map(s => `${s} Optional Coaching`) },
  { t: 'CSAT Course', courses: ['CSAT Course', 'CSAT Test Series'] },
  { t: 'Interview Guidance Programme', courses: ['UPSC CSE Interview Guidance Programme'] },
  { t: 'Mentorship Programme', courses: ['StepUp Mentorship Programme 2027'] },
  { t: 'Mains Test Series', courses: ['Sure Shot Mains Programme 2027', 'Sure Shot Mains Programme 2027 (Hindi)', 'Mains CAMP 2027', 'Essay Test Series 2027', 'Sure Shot PYQ Dominator 2027', 'Sure Shot Mains Test Series for Seniors', 'Mains CAMP Rehearsals 2026', 'Sure Shot Mains 2026, FLT', 'Sure Shot Mains 2026, FLT Plus Sectional', 'Sure Shot Mains Test Series 2026', 'Sure Shot PYQ Dominator'] },
  { t: 'Prelims Test Series', courses: ['PowerUp Prelims Test Series', 'PowerUp Current Affairs Test Series', 'PowerUp Combo', 'Prelims Plus Test Series', 'Prelims CAMP', 'Prelims CAMP 2026 (Hindi)', 'SMART Current Affairs Programme 2027'] },
  { t: 'Optional Test Series', courses: ['Agriculture Optional Year-Long Test Series 2027', 'Agriculture Optional Mains Test Series', 'Anthropology Optional Test Series', 'Economics Optional Test Series', 'Geography Optional Comprehensive Test Series', 'History Optional Test Series', 'Law Optional Test Series', 'Mathematics Optional Test Series', 'Mathematics Optional Year-Long Test Series 2026–27', 'Philosophy Optional Test Series', 'PSIR Optional Test Series', 'Public Administration Optional Test Series', 'Sociology Optional Test Series'] }
];

export const CAT_D = [
  'The whole General Studies syllabus for Prelims and Mains together.',
  'Two papers, 500 marks, taught by a specialist in your optional subject.',
  'Prelims Paper II. Qualifying at 33%, but it has to be cleared.',
  'Mock boards with detailed feedback, for the 275-mark personality test.',
  'A mentor keeps your plan on track, week by week, in English or Hindi.',
  'Write to time, then read what an evaluator would change. English and Hindi.',
  'Full-length tests with the reasoning behind every answer, plus current affairs.',
  'Answer writing for your optional, evaluated paper by paper.'
];

// the exam stages, each listing its categories (indexes into CATS)
export const STAGES = [
  { k: 'Foundation', cats: [0] },
  { k: 'Prelims', cats: [6, 2] },
  { k: 'Mains', cats: [5, 1, 7] },
  { k: 'Interview', cats: [3] },
  { k: 'Mentorship', cats: [4] }
];

export const stageFor = i => STAGES.find(s => s.cats.includes(i))?.k || 'Every stage';
