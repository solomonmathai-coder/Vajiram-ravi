// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): components/ui/Button.tsx. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
import type { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

export const VARIANTS = ['primary', 'white', 'secondary', 'outline', 'ghost', 'link', 'destructive', 'fab'] as const;
export const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type ButtonVariant = (typeof VARIANTS)[number];
export type ButtonSize = (typeof SIZES)[number];
export type ButtonIcon = 'arrow' | 'arrow-left' | 'close' | 'chevron' | ReactNode;

export interface ButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement> & ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: string;
  children?: ReactNode;
  iconStart?: ButtonIcon;
  iconEnd?: ButtonIcon;
  iconOnly?: boolean;
  onDark?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
  selected?: boolean;
  shadow?: boolean;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  ariaLabel?: string;
  labelId?: string;
  [data: `data-${string}`]: string | number | boolean | undefined;
}

type Opts = Record<string, any>;

const DISC = new Set<string>(['primary', 'white', 'secondary', 'outline', 'destructive']);
const ROLLS = new Set<string>([...DISC, 'ghost']);

const PATHS: Record<string, string> = {
  arrow: '<path d="M2.5 8h11"/><path d="M8.6 3.6C9.4 5.9 11.2 7.4 13.5 8 11.2 8.6 9.4 10.1 8.6 12.4"/>',
  close: '<path d="M3.5 3.5l9 9"/><path d="M12.5 3.5l-9 9"/>',
  chevron: '<path d="M4 6l4 4 4-4"/>',
};
PATHS['arrow-left'] = PATHS.arrow;
export const ICONS = Object.keys(PATHS);
export const isIconName = (v: unknown): v is string => typeof v === 'string' && Object.prototype.hasOwnProperty.call(PATHS, v);
export const iconSVG = (name: string) => `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${PATHS[name]}</svg>`;
export const isSwapIcon = (name: string) => name === 'arrow' || name === 'arrow-left';

const iconClass = (slot: string, name?: string) =>
  `btn__icon btn__icon--${slot}${name && isSwapIcon(name) ? ' btn__icon--swap' : ''}${name === 'arrow-left' ? ' btn__icon--flip' : ''}`;

export function resolve({ variant = 'primary', size = 'md', iconStart, iconEnd, iconOnly = false, onDark = false, fullWidth = false,
  loading = false, loadingLabel, disabled = false, selected, shadow = true, className = '' }: Opts = {}) {
  if (!(VARIANTS as readonly string[]).includes(variant)) variant = 'primary';
  if (!(SIZES as readonly string[]).includes(size)) size = 'md';
  const fab = variant === 'fab';
  const disc = !iconOnly && !fab && DISC.has(variant) && iconEnd === 'arrow';
  const cls = ['btn', `btn--${variant}`, `btn--${size}`];
  if (iconOnly) cls.push('btn--icon');
  if (disc) cls.push('btn--disc');
  if (onDark) cls.push('btn--on-dark');
  if (fullWidth) cls.push('btn--full');
  if (shadow === false) cls.push('btn--flat');
  if (selected) cls.push('is-selected');
  if (className) cls.push(className);
  return {
    variant, size, disc, fab,
    roll: ROLLS.has(variant) && !iconOnly,
    className: cls.join(' '),
    busy: !!loading, busyLabel: loading && loadingLabel ? loadingLabel : null,
    off: !!disabled || !!loading,
  };
}

export const buttonClass = (opts?: Opts) => resolve(opts).className;

const escHTML = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as Record<string, string>)[c]);
const iconHTML = (v: any, slot: string) => {
  if (v == null || v === false) return '';
  if (isIconName(v)) {
    const svg = iconSVG(v);
    return `<span class="${iconClass(slot, v)}" aria-hidden="true">${isSwapIcon(v) ? svg + svg : svg}</span>`;
  }
  return `<span class="${iconClass(slot)}" aria-hidden="true">${v}</span>`;
};

export function buttonHTML(opts: Opts = {}) {
  const { href, type = 'button', label = '', labelHTML, iconStart, iconEnd, iconOnly = false, ariaLabel, target, rel, id, attrs = {} } = opts;
  const r = resolve(opts);
  const text = labelHTML ?? escHTML(r.busyLabel ?? label);
  const a: string[] = [`class="${escHTML(r.className)}"`];
  const tag = href != null ? 'a' : 'button';
  if (tag === 'a') {
    if (!r.off) a.push(`href="${escHTML(href)}"`); else a.push('aria-disabled="true"', 'tabindex="-1"', 'role="link"');
    if (target) a.push(`target="${escHTML(target)}"`);
    if (rel || target === '_blank') a.push(`rel="${escHTML(rel || 'noopener')}"`);
  } else {
    a.push(`type="${escHTML(type)}"`);
    if (r.off) a.push('disabled');
  }
  if (id) a.push(`id="${escHTML(id)}"`);
  if (ariaLabel || iconOnly) a.push(`aria-label="${escHTML(ariaLabel || label)}"`);
  if (r.busy) a.push('aria-busy="true"');
  if (r.busyLabel) a.push('data-busy-label=""');
  if (opts.selected != null) a.push(`aria-pressed="${opts.selected ? 'true' : 'false'}"`);
  Object.entries(attrs).forEach(([k, v]) => { if (v != null && v !== false) a.push(v === true ? k : `${k}="${escHTML(v)}"`); });

  let inner = '';
  if (iconOnly) {
    inner = iconHTML(iconStart ?? iconEnd, 'only');
  } else {
    inner += iconHTML(iconStart, 'start');
    inner += r.roll
      ? `<span class="btn__label"><span class="btn__t">${text}</span><span class="btn__t" aria-hidden="true">${text}</span></span>`
      : `<span class="btn__label"><span class="btn__t">${text}</span></span>`;
    if (r.disc) inner += `<span class="btn__disc" aria-hidden="true">${iconSVG('arrow')}${iconSVG('arrow')}<span class="btn__spin"></span></span>`;
    else inner += iconHTML(iconEnd, 'end');
  }
  if (!r.disc) inner += '<span class="btn__spin" aria-hidden="true"></span>';
  return `<${tag} ${a.join(' ')}>${inner}</${tag}>`;
}

export function setButtonLoading(el: HTMLElement | null, on: boolean, loadingLabel?: string) {
  if (!el) return;
  const ts = [...el.querySelectorAll('.btn__t')];
  if (on) {
    if (el.dataset.label == null) el.dataset.label = ts[0]?.textContent ?? '';
    el.setAttribute('aria-busy', 'true');
    if (loadingLabel) { el.setAttribute('data-busy-label', ''); ts.forEach(t => { t.textContent = loadingLabel; }); }
    else el.removeAttribute('data-busy-label');
    setButtonDisabled(el, true);
  } else {
    el.removeAttribute('aria-busy'); el.removeAttribute('data-busy-label');
    const saved = el.dataset.label;
    if (saved != null) { ts.forEach(t => { t.textContent = saved; }); delete el.dataset.label; }
    setButtonDisabled(el, false);
  }
}

export function setButtonDisabled(el: HTMLElement | null, off: boolean) {
  if (!el) return;
  if (el.tagName === 'BUTTON') { (el as HTMLButtonElement).disabled = off; return; }
  if (off) { el.setAttribute('aria-disabled', 'true'); el.setAttribute('tabindex', '-1'); }
  else { el.removeAttribute('aria-disabled'); el.removeAttribute('tabindex'); }
}

export function setButtonLabel(el: HTMLElement | null, text: string) {
  if (!el) return;
  el.querySelectorAll('.btn__t').forEach(t => { t.textContent = text; });
  if (el.dataset.label != null) el.dataset.label = text;
}

const JSX_PATHS: Record<string, ReactNode> = {
  arrow: <><path d="M2.5 8h11" /><path d="M8.6 3.6C9.4 5.9 11.2 7.4 13.5 8 11.2 8.6 9.4 10.1 8.6 12.4" /></>,
  close: <><path d="M3.5 3.5l9 9" /><path d="M12.5 3.5l-9 9" /></>,
  chevron: <path d="M4 6l4 4 4-4" />,
};
JSX_PATHS['arrow-left'] = JSX_PATHS.arrow;

function Svg({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {JSX_PATHS[name]}
    </svg>
  );
}

function Icon({ icon, slot }: { icon: ButtonIcon; slot: string }) {
  if (icon == null || icon === false) return null;
  if (isIconName(icon)) {
    return <span className={iconClass(slot, icon)} aria-hidden="true"><Svg name={icon} />{isSwapIcon(icon) && <Svg name={icon} />}</span>;
  }
  return <span className={iconClass(slot)} aria-hidden="true">{icon}</span>;
}

export default function Button({
  variant = 'primary', size = 'md', label, children, iconStart, iconEnd, iconOnly = false, onDark = false,
  disabled = false, loading = false, loadingLabel, fullWidth = false, selected, shadow = true,
  type = 'button', href, target, rel, ariaLabel, className, labelId, ...rest
}: ButtonProps) {
  const r = resolve({ variant, size, iconStart, iconEnd, iconOnly, onDark, fullWidth, loading, loadingLabel, disabled, selected, shadow, className });
  const text = r.busyLabel ?? children ?? label;
  const a11yLabel = ariaLabel ?? (iconOnly ? (label ?? (typeof children === 'string' ? children : undefined)) : undefined);
  const state = {
    'aria-label': a11yLabel,
    'aria-busy': r.busy || undefined,
    'data-busy-label': r.busyLabel ? '' : undefined,
    'aria-pressed': selected == null ? undefined : !!selected,
  };

  const inner = iconOnly ? (
    <Icon icon={iconStart ?? iconEnd} slot="only" />
  ) : (
    <>
      <Icon icon={iconStart} slot="start" />
      <span className="btn__label">
        <span className="btn__t" id={labelId}>{text}</span>
        {r.roll && <span className="btn__t" aria-hidden="true">{text}</span>}
      </span>
      {r.disc
        ? <span className="btn__disc" aria-hidden="true"><Svg name="arrow" /><Svg name="arrow" /><span className="btn__spin" /></span>
        : <Icon icon={iconEnd} slot="end" />}
    </>
  );
  const spin = r.disc ? null : <span className="btn__spin" aria-hidden="true" />;

  if (href != null) {
    const link = r.off
      ? { 'aria-disabled': true, tabIndex: -1, role: 'link' }
      : { href, target, rel: rel ?? (target === '_blank' ? 'noopener' : undefined) };
    return <a className={r.className} {...link} {...state} {...rest}>{inner}{spin}</a>;
  }
  return <button className={r.className} type={type} disabled={r.off} {...state} {...rest}>{inner}{spin}</button>;
}
