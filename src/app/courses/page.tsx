import type { Metadata } from "next";
import CourseFinderPage from "@/components/course-finder/CourseFinderPage";
import RefFooter from "@/components/footer-ref/RefFooter";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export const metadata: Metadata = {
  title: "UPSC courses · Vajiram & Ravi",
  description:
    "Find your UPSC course at Vajiram & Ravi: GS Foundation, optional subjects, CSAT, mentorship, Prelims and Mains test series and interview guidance, in Classroom and LIVE-Online, English and Hindi.",
};

/**
 * The courses page (/courses): Kevin's course finder v2 from the `kevin` branch (commit 58f580a), ported to
 * React in components/course-finder: his fixed nav over a paper head with the figures, the sticky search and
 * Mode / Medium / Target year dropdowns, the category rail, Our Top Picks and a section per category (its
 * book, chips and a sideways row of course cards), and the counsellor banner; then the final site's footer
 * (footer-ref/RefFooter, as Kevin's page has it: without the current affairs card and the debossed name) and the WhatsApp button. Our earlier version (the books and their strips) is at /courses/books.
 */
export default function CoursesPage() {
  return (
    <>
      <CourseFinderPage />
      <RefFooter news={false} word={false} />
      <WhatsAppButton />
    </>
  );
}
