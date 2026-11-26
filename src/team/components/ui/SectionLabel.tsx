// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): components/ui/SectionLabel.tsx. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
import type { CSSProperties, ReactNode } from 'react';
import '@/team/tailwind-sections.css';

export type SectionLabelAlign = 'start' | 'center';
export type SectionLabelTone = 'brand' | 'dark';

export interface SectionLabelProps {
  children: ReactNode;
  align?: SectionLabelAlign;
  tone?: SectionLabelTone;
  reveal?: boolean;
  delay?: string;
  id?: string;
  className?: string;
}

const ALIGN: Record<SectionLabelAlign, string> = {
  start: 'cu:justify-start',
  center: 'cu:justify-center',
};

const TONE: Record<SectionLabelTone, string> = {
  brand: 'cu:[border-image-source:url(/assets/img/brand/cartouche-brand.svg)]',
  dark: 'cu:[border-image-source:url(/assets/img/brand/cartouche.svg)]',
};

const BADGE = [
  'cu:inline-flex cu:items-center cu:justify-center cu:box-border cu:h-[30px] cu:m-0 cu:px-[11px] cu:overflow-visible',
  'cu:border-solid cu:border-transparent cu:border-x-[13px] cu:border-y-0',
  'cu:[border-image-slice:0_13_fill] cu:[border-image-width:0_13px] cu:[border-image-outset:0] cu:[border-image-repeat:stretch]',
  'cu:bg-transparent cu:text-white cu:[font-family:"Geist",var(--f),sans-serif] cu:font-medium cu:text-[12px]/[16px] cu:tracking-[.96px] cu:uppercase cu:whitespace-nowrap',
].join(' ');

export default function SectionLabel({ children, align = 'start', tone = 'brand', reveal = true, delay = '.05s', id, className = '' }: SectionLabelProps) {
  const cls = ['lbl cu:flex cu:items-center cu:gap-0', ALIGN[align], reveal && 'rv', className].filter(Boolean).join(' ');
  const style = reveal ? ({ '--d': delay } as CSSProperties) : undefined;
  return (
    <div id={id} className={cls} style={style}>
      <span className={`${BADGE} ${TONE[tone]}`} data-label-text>{children}</span>
    </div>
  );
}
