// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): lib/data/footer.js. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
// The footer's link columns, social links, app store badges and legal links (Footer.jsx).

export const SITE = 'https://vajiramandravi.com/';

export const site = path => `${SITE}${path}`;

export const COLUMNS = [
  {
    title: 'Vajiram & Ravi',
    links: [
      { label: 'About Us', href: site('about-us/') },
      { label: 'Careers', href: site('careers/') },
      { label: 'Contact Us', href: '#contact' },
      { label: 'FAQs', href: '#faq' },
    ],
  },
  {
    title: 'Free Resources',
    links: [
      { label: 'Current Affairs', href: site('current-affairs/') },
      { label: 'Previous Year Papers', href: site('upsc-previous-year-papers/') },
      { label: 'Books & Study Material', href: site('upsc-exam/upsc-book-list/') },
      { label: 'Model Answers for Mains 2026', href: site('upsc-exam/model-answers-for-upsc-mains/') },
    ],
  },
  {
    title: 'UPSC Exam',
    links: [
      { label: 'Syllabus & Exam Pattern', href: site('upsc-syllabus/') },
      { label: 'Optional Subjects List', href: site('upsc-exam/optional-subjects-for-upsc/') },
      { label: 'Eligibility & Age Limit', href: site('upsc-exam/upsc-age-limit/') },
      { label: 'Exam Calendar 2027', href: site('upsc-exam/upsc-calendar/') },
      { label: 'Admit Card & Answer Key', href: site('upsc-exam/upsc-admit-card/') },
      { label: 'Cut Off & Results', href: site('upsc-exam/upsc-cut-off/') },
      { label: 'IAS Salary', href: site('upsc-exam/ias-salary/') },
    ],
  },
  {
    title: 'Courses & Test Series',
    links: [
      { label: 'GS Course 2027', href: site('courses/upsc-gs-course/') },
      { label: '2 Year Course', href: site('courses/2-year-upsc-course/') },
      { label: 'Online Coaching', href: site('upsc-online-coaching/') },
      { label: 'CSAT Course', href: site('courses/upsc-csat-course/') },
      { label: 'Current Affairs Course', href: site('courses/upsc-module-courses/current-affairs-course/') },
      { label: 'Prelims Test Series 2027', href: site('courses/prelims-test-series/') },
      { label: 'Mains Test Series 2027', href: site('courses/upsc-mains-test-series/') },
      { label: 'Optional Test Series', href: site('courses/upsc-mains-optional-subject-test-series/') },
      { label: 'Mentorship Program 2027', href: site('courses/upsc-mentorship-program/') },
      { label: 'Interview Guidance Program', href: site('courses/interview-guidance-program/') },
    ],
  },
];

export const SOCIALS = [
  { label: 'YouTube', icon: 'youtube' },
  { label: 'Facebook', icon: 'facebook' },
  { label: 'Instagram', icon: 'instagram' },
  { label: 'Telegram', icon: 'telegram' },
  { label: 'Quora', icon: 'quora' },
  { label: 'WhatsApp channel', icon: 'whatsapp' },
];

export const STORES = [
  {
    kicker: 'Download on the',
    name: 'App Store',
    font: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
    upper: false,
    href: 'https://apps.apple.com/in/app/vajiram-ias/id1482088570',
    icon: 'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701',
  },
  {
    kicker: 'Get it on',
    name: 'Google Play',
    font: '"Google Sans", "Product Sans", Roboto, Arial, sans-serif',
    upper: true,
    href: 'https://play.google.com/store/search?q=Vajiram%20IAS&c=apps',
    icon: 'M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z',
  },
];

export const LEGAL = [
  { label: 'Terms and Conditions', href: site('terms-and-conditions/') },
  { label: 'Privacy Policy', href: site('privacy-policy/') },
];
