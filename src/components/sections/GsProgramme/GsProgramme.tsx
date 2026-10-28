import { FlagshipBadgeShape } from "@/components/icons";
import { KnobButton } from "@/components/ui/Buttons";
import Photo from "@/components/ui/Photo";
import { gsStats } from "@/data/home";
import { cx } from "@/lib/cx";

export default function GsProgramme() {
  return (
    <section className="bg-brand-50" aria-labelledby="gs-h">
      <div className="relative mx-auto w-canvas px-20 py-24">
        <div
          data-reveal
          className="group/card flex items-stretch overflow-hidden rounded-3xl border border-neutral-200 bg-white py-6 pr-6 pl-0"
        >
          <div className="flex w-[655px] flex-none flex-col items-start gap-12 overflow-hidden px-10 pt-6 pb-10">
            <div className="flex w-[575px] flex-col gap-8">
              <div className="flex flex-col gap-5">
                <div className="relative h-[47.8px] w-[172px]" aria-label="Our flagship programme">
                  <FlagshipBadgeShape className="absolute top-0 left-0" />
                  <span className="absolute top-[10.15px] left-[9.52px] h-[27.53px] w-[27.5px] bg-no-repeat [background-image:var(--image-logo)] [background-position:0_50%] [background-size:440.52%_106.67%]" />
                  <span className="absolute top-[9.53px] left-14 font-display text-[12px]/[14px] font-semibold whitespace-nowrap text-brand-800">
                    OUR FLAGSHIP
                    <br />
                    PROGRAMME
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h2 id="gs-h" className="font-display text-[32px]/[39px] font-semibold whitespace-nowrap text-neutral-900">
                    General Studies decides most of your
                    <br />
                    UPSC score
                  </h2>
                  <p className="font-sans text-[16px]/[23px] font-medium text-neutral-500">
                    Our GS Prelims &amp; Mains Programme covers the full syllabus with daily classes, printed study
                    material, Prelims and Mains tests and mentoring, in Classroom or LIVE-Online. Graduates take the 1-year
                    programme; college students start with the 2-year Fledgling.
                  </p>
                </div>
              </div>
              <div className="flex gap-10 rounded-[14px]">
                {gsStats.map((stat, i) => (
                  <div key={stat.stage} className={cx("flex min-w-0 flex-1 flex-col gap-3", i > 0 && "overflow-hidden pr-3.5")}>
                    <p className="font-display text-[16px]/[22px] font-semibold text-neutral-500">{stat.stage}</p>
                    <div>
                      <p className="font-display text-[0px]/[0] font-semibold whitespace-nowrap [font-feature-settings:'lnum'_1,'pnum'_1]">
                        <span className="text-[40px]/[47px] text-[#451b03]">{stat.marks}</span>
                        <span className="text-[18px]/[25px] font-medium text-neutral-600">{stat.total}</span>
                      </p>
                      <p className="font-sans text-[14px]/[21px] font-medium text-neutral-500">Marks come from General Studies</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <KnobButton href="#courses" size="md">
              Enrol in the GS programme
            </KnobButton>
          </div>
          <div className="flex w-[599px] flex-none overflow-hidden rounded-[20px] p-3 drop-shadow-[0_8px_12px_rgba(43,20,5,.06)]">
            <div className="flex-1 overflow-hidden rounded-xl">
              <Photo
                className="relative size-full transition-transform duration-1200 ease-smooth group-hover/card:scale-103"
                src="/images/gs-classroom.webp"
                alt="A Vajiram & Ravi GS classroom in session"
                sizes="575px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
