import { ContactRings } from "@/components/icons";
import Photo from "@/components/ui/Photo";
import { Eyebrow } from "@/components/ui/Typography";
import { courses, timePreferences } from "@/data/programmes";
import CounsellingForm from "./CounsellingForm";

export default function Counselling() {
  return (
    <section id="contact" aria-labelledby="cb-h">
      <div className="relative mx-auto w-canvas px-38 pt-24 pb-16">
        <div
          data-reveal
          className="relative flex h-[630px] items-start gap-14 overflow-hidden rounded-[20px] border border-[#f3e0a0] bg-[#fdefb8] px-10 pt-10 pb-0"
        >
          <ContactRings className="pointer-events-none absolute -top-px -left-px" />
          <div className="relative flex h-full max-w-[860px] min-w-0 flex-1 flex-col items-center gap-4 overflow-hidden">
            <div className="flex w-full flex-col gap-5">
              <Eyebrow tone="rust">TALK TO US</Eyebrow>
              <div className="flex flex-col gap-3 text-neutral-900">
                <h2 id="cb-h" className="font-display text-[40px]/[47px] font-semibold">
                  Talk to a counsellor before you enrol
                </h2>
                <p className="font-sans text-[18px]/[25px] font-medium">
                  Schedule a free call with a Vajiram &amp; Ravi counsellor to answer your questions—no pressure to enrol.
                </p>
              </div>
            </div>
            <Photo
              className="relative h-[378px] w-[346px] flex-none"
              src="/images/counsellor.webp"
              alt="Vajiram & Ravi counsellor"
              sizes="346px"
            />
          </div>
          <CounsellingForm programmes={courses.map((course) => course.title)} timePreferences={timePreferences} />
        </div>
      </div>
    </section>
  );
}
