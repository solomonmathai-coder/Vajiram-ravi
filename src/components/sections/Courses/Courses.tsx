import { ArrowRightIcon } from "@/components/icons";
import { ChevronButton, NUDGE, textLink } from "@/components/ui/Buttons";
import Photo from "@/components/ui/Photo";
import { Lead } from "@/components/ui/Typography";
import { courses, type Course } from "@/data/programmes";
import { cx } from "@/lib/cx";

function CourseCard({ course }: { course: Course }) {
  return (
    <a
      href="#"
      className="group/card flex flex-col overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-[0_4px_8px_rgba(28,26,23,.05)] [transition:translate_.35s_var(--ease-smooth),box-shadow_.35s_var(--ease-smooth)] hover:-translate-y-1 hover:shadow-[0_22px_40px_-20px_rgba(28,26,23,.28)]"
    >
      <div className="h-[130px] shrink-0 overflow-hidden bg-neutral-100">
        <Photo
          className="relative size-full transition-transform duration-700 ease-smooth group-hover/card:scale-106"
          src={course.image}
          alt={`${course.title} illustration`}
          sizes="302px"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-5 p-6">
        <div className="flex flex-col gap-3">
          <span className="self-start rounded-full bg-neutral-100 px-3 py-1 font-sans text-[14px]/[20px] font-medium whitespace-nowrap text-neutral-600">
            {course.courseCount} courses
          </span>
          <h3 className="font-display text-[20px]/[28px] font-bold text-neutral-900">{course.title}</h3>
          <p className="font-sans text-[14px]/[21px] font-medium text-neutral-600">Classroom · LIVE-Online</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-px bg-line" />
          <span className={textLink()}>
            View courses
            <ArrowRightIcon className={cx(NUDGE, "group-hover/card:translate-x-[3px]")} />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function Courses() {
  return (
    <section id="courses" aria-labelledby="c-h">
      <div className="relative mx-auto flex w-canvas flex-col gap-12 px-20 pt-16 pb-24">
        <div data-reveal className="flex items-end gap-20">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h2 id="c-h" className="font-display text-[38px]/[45px] font-semibold text-neutral-900">
              Featured UPSC CSE programmes
            </h2>
            <Lead>From your first GS class to the interview — pick the stage you’re at, then the programme.</Lead>
          </div>
          <ChevronButton href="#" size="md">
            {"View all "}
          </ChevronButton>
        </div>
        <div data-reveal-group className="grid grid-cols-[repeat(4,302px)] gap-x-6 gap-y-8">
          {courses.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
