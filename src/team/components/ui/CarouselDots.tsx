// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): components/ui/CarouselDots.jsx. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
import '@/team/tailwind-sections.css';

const ROW = 'cu:flex cu:items-center cu:m-0 cu:py-[10px] cu:px-[7px] cu:rounded-full cu:bg-(--dot-pill)';
const TONE = {
  dark: 'cu:[--dot-edge:rgba(0,0,0,.8)] cu:[--dot-track:rgba(255,255,255,.4)] cu:[--dot-fill:#fff] cu:[--dot-ring:#FFD48A] cu:[--dot-pill:rgba(0,0,0,.05)]',
  hero: 'cu:[--dot-edge:rgba(255,255,255,.9)] cu:[--dot-track:rgba(255,255,255,.4)] cu:[--dot-fill:#fff] cu:[--dot-ring:#FFD48A] cu:[--dot-pill:rgba(0,0,0,.05)]',
  light: 'cu:[--dot-edge:rgba(0,0,0,.8)] cu:[--dot-track:rgba(194,65,12,.3)] cu:[--dot-fill:var(--brand)] cu:[--dot-ring:var(--brand)] cu:[--dot-pill:rgba(0,0,0,.05)]',
};
const DOT = [
  'cu:relative cu:flex-none cu:box-content cu:w-[8px] cu:h-[8px] cu:-my-[8px] cu:-mx-[3px] cu:p-0 cu:overflow-hidden cu:cursor-pointer',
  'cu:border-8 cu:border-solid cu:border-transparent cu:rounded-full cu:bg-clip-padding cu:bg-(--dot-edge)',
  'cu:[transition:width_.35s_cubic-bezier(.65,0,.35,1),scale_.2s_ease,background-color_.2s_ease] cu:motion-reduce:transition-none',
  'cu:[&:not([aria-current=true]):hover]:[scale:1.6] cu:[&:not([aria-current=true]):focus-visible]:[scale:1.6]',
  'cu:aria-[current=true]:w-[32px] cu:aria-[current=true]:bg-(--dot-track)',
  'cu:focus-visible:outline-2 cu:focus-visible:outline-(--dot-ring) cu:focus-visible:outline-offset-[-5px]',
].join(' ');
const FILL = 'cu:absolute cu:inset-0 cu:block cu:bg-(--dot-fill) cu:origin-left cu:[transform:scaleX(var(--p,1))] cu:[:not([aria-current=true])>&]:[transform:scaleX(0)]';
const TIMED = [
  'cu:[[aria-current=true]>&]:[transform:scaleX(0)] cu:[[aria-current=true]>&]:animate-[cd-fill_var(--dot-t,6s)_linear_forwards]',
  'cu:[.is-paused_&]:[animation-play-state:paused]',
  'cu:motion-reduce:[[aria-current=true]>&]:animate-none cu:motion-reduce:[[aria-current=true]>&]:[transform:none]',
].join(' ');

export default function CarouselDots({
  labels, label, active, onSelect, tone = 'dark', timed = false, duration = undefined, fillRef, fillProps, activeClass = undefined,
  controls = undefined, as: Tag = 'div', id = undefined, className,
}) {
  const cls = [ROW, TONE[tone] || TONE.dark, className].filter(Boolean).join(' ');
  const fillCls = timed ? `${FILL} ${TIMED}` : FILL;
  return (
    <Tag id={id} className={cls} role="group" aria-label={label} style={duration ? { '--dot-t': duration } : undefined}>
      {labels.map((name, i) => {
        const on = i === active;
        const { key: fillKey, ...fill } = (fillProps && fillProps(i, on)) || {};
        return (
          <button key={i} type="button" aria-label={name} aria-controls={controls} aria-current={on ? 'true' : undefined}
            className={on && activeClass ? `${DOT} ${activeClass}` : DOT} onClick={onSelect ? () => onSelect(i) : undefined}>
            <i key={fillKey} aria-hidden="true" ref={on ? fillRef : undefined} className={fillCls} {...fill} />
          </button>
        );
      })}
    </Tag>
  );
}
