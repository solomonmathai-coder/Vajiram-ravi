import { LinkedInIcon } from "@/components/icons";
import Photo from "@/components/ui/Photo";
import TrackCarousel from "@/components/ui/TrackCarousel";
import { Lead, SectionTitle } from "@/components/ui/Typography";
import { faculty, type Educator } from "@/data/faculty";

const LINK_BOX = "flex size-11 flex-none items-start justify-end rounded-lg pt-[2.5px]";

function EducatorCard({ educator }: { educator: Educator }) {
  return (
    <article className="group/card flex h-[424px] w-80 flex-none flex-col gap-3.5 rounded-[20px] bg-neutral-50 p-4 shadow-[0_0_0_1px_var(--color-neutral-200)] [transition:box-shadow_.35s_var(--ease-smooth),translate_.35s_var(--ease-smooth)] hover:-translate-y-[3px] hover:shadow-[0_0_0_1px_var(--color-neutral-300),0_18px_34px_-18px_rgba(43,20,5,.28)]">
      <div className="h-[307px] shrink-0 overflow-hidden rounded-[14px] bg-white">
        <Photo
          className="relative size-full transition-transform duration-600 ease-smooth group-hover/card:scale-104"
          src={educator.image}
          alt={educator.name}
          sizes="288px"
        />
      </div>
      <div className="flex items-start overflow-hidden">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[18px]/[25px] font-semibold text-neutral-900">{educator.name}</h3>
          <p className="font-sans text-[14px]/[23px] font-medium text-neutral-600">{educator.subject}</p>
        </div>
        {educator.linkedIn ? (
          <a className={`group/li ${LINK_BOX}`} href="#" aria-label={`${educator.name} on LinkedIn`}>
            <LinkedInIcon className="transition-transform duration-250 ease-smooth group-hover/li:scale-110" />
          </a>
        ) : (
          <span className={LINK_BOX} />
        )}
      </div>
    </article>
  );
}

export default function Faculty() {
  return (
    <section className="overflow-x-clip" aria-labelledby="fac-h">
      <div className="relative mx-auto flex w-canvas flex-col gap-12 px-20 py-24">
        <div data-reveal className="flex flex-col gap-3">
          <SectionTitle id="fac-h" className="w-[1000px]">
            Learn from top educators
          </SectionTitle>
          <Lead className="w-[760px]">Subject specialists for every GS paper, the essay, the optionals and the interview.</Lead>
        </div>
        <TrackCarousel
          reveal
          className="relative flex flex-col items-center gap-6"
          viewClassName="w-full touch-pan-y [clip-path:inset(-60px_-100vw_-60px_-1px)]"
          trackClassName="flex w-max items-stretch gap-4 transition-transform duration-700 ease-smooth"
          arrows={{ prev: "top-[212px] left-0", next: "top-[212px] right-0" }}
          step={336}
          pages={3}
          dotsLabel="Choose faculty page"
          prevLabel="Previous educators"
          nextLabel="Next educators"
        >
          {faculty.map((educator) => (
            <EducatorCard key={educator.name} educator={educator} />
          ))}
        </TrackCarousel>
      </div>
    </section>
  );
}
