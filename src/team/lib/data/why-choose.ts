// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): lib/data/why-choose.js. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
// Why Vajiram & Ravi: the legacy block, its photo and the six reasons (WhyChoose.jsx).

// The About page's words (26 Nov 2026, the Figma file "Vajiram & Ravi Website", About Us – 1445, 38:43088): who we are, how it
// started (with its photograph) and our values; the five values as the reasons.
export const WHO = {
  label: 'Who we are',
  title: 'Excellence in UPSC coaching, at every stage.',
  body: [
    'Since 1976, Vajiram & Ravi has been synonymous with excellence in Civil Services Examination coaching, preparing aspirants for all three stages of the UPSC exam: the Preliminary Test, the Main Examination and the Personality Test.',
    'With nearly five decades of experience, we have shaped the careers of countless IAS, IFS, IPS and other Central Services officers. Our students consistently secure top ranks, often within the first ten positions.',
  ],
};

export const LEGACY = {
  label: 'Since 1976',
  title: 'How it started.',
  body: [
    'Professor P. Velayutham founded Vajiram & Ravi in 1976. His academic background, including a diploma in International Law from the International Court of Justice, The Hague, laid the foundation for the institute.',
    'With nearly five decades of experience, Vajiram & Ravi has shaped the careers of countless IAS, IFS, IPS and other Central Services officers. The institute boasts a remarkable track record, with many students consistently securing top ranks, often within the first ten positions.',
  ],
};

export const PHOTO = { src: '/assets/img/photos/institute-exterior.webp', alt: 'Our campus at Old Rajinder Nagar, New Delhi: the Vajiram & Ravi building, its sign reading "Institute for IAS Exam"', w: 900, h: 1200 };

export const VALUES = {
  label: 'Our values',
  title: 'A holistic approach to education.',
  body: [
    'We focus not only on imparting knowledge, but on inspiring students to reach their highest potential — so they are ready for the exam, and for careers as administrators who shape the future of India’s public administration.',
  ],
};

export const REASONS = [
  { t: 'Knowledge, taught in depth', d: 'Every subject is taught by specialists, so aspirants build a clear understanding of the syllabus for every stage of the exam.', icon: 'board' },
  { t: 'Inspiration and motivation', d: 'We inspire and motivate students to reach their highest potential, through a preparation that can run for months and years.', icon: 'mentor' },
  { t: 'Engaging study material', d: 'Our faculty write study material that keeps students engaged with the syllabus, rather than buried in it.', icon: 'notes' },
  { t: 'A stimulating learning environment', d: 'Classrooms and mentoring built so students stay focused, ask questions and keep improving.', icon: 'place' },
  { t: 'Excellence and innovation', d: 'An unwavering commitment to quality that has guided aspirants towards the civil services for nearly five decades.', icon: 'medal' },
];
