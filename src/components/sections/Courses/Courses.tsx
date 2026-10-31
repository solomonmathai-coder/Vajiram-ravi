import { SplitButton } from "@/components/ui/Buttons";
import { Lead } from "@/components/ui/Typography";
import { courses } from "@/data/home";
import CourseRail from "./CourseRail";

/**
 * Featured programmes: the heading row from the design stays at the top while the course cards slide
 * past below it on a warm glow (CourseRail).
 */
export default function Courses() {
  return (
    <section id="courses" className="bg-white" aria-labelledby="courses-title">
      <CourseRail courses={courses.items}>
        <div className="flex items-end gap-20">
          <div className="flex min-w-px flex-1 flex-col gap-2">
            <h2 id="courses-title" className="font-display text-[38px]/[45px] font-semibold text-neutral-900">
              {courses.heading}
            </h2>
            <Lead tone="body">{courses.intro}</Lead>
          </div>
          <SplitButton href={courses.viewAll.href}>{courses.viewAll.label}</SplitButton>
        </div>
      </CourseRail>
    </section>
  );
}
