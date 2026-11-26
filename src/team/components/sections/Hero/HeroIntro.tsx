// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): components/sections/Hero/HeroIntro.jsx. On the About page it is "Who we are" (26 Nov 2026): its label, heading (an h2 there) and paragraph carry those words, the figures under them; otherwise as it is.
// @ts-nocheck
import SectionWrapper from '@/team/components/ui/section_wrapper';
import SectionLabel from '@/team/components/ui/SectionLabel';
import { $, reduce } from '@/team/lib/site';
import '@/team/tailwind-sections.css';
import { STATS } from '@/team/lib/data/hero';

// (About page) `stats={false}` leaves its figures out, so the page can show them elsewhere (Stats is exported for that).
export default function HeroIntro({ stats = true } = {}) {
  return (
    <SectionWrapper id="about-vr" labelledBy="aboutVrH" compact className="hx__intro cu:z-1 cu:text-center cu:[--px:clamp(16px,5.5vw,60px)]">
      <div className="cu:mx-auto cu:flex cu:max-w-[1180px] cu:flex-col cu:items-center">
        <SectionLabel align="center">Who we are</SectionLabel>
        <h2 id="aboutVrH" className="h2 h2--sec rv cu:text-balance" style={{ '--d': '.1s' }}>
          Excellence in UPSC coaching, at every stage.
        </h2>
        <p className="intro rv cu:max-w-[860px]! cu:text-balance" style={{ '--d': '.2s' }}>
          Since 1976, Vajiram &amp; Ravi has been synonymous with excellence in Civil Services Examination coaching, preparing aspirants for all three stages of the UPSC exam: the Preliminary Test, the Main Examination and the Personality Test. With nearly five decades of experience, we have shaped the careers of countless IAS, IFS, IPS and other Central Services officers, and our students consistently secure top ranks, often within the first ten positions.
        </p>
      </div>
      {stats && <Stats />}
    </SectionWrapper>
  );
}

const STAGGER_MS = 70;
const ROLL_MS = 700;

const LIST = [
  'cu:grid cu:flex-none cu:box-border cu:m-0 cu:p-0 cu:list-none cu:items-center cu:justify-center cu:text-center cu:text-(--ink)',
  'cu:gap-x-[16px] cu:gap-y-[28px] cu:h-auto! cu:mt-[calc(clamp(36px,3.4vw,48px)*1.2+2px)]! cu:py-0!',
  'cu:max-[900.98px]:relative cu:max-[900.98px]:grid-cols-[repeat(2,minmax(0,1fr))] cu:max-[900.98px]:justify-items-center cu:max-[900.98px]:content-center',
  'cu:min-[761px]:text-start cu:min-[761px]:gap-y-[24px] cu:min-[761px]:max-[900.98px]:px-[8px]',
  'cu:[--sg:clamp(28px,3.2vw,80px)] cu:min-[901px]:max-[1180.98px]:[--sg:36px] cu:min-[1181px]:max-[1500.98px]:[--sg:40px]',
  'cu:min-[901px]:grid-cols-[minmax(28px,1fr)_repeat(4,auto)_minmax(28px,1fr)] cu:min-[901px]:gap-x-[40px] cu:min-[1181px]:gap-x-(--sg)',
  'cu:before:content-[""] cu:after:content-[""] cu:before:pointer-events-none cu:after:pointer-events-none',
  'cu:min-[901px]:before:h-px cu:min-[901px]:after:h-px cu:min-[901px]:before:self-center cu:min-[901px]:after:self-center',
  'cu:min-[901px]:before:mr-[calc(24px-var(--sg))] cu:min-[901px]:after:ml-[calc(24px-var(--sg))]',
  'cu:min-[901px]:before:bg-[linear-gradient(90deg,rgba(194,65,12,0),rgba(194,65,12,.45))] cu:min-[901px]:after:bg-[linear-gradient(90deg,rgba(194,65,12,.45),rgba(194,65,12,0))]',
  'cu:max-[900.98px]:before:absolute cu:max-[900.98px]:after:absolute',
  'cu:max-[900.98px]:before:left-1/2 cu:max-[900.98px]:before:top-[32px] cu:max-[900.98px]:before:bottom-[40px] cu:max-[900.98px]:before:w-px cu:max-[900.98px]:before:-ml-[.5px]',
  'cu:max-[900.98px]:before:bg-[linear-gradient(180deg,rgba(194,65,12,0),rgba(194,65,12,.45)_50%,rgba(194,65,12,0))]',
  'cu:max-[760.98px]:before:top-[24px] cu:max-[760.98px]:before:bottom-[24px]',
  'cu:max-[900.98px]:after:top-[calc(50%-4px)] cu:max-[900.98px]:after:left-[8%] cu:max-[900.98px]:after:right-[8%] cu:max-[900.98px]:after:h-px cu:max-[760.98px]:after:top-1/2',
  'cu:max-[900.98px]:after:bg-[linear-gradient(90deg,rgba(194,65,12,0),rgba(194,65,12,.45)_50%,rgba(194,65,12,0))]',
  'cu:max-[900.98px]:[html.js_&.is-pre]:before:opacity-0 cu:max-[900.98px]:[html.js_&.is-pre]:after:opacity-0',
  'cu:max-[900.98px]:[&.is-in]:before:opacity-100 cu:max-[900.98px]:[&.is-in]:after:opacity-100',
  'cu:max-[900.98px]:[&.is-in]:before:[transition:opacity_.9s_ease-out_.7s] cu:max-[900.98px]:[&.is-in]:after:[transition:opacity_.9s_ease-out_.7s]',
  'cu:max-[900.98px]:motion-reduce:[html.js_&.is-pre]:before:opacity-100 cu:max-[900.98px]:motion-reduce:[html.js_&.is-pre]:after:opacity-100',
  'cu:max-[900.98px]:motion-reduce:[&.is-in]:before:transition-none cu:max-[900.98px]:motion-reduce:[&.is-in]:after:transition-none',
].join(' ');

const ITEM = [
  'cu:group/stat cu:flex cu:items-center cu:gap-[18px] cu:min-[901px]:relative',
  'cu:min-[1181px]:max-[1500.98px]:gap-[14px] cu:min-[901px]:max-[1180.98px]:gap-[12px] cu:max-[760.98px]:flex-col cu:max-[760.98px]:gap-[6px]',
  'cu:[html.js_.is-pre_&]:opacity-0 cu:[html.js_.is-pre_&]:[translate:0_24px]',
  'cu:[.is-in_&]:opacity-100 cu:[.is-in_&]:[translate:none] cu:[.is-in_&]:[transition:opacity_.45s_ease-out_var(--at,0ms),translate_.45s_ease-out_var(--at,0ms)]',
  'cu:motion-reduce:[html.js_.is-pre_&]:opacity-100 cu:motion-reduce:[html.js_.is-pre_&]:[translate:none] cu:motion-reduce:[.is-in_&]:transition-none',
  'cu:min-[901px]:not-first:before:content-[""] cu:min-[901px]:not-first:before:absolute cu:min-[901px]:not-first:before:size-[8px] cu:min-[901px]:not-first:before:bg-(--brand) cu:min-[901px]:not-first:before:rotate-45 cu:min-[901px]:not-first:before:[box-shadow:0_0_0_3px_rgba(194,65,12,.14)] cu:min-[901px]:not-first:before:pointer-events-none',
  'cu:min-[901px]:not-first:before:left-[calc(var(--sg)/-2-4px)] cu:min-[901px]:not-first:before:top-1/2 cu:min-[901px]:not-first:before:-mt-[4px]',
  'cu:max-[900.98px]:first:after:content-[""] cu:max-[900.98px]:first:after:absolute cu:max-[900.98px]:first:after:size-[8px] cu:max-[900.98px]:first:after:bg-(--brand) cu:max-[900.98px]:first:after:rotate-45 cu:max-[900.98px]:first:after:[box-shadow:0_0_0_3px_rgba(194,65,12,.14)] cu:max-[900.98px]:first:after:pointer-events-none cu:max-[900.98px]:first:after:z-1',
  'cu:max-[900.98px]:first:after:left-1/2 cu:max-[900.98px]:first:after:top-[calc(50%-4px)] cu:max-[760.98px]:first:after:top-1/2 cu:max-[900.98px]:first:after:-mt-[4px] cu:max-[900.98px]:first:after:-ml-[4px]',
  'cu:max-[900.98px]:[html.js_.is-pre_&]:first:after:opacity-0 cu:max-[900.98px]:[.is-in_&]:first:after:opacity-100 cu:max-[900.98px]:[.is-in_&]:first:after:[transition:opacity_.9s_ease-out_.7s]',
  'cu:max-[900.98px]:motion-reduce:[html.js_.is-pre_&]:first:after:opacity-100 cu:max-[900.98px]:motion-reduce:[.is-in_&]:first:after:transition-none',
].join(' ');

const NUM = [
  'cu:relative cu:inline-grid cu:flex-none',
  'cu:after:content-[""] cu:after:absolute cu:after:inset-x-0 cu:after:-bottom-[8px] cu:after:h-[2px] cu:after:bg-(--brand) cu:after:origin-left',
  'cu:after:[transform:scaleX(0)] cu:after:[transition:transform_.45s_cubic-bezier(.7,0,.2,1)] cu:fine:group-hover/stat:after:[transform:scaleX(1)]',
  'cu:max-[760.98px]:after:hidden cu:motion-reduce:after:transition-none',
].join(' ');

const FIG = [
  'cu:relative cu:[grid-area:1/1] cu:text-left cu:whitespace-nowrap cu:font-medium cu:text-(--ink) cu:[font-family:var(--f-title,Georgia),serif]',
  'cu:leading-none cu:tracking-[-.02em] cu:[font-variant-numeric:lining-nums_tabular-nums]',
  'cu:text-[length:clamp(40px,3.6vw,54px)] cu:min-[1181px]:max-[1500.98px]:text-[length:44px] cu:min-[901px]:max-[1180.98px]:text-[length:35px] cu:max-[760.98px]:text-[length:38px]',
].join(' ');
const FIG_LIVE = `${FIG} cu:[transition:translate_.35s_cubic-bezier(.22,1,.36,1)] cu:fine:group-hover/stat:[translate:0_-3px] cu:motion-reduce:transition-none`;
const FIG_ROOM = `${FIG} cu:invisible`;

const LABEL = [
  'cu:w-auto cu:whitespace-nowrap cu:font-normal cu:text-[#4A4038] cu:[font-family:var(--f)] cu:leading-[1.35]',
  'cu:text-[length:17px] cu:min-[1181px]:max-[1500.98px]:text-[length:16px] cu:min-[901px]:max-[1180.98px]:text-[length:15px] cu:max-[760.98px]:text-[length:16px]',
].join(' ');

export function Stats() {
  return (
    <ul className={`hx__stats is-pre ${LIST}`} aria-label="Vajiram & Ravi at a glance">
      {STATS.map(({ fig, lines }, i) => (
        <li key={fig} className={`hx__stat ${ITEM}`} style={{ '--at': `${i * STAGGER_MS}ms` }}>
          <span className={NUM}>
            <b className={`hx__fig ${FIG_LIVE}`} data-fig={fig}>{fig}</b>
            <span className={`hx__fig ${FIG_ROOM}`} aria-hidden="true">{fig}</span>
          </span>
          <span className={LABEL}>{lines.map((l, k) => <span key={l} className="cu:block">{k ? ' ' : ''}{l}</span>)}</span>
        </li>
      ))}
    </ul>
  );
}

function rollUp(fig, delay) {
  const m = fig.dataset.fig.match(/^(\D*)(\d+)(.*)$/);
  if (!m) return;
  const [, pre, num, post] = m;
  const to = +num;
  fig.textContent = pre + '0' + post;
  setTimeout(() => {
    const t0 = performance.now();
    const step = now => {
      const p = Math.min(1, (now - t0) / ROLL_MS);
      fig.textContent = pre + Math.round(to * (1 - (1 - p) ** 3)) + post;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, delay);
}

export function initHeroStats() {
  const row = $('.hx__stats');
  if (!row) return;
  const reveal = () => { row.classList.remove('is-pre'); row.classList.add('is-in'); };
  if (reduce) { reveal(); return; }

  const start = () => {
    reveal();
    row.querySelectorAll('.hx__stat').forEach((li, i) => rollUp(li.querySelector('.hx__fig'), i * STAGGER_MS));
  };
  if (document.documentElement.classList.contains('vrv-lock')) document.addEventListener('vr:intro-done', start, { once: true });
  else start();
}
