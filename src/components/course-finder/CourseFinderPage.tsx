import CourseFinder from "./CourseFinder";
import CourseFinderNav from "./CourseFinderNav";
import "./base.css";
import "./shared.css";
import "./programme-shelf.css";
import "./course-finder.css";
import "./ref-nav.css";

/**
 * Kevin's course finder page (course-finder.html, `kevin` branch commit 58f580a) under .cf-page, his body:
 * his fixed nav over the paper head, then the finder. Its stylesheets load here in his order (the homepage's shared
 * rules, the books, the finder, the nav). The site's footer and WhatsApp button follow outside it (app/courses).
 * The cards are rendered for the build's date and redrawn for the visitor's (CourseFinder).
 */
export default function CourseFinderPage() {
  const d = new Date();
  const buildDay = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return (
    <div className="cf-page">
      <CourseFinderNav />
      <CourseFinder buildDay={buildDay} />
    </div>
  );
}
