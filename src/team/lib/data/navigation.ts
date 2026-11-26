// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): lib/data/navigation.js. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
// The header's links, the Study materials menu and the current-affairs headlines (NavigationBar.jsx).

export const BAR_LINKS = [
  { k: 'toppers', href: '#toppers', t: 'Toppers' },
  { k: 'batches', href: '#batches', t: 'Upcoming batches' },
  { k: 'faq', href: '#faq', t: 'FAQs' },
];

export const DRAWER_LINKS = [
  ['/courses', 'All courses'],   // the course finder page (user 2026-11-23)
  ['#toppers', 'Toppers'],
  ['#resources', 'Study materials'],
  ['#batches', 'Upcoming batches'],
  ['#faq', 'FAQs'],
  ['#contact', 'Contact us'],
];

export const MORE_ORDER = ['faq', 'batches', 'toppers'];

export const STUDY_MENU = [
  ['Current affairs', [['Daily current affairs', 'Prelims, Mains and Quest articles', 'Daily'],
    ['The Recitals', 'The monthly current affairs magazine', 'Monthly'],
    ['Editorial analysis', 'The day’s editorials, explained', 'Daily'],
    ['Daily quiz', 'Ten quick questions on the news', 'Daily']]],
  ['Practice', [['Previous year papers', 'Prelims and Mains, with answer keys'],
    ['Answer writing practice', 'A Mains question to write each day'],
    ['Model answers for Mains', 'Mains 2026, paper by paper'],
    ['Essay topics', 'Past and probable essay themes']]],
  ['Study material', [['GS postal books', 'Printed General Studies material'],
    ['NCERT notes', 'The basics every paper builds on'],
    ['Government schemes', 'Schemes and missions, summed up'],
    ['Ethics case studies', 'GS Paper IV cases, with approaches']]],
  ['Exam guide', [['Syllabus & exam pattern', 'Each stage, and how it is marked'],
    ['UPSC Calendar 2027', 'Every date, the age limit, eligibility'],
    ['Optional subjects list', 'All optionals, and how to choose'],
    ['Interview guidance tips', 'Preparing for the Personality Test']]],
];

export const HEADLINES = [
  ['Mains', 'Supreme Court redefines the meaning of ‘industry’', 'current-affairs/upsc-mains-current-affairs/'],
  ['Mains', 'NITI Aayog flags gap between education and employment', 'current-affairs/upsc-mains-current-affairs/'],
  ['Prelims', 'Thiksey Monastery', 'current-affairs/upsc-prelims-current-affairs/'],
];
