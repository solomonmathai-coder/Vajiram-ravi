import type { ReactNode } from "react";
import { currentPreview, resourceCards, resourcesV2Intro, type ResourceCard, type ResourceKind } from "@/data/resourcesV2";
import { cx } from "@/lib/cx";

/**
 * The free resources (homepage v2, IA 9), in design S's style (the client's choice): the eyebrow, the
 * heading and the line, then the six resources as a bento of white cards on the paper with design S's
 * jaali. The client found S's cards plain, so each now shows a little of what is inside: today's articles
 * under Current affairs, the month's magazine cover under The Recitals, the years under Previous year
 * papers, the three stages under Syllabus, a stack of the printed books, and the stages of the year on a
 * line under the calendar. Every card carries its number, its icon in a warm disc and design S's sun's
 * rays in its corner; on hover it lifts, its border warms to orange, the rays turn a little and its
 * arrow steps on. Each card is one link.
 */
export default function Resources() {
  return (
    <section
      id="resources"
      aria-labelledby="resources-h"
      className="relative"
      style={{
        background:
          "linear-gradient(90deg, rgb(255 250 243 / 0) 0%, rgb(255 250 243 / 0.94) 30%, rgb(255 250 243 / 0.94) 70%, rgb(255 250 243 / 0) 100%), url(/images/ornaments/bg-jaali.svg) 0 0 / 36px 36px repeat, #fffaf3",
      }}
    >
      <div className="mx-auto flex w-canvas flex-col items-center px-20 pt-20 pb-20">
        <p className="rounded-full bg-[#c2410c] px-3.5 py-1 text-[12px]/[16px] font-bold tracking-[0.1em] text-white uppercase">{resourcesV2Intro.eyebrow}</p>
        <h2 id="resources-h" data-split className="mt-4 text-center font-heading text-[52px]/[1.08] font-semibold tracking-[-0.02em] text-ink">
          {resourcesV2Intro.heading.before}
          <em data-reveal-em className="text-orange not-italic">
            {resourcesV2Intro.heading.em}
          </em>
        </h2>
        <p className="mt-3 w-[560px] text-center text-[17px]/[1.55] text-clay">{resourcesV2Intro.lead}</p>

        <ul data-stagger className="mt-10 grid w-full grid-cols-4 gap-5">
          {resourceCards.map((card, i) => (
            <li key={card.kind} className={card.wide ? "col-span-2" : undefined}>
              <Card card={card} n={i + 1} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Card({ card, n }: { card: ResourceCard; n: number }) {
  return (
    <a
      href={card.href}
      className="group/rs relative flex h-[268px] flex-col overflow-clip rounded-[20px] border border-[#eadbc4] bg-white p-6 shadow-[0_14px_30px_-24px_rgb(77_31_8/0.45)] [transition:translate_var(--dur-base)_var(--ease-out),border-color_var(--dur-base)_var(--ease-out),box-shadow_var(--dur-base)_var(--ease-out)] hover:-translate-y-1 hover:border-[#e3753f] hover:shadow-[0_26px_40px_-26px_rgb(194_65_12/0.55)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burnt"
    >
      {/* Design S's sun's rays, in the card's corner, turning a little on hover. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-[150px] -right-[150px] size-[300px] bg-[#e3753f] opacity-50 [transition:rotate_900ms_var(--ease-out)] group-hover/rs:rotate-12"
        style={{ mask: "url(/images/ornaments/surya-rays.svg) center / contain no-repeat", WebkitMask: "url(/images/ornaments/surya-rays.svg) center / contain no-repeat" }}
      />
      <div className="relative flex items-start justify-between">
        <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-[#fdebd6] text-[#c2410c] ring-1 ring-[#f4cfa6]">
          <Icon kind={card.kind} />
        </span>
        <span aria-hidden="true" className="font-heading text-[14px]/[1] font-semibold text-[#c2410c]/60">
          {String(n).padStart(2, "0")}
        </span>
      </div>
      <h3 className="relative mt-4 font-heading text-[22px]/[1.2] font-semibold text-ink">{card.title}</h3>
      <p className="relative mt-1.5 text-[15px]/[1.45] text-clay">{card.text}</p>
      <div className="relative mt-auto flex items-end justify-between gap-4">
        <span className="flex items-center gap-1.5 text-[15px]/[20px] font-semibold whitespace-nowrap text-[#c2410c]">
          {card.cta}
          <span aria-hidden="true" className="[transition:translate_var(--dur-fast)_var(--ease-out)] group-hover/rs:translate-x-1">
            →
          </span>
        </span>
        <Preview kind={card.kind} />
      </div>
    </a>
  );
}

/** What is inside, in small. Decoration: the card's words say it. */
function Preview({ kind }: { kind: ResourceKind }) {
  const box = (children: ReactNode, className?: string) => (
    <span aria-hidden="true" className={cx("flex shrink-0", className)}>
      {children}
    </span>
  );
  switch (kind) {
    case "current":
      return box(
        <span className="flex w-[300px] flex-col gap-1.5">
          {currentPreview.map((item) => (
            <span key={item.title} className="flex items-center gap-2 rounded-[10px] bg-[#fbf3e6] px-2.5 py-1.5 [transition:background-color_var(--dur-fast)_var(--ease-out)] group-hover/rs:bg-[#fdebd6]">
              <span className="shrink-0 rounded-full bg-[#c2410c] px-2 py-0.5 text-[12px]/[14px] font-semibold text-white">{item.tag}</span>
              <span className="truncate text-[13px]/[18px] font-medium text-ink">{item.title}</span>
            </span>
          ))}
        </span>,
      );
    case "recitals":
      return box(
        <span className="relative h-[72px] w-[56px] rotate-6 rounded-[4px] bg-[linear-gradient(160deg,#f06a2c,#c2410c)] p-1.5 shadow-[0_6px_12px_-6px_rgb(77_31_8/0.6)] [transition:rotate_var(--dur-base)_var(--ease-out)] group-hover/rs:rotate-0">
          <span className="block text-[12px]/[13px] font-bold text-white">Recitals</span>
          <span className="absolute inset-x-1.5 bottom-1.5 h-1 rounded-full bg-white/50" />
          <span className="absolute inset-x-1.5 bottom-3.5 h-1 w-2/3 rounded-full bg-white/35" />
        </span>,
      );
    case "papers":
      return box(
        <span className="grid grid-cols-2 gap-1">
          {[2025, 2024, 2023, 2022].map((y) => (
            <span key={y} className="rounded-full border border-[#f4cfa6] px-2 py-0.5 text-[12px]/[14px] font-semibold text-[#c2410c]">
              {y}
            </span>
          ))}
        </span>,
      );
    case "syllabus":
      return box(
        <span className="flex flex-col items-end gap-1">
          {["Prelims", "Mains", "Interview"].map((s, i) => (
            <span key={s} className="rounded-full bg-[#fbf3e6] px-2 py-0.5 text-[12px]/[14px] font-semibold text-ink" style={{ marginRight: i * 8 }}>
              {s}
            </span>
          ))}
        </span>,
      );
    case "books":
      return box(
        <span className="flex items-end gap-1">
          {["#c2410c", "#e8a020", "#7a2a08"].map((c, i) => (
            <span
              key={c}
              className="block w-[16px] rounded-[3px] [transition:translate_var(--dur-base)_var(--ease-out)] group-hover/rs:-translate-y-1"
              style={{ background: c, height: 56 + i * 8, transitionDelay: `${i * 50}ms` }}
            />
          ))}
        </span>,
      );
    case "calendar":
      return box(
        <span className="relative flex w-[300px] items-center justify-between">
          <span className="absolute inset-x-2 top-1/2 h-px bg-[#f4cfa6]" />
          {["Notification", "Prelims", "Mains", "Interview"].map((s) => (
            <span key={s} className="relative rounded-full border border-[#f4cfa6] bg-white px-2 py-0.5 text-[12px]/[14px] font-semibold text-[#c2410c]">
              {s}
            </span>
          ))}
        </span>,
      );
  }
}

function Icon({ kind }: { kind: ResourceKind }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "current":
      return (
        <svg {...common}>
          <rect x={3} y={4} width={14} height={16} rx={1.5} />
          <path d="M17 8h3v10a2 2 0 0 1-2 2H6M7 8h6M7 12h6M7 16h4" />
        </svg>
      );
    case "recitals":
      return (
        <svg {...common}>
          <path d="M6 3h9l4 4v14H6z" />
          <path d="M15 3v4h4M9 12h7M9 16h5" />
        </svg>
      );
    case "papers":
      return (
        <svg {...common}>
          <path d="M8 3h11v15H8zM5 6v15h11" />
          <path d="M11 8h5M11 12h5" />
        </svg>
      );
    case "syllabus":
      return (
        <svg {...common}>
          <path d="M4 20h4v-5h4v-5h4V5h4" />
          <path d="M18 5h2v2" />
        </svg>
      );
    case "books":
      return (
        <svg {...common}>
          <path d="M4 19h16M5 15h14v4H5zM6 11h12v4H6zM7 7h10v4H7z" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x={3} y={5} width={18} height={16} rx={2} />
          <path d="M3 10h18M8 3v4M16 3v4M8 14h2M12 14h2M16 14h1M8 17h2M12 17h2" />
        </svg>
      );
  }
}
