// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): components/ui/section_wrapper.jsx. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
import '@/team/tailwind-sections.css';

export default function SectionWrapper({ id, labelledBy, className = '', tight = false, noBottom = false, bleed = false, compact = false, half = false, children, ...rest }) {
  const pad = [
    half ? 'cu:pt-[calc(var(--sec-y)*.33)]!' : compact ? 'cu:pt-[calc(var(--sec-y)*.65)]!' : tight ? 'cu:pt-[calc(var(--sec-y)*.5)]!' : 'cu:pt-(--sec-y)!',
    noBottom ? 'cu:pb-0!' : half ? 'cu:pb-[calc(var(--sec-y)*.33)]!' : compact ? 'cu:pb-[calc(var(--sec-y)*.65)]!' : 'cu:pb-(--sec-y)!',
    bleed ? 'cu:px-0!' : 'cu:px-(--px)!',
    'cu:[&_.lbl+.h2]:mt-(--hd-lbl) cu:[&_.h2.h2--sec]:mt-(--hd-lbl) cu:[&_.h2+.intro]:mt-(--hd-in) cu:[&_.h2--sec+.intro]:mt-(--hd-in)',
    String.raw`cu:[&_.sm\_\_grid]:mt-(--hd-gap)! cu:[&_.qas]:mt-(--hd-gap)! cu:[&_.cm]:mt-(--hd-gap)! cu:[&_.cl\_\_p]:mt-[calc(var(--hd-in)-20px)] cu:[&_.cl\_\_h]:mb-0`,
  ].join(' ');
  return (
    <section id={id} aria-labelledby={labelledBy} className={`cu:relative ${pad} ${className}`.trim()} {...rest}>
      {children}
    </section>
  );
}
