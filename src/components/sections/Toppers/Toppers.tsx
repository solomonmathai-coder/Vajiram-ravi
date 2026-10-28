import { BannerRings } from "@/components/icons";
import { ChevronButton, KnobButton } from "@/components/ui/Buttons";
import Photo from "@/components/ui/Photo";
import RankBadge from "@/components/ui/RankBadge";
import { Lead, SectionTitle } from "@/components/ui/Typography";
import { resultYears, toppers, type Topper } from "@/data/toppers";
import ToppersBoard from "./ToppersBoard";

const BANNER_AVATARS = 5;

function TopperCard({ topper }: { topper: Topper }) {
  return (
    <article className="group/card flex flex-col gap-3.5 rounded-2xl border border-neutral-200 bg-white px-3 pt-3 pb-4 [transition:box-shadow_.35s_var(--ease-smooth),translate_.35s_var(--ease-smooth),border-color_.35s] hover:-translate-y-[3px] hover:border-neutral-300 hover:shadow-[0_18px_34px_-18px_rgba(43,20,5,.28)]">
      <div className="relative h-[236px] shrink-0 overflow-hidden rounded-xl bg-brand-100">
        <Photo
          className="absolute inset-0 transition-transform duration-600 ease-smooth group-hover/card:scale-104"
          src={topper.image}
          alt={topper.name}
          sizes="240px"
        />
        <RankBadge rank={topper.rank} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-[18px]/[25px] font-semibold text-neutral-900">{topper.name}</h3>
        <p className="font-sans text-[14px]/[21px] font-medium text-neutral-600">{topper.programme}</p>
      </div>
    </article>
  );
}

export default function Toppers() {
  return (
    <section id="toppers" aria-labelledby="res-h">
      <div className="relative mx-auto flex w-canvas flex-col items-center gap-16 px-20 py-16">
        <div className="flex w-full flex-col items-center gap-12">
          <div data-reveal className="flex flex-col items-center gap-3">
            <SectionTitle id="res-h" className="w-[820px]">
              Toppers who prepared with Vajiram &amp; Ravi
            </SectionTitle>
            <Lead className="w-[760px] text-center">
              Ranks 1 to 10 in UPSC CSE 2025 all studied with us. Each took at least one of our programmes: a classroom
              course, a test series or the Interview Guidance Programme.
            </Lead>
          </div>
          <ToppersBoard
            years={resultYears}
            footer={
              <div data-reveal className="flex h-11 items-center gap-4">
                <span className="h-px flex-1 bg-neutral-200" />
                <ChevronButton href="#" size="sm">
                  See all toppers
                </ChevronButton>
                <span className="h-px flex-1 bg-neutral-200" />
              </div>
            }
          >
            {toppers.map((topper) => (
              <TopperCard key={topper.rank} topper={topper} />
            ))}
          </ToppersBoard>
        </div>

        <div
          data-reveal
          className="group/banner relative flex w-[1120px] items-center gap-12 overflow-hidden rounded-[20px] bg-[linear-gradient(90deg,#c54d0e_0%,#c54d0e_55%,#e57512_78%,#e57512_100%)] p-14"
        >
          <BannerRings className="pointer-events-none absolute top-0 left-0" />
          <div className="relative flex flex-1 items-center justify-between">
            <div className="flex w-[666px] flex-col gap-6">
              <div className="group/avatars isolate flex items-center" aria-hidden="true">
                {toppers.slice(0, BANNER_AVATARS).map((topper, i) => (
                  <span
                    key={topper.rank}
                    className="relative -mr-3.5 size-12 rounded-full bg-media bg-no-repeat [background-position:50%_10.53%] [background-size:161.29%] shadow-[0_0_0_1px_#fff] transition-transform duration-300 ease-smooth group-hover/avatars:-translate-y-0.5 last:mr-0"
                    style={{ backgroundImage: `url(${topper.image})`, zIndex: BANNER_AVATARS - i }}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-[32px]/[39px] font-semibold text-white">Start where these toppers started.</h3>
                <p className="font-sans text-[18px]/[25px] font-medium text-white opacity-92">
                  Every topper above began with our classroom courses, test series or interview guidance. Admissions for
                  2027 are open.
                </p>
              </div>
            </div>
            <KnobButton href="#courses" tone="light">
              Find your course
            </KnobButton>
          </div>
        </div>
      </div>
    </section>
  );
}
