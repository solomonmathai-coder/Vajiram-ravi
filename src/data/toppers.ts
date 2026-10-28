export type Topper = {
  rank: number;
  name: string;
  /** Vajiram & Ravi programmes the topper took. */
  programme: string;
  image: string;
};

/** Years offered by the results tabs, newest first. */
export const resultYears = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];

/** UPSC CSE 2025, ranks 1 to 10. */
export const toppers: Topper[] = [
  { rank: 1, name: "Anuj Agnihotri", programme: "Interview Guidance Programme (IGP)", image: "/images/toppers/anuj-agnihotri.webp" },
  { rank: 2, name: "Rajeshwari Suve M", programme: "PowerUp Prelims Test Series, IGP, Mains Test Series", image: "/images/toppers/rajeshwari-suve-m.webp" },
  { rank: 3, name: "Akansh Dhull", programme: "GS Prelims cum Mains Classroom Programme", image: "/images/toppers/akansh-dhull.webp" },
  { rank: 4, name: "Raghav Jhunjhunwala", programme: "Interview Guidance Programme (IGP)", image: "/images/toppers/raghav-jhunjhunwala.webp" },
  { rank: 5, name: "Ishan Bhatnagar", programme: "Sociology Optional, Prelims CAMP, IGP", image: "/images/toppers/ishan-bhatnagar.webp" },
  { rank: 6, name: "Zinnia Aurora", programme: "GS Ethics Module, IGP, Power Up 23", image: "/images/toppers/zinnia-aurora.webp" },
  { rank: 7, name: "A R Rajah Mohaideen", programme: "Interview Guidance Programme (IGP)", image: "/images/toppers/a-r-rajah-mohaideen.webp" },
  { rank: 8, name: "Pakshal Secretry", programme: "Mains Camp, IGP", image: "/images/toppers/pakshal-secretry.webp" },
  { rank: 9, name: "Astha Jain", programme: "Interview Guidance Programme (IGP)", image: "/images/toppers/astha-jain.webp" },
  { rank: 10, name: "Ujjwal Priyank", programme: "Interview Guidance Programme (IGP)", image: "/images/toppers/ujjwal-priyank.webp" },
];

export type Story = { topper: Topper; quote: string; exam: string };

export const stories: Story[] = [
  {
    topper: toppers[0],
    quote:
      "The mock interviews felt closer to the real board than anything else I tried. The feedback after each round was honest and specific.",
    exam: "CSE 2025",
  },
  {
    topper: toppers[1],
    quote:
      "The test series showed me exactly where I was losing marks. By the last few papers I was finishing on time and still checking my answers.",
    exam: "CSE 2025",
  },
];
