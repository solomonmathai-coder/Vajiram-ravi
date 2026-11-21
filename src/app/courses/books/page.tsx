import type { Metadata } from "next";
import CoursesExplorer from "@/components/courses/CoursesExplorer";
import CoursesHeader from "@/components/courses/CoursesHeader";
import RefFooter from "@/components/footer-ref/RefFooter";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export const metadata: Metadata = {
  title: "UPSC courses (book strips) · Vajiram & Ravi",
  description: "Every Vajiram & Ravi UPSC programme, from Prelims to Interview, in the classroom and LIVE-Online, in English and Hindi: dates, duration, fees and timings.",
};

/**
 * Our own version of the courses page (/courses/books, 19 Nov 2026), kept beside /courses (now Kevin's course
 * finder v2, ported): a strip for each category, its book taking each course in as the row moves
 * (CoursesExplorer), in the language of the homepage, with its header (CoursesHeader) and the final site's footer
 * (footer-ref/RefFooter). Below 768px it has a phone layout of its own (lib/canvas PHONE_PAGES).
 */
/** The page's ground: the cream jaali, fading out at the sides. The page's <main> carries it too, as it sits over the footer. */
const BG =
  "linear-gradient(90deg, rgb(255 250 243 / 0) 0%, rgb(255 250 243 / 0.94) 30%, rgb(255 250 243 / 0.94) 70%, rgb(255 250 243 / 0) 100%), url(/images/ornaments/bg-jaali.svg) 0 0 / 36px 36px repeat, #fffaf3";

export default function CoursesBooksPage() {
  return (
    <div
      className="min-h-svh font-[family-name:var(--font-plex)] text-[#1a1714]"
      style={{ background: BG }}
    >
      <CoursesHeader />
      <main id="main" className="cb-main" style={{ background: BG }}>
        <CoursesExplorer />
      </main>
      <RefFooter />
      <WhatsAppButton />
    </div>
  );
}
