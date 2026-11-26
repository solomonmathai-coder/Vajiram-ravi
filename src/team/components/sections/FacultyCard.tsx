// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): components/sections/FacultyCard.tsx. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
import type { ReactNode } from "react";
import type { Educator } from "@/team/lib/data/faculty";
import "@/team/tailwind-sections.css";

export const PHONE_CARD_SHARE = 0.7;

export const facultyCardSize = (phoneWidth: number) => {
  const size = phoneWidth ? Math.round(phoneWidth * PHONE_CARD_SHARE) : 300;
  return { width: size, height: size, imageY: "0%" };
};

export const facultyCardLabel = (educator: Educator) => ({ title: educator.name, sub: educator.focus });

const listOf = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}` : items[0] ?? "");

function factsSentence({ experience, qualifications, studiedAt }: Educator): ReactNode {
  const years = experience?.match(/^(\d+\+?)\s*years?\s*(.*)$/i);
  const lead = years ? <><b className="cu:font-semibold">{years[1]} years</b>{years[2] ? ` ${years[2]}` : ""}</> : experience;
  const degree = qualifications?.replace(/^([^,]+),\s*(.+)$/, "$1 in $2");
  const rest = [degree, studiedAt?.length ? `${degree ? "studied" : "Studied"} at ${listOf(studiedAt)}` : ""].filter(Boolean).join(", ");
  if (!lead && !rest) return null;
  return <>{lead}{lead && rest ? ". " : ""}{rest}{rest ? "." : lead ? "." : ""}</>;
}

export function FacultyCardDetails({ educator }: { educator: Educator }) {
  const { name, linkedin } = educator;
  return (
    <>
      <span aria-hidden="true" className="cu:contents">
        <span className="cu:block">
          <span className="cu:block cu:[font:600_20px/1.15_Newsreader,Georgia,serif] cu:tracking-[-.01em] cu:text-(--ink)">{name}</span>
          <span className="cu:mt-1 cu:block cu:text-[12.5px] cu:leading-[1.35] cu:font-medium cu:text-(--ink)">{educator.focus}</span>
        </span>
        <span className="cu:mt-3 cu:block cu:h-px cu:w-full cu:bg-[linear-gradient(90deg,#D9A441,rgb(217_164_65/0))]" />
        <span className="cu:mt-3 cu:block cu:text-[13px] cu:leading-[1.5] cu:font-normal cu:text-(--ink) cu:text-pretty">{factsSentence(educator)}</span>
      </span>
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on LinkedIn`}
          className="cu:relative cu:z-[1] cu:mt-3 cu:inline-flex cu:items-center cu:gap-1.5 cu:self-start cu:text-[12px] cu:font-semibold cu:text-(--ink) cu:no-underline cu:transition-colors cu:duration-200 cu:hover:text-[#C2410C] cu:focus-visible:outline-2 cu:focus-visible:outline-offset-2 cu:focus-visible:outline-[#C2410C]"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" className="cu:fill-current">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
          </svg>
          LinkedIn
        </a>
      )}
    </>
  );
}

export function FacultyCardText({ educator }: { educator: Educator }) {
  const { name, focus, qualifications, experience, studiedAt, introduction } = educator;
  const details = [focus, qualifications, studiedAt?.length ? `Studied at ${studiedAt.join(", ")}` : "", experience, introduction].filter(Boolean).join(". ");
  return (
    <>
      <h3>{name}</h3>
      {details && <p>{details}</p>}
    </>
  );
}
