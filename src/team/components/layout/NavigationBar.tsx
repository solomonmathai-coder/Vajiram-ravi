// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): components/layout/NavigationBar.jsx. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
import '@/team/tailwind-sections.css';
import Button from '@/team/components/ui/Button';
import { buttonHTML } from '@/team/components/ui/Button';
import { $, $$, esc, reduce, SITE } from '@/team/lib/site';
import { CATS, CAT_D, STAGES } from '@/team/lib/data/courses';
import { BAR_LINKS, DRAWER_LINKS, MORE_ORDER, STUDY_MENU, HEADLINES } from '@/team/lib/data/navigation';

const MORE_GAP = 40;

const EASE = 'cubic-bezier(.2, .7, .2, 1)';

const LINK = 'cu:flex cu:items-center cu:h-[34px] cu:px-[13px] cu:rounded-full cu:border-0 cu:bg-transparent cu:cursor-pointer cu:whitespace-nowrap cu:no-underline cu:[font-family:var(--btn-font)] cu:font-medium cu:text-base cu:leading-[var(--btn-lh)] cu:tracking-[var(--btn-ls)] cu:text-[var(--ink)] cu:transition-colors cu:duration-200 cu:hover:bg-[rgba(194,65,12,.1)] cu:hover:text-[var(--brand)] cu:aria-expanded:bg-[rgba(194,65,12,.1)] cu:aria-expanded:text-[var(--brand)] cu:focus-visible:outline-2 cu:focus-visible:outline-offset-2 cu:focus-visible:outline-[var(--brand)] cu:data-[over]:hidden';

const MEGA = 'cu:absolute cu:-left-2.5 cu:top-[calc(100%+12px)] cu:grid cu:box-border cu:overflow-hidden cu:rounded-[var(--r-box,16px)] cu:bg-white cu:shadow-[0_0_0_1px_rgba(38,20,8,.06),0_30px_60px_-24px_rgba(60,24,6,.45)] cu:invisible cu:opacity-0 cu:-translate-y-2 cu:[transition:opacity_.2s_var(--ease),translate_.25s_var(--ease),visibility_0s_.25s] cu:group-data-[open]/mega:visible cu:group-data-[open]/mega:opacity-100 cu:group-data-[open]/mega:translate-y-0 cu:group-data-[open]/mega:[transition:opacity_.22s_var(--ease),translate_.3s_var(--ease),visibility_0s] cu:motion-reduce:transition-none cu:motion-reduce:translate-y-0';

const LANG_WRAP = 'cu:group/lang cu:relative cu:flex cu:items-center cu:h-11 cu:p-1 cu:rounded-full cu:bg-[#F9F0E4] cu:transition-[background-color,box-shadow] cu:duration-300 cu:motion-safe:animate-[nav-lang-in_.7s_var(--ease)_.15s_both]';
const LANG_WRAP_BAR = 'cu:max-[600px]:p-0';
const LANG_THUMB = 'cu:absolute cu:inset-y-1 cu:left-1 cu:w-[calc(50%-4px)] cu:rounded-full cu:bg-[var(--brand)] cu:transition-transform cu:duration-[.45s] cu:ease-[cubic-bezier(.34,1.4,.5,1)] cu:group-data-[cur=hi]/lang:translate-x-full cu:motion-reduce:transition-none';
const LANG_THUMB_BAR = 'cu:max-[600px]:hidden';
const LANG_BTN = 'cu:relative cu:z-[1] cu:min-w-11 cu:h-full cu:px-3 cu:rounded-full cu:border-0 cu:bg-transparent cu:cursor-pointer cu:text-[var(--ink)] cu:transition-[color,translate] cu:duration-[.25s] cu:aria-pressed:text-white cu:fine:hover:aria-[pressed=false]:text-[var(--brand)] cu:fine:hover:aria-[pressed=false]:-translate-y-px cu:focus-visible:outline-2 cu:focus-visible:outline-offset-2 cu:focus-visible:outline-[var(--brand)] cu:motion-reduce:transition-none';
const LANG_BTN_BAR = 'cu:max-[600px]:aria-pressed:hidden cu:max-[600px]:h-11 cu:max-[600px]:px-1.5';
const LANG_EN = 'cu:[font:600_15px/1_var(--f)] cu:tracking-[.02em]';
const LANG_EN_BAR = 'cu:max-[480px]:text-[13.5px]';
const LANG_HI = 'cu:[font:400_20px/1_var(--f-hi)] cu:pt-0.5';
const LANG_HI_BAR = 'cu:max-[480px]:text-[17px]';

function LangSwitch({ bar }) {
  return (
    <div className={`${LANG_WRAP} ${bar ? LANG_WRAP_BAR : 'cu:flex-none'}`} data-lang-sw="" data-cur="en" role="group" aria-label="Language / भाषा">
      <span className={`${LANG_THUMB} ${bar ? LANG_THUMB_BAR : ''}`} aria-hidden="true" />
      <button className={`${LANG_BTN} ${LANG_EN} ${bar ? `${LANG_BTN_BAR} ${LANG_EN_BAR}` : ''}`} type="button" data-lang="en" lang="en" aria-pressed="true" title="English">EN</button>
      <button className={`${LANG_BTN} ${LANG_HI} ${bar ? `${LANG_BTN_BAR} ${LANG_HI_BAR}` : ''}`} type="button" data-lang="hi" lang="hi" aria-pressed="false" title="हिन्दी">हिं</button>
    </div>
  );
}

function Logo() {
  const box = 'cu:flex cu:items-center cu:gap-[calc(var(--lh)*.167)] cu:[--lh:52px] cu:max-[1023.98px]:[--lh:49px] cu:max-[760px]:[--lh:41px] cu:transition-transform cu:duration-300 cu:ease-[cubic-bezier(.22,1,.36,1)] cu:group-hover/logo:scale-[1.03] cu:group-focus-visible/logo:scale-[1.03]';
  return (
    <a className="cu:group/logo cu:flex cu:flex-none cu:items-center cu:h-[52px] cu:max-[760px]:h-11 cu:mr-3.5 cu:rounded-lg cu:focus-visible:outline-2 cu:focus-visible:outline-offset-4 cu:focus-visible:outline-[var(--brand)] cu:max-[1023.98px]:flex-[0_1_auto] cu:max-[1023.98px]:min-w-0 cu:max-[1023.98px]:mr-auto" href="#top" aria-label="Vajiram & Ravi home">
      <span className={box}>
        <img className="cu:block cu:h-(--lh) cu:w-auto cu:flex-none" src="/assets/img/brand/logo-emblem.webp" alt="" width="222" height="227" />
        <img className="cu:block cu:h-[calc(var(--lh)*.476)] cu:w-auto cu:min-w-0" src="/assets/img/brand/logo-text.webp" alt="Vajiram & Ravi, Institute for IAS Examination" width="707" height="127" />
      </span>
    </a>
  );
}

function MegaMenu({ id, wrapId, btnId, label, wide }) {
  const size = wide
    ? 'cu:w-[min(var(--chrome-w),calc(100vw-2*var(--chrome-px)))] cu:grid-cols-[minmax(0,1fr)_272px] cu:max-[1500px]:grid-cols-[minmax(0,1fr)_248px]'
    : 'cu:w-[min(1240px,calc(100vw-2*var(--chrome-px)))] cu:grid-cols-[minmax(0,1fr)_300px] cu:max-[1500px]:grid-cols-[minmax(0,1fr)_270px]';
  return (
    <div className="cu:group/mega cu:static" id={wrapId}>
      <button className={LINK} id={btnId} type="button" aria-expanded="false" aria-controls={id}>{label}</button>
      <div className={`${MEGA} ${size}`} id={id} />
    </div>
  );
}

function MoreMenu() {
  return (
    <div className="cu:group/more cu:relative cu:flex cu:items-center cu:[&[hidden]]:hidden" id="navMore" hidden>
      <button className={`${LINK} cu:gap-1.5`} id="moreBtn" type="button" aria-expanded="false" aria-controls="moreMenu" aria-haspopup="true">
        <span>More</span>
        <svg className="cu:fill-none cu:stroke-current cu:[stroke-width:1.8] cu:[stroke-linecap:round] cu:[stroke-linejoin:round] cu:transition-[rotate] cu:duration-300 cu:ease-[cubic-bezier(.22,1,.36,1)] cu:group-data-[open]/more:rotate-180 cu:motion-reduce:transition-none" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
      </button>
      <ul className="cu:absolute cu:top-[calc(100%+14px)] cu:right-0 cu:z-[70] cu:min-w-[220px] cu:m-0 cu:p-2 cu:list-none cu:bg-white cu:rounded-[var(--r-box,16px)] cu:shadow-[0_0_0_1px_rgba(122,42,10,.06),0_24px_48px_-20px_rgba(60,25,5,.35)] cu:invisible cu:opacity-0 cu:-translate-y-1.5 cu:pointer-events-none cu:[transition:opacity_.2s_ease,translate_.3s_cubic-bezier(.22,1,.36,1),visibility_0s_linear_.3s] cu:group-data-[open]/more:visible cu:group-data-[open]/more:opacity-100 cu:group-data-[open]/more:translate-y-0 cu:group-data-[open]/more:pointer-events-auto cu:group-data-[open]/more:delay-0 cu:motion-reduce:transition-none cu:[&>li+li]:mt-0.5" id="moreMenu">
        {BAR_LINKS.map(({ k, href, t }) => (
          <li key={k} className="cu:[&[hidden]]:hidden" data-more={k} hidden>
            <a className="cu:block cu:w-full cu:box-border cu:py-[11px] cu:px-3.5 cu:rounded-[10px] cu:text-[var(--ink)] cu:no-underline cu:whitespace-nowrap cu:[font-family:var(--btn-font)] cu:font-medium cu:text-[17px] cu:leading-[1.2] cu:transition-colors cu:duration-200 cu:hover:bg-[rgba(194,65,12,.08)] cu:hover:text-[var(--brand)] cu:focus-visible:bg-[rgba(194,65,12,.08)] cu:focus-visible:text-[var(--brand)] cu:focus-visible:outline-none cu:focus-visible:shadow-[inset_0_0_0_2px_var(--brand)]" href={href}>{t}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function NavigationBar() {
  return (
    <>
      <div className="nav-band cu:absolute cu:top-0 cu:inset-x-0 cu:z-[2] cu:h-[calc(var(--hdr-h)+var(--hdr-gap))] cu:pointer-events-none" aria-hidden="true" />
      <header className="cu:fixed cu:z-50 cu:top-[var(--hdr-pt)] cu:left-[calc(var(--chrome-px)+10px)] cu:min-[901px]:left-[calc(var(--chrome-cap)+34px)] cu:right-[calc(var(--chrome-px)+10px)] cu:min-[901px]:right-[calc(var(--chrome-cap)+34px)] cu:flex cu:items-center cu:justify-between cu:pointer-events-none cu:*:pointer-events-auto cu:after:absolute cu:after:-inset-y-2 cu:after:-inset-x-2.5 cu:after:-z-10 cu:after:rounded-[24px] cu:max-[900px]:after:rounded-[20px] cu:after:pointer-events-none cu:after:bg-[#FFFAF3] cu:min-[761px]:data-[top]:after:opacity-0 cu:not-data-[top]:after:shadow-[0_6px_18px_-8px_rgba(40,25,10,.22),0_1px_3px_rgba(40,25,10,.08)] cu:after:transition-[opacity,box-shadow] cu:after:duration-[.25s] cu:after:ease-out cu:max-[760px]:after:bg-[#FFFAF3] cu:motion-reduce:after:transition-none cu:max-[1023.98px]:justify-start cu:max-[1023.98px]:gap-2 cu:max-[760px]:flex-wrap cu:max-[760px]:gap-0" id="nav" data-top="">
        <div className="cu:relative cu:flex cu:items-center cu:gap-1.5 cu:h-[54px] cu:py-px cu:pl-3 cu:pr-2.5 cu:max-[1023.98px]:contents">
          <Logo />
          <nav className="cu:flex cu:items-center cu:gap-0.5 cu:max-[1600px]:gap-0 cu:max-[1023.98px]:hidden" id="navLinks" aria-label="Main">
            <MegaMenu id="mega" wrapId="explore" btnId="exploreBtn" label="All courses" wide />
            <a className={LINK} href="#toppers" data-more="toppers">Toppers</a>
            <MegaMenu id="megaSm" wrapId="studyNav" btnId="studyBtn" label="Study materials" />
            <a className={LINK} href="#batches" data-more="batches">Upcoming batches</a>
            <a className={LINK} href="#faq" data-more="faq">FAQs</a>
            <MoreMenu />
          </nav>
          <button className="cu:group/burger cu:hidden cu:max-[1023.98px]:block cu:relative cu:flex-none cu:order-2 cu:size-11 cu:max-[760px]:size-10 cu:p-0 cu:rounded-xl cu:border-0 cu:bg-transparent cu:cursor-pointer cu:text-[var(--ink)] cu:transition-colors cu:duration-200 cu:hover:bg-[rgba(38,38,38,.06)] cu:focus-visible:outline-2 cu:focus-visible:outline-offset-2 cu:focus-visible:outline-current cu:max-[760px]:ml-auto" id="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="drawer">
            <span className="cu:absolute cu:inset-x-[13px] cu:top-[17px] cu:h-[2px] cu:rounded-full cu:bg-current cu:transition-[translate,rotate] cu:duration-[.25s] cu:ease-[cubic-bezier(.2,.7,.2,1)] cu:group-aria-expanded/burger:translate-y-[4px] cu:group-aria-expanded/burger:rotate-45 cu:max-[760px]:inset-x-[11px] cu:motion-reduce:transition-none" />
            <span className="cu:absolute cu:inset-x-[13px] cu:top-[25px] cu:h-[2px] cu:rounded-full cu:bg-current cu:transition-[translate,rotate] cu:duration-[.25s] cu:ease-[cubic-bezier(.2,.7,.2,1)] cu:group-aria-expanded/burger:-translate-y-[4px] cu:group-aria-expanded/burger:-rotate-45 cu:max-[760px]:inset-x-[11px] cu:motion-reduce:transition-none" />
          </button>
        </div>
        <div className="cu:flex cu:items-center cu:gap-2.5 cu:pr-3 cu:max-[1023.98px]:order-1 cu:max-[760px]:hidden" id="navEnd">
          <LangSwitch bar />
          <Button className="talk" size="sm" shadow={false} href="#contact" iconEnd="arrow" data-talk="">Let's talk</Button>
        </div>
        <div className="cu:fixed cu:z-[49] cu:top-[100px] cu:inset-x-[var(--chrome-px)] cu:grid cu:p-2.5 cu:rounded-[20px] cu:bg-white cu:shadow-[0_18px_48px_rgba(38,38,38,.16)] cu:max-[900px]:top-[92px] cu:max-[760px]:static cu:max-[760px]:order-3 cu:max-[760px]:basis-full cu:max-[760px]:mt-2 cu:max-[760px]:p-0 cu:max-[760px]:pt-2 cu:max-[760px]:pb-1 cu:max-[760px]:max-h-[calc(100svh-120px)] cu:max-[760px]:overflow-y-auto cu:max-[760px]:rounded-none cu:max-[760px]:bg-transparent cu:max-[760px]:shadow-none cu:max-[760px]:border-0 cu:max-[760px]:border-t cu:max-[760px]:border-solid cu:max-[760px]:border-[rgba(45,18,4,.08)] cu:[&[hidden]]:hidden" id="drawer" hidden>
        {DRAWER_LINKS.map(([href, t]) => (
          <a key={href} className="cu:py-3 cu:px-3.5 cu:rounded-xl cu:text-[var(--ink)] cu:no-underline cu:[font-family:var(--btn-font)] cu:font-medium cu:text-lg cu:leading-[var(--btn-lh)] cu:tracking-[var(--btn-ls)] cu:transition-colors cu:duration-200 cu:hover:bg-[var(--sand)] cu:focus-visible:bg-[var(--sand)] cu:focus-visible:outline-2 cu:focus-visible:-outline-offset-2 cu:focus-visible:outline-[var(--brand)]" href={href}>{t}</a>
        ))}
        <div className="cu:hidden cu:max-[760px]:flex cu:items-center cu:gap-3 cu:mt-2 cu:pt-3 cu:px-1 cu:pb-1 cu:border-t cu:border-[var(--sand)]">
          <LangSwitch />
          <Button className="cu:flex-[1_1_auto] cu:min-w-0" size="sm" shadow={false} href="#contact" iconEnd="arrow" data-talk="">Let's talk</Button>
        </div>
        </div>
      </header>
      <div className="cu:fixed cu:inset-0 cu:z-[49] cu:pointer-events-none cu:invisible cu:opacity-0 cu:bg-[rgba(26,10,2,.16)] cu:backdrop-blur-[10px] cu:[transition:opacity_.3s_var(--ease),visibility_0s_.3s] cu:data-[open]:visible cu:data-[open]:opacity-100 cu:data-[open]:[transition:opacity_.3s_var(--ease),visibility_0s] cu:motion-reduce:transition-none" id="megaScrim" aria-hidden="true" />
    </>
  );
}

const ARROW_SVG = '<svg class="cu:size-3.5 cu:fill-none cu:stroke-current cu:stroke-2 cu:[stroke-linecap:round] cu:[stroke-linejoin:round] cu:transition-transform cu:duration-[.25s] cu:fine:group-hover/all:translate-x-[3px] cu:motion-reduce:transition-none" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg>';
const ALL_LINK = 'cu:group/all cu:inline-flex cu:items-center cu:gap-2 cu:p-0 cu:rounded-[3px] cu:[font:700_14px/1.2_var(--f)] cu:text-[var(--brand)] cu:no-underline cu:focus-visible:outline-2 cu:focus-visible:outline-offset-[3px] cu:focus-visible:outline-[var(--brand)]';
const KICKER = 'cu:relative cu:z-[1] cu:flex cu:items-center cu:gap-2 cu:w-fit cu:m-0 cu:pr-3 cu:[font:700_12px/1.3_var(--f)] cu:tracking-[.12em] cu:uppercase cu:text-[var(--brand)]';
const DISC = 'cu:flex-none cu:grid cu:place-items-center cu:size-7 cu:rounded-full cu:text-[11px] cu:tracking-normal';
const DISC_PLAIN = 'cu:bg-white cu:shadow-[inset_0_0_0_1px_rgba(194,65,12,.35)]';
const DISC_FEAT = 'cu:bg-[var(--brand)] cu:text-white';
const ROW = 'cu:group/row cu:grid cu:-ml-2.5 cu:px-2.5 cu:rounded-[var(--r-box,16px)] cu:text-[var(--ink)] cu:no-underline cu:transition-colors cu:duration-200 cu:fine:hover:bg-[var(--sand)] cu:focus-visible:outline-2 cu:focus-visible:outline-offset-2 cu:focus-visible:outline-[var(--brand)]';
const ROW_T = 'cu:[font:500_16px/1.25_var(--f-d)] cu:tracking-[-.005em] cu:text-[var(--ink)] cu:transition-colors cu:duration-200 cu:fine:group-hover/row:text-[var(--brand)]';
const ROW_D = 'cu:[font:400_13px/1.45_var(--f)] cu:text-[#6B5D52]';
const ASIDE = 'cu:flex cu:flex-col cu:items-start cu:bg-[var(--sand,#FFF2E6)] cu:border-l cu:border-[rgba(194,65,12,.12)]';

const plural = n => n + (n === 1 ? ' course' : ' courses');
// the All courses menu opens the course finder (app/courses) at that category's section (user 2026-11-23); CATS order -> its section keys
const CF_KEY = ['gs', 'optional', 'csat', 'interview', 'mentorship', 'mains-ts', 'prelims-ts', 'optional-ts'];
const cfHref = c => `/courses#cat=${CF_KEY[c] || 'all'}`;
const num = i => String(i + 1).padStart(2, '0');

function coursesMenu() {
  const total = CATS.reduce((n, c) => n + c.courses.length, 0);
  const cols = STAGES.map((s, i) => `<section class="cu:relative cu:pr-3.5" data-mega-col>
      <p class="${KICKER} cu:mb-3"><b class="${DISC} ${DISC_PLAIN}">${num(i)}</b>${s.k}</p>
      <ul class="cu:grid cu:gap-1 cu:m-0 cu:p-0 cu:list-none">${s.cats.map(c => `<li><a class="${ROW} cu:gap-[3px] cu:pt-2.5 cu:pb-[11px]" href="${cfHref(c)}" data-mega-close><span class="${ROW_T}">${esc(CATS[c].t)}</span><span class="${ROW_D} cu:line-clamp-3">${esc(CAT_D[c])}</span><span class="cu:justify-self-start cu:mt-1 cu:py-0.5 cu:px-2 cu:rounded-full cu:bg-[rgba(194,65,12,.08)] cu:[font:700_11px/1.5_var(--f)] cu:tracking-[.02em] cu:text-[var(--brand)] cu:transition-colors cu:duration-200 cu:fine:group-hover/row:bg-[var(--brand)] cu:fine:group-hover/row:text-white">${plural(CATS[c].courses.length)}</span></a></li>`).join('')}</ul>
    </section>`).join('');
  return `<div class="cu:grid cu:grid-cols-5 cu:pt-[26px] cu:pr-3 cu:pb-[22px] cu:pl-[26px] cu:max-[1500px]:pl-[22px]">${cols}</div>
    <aside class="${ASIDE} cu:gap-3 cu:py-[26px] cu:px-6" data-mega-col>
      <p class="${KICKER} cu:tracking-[.1em]">Not sure where to start?</p>
      <p class="cu:m-0 cu:[font:400_14px/1.5_var(--f)] cu:text-[#4A4038]">A counsellor will match you to a programme for your stage, with no pressure to enrol.</p>
      ${buttonHTML({ href: '#contact', label: 'Talk to a counsellor', size: 'sm', iconEnd: 'arrow', fullWidth: true, className: 'cu:self-stretch cu:mt-1 cu:grid-cols-[minmax(0,1fr)_var(--btn-disc)]! cu:[&>:first-child]:col-start-1! cu:[&>:nth-child(2)]:col-start-2!', attrs: { 'data-mega-close': '' } })}
      <a class="${ALL_LINK} cu:mt-auto" href="/courses" data-mega-close>View all ${total} courses${ARROW_SVG}</a>
    </aside>`;
}

function studyMenu() {
  const cols = STUDY_MENU.map(([k, items], i) => {
    const feat = i === 0;
    const live = feat ? '<span class="cu:inline-flex cu:items-center cu:gap-[5px] cu:ml-0.5 cu:py-0.5 cu:pr-[7px] cu:pl-1.5 cu:rounded-full cu:bg-[#FFD48A] cu:text-[#7A2A0A] cu:[font:700_9.5px/1.4_var(--f)] cu:tracking-[.1em]"><i class="cu:relative cu:size-1.5 cu:rounded-full cu:bg-[#C2410C]" aria-hidden="true"><i class="cu:absolute cu:inset-0 cu:rounded-full cu:bg-[#C2410C] cu:animate-ping cu:motion-reduce:hidden"></i></i>Live</span>' : '';
    const colCls = feat
      ? 'cu:relative cu:-my-2 cu:-ml-2 cu:mr-2 cu:pt-2 cu:pr-2.5 cu:pb-2.5 cu:pl-2 cu:rounded-[var(--r-box,16px)] cu:bg-[linear-gradient(180deg,#FFF3E6,#FFF8F1)] cu:shadow-[inset_0_0_0_1px_rgba(194,65,12,.14)]'
      : 'cu:relative cu:pr-2';
    return `<section class="${colCls}" data-mega-col>
    <p class="${KICKER} cu:mb-2${feat ? ' cu:whitespace-nowrap' : ''}"><b class="${DISC} ${feat ? DISC_FEAT : DISC_PLAIN}">${num(i)}</b>${esc(k)}${live}</p>
    <ul class="cu:grid cu:gap-0.5 cu:m-0 cu:p-0 cu:list-none">${items.map(([t, d, n]) => `<li><a class="${ROW} cu:gap-0.5 cu:pt-2 cu:pb-[9px]" href="${SITE}" target="_blank" rel="noopener" data-mega-close><span class="${ROW_T} cu:text-[15.5px]">${esc(t)}</span><span class="${ROW_D} cu:line-clamp-2">${n ? `<b class="cu:mr-1.5 cu:[font:700_10.5px/1_var(--f)] cu:tracking-[.08em] cu:uppercase cu:text-[var(--brand)]">${esc(n)}</b>` : ''}${esc(d)}</span></a></li>`).join('')}</ul>
  </section>`;
  }).join('');
  const heads = HEADLINES.map(([k, t, path]) => `<li><a class="cu:group/h cu:grid cu:gap-[3px] cu:-mx-2.5 cu:p-2.5 cu:rounded-[var(--r-card,12px)] cu:text-[var(--ink)] cu:no-underline cu:transition-colors cu:duration-200 cu:fine:hover:bg-white cu:focus-visible:outline-2 cu:focus-visible:outline-offset-2 cu:focus-visible:outline-[var(--brand)]" href="${SITE}${path}" target="_blank" rel="noopener" data-mega-close><span class="cu:justify-self-start cu:[font:700_10px/1.3_var(--f)] cu:tracking-[.12em] cu:uppercase cu:text-[var(--brand)]">${esc(k)}</span><span class="cu:[font:500_14px/1.35_var(--f-d)] cu:text-[var(--ink)] cu:transition-colors cu:duration-200 cu:fine:group-hover/h:text-[var(--brand)]">${esc(t)}</span></a></li>`).join('');
  return `<div class="cu:grid cu:grid-cols-[minmax(0,1.18fr)_repeat(3,minmax(0,1fr))] cu:items-start cu:gap-x-1.5 cu:pt-[22px] cu:pr-[18px] cu:pb-5 cu:pl-[22px]">${cols}</div>
  <aside class="${ASIDE} cu:gap-3.5 cu:pt-6 cu:px-[22px] cu:pb-[22px]" data-mega-col>
    <p class="${KICKER} cu:tracking-[.1em]">Today’s headlines</p>
    <ul class="cu:grid cu:w-full cu:-mt-0.5 cu:mb-1 cu:p-0 cu:list-none cu:[&>li+li]:border-t cu:[&>li+li]:border-[rgba(194,65,12,.14)]">${heads}</ul>
    ${buttonHTML({ href: '#resources', label: 'Explore free resources', size: 'sm', iconEnd: 'arrow', fullWidth: true, className: 'cu:self-stretch cu:grid-cols-[minmax(0,1fr)_var(--btn-disc)]! cu:[&>:first-child]:col-start-1! cu:[&>:nth-child(2)]:col-start-2!', attrs: { 'data-mega-close': '' } })}
    <a class="${ALL_LINK}" href="${SITE}" target="_blank" rel="noopener" data-mega-close>View all study materials${ARROW_SVG}</a>
  </aside>`;
}

let drawer, burger, scrim;
const megas = [];

const rise = (els, dy, step) => {
  if (reduce) return;
  els.forEach((el, i) => el.animate([{ opacity: 0, translate: `0 ${dy}px` }, { opacity: 1, translate: '0 0' }],
    { duration: 400, delay: i * step + 40, easing: EASE, fill: 'backwards' }));
};

export const setDrawer = open => {
  if (!drawer) return;
  const was = !drawer.hidden;
  drawer.hidden = !open;
  burger.setAttribute('aria-expanded', open);
  if (open && !was) {
    if (!reduce) drawer.animate([{ opacity: 0, translate: '0 -8px' }, { opacity: 1, translate: '0 0' }], { duration: 260, easing: EASE });
    rise([...drawer.children], 6, 25);
  }
};

export const setMega = open => megas.forEach(m => m.set(open && m === megas[0]));

const navMega = (wrap, btn, href) => {
  const isOpen = () => wrap.hasAttribute('data-open');
  const set = open => {
    if (open) megas.forEach(m => m !== api && m.set(false));
    const was = isOpen();
    wrap.toggleAttribute('data-open', open);
    btn.setAttribute('aria-expanded', open);
    scrim?.toggleAttribute('data-open', megas.some(m => m.isOpen()));
    if (open && !was) rise($$('[data-mega-col]', wrap), 8, 35);
  };
  let t;
  btn.addEventListener('click', e => {
    if (href && e.detail > 0 && matchMedia('(hover: hover)').matches) { location.assign(href); return; }   // a mouse click goes to the page (the menu already opens on hover); touch and keyboard toggle the menu
    set(!isOpen());
  });
  wrap.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { clearTimeout(t); set(true); } });
  wrap.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') t = setTimeout(() => set(false), 160); });
  document.addEventListener('click', e => { if (!wrap.contains(e.target)) set(false); });
  wrap.addEventListener('focusout', e => { if (!wrap.contains(e.relatedTarget)) set(false); });
  btn.addEventListener('keydown', e => {
    if (e.key !== 'ArrowDown') return;
    e.preventDefault(); set(true);
    $('[data-mega-col] a', wrap)?.focus();
  });
  wrap.addEventListener('click', e => { if (e.target.closest('[data-mega-close], [data-cat]')) set(false); });
  const api = { set, isOpen };
  megas.push(api);
  return api;
};

export function initNavMenus() {
  drawer = $('#drawer'); burger = $('#burger'); scrim = $('#megaScrim');
  if (!drawer || !burger) return;
  burger.addEventListener('click', () => setDrawer(drawer.hidden));
  $$('a', drawer).forEach(a => a.addEventListener('click', () => setDrawer(false)));
  $('#mega').innerHTML = coursesMenu();
  $('#megaSm').innerHTML = studyMenu();
  navMega($('#explore'), $('#exploreBtn'), '/courses');
  navMega($('#studyNav'), $('#studyBtn'));
  addEventListener('keydown', e => { if (e.key === 'Escape') { setMega(false); setDrawer(false); } });
}

export function initNavScrolled() {
  const nav = $('#nav');
  if (!nav) return;
  let tick = false;
  const update = () => { tick = false; nav.toggleAttribute('data-top', scrollY <= 2); };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

export function initNavMore() {
  const wrap = $('#navMore'), btn = $('#moreBtn'), menu = $('#moreMenu'), links = $('#navLinks'), end = $('#navEnd');
  if (!wrap || !btn || !menu || !links || !end) return;
  const barLink = k => links.querySelector(`:scope > a[data-more="${k}"]`);
  const twin = k => menu.querySelector(`[data-more="${k}"]`);
  const isOpen = () => wrap.hasAttribute('data-open');
  const setOpen = open => {
    wrap.toggleAttribute('data-open', open);
    btn.setAttribute('aria-expanded', open);
    if (open) setMega(false);
  };
  const free = () => {
    const kids = [...links.children].filter(e => !e.hidden && e.getClientRects().length && getComputedStyle(e).display !== 'none');
    const right = Math.max(...kids.map(e => e.getBoundingClientRect().right));
    return end.getBoundingClientRect().left - right;
  };
  const fit = () => {
    MORE_ORDER.forEach(k => { barLink(k)?.removeAttribute('data-over'); const t = twin(k); if (t) t.hidden = true; });
    wrap.hidden = true;
    if (getComputedStyle(links).display !== 'none') {
      for (const k of MORE_ORDER) {
        if (free() >= MORE_GAP) break;
        barLink(k)?.setAttribute('data-over', '');
        const t = twin(k); if (t) t.hidden = false;
        wrap.hidden = false;
      }
    }
    if (wrap.hidden && isOpen()) setOpen(false);
  };
  let frame = 0;
  const refit = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(fit); };
  btn.addEventListener('click', e => { e.stopPropagation(); setOpen(!isOpen()); });
  menu.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('click', e => { if (isOpen() && !wrap.contains(e.target)) setOpen(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) { setOpen(false); btn.focus(); } });
  wrap.addEventListener('focusout', e => { if (isOpen() && !wrap.contains(e.relatedTarget)) setOpen(false); });
  ['#exploreBtn', '#studyBtn'].forEach(s => $(s)?.addEventListener('click', () => setOpen(false)));
  addEventListener('resize', refit);
  document.fonts?.ready.then(refit);
  fit();
}

export function initLangSwitch() {
  $$('[data-lang-sw]').forEach(w => $$('button[data-lang]', w).forEach(b => b.addEventListener('click', () => {
    w.dataset.cur = b.dataset.lang;
    $$('button[data-lang]', w).forEach(x => x.setAttribute('aria-pressed', x === b));
  })));
}
