/**
 * The UPSC courses for the courses page (/courses): the course finder design the client shared (its
 * families, optional subjects and 80 courses, each with its Classroom / LIVE-Online and English / Hindi
 * versions and their banners, now in public/images/courses), with each version's batch details as its own
 * page on vajiramandravi.com showed them on 17 Nov 2026 (date of commencement, mode, duration, fee and course
 * time). A detail a page does not give is left out, and the card says "To be announced"; never invented.
 * TODO: the CMS should feed these, so they stay current.
 */

export type CourseMode = "classroom" | "online" | "both";
export type CourseLang = "en" | "hi";

export type CourseDetails = { start?: string; mode?: string; duration?: string; fee?: string; time?: string };

export type CourseVersion = { mode: CourseMode; lang: CourseLang; url: string; image: string; width: number; height: number; details: CourseDetails };

export type Course = { family: string; title: string; subject: string; versions: CourseVersion[] };

export const SITE = "https://vajiramandravi.com";

/** The families, in the design's order (GS Foundation's two lengths are shown as one category with two rows). */
export const courseFamilies: { key: string; label: string; url: string }[] = [
  { key: "gs-11", label: "GS Foundation — 11 Months", url: "/courses/upsc-general-studies/" },
  { key: "gs-2yr", label: "GS Foundation — 2 Years", url: "/courses/upsc-general-studies/" },
  { key: "optional", label: "Optional Subject", url: "/courses/upsc-optional-subject-courses/" },
  { key: "csat", label: "CSAT", url: "/courses/upsc-csat/" },
  { key: "interview", label: "Interview Guidance", url: "/courses/interview-guidance-program/" },
  { key: "mentorship", label: "Mentorship", url: "/courses/mentorship-programs/" },
  { key: "mains-ts", label: "Mains Test Series", url: "/courses/mains-test-series/" },
  { key: "prelims-ts", label: "Prelims Test Series", url: "/courses/prelims-test-series/" },
  { key: "optional-ts", label: "Optional Test Series", url: "/courses/upsc-mains-optional-subject-test-series/" },
  { key: "module", label: "Module Courses", url: "/courses/upsc-module-courses/" },
  { key: "crash", label: "Optional Crash Course", url: "/courses/upsc-crash-courses/" },
  { key: "enrichment", label: "Optional Enrichment", url: "/courses/optional-enrichment-course-upsc/" },
  { key: "ifos", label: "IFoS", url: "/courses/upsc-indian-forest-service-ifos-coaching/" },
  { key: "postal", label: "Postal Course", url: "/upsc-gs-postal-books/" },
];

/** The optional subjects, for the subject chips. */
export const courseSubjects: { key: string; label: string }[] = [
  { key: "agriculture", label: "Agriculture" },
  { key: "anthropology", label: "Anthropology" },
  { key: "commerce", label: "Commerce & Accountancy" },
  { key: "economics", label: "Economics" },
  { key: "forestry", label: "Forestry" },
  { key: "geography", label: "Geography" },
  { key: "geology", label: "Geology" },
  { key: "history", label: "History" },
  { key: "law", label: "Law" },
  { key: "maths", label: "Mathematics" },
  { key: "medical", label: "Medical Science" },
  { key: "philosophy", label: "Philosophy" },
  { key: "psir", label: "PSIR" },
  { key: "psychology", label: "Psychology" },
  { key: "pubad", label: "Public Administration" },
  { key: "sociology", label: "Sociology" },
];

export const courses: Course[] = [
  { family: "gs-11", title: "GS Prelims & Mains Programme", subject: "", versions: [
    { mode: "classroom", lang: "en", url: "/courses/upsc-gs-course/", image: "/images/courses/gs-prelims-mains-programme-classroom-en.webp", width: 450, height: 300, details: {"start": "27th November 2026", "mode": "Classroom", "duration": "11 Months", "fee": "Rs. 1,80,000 -Incl. GST | 1,95,000-Incl GST (GS+CSAT Course)", "time": "02:30 PM to 05:00 PM"} },
    { mode: "online", lang: "en", url: "/courses/upsc-gs-online-course/", image: "/images/courses/gs-prelims-mains-programme-online-en.webp", width: 450, height: 300, details: {"start": "27th November 2026", "mode": "LIVE-Online", "duration": "11 Months", "fee": "Rs. 1,60,000 -Incl. GST | 1,75,000-Incl GST (GS+CSAT Course)", "time": "02:30 PM to 05:00 PM"} },
  ] },
  { family: "gs-2yr", title: "GS 2-Year Fledgling Prelims & Mains Programme", subject: "", versions: [
    { mode: "classroom", lang: "en", url: "/courses/2-year-upsc-course/", image: "/images/courses/gs-2-year-fledgling-prelims-mains-programme-classroom-en.webp", width: 450, height: 300, details: {"start": "20th December 2026", "mode": "Classroom", "duration": "2 Years", "fee": "Rs.2,45,000/- (Incl. GST)", "time": "5:30 PM to 8:00 PM"} },
    { mode: "online", lang: "en", url: "/courses/2-year-upsc-online-course/", image: "/images/courses/gs-2-year-fledgling-prelims-mains-programme-online-en.webp", width: 450, height: 300, details: {"start": "20th December 2026", "mode": "LIVE-Online", "duration": "2 Years", "fee": "Rs. 2,25,000/- (Incl. GST)", "time": "5:30 PM to 8:00 PM"} },
  ] },
  { family: "optional", title: "Agriculture Optional Coaching", subject: "agriculture", versions: [
    { mode: "classroom", lang: "en", url: "/courses/upsc-optional-subject-courses/agriculture-classes/", image: "/images/courses/agriculture-optional-coaching-classroom-en.webp", width: 450, height: 300, details: {"start": "21st October 2026", "mode": "Classroom", "duration": "20 Weeks", "fee": "Rs. 54,000 (Incl. GST)", "time": "05:30 PM to 8:00 PM"} },
    { mode: "online", lang: "en", url: "/courses/upsc-optional-subject-courses/agriculture-online-classes/", image: "/images/courses/agriculture-optional-coaching-online-en.webp", width: 450, height: 300, details: {"start": "21st October 2026", "mode": "LIVE-Online", "duration": "20 Weeks", "fee": "Rs. 50,000 (Incl. GST)", "time": "05:30 PM to 8:00 PM"} },
  ] },
  { family: "optional", title: "Philosophy Optional Coaching", subject: "philosophy", versions: [
    { mode: "classroom", lang: "en", url: "/courses/upsc-optional-subject-courses/philosophy-classes/", image: "/images/courses/philosophy-optional-coaching-classroom-en.webp", width: 450, height: 300, details: {"mode": "Classroom", "duration": "20 Weeks", "time": "To Be Announced Later"} },
    { mode: "online", lang: "en", url: "/courses/upsc-optional-subject-courses/philosophy-online-classes/", image: "/images/courses/philosophy-optional-coaching-online-en.webp", width: 450, height: 300, details: {"start": "10th December 2026", "mode": "LIVE-Online", "duration": "20 Weeks", "fee": "Rs. 44,000 (Incl. GST)", "time": "7:30 AM to 10:00 AM"} },
  ] },
  { family: "optional", title: "Commerce and Accountancy Optional Coaching", subject: "commerce", versions: [
    { mode: "classroom", lang: "en", url: "/courses/upsc-optional-subject-courses/commerce-and-accountancy-classes/", image: "/images/courses/commerce-and-accountancy-optional-coaching-classroom-en.webp", width: 450, height: 300, details: {"start": "16th August  2026", "mode": "Classroom", "duration": "20 Weeks", "fee": "Rs. 54,000 (Incl. GST)", "time": "7:30 AM to 10:00 AM"} },
    { mode: "online", lang: "en", url: "/courses/upsc-optional-subject-courses/commerce-accountancy-online-classes/", image: "/images/courses/commerce-and-accountancy-optional-coaching-online-en.webp", width: 450, height: 300, details: {"start": "16th August  2026", "mode": "LIVE-Online", "duration": "20 Weeks", "fee": "Rs. 50,000 (Incl. GST)", "time": "7:30 AM to 10:00 AM"} },
  ] },
  { family: "optional", title: "Economics Optional Coaching", subject: "economics", versions: [
    { mode: "classroom", lang: "en", url: "/courses/upsc-optional-subject-courses/economics-classes/", image: "/images/courses/economics-optional-coaching-classroom-en.webp", width: 450, height: 300, details: {"start": "1st July 2026", "mode": "Classroom", "duration": "24 Weeks", "fee": "Rs. 54,000 (Incl. GST)", "time": "11:00 AM to 01:30 PM"} },
    { mode: "online", lang: "en", url: "/courses/upsc-optional-subject-courses/economics-online-classes/", image: "/images/courses/economics-optional-coaching-online-en.webp", width: 450, height: 300, details: {"start": "1st July 2026", "mode": "LIVE-Online", "duration": "24 Weeks", "fee": "Rs. 50,000 (Incl. GST)", "time": "11:00 AM to 01:30 PM"} },
  ] },
  { family: "optional", title: "Geography Optional Coaching", subject: "geography", versions: [
    { mode: "classroom", lang: "en", url: "/courses/upsc-optional-subject-courses/geography-classes/", image: "/images/courses/geography-optional-coaching-classroom-en.webp", width: 450, height: 300, details: {"start": "12th October 2026", "mode": "Classroom", "duration": "20 Weeks", "fee": "Rs. 54,000 (Incl. GST)", "time": "02:30 PM to 05:00 PM"} },
    { mode: "online", lang: "en", url: "/courses/upsc-optional-subject-courses/geography-online-classes/", image: "/images/courses/geography-optional-coaching-online-en.webp", width: 450, height: 300, details: {"start": "12th October 2026", "mode": "LIVE-Online", "duration": "20 Weeks", "fee": "Rs. 50,000 (Incl. GST)", "time": "02:30 PM to 05:00 PM"} },
  ] },
  { family: "optional", title: "History Optional Coaching", subject: "history", versions: [
    { mode: "classroom", lang: "en", url: "/courses/upsc-optional-subject-courses/history-classes/", image: "/images/courses/history-optional-coaching-classroom-en.webp", width: 450, height: 300, details: {"start": "10th October 2026", "mode": "CLASSROOM & LIVE-Online", "duration": "24 weeks", "fee": "Rs. 54,000 (Incl. GST)", "time": "5:30 PM to 08:00 PM"} },
    { mode: "online", lang: "en", url: "/courses/upsc-optional-subject-courses/history-online-classes/", image: "/images/courses/history-optional-coaching-online-en.webp", width: 450, height: 300, details: {"start": "10th October 2026", "mode": "LIVE-Online", "duration": "24 Weeks", "fee": "Rs. 50,000 (Incl. GST)", "time": "5:30 PM to 08:00 PM"} },
  ] },
  { family: "optional", title: "Mathematics Optional Coaching", subject: "maths", versions: [
    { mode: "classroom", lang: "en", url: "/courses/upsc-optional-subject-courses/mathematics-classes/", image: "/images/courses/mathematics-optional-coaching-classroom-en.webp", width: 450, height: 300, details: {"start": "10th September 2026", "mode": "Classroom", "duration": "30 Weeks", "fee": "Rs. 64,000 (Incl. GST)", "time": "7:30 AM to 10:00 AM"} },
    { mode: "online", lang: "en", url: "/courses/upsc-optional-subject-courses/mathematics-online-classes/", image: "/images/courses/mathematics-optional-coaching-online-en.webp", width: 450, height: 300, details: {"start": "10th September 2026", "mode": "LIVE-Online", "duration": "30 Weeks", "fee": "Rs. 60,000 (Incl. GST)", "time": "7:30 AM to 10:00 AM"} },
  ] },
  { family: "optional", title: "Political Science and International Relations (PSIR) Optional Coaching", subject: "psir", versions: [
    { mode: "classroom", lang: "en", url: "/courses/upsc-optional-subject-courses/psir-political-science-and-international-relations-classes/", image: "/images/courses/political-science-and-international-relations-psir-optional--classroom-en.webp", width: 450, height: 300, details: {"start": "16th September 2026", "mode": "Classroom", "duration": "22 Weeks", "fee": "Rs. 54,000 (Incl. GST)", "time": "2:30 PM to 05:00 PM"} },
    { mode: "online", lang: "en", url: "/courses/upsc-optional-subject-courses/psir-online-classes/", image: "/images/courses/political-science-and-international-relations-psir-optional--online-en.webp", width: 450, height: 300, details: {"start": "16th September 2026", "mode": "LIVE-Online", "duration": "22 Weeks", "fee": "Rs. 50,000 (Incl. GST)", "time": "2:30 PM to 05:00 PM"} },
  ] },
  { family: "optional", title: "Public Administration Optional Coaching", subject: "pubad", versions: [
    { mode: "classroom", lang: "en", url: "/courses/upsc-optional-subject-courses/public-administration-classes/", image: "/images/courses/public-administration-optional-coaching-classroom-en.webp", width: 450, height: 300, details: {"start": "5th October  2026", "mode": "Classroom", "duration": "20 Weeks", "fee": "Rs. 54,000 (Incl. GST)", "time": "11:00 AM to 01:30 PM"} },
    { mode: "online", lang: "en", url: "/courses/upsc-optional-subject-courses/public-administration-online-classes/", image: "/images/courses/public-administration-optional-coaching-online-en.webp", width: 450, height: 300, details: {"start": "5th October 2026", "mode": "LIVE-Online", "duration": "20 Weeks", "fee": "Rs. 50,000 (Incl. GST)", "time": "11:00 AM to 01:30 PM"} },
  ] },
  { family: "optional", title: "Psychology Optional Coaching", subject: "psychology", versions: [
    { mode: "classroom", lang: "en", url: "/courses/upsc-optional-subject-courses/psychology-classes/", image: "/images/courses/psychology-optional-coaching-classroom-en.webp", width: 450, height: 300, details: {"start": "20th  August 2026", "mode": "CLASSROOM & LIVE-Online", "duration": "24 Weeks", "fee": "Rs. 54,000 (Incl. GST)", "time": "02:30 PM to 05:00 PM"} },
    { mode: "online", lang: "en", url: "/courses/upsc-optional-subject-courses/psychology-online-classes/", image: "/images/courses/psychology-optional-coaching-online-en.webp", width: 450, height: 300, details: {"start": "20th August 2026", "mode": "LIVE-Online", "duration": "24 Weeks", "fee": "Rs. 50,000 (Incl. GST)", "time": "02:30 PM to 05:00 PM"} },
  ] },
  { family: "optional", title: "Sociology Optional Coaching", subject: "sociology", versions: [
    { mode: "classroom", lang: "en", url: "/courses/upsc-optional-subject-courses/sociology-classes/", image: "/images/courses/sociology-optional-coaching-classroom-en.webp", width: 450, height: 300, details: {"start": "6th October 2026", "mode": "Classroom", "duration": "20 Weeks", "fee": "Rs. 54,000 (Incl. GST)", "time": "02:30 PM to 05:00 PM"} },
    { mode: "online", lang: "en", url: "/courses/upsc-optional-subject-courses/sociology-online-classes/", image: "/images/courses/sociology-optional-coaching-online-en.webp", width: 450, height: 300, details: {"start": "6th October 2026", "mode": "LIVE-Online", "duration": "20 Weeks", "fee": "Rs. 50,000 (Incl. GST)", "time": "02:30 PM to 05:00 PM"} },
  ] },
  { family: "optional", title: "Law Optional Coaching", subject: "law", versions: [
    { mode: "classroom", lang: "en", url: "/courses/upsc-optional-subject-courses/law-classes/", image: "/images/courses/law-optional-coaching-classroom-en.webp", width: 450, height: 300, details: {"mode": "Online"} },
    { mode: "online", lang: "en", url: "/courses/upsc-optional-subject-courses/law-online-classes/", image: "/images/courses/law-optional-coaching-online-en.webp", width: 450, height: 300, details: {"start": "1st August 2026", "mode": "Online", "fee": "Rs. 50,000 (Incl. GST)", "time": "5:30 PM"} },
  ] },
  { family: "optional", title: "Anthropology Optional Coaching", subject: "anthropology", versions: [
    { mode: "classroom", lang: "en", url: "/courses/upsc-optional-subject-courses/anthropology-classes/", image: "/images/courses/anthropology-optional-coaching-classroom-en.webp", width: 450, height: 300, details: {"start": "6th October 2026", "mode": "CLASSROOM & LIVE-Online", "duration": "24 Weeks", "fee": "Rs. 54,000 (Incl. GST)", "time": "11:00 AM to 01:30 PM"} },
    { mode: "online", lang: "en", url: "/courses/upsc-optional-subject-courses/anthropology-online-classes/", image: "/images/courses/anthropology-optional-coaching-online-en.webp", width: 450, height: 300, details: {"start": "6th October 2026", "mode": "LIVE-Online", "duration": "24 Weeks", "fee": "Rs. 50,000 (Incl. GST)", "time": "11:00 AM to 01:30 PM"} },
  ] },
  { family: "csat", title: "CSAT Course", subject: "", versions: [
    { mode: "classroom", lang: "en", url: "/courses/upsc-csat-course/", image: "/images/courses/csat-course-classroom-en.webp", width: 450, height: 300, details: {"start": "28th November 2026", "mode": "Classroom", "duration": "3.5 Months", "fee": "Rs. 18,000 (Incl. GST)", "time": "11:00 AM to 01:30 PM"} },
    { mode: "online", lang: "en", url: "/courses/upsc-csat-online-course/", image: "/images/courses/csat-course-online-en.webp", width: 450, height: 300, details: {"start": "28th November 2026", "mode": "LIVE-Online", "duration": "3.5 Months", "fee": "Rs. 18,000 (Incl. GST)", "time": "11:00 AM to 01:30 PM"} },
  ] },
  { family: "interview", title: "UPSC CSE Interview Guidance Programme", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/interview-guidance-program/upsc-cse/", image: "/images/courses/upsc-cse-interview-guidance-programme-both-en.webp", width: 450, height: 300, details: {"start": "11th November 2026", "mode": "Offline/Online", "duration": "3.5 Months", "fee": "Rs. 600/- Incl. GST ( For non- Vajiram students)"} },
  ] },
  { family: "interview", title: "IFoS Interview Guidance Programme", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/interview-guidance-program/ifos/", image: "/images/courses/ifos-interview-guidance-programme-both-en.webp", width: 300, height: 200, details: {"start": "5th February 2026", "fee": "Rs. 500 (Incl. GST)"} },
  ] },
  { family: "mentorship", title: "StepUp Mentorship Programme 2027", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mentorship-program/", image: "/images/courses/stepup-mentorship-programme-2027-both-en.webp", width: 520, height: 347, details: {"start": "28th  October 2026 ( Batch XXII )", "mode": "Offline/Online", "fee": "Rs. 58,000 (Incl. GST)"} },
    { mode: "both", lang: "hi", url: "/courses/upsc-mentorship-program-hindi-medium/", image: "/images/courses/stepup-mentorship-programme-2027-both-hi.webp", width: 520, height: 346, details: {"start": "28th October 2026 (Batch XX )", "mode": "ऑफलाइन एवंम ऑनलाइन", "fee": "रु. 40,000 (जीएसटी सहित) - 15% प्रारंभिक छूट"} },
  ] },
  { family: "mentorship", title: "StepUp Mains Advance 2026", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/mentorship-programs/mentorship-progam-2026/", image: "/images/courses/stepup-mains-advance-2026-both-en.webp", width: 520, height: 346, details: {"start": "23rd November 2026", "mode": "Offline/Online", "fee": "Rs. 15,000 (Incl. GST)"} },
  ] },
  { family: "mentorship", title: "Stepup Express Batch 2026", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/mentorship-programs/step-up/", image: "/images/courses/stepup-express-batch-2026-both-en.webp", width: 520, height: 346, details: {"mode": "Offline/Online", "duration": "3 months", "fee": "Rs. 18,000 (Incl. GST)"} },
    { mode: "both", lang: "hi", url: "/courses/mentorship-programs/step-up-hindi/", image: "/images/courses/stepup-express-batch-2026-both-hi.webp", width: 520, height: 346, details: {"start": "2nd March 2026 (Batch IV )", "mode": "Offline/Online", "fee": "Rs. 13,000 - Incl. GST (10% Early Bird Discount)"} },
  ] },
  { family: "mentorship", title: "StepUp Mentorship (Prodigy 100)", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/mentorship-programs/prodigy-mentorship/", image: "/images/courses/stepup-mentorship-prodigy-100-both-en.webp", width: 300, height: 200, details: {"start": "1st November 2026", "mode": "Offline/Online", "fee": "Rs. 30,000 - Incl. GST"} },
  ] },
  { family: "mains-ts", title: "Sure Shot Mains Programme 2027 (Rankers Led Test Series)", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-test-series/", image: "/images/courses/sure-shot-mains-programme-2027-rankers-led-test-series-both-en.webp", width: 300, height: 200, details: {"start": "15th November 2026", "mode": "Offline/Online", "fee": "Rs. 23,500 (Incl. GST)"} },
    { mode: "both", lang: "hi", url: "/courses/upsc-mains-test-series-hindi-medium/", image: "/images/courses/sure-shot-mains-programme-2027-rankers-led-test-series-both-hi.webp", width: 300, height: 200, details: {"start": "15th November 2026", "mode": "Offline/Online", "fee": "Rs. 13,500 (Incl. GST)"} },
  ] },
  { family: "mains-ts", title: "Sure Shot Mains Test Series for Seniors", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/mains-test-series/sure-shot/", image: "/images/courses/sure-shot-mains-test-series-for-seniors-both-en.webp", width: 450, height: 300, details: {"start": "20th November 2026", "mode": "Offline & Online", "fee": "Rs. 22,000 (Incl. GST)"} },
  ] },
  { family: "mains-ts", title: "Mains Camp Rehearsals 2026", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/mains-test-series/mains-rehearsal/", image: "/images/courses/mains-camp-rehearsals-2026-both-en.webp", width: 300, height: 200, details: {"start": "7th August 2026", "mode": "Offline & Online | Hindi & English Medium", "fee": "Rs. 3500/ (with Evaluation)-Incl. GST | Rs. 600/ (without evaluation)-Incl GST"} },
  ] },
  { family: "mains-ts", title: "Mains CAMP 2026", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/mains-test-series/camp-mains/", image: "/images/courses/mains-camp-2026-both-en.webp", width: 450, height: 300, details: {"start": "20th November 2026", "mode": "Offline/Online", "fee": "Rs. 12,500/- (Incl. GST) | Rs. 7,000/- (Incl. GST)"} },
  ] },
  { family: "mains-ts", title: "Sure Shot Mains 2026 - FLT", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/mains-test-series/sure-shot-flt/", image: "/images/courses/sure-shot-mains-2026-flt-both-en.webp", width: 520, height: 347, details: {"start": "12th July 2026", "mode": "Offline & Online", "fee": "Rs. 7,500 (Incl. GST)"} },
  ] },
  { family: "mains-ts", title: "Sure Shot Mains 2026 - FLT Plus Sectional", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/mains-test-series/sure-shot-full-version/", image: "/images/courses/sure-shot-mains-2026-flt-plus-sectional-both-en.webp", width: 520, height: 347, details: {"start": "12th July  2026", "mode": "Offline & Online", "fee": "Rs. 14,000 (Incl. GST)"} },
  ] },
  { family: "mains-ts", title: "Sure Shot PYQ Dominator 2027", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/mains-test-series/sureshot-pyq-dominator/", image: "/images/courses/sure-shot-pyq-dominator-2027-both-en.webp", width: 450, height: 300, details: {"start": "10th May 2026", "mode": "Offline/Online", "fee": "Rs. 24,500 (Incl. GST)"} },
  ] },
  { family: "mains-ts", title: "Sure Shot Mains Test Series 2026", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/mains-test-series/sureshot/", image: "/images/courses/sure-shot-mains-test-series-2026-both-en.webp", width: 450, height: 300, details: {"mode": "Offline/Online", "fee": "Rs 19000/ - Inc. GST"} },
  ] },
  { family: "mains-ts", title: "Essay Test Series 2026", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/mains-test-series/essay/", image: "/images/courses/essay-test-series-2026-both-en.webp", width: 450, height: 300, details: {"start": "1st October 2026", "mode": "Offline/Online", "duration": "01 October 2026 – 30 November 2026", "fee": "Rs. 4,000/- (Incl. GST)"} },
  ] },
  { family: "mains-ts", title: "Sure Shot PYQ Dominator", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/mains-test-series/sureshot-pyqs/", image: "/images/courses/sure-shot-pyq-dominator-both-en.webp", width: 450, height: 300, details: {"mode": "Offline/Online", "fee": "Rs. 14,500 (Incl. GST)"} },
  ] },
  { family: "prelims-ts", title: "PowerUp Current Affairs Test Series", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/prelims-test-series/powerup-current-affairs/", image: "/images/courses/powerup-current-affairs-test-series-both-en.webp", width: 450, height: 300, details: {"start": "18th November 2026", "mode": "Offline/Online", "fee": "Rs. 6000 -Incl. GST (Offline batch)  | 5000-Incl GST (Online batch)"} },
  ] },
  { family: "prelims-ts", title: "PowerUP Prelims Test Series Programme", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/prelims-test-series/powerup", image: "/images/courses/powerup-prelims-test-series-programme-both-en.webp", width: 450, height: 300, details: {"start": "6th December 2026", "mode": "Offline/Online", "fee": "Rs. 14,000 -Incl. GST (Offline batch)  |  12,500-Incl GST (Online batch)"} },
  ] },
  { family: "prelims-ts", title: "PowerUp Combo", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/prelims-test-series/powerup-prelims-combo/", image: "/images/courses/powerup-combo-both-en.webp", width: 450, height: 300, details: {"start": "6th December 2026", "mode": "Offline/Online", "fee": "Rs. 17,000 -Incl. GST (PowerUp Combo Offline batch)  | 15,000-Incl GST (PowerUp Combo Online batch)"} },
  ] },
  { family: "prelims-ts", title: "CSAT Test Series", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/prelims-test-series/cast-test-series/", image: "/images/courses/csat-test-series-both-en.webp", width: 450, height: 300, details: {} },
  ] },
  { family: "prelims-ts", title: "Prelims CAMP", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/prelims-test-series/camp/", image: "/images/courses/prelims-camp-both-en.webp", width: 450, height: 300, details: {"start": "23rd November 2026", "mode": "Offline/Online", "fee": "Rs. 8,500 -Incl. GST (Offline Batch)  | 7,500-Incl GST (Online Batch)"} },
    { mode: "both", lang: "hi", url: "/courses/prelims-test-series/camp-hindi/", image: "/images/courses/prelims-camp-both-hi.webp", width: 520, height: 346, details: {"start": "16th February 2026", "mode": "Offline/Online", "fee": "Rs. 5,000 (Incl. GST) For Offline Batch | Rs. 4500 (Incl. GST) For Online Batch"} },
  ] },
  { family: "prelims-ts", title: "Prelims Plus Test Series", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/prelims-test-series/plus/", image: "/images/courses/prelims-plus-test-series-both-en.webp", width: 450, height: 300, details: {"start": "1st March 2026 (Batch 2) | 1st April 2026 (Batch 3)", "mode": "Offline/Online", "fee": "Rs 7000/ Inc. GST(Offline Batch) | Rs 6000/  Inc. GST(Online Batch)"} },
  ] },
  { family: "optional-ts", title: "Agriculture Optional Year-Long Test Series 2027", subject: "agriculture", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-optional-subject-test-series/agriculture-year-long/", image: "/images/courses/agriculture-optional-year-long-test-series-2027-both-en.webp", width: 450, height: 300, details: {"start": "14th August 2026", "mode": "Online/Offline", "fee": "Rs. 6,500 (Incl. GST)"} },
  ] },
  { family: "optional-ts", title: "Sociology Optional Test Series", subject: "sociology", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-optional-subject-test-series/sociology-tests/", image: "/images/courses/sociology-optional-test-series-both-en.webp", width: 450, height: 300, details: {"start": "13th June, 2026", "mode": "Online/Offline", "duration": "03 Months", "fee": "Rs. 12,000 (Incl. GST)"} },
  ] },
  { family: "optional-ts", title: "Law Optional Test Series", subject: "law", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-optional-subject-test-series/law-optional/", image: "/images/courses/law-optional-test-series-both-en.webp", width: 450, height: 300, details: {"start": "14th June 2026", "mode": "Offline/Online", "fee": "Rs. 12,000 (Incl. GST) | 10% discount for Ex-Vajiram students or Mains Writing students (any one applicable)"} },
  ] },
  { family: "optional-ts", title: "Mathematics Optional Test Series", subject: "maths", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-optional-subject-test-series/mathematics-tests/", image: "/images/courses/mathematics-optional-test-series-both-en.webp", width: 450, height: 300, details: {"start": "15th June, 2026", "mode": "Online/Offline", "duration": "Till Mains 2026", "fee": "Rs.10,000/- Inc. GST"} },
  ] },
  { family: "optional-ts", title: "Agriculture Optional Mains Test Series", subject: "agriculture", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-optional-subject-test-series/agriculture-tests/", image: "/images/courses/agriculture-optional-year-long-test-series-2027-both-en.webp", width: 450, height: 300, details: {"start": "18th June 2026", "mode": "Online/Offline", "duration": "02 Months", "fee": "Rs.8500/- Inc. GST (Offline Batch) /  |  Rs.6500/- Inc. GST(Online Batch)"} },
  ] },
  { family: "optional-ts", title: "History Optional Test Series", subject: "history", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-optional-subject-test-series/history-tests/", image: "/images/courses/history-optional-test-series-both-en.webp", width: 450, height: 300, details: {"start": "7th June 2026", "mode": "Online/Offline", "fee": "Rs. 12,000 (Incl. GST)"} },
  ] },
  { family: "optional-ts", title: "Anthropology Optional Test Series", subject: "anthropology", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-optional-subject-test-series/anthropology-tests/", image: "/images/courses/anthropology-optional-test-series-both-en.webp", width: 450, height: 300, details: {"start": "21st  June, 2026", "mode": "Online/Offline", "duration": "03 Months", "fee": "Rs. 12,000 (Incl. GST)"} },
  ] },
  { family: "optional-ts", title: "PSIR Optional Test Series", subject: "psir", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-optional-subject-test-series/psir-tests/", image: "/images/courses/psir-optional-test-series-both-en.webp", width: 450, height: 300, details: {"start": "7th June, 2026", "mode": "Online/Offline", "duration": "2.5 Months", "fee": "Rs. 12,000 (Incl. GST)"} },
  ] },
  { family: "optional-ts", title: "Economics Optional Test Series", subject: "economics", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-optional-subject-test-series/economics-tests/", image: "/images/courses/economics-optional-test-series-both-en.webp", width: 450, height: 300, details: {"start": "25th June, 2026", "mode": "Online/Offline", "duration": "2.5 Months", "fee": "Rs. 12,000 (Incl. GST)"} },
  ] },
  { family: "optional-ts", title: "Public Administration Optional Test Series", subject: "pubad", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-optional-subject-test-series/public-administration-pubad-tests/", image: "/images/courses/public-administration-optional-test-series-both-en.webp", width: 450, height: 300, details: {"start": "15th June 2026", "mode": "Online/Offline", "fee": "Rs.12,000/- Inclusive GST"} },
  ] },
  { family: "optional-ts", title: "Mathematics Optional Year-long Test Series 2026–27", subject: "maths", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-optional-subject-test-series/mathematics-tests-2026-27/", image: "/images/courses/mathematics-optional-test-series-both-en.webp", width: 450, height: 300, details: {"start": "1st July, 2026", "mode": "Online/Offline", "duration": "July 2026 to July  2027", "fee": "Rs. 18,880 - Incl. GST (10% discount applicable for existing Mathematics Optional students)"} },
  ] },
  { family: "optional-ts", title: "GEOGRAPHY Optional Daily Answer Writing With Mains Test Series Program", subject: "geography", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-optional-subject-test-series/geography-daily-answer-writing/", image: "/images/courses/geography-optional-daily-answer-writing-with-mains-test-seri-both-en.webp", width: 450, height: 300, details: {"start": "14th June 2025  (Daily answer writing Practice on 04th of June, 2025)", "mode": "Offline/Online", "duration": "3 Months", "fee": "Rs. 12,000 (Incl. GST)"} },
  ] },
  { family: "optional-ts", title: "Philosophy Optional Test Series", subject: "philosophy", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-optional-subject-test-series/philosophy-tests/", image: "/images/courses/philosophy-optional-test-series-both-en.webp", width: 450, height: 300, details: {"start": "30th June, 2024", "mode": "Online/Offline", "duration": "02 Months", "fee": "Rs.12,000/-"} },
  ] },
  { family: "optional-ts", title: "Commerce & Accountancy Optional Test Series", subject: "commerce", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-optional-subject-test-series/commerce-accountancy-tests/", image: "/images/courses/commerce-accountancy-optional-test-series-both-en.webp", width: 450, height: 300, details: {"mode": "Online/Offline", "duration": "02 Months", "fee": "Rs.12,000/-"} },
  ] },
  { family: "optional-ts", title: "Psychology Optional Test Series", subject: "psychology", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-optional-subject-test-series/psychology-tests/", image: "/images/courses/psychology-optional-test-series-both-en.webp", width: 450, height: 300, details: {"start": "15th June 2025", "mode": "Online/Offline", "duration": "03 Months", "fee": "Rs. 12,000 (Incl. GST)"} },
  ] },
  { family: "optional-ts", title: "Medical Science Optional Test Series", subject: "medical", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-mains-optional-subject-test-series/medical-science-tests/", image: "/images/courses/medical-science-optional-test-series-both-en.webp", width: 450, height: 300, details: {"start": "13th July 2024", "mode": "Offline/Online", "fee": "Rs. 12,000 (Incl. GST)"} },
  ] },
  { family: "module", title: "Ranker’s Programme", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-module-courses/upsc-rankers-program/", image: "/images/courses/ranker-s-programme-both-en.webp", width: 450, height: 300, details: {"start": "1st July 2026", "mode": "Offline/Online", "fee": "Rs. 6,000 (Incl. GST)"} },
  ] },
  { family: "module", title: "SMART Mains Current Affairs", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-module-courses/mains-current-affairs-programme/", image: "/images/courses/smart-mains-current-affairs-both-en.webp", width: 450, height: 300, details: {"start": "1st July 2026", "mode": "Offline/Online", "fee": "Rs 10,000/ - Inc. GST | Rs 19,500/ - Inc GST"} },
  ] },
  { family: "module", title: "SMART Current Affairs Programme for UPSC Prelims and Mains 2027", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-module-courses/current-affairs-course/", image: "/images/courses/smart-current-affairs-programme-for-upsc-prelims-and-mains-2-both-en.webp", width: 450, height: 300, details: {"start": "5th January 2027", "mode": "Offline/Online", "fee": "Rs. 20,000 (Incl. GST)"} },
  ] },
  { family: "module", title: "SMART Prelims Current Affairs Programme 2026", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-module-courses/prelims-current-affairs-programme/", image: "/images/courses/smart-prelims-current-affairs-programme-2026-both-en.webp", width: 450, height: 300, details: {"start": "16th February 2026 ( Batch II )", "mode": "Offline/Online", "fee": "Rs. 8000.0 (Incl. GST)"} },
  ] },
  { family: "module", title: "Economics Module for General Studies 2027", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-module-courses/general-studies-economics-module-for-upsc/", image: "/images/courses/economics-module-for-general-studies-2027-both-en.webp", width: 450, height: 300, details: {"start": "25th August 2026", "mode": "CLASSROOM & LIVE-Online", "fee": "Rs. 22,000 (Incl. GST) | Early Bird Offer: 10% Off | Ex-Vajiram Students: 15% Off", "time": "7:30 AM"} },
  ] },
  { family: "module", title: "Ethics Crash Course 2027", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-module-courses/upsc-ethics-crash-course-2026/", image: "/images/courses/ethics-crash-course-2027-both-en.webp", width: 300, height: 200, details: {"start": "To be Announced Soon", "mode": "Offline/Online"} },
  ] },
  { family: "module", title: "Ethics Marks Improvement Program 2026", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-module-courses/ethics-course-for-upsc/", image: "/images/courses/ethics-marks-improvement-program-2026-both-en.webp", width: 450, height: 300, details: {"start": "24th September 2026", "mode": "Classroom & LIVE Online", "fee": "Rs. 10,000 (Incl. GST)"} },
  ] },
  { family: "module", title: "Ethics Answer Writing Enrichment Program- 2026", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-module-courses/ethics-writing-program/", image: "/images/courses/ethics-answer-writing-enrichment-program-2026-both-en.webp", width: 450, height: 300, details: {"start": "26th November 2026", "mode": "Offline/Online", "fee": "Rs. 8000/- Incl GST", "time": "2:30 PM"} },
  ] },
  { family: "module", title: "Essay Module Course", subject: "", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-module-courses/essay-course/", image: "/images/courses/essay-module-course-both-en.webp", width: 450, height: 300, details: {"mode": "Classroom & LIVE-Online", "fee": "Rs. 12,000 (Incl. GST)", "time": "11:00 AM"} },
  ] },
  { family: "crash", title: "History Optional Crash Course & Test Series", subject: "history", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-crash-courses/history-course/", image: "/images/courses/history-optional-crash-course-test-series-both-en.webp", width: 450, height: 300, details: {"start": "3rd June 2025", "mode": "Offline/Online", "fee": "Rs. 15,000 (Incl. GST)"} },
  ] },
  { family: "crash", title: "PSIR Optional Crash Course & Test Series", subject: "psir", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-crash-courses/political-science-international-relations-course/", image: "/images/courses/psir-optional-crash-course-test-series-both-en.webp", width: 450, height: 300, details: {"mode": "Offline/Online"} },
  ] },
  { family: "crash", title: "Mathematics Optional Crash Course & Test Series", subject: "maths", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-crash-courses/mathematics-course/", image: "/images/courses/mathematics-optional-crash-course-test-series-both-en.webp", width: 450, height: 300, details: {"start": "15th June 2026", "mode": "Offline/Online", "fee": "Rs. 15,000 (Incl. GST)", "time": "11:00 AM to 01:00 PM"} },
  ] },
  { family: "crash", title: "Commerce & Accountancy Optional Test Series Cum Crash Course", subject: "commerce", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-crash-courses/commerce-and-accountancy-course/", image: "/images/courses/commerce-accountancy-optional-test-series-cum-crash-course-both-en.webp", width: 450, height: 300, details: {"mode": "Offline/Online", "duration": "3 Months"} },
  ] },
  { family: "crash", title: "Sociology Optional Crash Course", subject: "sociology", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-crash-courses/sociology-course/", image: "/images/courses/sociology-optional-crash-course-both-en.webp", width: 450, height: 300, details: {"start": "16th November 2026", "mode": "Offline/Online", "duration": "16th November to 11th December", "fee": "Rs.8,000 (Incl. GST)"} },
  ] },
  { family: "crash", title: "Medical Science Crash Course", subject: "medical", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-optional-subject-courses/medical-science-crash-course/", image: "/images/courses/medical-science-crash-course-both-en.webp", width: 450, height: 300, details: {"mode": "CLASSROOM & LIVE-Online", "duration": "3-4 Months", "fee": "Rs 40,000 (Incl. GST)"} },
  ] },
  { family: "enrichment", title: "Master Course on PSIR Answer writing", subject: "psir", versions: [
    { mode: "both", lang: "en", url: "/courses/optional-enrichment-course-upsc/psir-political-science-and-international-relations/", image: "/images/courses/master-course-on-psir-answer-writing-both-en.webp", width: 300, height: 200, details: {"start": "11th July 2026", "mode": "Online", "duration": "26 weeks", "fee": "Rs. 8,500 (Incl. GST)"} },
  ] },
  { family: "enrichment", title: "Sociology Optional Enrichment Programme 2026", subject: "sociology", versions: [
    { mode: "both", lang: "en", url: "/courses/optional-enrichment-course-upsc/sociology/", image: "/images/courses/sociology-optional-enrichment-programme-2026-both-en.webp", width: 450, height: 300, details: {"start": "1st October 2026", "mode": "Offline/Online", "duration": "14 weeks", "fee": "Rs. 17000/ (Inc. GST)"} },
  ] },
  { family: "enrichment", title: "History Optional Enrichment Programme 2026", subject: "history", versions: [
    { mode: "both", lang: "en", url: "/courses/optional-enrichment-course-upsc/history/", image: "/images/courses/history-optional-enrichment-programme-2026-both-en.webp", width: 450, height: 300, details: {"start": "26th September 2026", "mode": "Online/Offline", "duration": "4 Months", "fee": "Rs. 17,000 (Incl. GST)"} },
  ] },
  { family: "enrichment", title: "Anthropology Optional Enrichment Programme 2026", subject: "anthropology", versions: [
    { mode: "both", lang: "en", url: "/courses/optional-enrichment-course-upsc/anthropology/", image: "/images/courses/anthropology-optional-enrichment-programme-2026-both-en.webp", width: 300, height: 200, details: {"start": "10th October 2026", "mode": "Online", "fee": "Rs 17000/ - Inc. GST"} },
  ] },
  { family: "enrichment", title: "Public Administration Optional Enrichment Programme", subject: "pubad", versions: [
    { mode: "both", lang: "en", url: "/courses/optional-enrichment-course-upsc/public-administration/", image: "/images/courses/public-administration-optional-enrichment-programme-both-en.webp", width: 450, height: 300, details: {"start": "1st July 2026", "mode": "Online", "duration": "3 Months", "fee": "Rs. 17,000 (Incl. GST)"} },
  ] },
  { family: "enrichment", title: "Sociology Enrichment- Advanced Test Practice Course- Dec Batch 2025", subject: "sociology", versions: [
    { mode: "both", lang: "en", url: "/courses/optional-enrichment-course-upsc/sociology-advanced/", image: "/images/courses/sociology-optional-enrichment-programme-2026-both-en.webp", width: 450, height: 300, details: {} },
  ] },
  { family: "ifos", title: "Forestry Optional Course", subject: "forestry", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-indian-forest-service-ifos-coaching/forestry/", image: "/images/courses/forestry-optional-course-both-en.webp", width: 450, height: 300, details: {"start": "9th September 2025", "mode": "LIVE-Online", "duration": "20 days", "fee": "Rs. 21,000 (Incl. GST)", "time": "9:30 AM to 2:00 PM"} },
  ] },
  { family: "ifos", title: "Forestry Test Series", subject: "forestry", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-indian-forest-service-ifos-coaching/forestry-tests/", image: "/images/courses/forestry-test-series-both-en.webp", width: 450, height: 300, details: {"start": "21st September 2025(Test) | 13th October 2025 (Daily Answer Writing)", "mode": "CLASSROOM & LIVE-Online", "fee": "Rs. 7,500 (Incl. GST)"} },
  ] },
  { family: "ifos", title: "Geology Optional Course", subject: "geology", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-indian-forest-service-ifos-coaching/geology/", image: "/images/courses/geology-optional-course-both-en.webp", width: 450, height: 300, details: {"start": "5th September 2025", "mode": "Online", "fee": "Rs. 21,000 (Incl. GST)", "time": "6:00 to 08:00 AM ( Saturday and Sunday: 08:00 AM to 2:00 PM (30-minute break))"} },
  ] },
  { family: "ifos", title: "Geology Optional Test Series", subject: "geology", versions: [
    { mode: "both", lang: "en", url: "/courses/upsc-indian-forest-service-ifos-coaching/geology-tests/", image: "/images/courses/geology-optional-test-series-both-en.webp", width: 450, height: 300, details: {"start": "17th September 2025", "mode": "CLASSROOM & LIVE-Online", "fee": "Rs. 7,500 (Incl. GST)"} },
  ] },
  { family: "postal", title: "Postal Course", subject: "", versions: [
    { mode: "both", lang: "en", url: "/upsc-gs-postal-books/", image: "/images/courses/postal-course-both-en.webp", width: 450, height: 300, details: {} },
  ] },
];
