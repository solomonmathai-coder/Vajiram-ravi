// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): lib/data/faculty.ts. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
// The faculty section: its intro and the educators (Faculties.tsx).

export type Href = string | null;

export const facultyIntro = {
  heading: { lead: "Learn from examination", emphasis: "specialists." },
  lead: "Experienced educators and subject specialists, teaching every paper with the examination in mind.",
  cta: { label: "Meet our faculty", href: null as Href },
};

export type Educator = {
  name: string;
  focus: string;
  photo: string;
  profile: Href;
  qualifications?: string;
  experience?: string;
  studiedAt?: string[];
  linkedin?: string;
  introduction?: string;
};

export const educators: Educator[] = [
  {
    name: "SK Manocha",
    focus: "General Studies · Polity & Governance",
    photo: "/assets/img/educators/sk-manocha-portrait.webp",
    profile: null,
    qualifications: "Postgraduate, Political Science",
    experience: "20+ years teaching UPSC",
    introduction: "Builds Polity from the Constitution up, and ties every topic to the way the examination asks about it.",
  },
  {
    name: "Brijender Singh",
    focus: "Essay",
    photo: "/assets/img/educators/brijender-singh-portrait.webp",
    profile: null,
    qualifications: "Postgraduate, English Literature",
    experience: "15+ years teaching UPSC",
    introduction: "Helps you find a clear argument, shape it into a structure and write it out within the time.",
  },
  {
    name: "Md. Rizwan",
    focus: "Geography optional",
    photo: "/assets/img/educators/md-rizwan-portrait.webp",
    profile: null,
    qualifications: "Postgraduate, Geography",
    experience: "15+ years teaching UPSC",
    introduction: "Teaches Geography through maps, diagrams and examples you can carry straight into the answer.",
  },
  {
    name: "Md. Tarique",
    focus: "History optional",
    photo: "/assets/img/educators/md-tarique-portrait.webp",
    profile: null,
    qualifications: "Postgraduate, History",
    experience: "15+ years teaching UPSC",
    introduction: "Turns long stretches of History into connected themes that are easier to revise and to write about.",
  },
  {
    name: "Mukul Pathak",
    focus: "Psychology optional",
    photo: "/assets/img/educators/mukul-pathak-portrait.webp",
    profile: null,
    qualifications: "Postgraduate, Psychology",
    experience: "10+ years teaching UPSC",
    introduction: "Links psychological theory to everyday examples, so the concepts stay with you in the examination hall.",
  },
  {
    name: "Shyam Sundar",
    focus: "Economics optional",
    photo: "/assets/img/educators/shyam-sundar-portrait.webp",
    profile: null,
    qualifications: "Postgraduate, Economics",
    experience: "15+ years teaching UPSC",
    introduction: "Explains Economics from first principles and then applies it to the questions India faces today.",
  },
];
