// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): components/sections/WhyChoose.jsx. Its words, photograph and cards may be passed in as props (About page, 26 Nov 2026); otherwise as it is.
// @ts-nocheck
import CarouselDots from '@/team/components/ui/CarouselDots';
import SectionWrapper from '@/team/components/ui/section_wrapper';
import SectionLabel from '@/team/components/ui/SectionLabel';
import { bindDots } from '@/team/components/ui/rail';
import { photoSrcSet } from '@/team/lib/photo';
import { $$ } from '@/team/lib/site';
import '@/team/tailwind-sections.css';
import { LEGACY, PHOTO, REASONS } from '@/team/lib/data/why-choose';

const ICONS = {
  medal: (
    <>
      <path d="M34.2 19.0 L35.0 19.9 L35.6 20.8 L35.6 21.7 L35.2 22.5 L34.4 23.2 L33.3 23.7 L32.2 24.0 L31.3 24.4 L30.7 24.8 L30.5 25.5 L30.5 26.5 L30.6 27.6 L30.6 28.8 L30.3 29.8 L29.7 30.6 L28.8 30.8 L27.8 30.7 L26.7 30.3 L25.6 29.7 L24.8 29.4 L24.0 29.3 L23.4 29.6 L22.7 30.3 L22.0 31.2 L21.1 32.0 L20.2 32.6 L19.3 32.6 L18.5 32.2 L17.8 31.4 L17.3 30.3 L17.0 29.2 L16.6 28.3 L16.2 27.7 L15.5 27.5 L14.5 27.5 L13.4 27.6 L12.2 27.6 L11.2 27.3 L10.4 26.7 L10.2 25.8 L10.3 24.8 L10.7 23.7 L11.3 22.6 L11.6 21.8 L11.7 21.0 L11.4 20.4 L10.7 19.7 L9.8 19.0 L9.0 18.1 L8.4 17.2 L8.4 16.3 L8.8 15.5 L9.6 14.8 L10.7 14.3 L11.8 14.0 L12.7 13.6 L13.3 13.2 L13.5 12.5 L13.5 11.5 L13.4 10.4 L13.4 9.2 L13.7 8.2 L14.3 7.4 L15.2 7.2 L16.2 7.3 L17.3 7.7 L18.4 8.3 L19.2 8.6 L20.0 8.7 L20.6 8.4 L21.3 7.7 L22.0 6.8 L22.9 6.0 L23.8 5.4 L24.7 5.4 L25.5 5.8 L26.2 6.6 L26.7 7.7 L27.0 8.8 L27.4 9.7 L27.8 10.3 L28.5 10.5 L29.5 10.5 L30.6 10.4 L31.8 10.4 L32.8 10.7 L33.6 11.3 L33.8 12.2 L33.7 13.2 L33.3 14.3 L32.7 15.4 L32.4 16.2 L32.3 17.0 L32.6 17.6 L33.3 18.3 L34.2 19.0Z" />
      <circle cx="22" cy="19" r="8" />
      <path d="M22.0 15.0 L23.3 18.2 L26.8 18.5 L24.1 20.7 L24.9 24.0 L22.0 22.2 L19.1 24.0 L19.9 20.7 L17.2 18.5 L20.7 18.2Z" />
      <path d="M15 31 9.5 44l6.5-2.5 3 4.5 3.5-14M29 31l5 13-6-2.5-3.5 4.5-3-14" />
      <path d="M37 7.5l3-2.5M40 12.5l4-.5" />
    </>
  ),
  board: (
    <>
      <path d="M3 18 24 8l21 10-21 10Z" />
      <path d="M12 23.5V32c0 3.2 5.4 6 12 6s12-2.8 12-6v-8.5" />
      <path d="M41 21v12" />
      <path d="M41 33l-1.8 5h3.6Z" />
      <path d="M36 5l2.5-2.5M41 8l4-.5" />
    </>
  ),
  mentor: (
    <>
      <circle cx="15" cy="14" r="6.5" />
      <path d="M3.5 41c0-9.5 5-15 11.5-15s11.5 5.5 11.5 15Z" />
      <circle cx="34" cy="18" r="5" />
      <path d="M28.5 29.5c1.5-.9 3.2-1.4 5.5-1.4 5 0 8.5 4 9 12.9" />
      <path d="M36 5.5l2-3M41 9.5l4-1" />
    </>
  ),
  notes: (
    <>
      <rect x="5" y="31" width="38" height="10" rx="2.5" />
      <rect x="8" y="20.5" width="32" height="9.5" rx="2.5" />
      <rect x="6" y="10" width="34" height="9.5" rx="2.5" />
      <path d="M11 36h12M14 25.2h12M12 14.8h12" />
      <path d="M38 4l2.5-2M43 7.5l3-.5" />
    </>
  ),
  place: (
    <>
      <path d="M24 4c-7.5 0-13 5.5-13 13 0 9.5 13 26 13 26s13-16.5 13-26c0-7.5-5.5-13-13-13Z" />
      <circle cx="24" cy="17" r="5.5" />
      <path d="M12 44.5c7 2 17 2 24 0" />
      <path d="M40 5l3-2.5M43 11l3.5-.5" />
    </>
  ),
  live: (
    <>
      <rect x="4" y="7" width="40" height="27" rx="3.5" />
      <path d="M20 14.5 33 20.5l-13 6Z" />
      <path d="M24 34v6.5M15 41.5h18" />
      <path d="M38 3l2.5-2M43 6.5l3-.5" />
    </>
  ),
};

const CARD = [
  'cu:group cu:relative cu:grid cu:grid-cols-[auto_minmax(0,1fr)] cu:content-start cu:items-center cu:gap-x-[14px] cu:h-full cu:p-[26px] cu:max-[640px]:p-[20px] cu:rounded-(--r-card) cu:text-[#5a4632]',
  'cu:paper-card',
].join(' ');

// (About page, 26 Nov 2026) its words, photograph and cards may be passed in, so the page can use it for more than one section;
// with none it is as on the homepage. `id` names the section; the homepage's ids are kept for id="story". `head`, when given,
// stands in place of its photograph-and-story block (its heading carrying the id `${id}-legacyH`), so the cards can follow a
// centred head.
export default function WhyChoose({ id = 'story', legacy = LEGACY, photo = PHOTO, reasons = REASONS, head = undefined } = {}) {
  const k = id === 'story' ? '' : `${id}-`;
  return (
    <SectionWrapper id={id} labelledBy={`${k}legacyH`} compact className="cu:[background:var(--ground-jaali)] cu:overflow-clip">
      {head ?? <div className="cu:grid cu:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] cu:max-[900px]:grid-cols-1 cu:items-center cu:gap-x-[clamp(24px,5vw,72px)] cu:gap-y-[28px] cu:text-left">
        <figure className="rv cu:m-0 cu:aspect-[3/4] cu:w-[min(100%,calc((100svh-var(--hdr-h)-64px)*.75))] cu:max-[900px]:w-[min(100%,360px)] cu:max-[640px]:w-full cu:max-[640px]:aspect-video cu:overflow-hidden cu:rounded-(--r-card) cu:bg-[#eadbc4] cu:[box-shadow:0_24px_48px_-32px_rgb(80_48_16/.35)]" style={{ '--d': '.05s' }}>
          <img src={photo.src} srcSet={photoSrcSet(photo.src, photo.w)} sizes="(max-width: 900px) 92vw, 30vw" alt={photo.alt} width={photo.w} height={photo.h} loading="lazy" decoding="async" className="cu:block cu:size-full cu:object-cover cu:object-center cu:max-[640px]:object-[50%_56%] cu:transition-transform cu:duration-700 cu:ease-(--ease) cu:fine:hover:scale-[1.03] cu:motion-reduce:transition-none" />
        </figure>
        <header id={`${k}legacy`} className="cu:flex cu:flex-col cu:items-start">
          <SectionLabel>{legacy.label}</SectionLabel>
          <h2 id={`${k}legacyH`} className="h2 h2--sec rv cu:mt-(--hd-lbl) cu:mb-0 cu:max-w-[22ch] cu:text-balance cu:max-[640px]:max-w-none" style={{ '--d': '.12s' }}>{legacy.title}</h2>
          {legacy.body.map((para, i) => <p key={i} className={`rv cu:mb-0 cu:text-[clamp(16px,1.25vw,18px)] cu:leading-[1.75] cu:text-[#4a3f35] ${i ? 'cu:mt-[1em]' : 'cu:mt-(--hd-in)'}`} style={{ '--d': `${0.2 + 0.08 * i}s` }}>{para}</p>)}
        </header>
      </div>}
      {reasons.length > 0 && <div id={`${k}reasons`} className="cu:mt-(--hd-gap) cu:max-[640px]:mt-[calc(var(--hd-gap)+14px)]">
        <ul id={`${k}whyCards`} className="why__cards cu:grid cu:grid-cols-3 cu:max-[1000px]:grid-cols-2 cu:max-[640px]:flex cu:max-[640px]:overflow-x-auto cu:max-[640px]:snap-x cu:max-[640px]:snap-mandatory cu:max-[640px]:overscroll-x-contain cu:max-[640px]:[scrollbar-width:none] cu:max-[640px]:[&::-webkit-scrollbar]:hidden cu:max-[640px]:-mx-(--px) cu:max-[640px]:px-(--px) cu:max-[640px]:scroll-px-(--px) cu:max-[640px]:pt-[14px] cu:max-[640px]:pb-[44px] cu:max-[640px]:-mt-[14px] cu:max-[640px]:-mb-[44px] cu:gap-(--card-gap) cu:w-full cu:max-[640px]:w-[calc(100%+2*var(--px))] cu:list-none cu:p-0 cu:text-left">
          {reasons.map((r) => (
            <li key={r.t} className="cu:min-w-0 cu:max-[640px]:flex-[0_0_82%] cu:max-[640px]:snap-start">
              <article className={CARD}>
                <span aria-hidden="true" className="cu:grid cu:place-items-center cu:flex-none cu:size-[56px] cu:max-[640px]:size-[44px] cu:rounded-full cu:bg-white cu:text-(--brand)">
                  <svg aria-hidden="true" viewBox="0 0 48 48" className="cu:size-[30px] cu:fill-none cu:stroke-(--brand) cu:[stroke-width:3] cu:[stroke-linecap:round] cu:[stroke-linejoin:round]">{ICONS[r.icon]}</svg>
                </span>
                <div className="cu:contents">
                  <h3 className="cu:m-0 cu:[font:600_22px/1.2_var(--f-title)] cu:max-[640px]:text-[20px] cu:max-[640px]:flex cu:max-[640px]:items-center cu:max-[640px]:min-h-[2.4em] cu:text-balance cu:tracking-[-.015em] cu:text-[#2A2016]">{r.t}</h3>
                  <p className="cu:mt-[12px] cu:col-span-2 cu:mb-0 cu:text-[14.5px] cu:leading-[1.5] cu:text-[#5a4632]">{r.d}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <div className="cu:flex cu:justify-center cu:mt-[16px] cu:min-[641px]:hidden"><CarouselDots className="why__dots" tone="light" label="Choose a reason" labels={reasons.map(r => `Show ${r.t}`)} controls={`${k}whyCards`} /></div>
      </div>}
    </SectionWrapper>
  );
}

export function initWhyDots() {
  bindDots(document.getElementById('whyCards'), $$('.why__dots > button'));
}
