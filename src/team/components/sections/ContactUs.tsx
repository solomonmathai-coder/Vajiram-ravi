// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): components/sections/ContactUs.jsx. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
import { photoSrcSet } from '@/team/lib/photo';
import SectionWrapper from '@/team/components/ui/section_wrapper';
import '@/team/tailwind-sections.css';
import { CENTRE, PHOTO } from '@/team/lib/data/contact';

const PHONE = 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z';
const MAIL = ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'];
const Ico = ({ d }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="cu:flex-none cu:fill-none cu:stroke-(--brand) cu:[stroke-width:2] cu:[stroke-linecap:round] cu:[stroke-linejoin:round]">
    {[].concat(d).map(p => <path key={p} d={p} />)}
  </svg>
);

const GO = ['M7 17 17 7', 'M7 7h10v10'];

const CARD = [
  'cu:relative cu:grid cu:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] cu:w-full cu:max-w-[900px] cu:mx-auto cu:mt-[20px] cu:xs:mt-[16px] cu:text-left cu:stacked:grid-cols-1',
  'cu:overflow-hidden cu:rounded-(--r-card) cu:bg-white cu:border cu:border-solid cu:border-[rgba(45,18,4,.08)] cu:border-r-0 cu:stacked:border-r cu:stacked:border-b-0 cu:shadow-[0_28px_56px_-32px_rgba(45,18,4,.35)]',
].join(' ');
const DETAILS = 'cu:relative cu:flex cu:flex-col cu:justify-center cu:min-w-0 cu:px-[clamp(24px,3.4vw,40px)] cu:py-[30px] cu:xs:p-[22px]';
const BADGE = 'cu:self-start cu:justify-self-start cu:m-0 cu:text-[#E57512] cu:[font:700_13px/1.2_var(--f)] cu:tracking-[.08em] cu:uppercase';
const ADDRESS = 'cu:mt-[10px] cu:mb-0 cu:font-(family-name:--f-title) cu:font-semibold cu:text-[clamp(24px,2vw,28px)] cu:leading-[1.2] cu:tracking-[-.01em] cu:text-(--ink) cu:[text-wrap:balance]';
const NEAR = 'cu:mt-[8px] cu:mb-0 cu:[font:400_15px/1.5_var(--f)] cu:text-(--body)';
const HOURS = 'cu:mt-[14px] cu:mb-0 cu:[font:600_15px/1.5_var(--f)] cu:text-(--ink)';
const META = 'cu:flex cu:flex-col cu:gap-[12px] cu:mt-[20px] cu:mb-0 cu:p-0 cu:pt-[20px] cu:border-0 cu:border-t cu:border-solid cu:border-[#eadbc4] cu:list-none cu:xs:gap-0 cu:xs:mt-[16px] cu:xs:pt-[6px]';
const LINK = [
  'cu:inline-flex cu:items-center cu:gap-[8px] cu:pb-px cu:xs:min-h-[40px] cu:xs:gap-[10px] cu:[font:600_16.5px/1.3_var(--f)] cu:text-(--ink) cu:no-underline',
  'cu:bg-[linear-gradient(currentColor,currentColor)] cu:bg-no-repeat cu:bg-[position:0_100%] cu:bg-[length:0_1px]',
  'cu:[transition:color_.2s_ease,background-size_.3s_cubic-bezier(.22,1,.36,1)] cu:motion-reduce:transition-none',
  'cu:hover:text-(--brand) cu:hover:bg-[length:100%_1px] cu:focus-visible:text-(--brand) cu:focus-visible:bg-[length:100%_1px]',
  'cu:focus-visible:outline-2 cu:focus-visible:outline-(--brand) cu:focus-visible:outline-offset-[3px] cu:focus-visible:rounded-[2px]',
].join(' ');
const MAP_BOX = [
  'cu:relative cu:z-1 cu:min-h-[290px] cu:w-full cu:overflow-hidden cu:bg-[#EDE6DA] cu:stacked:min-h-0 cu:stacked:aspect-[2/1] cu:xs:aspect-[4/3]',
].join(' ');
const MAP_FRAME = 'cu:pointer-events-none cu:absolute cu:inset-x-0 cu:top-[-64px] cu:w-full cu:h-[calc(160%+128px)] cu:border-0';
const POP = [
  'cu:group cu:absolute cu:z-2 cu:block cu:text-left cu:no-underline cu:left-[calc(50%-26px)] cu:bottom-[calc(20%+16px)] cu:-translate-x-1/2 cu:w-[220px] cu:xs:w-[210px] cu:rounded-[6px] cu:bg-white',
  'cu:shadow-[0_18px_40px_-16px_rgba(45,18,4,.45),0_0_0_1px_rgba(45,18,4,.06)]',
  "cu:after:content-[''] cu:after:absolute cu:after:left-1/2 cu:after:bottom-[-7px] cu:after:size-[14px] cu:after:-translate-x-1/2 cu:after:rotate-45 cu:after:bg-white",
  'cu:origin-bottom cu:opacity-0 cu:scale-[.94] cu:[.in_&]:opacity-100 cu:[.in_&]:scale-100 cu:[transition:opacity_.5s_ease_.75s,scale_.6s_cubic-bezier(.34,1.56,.64,1)_.75s,translate_.45s_cubic-bezier(.22,1,.36,1),box-shadow_.3s_ease] cu:motion-reduce:opacity-100 cu:motion-reduce:scale-100 cu:fine:hover:-translate-y-1 cu:hover:shadow-[0_24px_44px_-16px_rgba(45,18,4,.5),0_0_0_1px_rgba(45,18,4,.08)] cu:focus-visible:outline-2 cu:focus-visible:outline-(--brand) cu:focus-visible:outline-offset-[3px] cu:motion-reduce:transition-none',
].join(' ');
const POP_PHOTO = 'cu:block cu:relative cu:aspect-[5/2] cu:overflow-hidden cu:rounded-t-[6px] cu:bg-[#6b2a0c]';
const POP_IMG = 'cu:absolute cu:inset-0 cu:block cu:w-full cu:h-full cu:object-cover cu:object-[40%_50%] cu:[transition:transform_.9s_cubic-bezier(.22,1,.36,1)] cu:motion-reduce:transition-none cu:fine:group-hover:[transform:scale(1.05)]';
const POP_BODY = 'cu:block cu:relative cu:z-1 cu:pt-[9px] cu:pr-[38px] cu:pb-[11px] cu:pl-[12px]';
const POP_GO = [
  'cu:absolute cu:right-[8px] cu:bottom-[8px] cu:grid cu:place-items-center cu:size-[28px] cu:rounded-full cu:text-(--ink)',
  'cu:[transition:background-color_.2s_ease,translate_.3s_cubic-bezier(.22,1,.36,1)] cu:group-hover:bg-[#FBEDE0] cu:group-hover:[translate:2px_-2px] cu:group-focus-visible:bg-[#FBEDE0] cu:motion-reduce:transition-none',
].join(' ');
const POP_NAME = 'cu:block cu:[font:600_13.5px/1.3_var(--f)] cu:text-(--ink)';
const POP_ADDRESS = 'cu:block cu:mt-[2px] cu:[font:400_12px/1.4_var(--f)] cu:text-(--body)';

export default function ContactUs() {
  return (
    <SectionWrapper id="visit" labelledBy="locH" half className="band dots band--gap">
      <h2 id="locH" className="h2 h2--sec rv cu:mt-0!" style={{ "--d": ".12s" }}>Contact us</h2>
      <p className="intro rv cu:text-balance" style={{ "--d": ".2s" }}>Pick the channel that suits you, or visit us in New Delhi.</p>
      <div className={`${CARD} rv`} style={{ "--d": ".28s" }}>
        <div className={DETAILS}>
          <p className={BADGE}>New Delhi centre</p>
          <h3 className={ADDRESS}>{CENTRE.address}</h3>
          <p className={NEAR}>{CENTRE.near.map(line => <span key={line} className="cu:block">{line}</span>)}</p>
          <p className={HOURS}>{CENTRE.hours}</p>
          <ul className={META}>
            <li><a className={LINK} href={CENTRE.phone.href} aria-label={`Call us on ${CENTRE.phone.label}`}><Ico d={PHONE} /><span>{CENTRE.phone.label}</span></a></li>
            <li><a className={LINK} href={`mailto:${CENTRE.email}`} aria-label={`Email us at ${CENTRE.email}`}><Ico d={MAIL} /><span>{CENTRE.email}</span></a></li>
          </ul>
        </div>
        <div className={MAP_BOX}>
          <iframe className={MAP_FRAME} src={CENTRE.embed} title={`Map: Vajiram & Ravi, ${CENTRE.address}`} tabIndex={-1} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <a className={POP} href={CENTRE.maps} target="_blank" rel="noopener noreferrer" aria-label={`${CENTRE.name}: open in Google Maps`}>
            <span className={POP_PHOTO}>
              <img className={POP_IMG} src={PHOTO.src} srcSet={photoSrcSet(PHOTO.src, PHOTO.w)} sizes="220px" alt="" width={PHOTO.w} height={PHOTO.h} loading="lazy" decoding="async" />
            </span>
            <span className={POP_BODY}>
              <span className={POP_NAME}>{CENTRE.name}</span>
              <span className={POP_ADDRESS}>{CENTRE.address}</span>
              <span className={POP_GO} aria-hidden="true"><Ico d={GO} /></span>
            </span>
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
