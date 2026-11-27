/*
 * The course finder's icons, inline as on Kevin's page: Iconoir's (search, xmark, nav-arrow-down, clock, calendar,
 * hourglass, presentation, video-camera, headset-help, xmark-circle) and the site's hand-drawn arrow (the reference
 * build's "TEER", also on the carousel buttons and in the "View course" disc).
 */
import type { ReactNode } from "react";

/** The card icons' stroke: 2 (his 2026-11-21, "we can update icon weight to 2"; was Iconoir's 1.5). */
const CARD = 2;

const Ico = ({ size = 16, width = 1.5, children }: { size?: number; width?: number; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const ISearch = () => (
  <Ico size={20}>
    <path d="M17 17L21 21" />
    <path d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z" />
  </Ico>
);

export const IClose = () => (
  <Ico size={18}>
    <path d="M6.758 17.243L12.001 12M17.244 6.757L12.001 12M12.001 12L6.758 6.757M12.001 12L17.244 17.243" />
  </Ico>
);

/** The dropdowns' chevron (a 2 stroke since his 10eea1b; was 1.6). */
export const IChevDown = () => (
  <Ico width={2}>
    <path d="M6 9L12 15L18 9" />
  </Ico>
);

/** Iconoir's check, the chosen row in a chip's menu. */
export const ICheck = () => (
  <Ico size={18} width={2}>
    <path d="M5 13L9 17L19 7" />
  </Ico>
);

/** Iconoir's xmark-circle (solid), the dropdowns' clear button. */
export const IXCircle = () => (
  <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true">
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM9.70164 8.64124C9.40875 8.34835 8.93388 8.34835 8.64098 8.64124C8.34809 8.93414 8.34809 9.40901 8.64098 9.7019L10.9391 12L8.64098 14.2981C8.34809 14.591 8.34809 15.0659 8.64098 15.3588C8.93388 15.6517 9.40875 15.6517 9.70164 15.3588L11.9997 13.0607L14.2978 15.3588C14.5907 15.6517 15.0656 15.6517 15.3585 15.3588C15.6514 15.0659 15.6514 14.591 15.3585 14.2981L13.0604 12L15.3585 9.7019C15.6514 9.40901 15.6514 8.93414 15.3585 8.64124C15.0656 8.34835 14.5907 8.34835 14.2978 8.64124L11.9997 10.9393L9.70164 8.64124Z"
    />
  </svg>
);

/** Iconoir's clock: the course time. */
export const ITime = () => (
  <Ico width={CARD}>
    <path d="M12 6L12 12L18 12" />
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
  </Ico>
);

/** Iconoir's calendar: the batch date. */
export const ICal = () => (
  <Ico width={CARD}>
    <path d="M15 4V2M15 4V6M15 4H10.5M3 10V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V10H3Z" />
    <path d="M3 10V6C3 4.89543 3.89543 4 5 4H7" />
    <path d="M7 2V6" />
    <path d="M21 10V6C21 4.89543 20.1046 4 19 4H18.5" />
  </Ico>
);

/** Iconoir's hourglass: the duration. */
export const IDur = () => (
  <Ico width={CARD}>
    <path d="M12 12C15.866 12 19 8.86599 19 5H5C5 8.86599 8.13401 12 12 12ZM12 12C15.866 12 19 15.134 19 19H5C5 15.134 8.13401 12 12 12Z" />
    <path d="M5 2L12 2L19 2" />
    <path d="M5 22H12L19 22" />
  </Ico>
);

/** Iconoir's presentation board: Classroom (and courses run both ways). */
export const IRoom = () => (
  <Ico width={CARD}>
    <path d="M22 4.6V17.4C22 17.7314 21.7314 18 21.4 18H2.6C2.26863 18 2 17.7314 2 17.4V4.6C2 4.26863 2.26863 4 2.6 4H21.4C21.7314 4 22 4.26863 22 4.6Z" />
    <path d="M8.5 21.5L12 18L15.5 21.5" />
    <path d="M12 2V4" />
    <path d="M9 12V14" />
    <path d="M12 10V14" />
    <path d="M15 8V14" />
  </Ico>
);

/** Iconoir's video camera: LIVE-Online. */
export const ILive = () => (
  <Ico width={CARD}>
    <path d="M15 12V16.4C15 16.7314 14.7314 17 14.4 17H3.6C3.26863 17 3 16.7314 3 16.4V7.6C3 7.26863 3.26863 7 3.6 7H14.4C14.7314 7 15 7.26863 15 7.6V12ZM15 12L20.0159 7.82009C20.4067 7.49443 21 7.77232 21 8.28103V15.719C21 16.2277 20.4067 16.5056 20.0159 16.1799L15 12Z" />
  </Ico>
);

/** Iconoir's headset-help: the counsellor banner. */
export const IHeadset = () => (
  <svg viewBox="0 0 24 24" width={30} height={30} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 11.4998L3.51493 11.6211C2.62459 11.8437 2 12.6436 2 13.5614V15.4382C2 16.356 2.62459 17.1559 3.51493 17.3785L5.25448 17.8134C5.63317 17.9081 6 17.6217 6 17.2313V11.7683C6 11.3779 5.63317 11.0915 5.25448 11.1862L4 11.4998ZM4 11.4998V11C4 6.58172 7.58172 3 12 3C16.4183 3 20 6.58172 20 11V11.4998M20 11.4998L20.4851 11.6211C21.3754 11.8437 22 12.6436 22 13.5614V15.4382C22 16.356 21.3754 17.1559 20.4851 17.3785L20 17.4998M20 11.4998L18.7455 11.1862C18.3668 11.0915 18 11.3779 18 11.7683V17.2313C18 17.6217 18.3668 17.9081 18.7455 17.8134L20 17.4998M15 20.5H18C19.1046 20.5 20 19.6046 20 18.5V18V17.4998M15 20.5C15 19.6716 14.3284 19 13.5 19H10.5C9.67157 19 9 19.6716 9 20.5C9 21.3284 9.67157 22 10.5 22H13.5C14.3284 22 15 21.3284 15 20.5Z" />
  </svg>
);

/** The site's hand-drawn arrow (the pills' discs, "Let's talk"); styled by its parent's CSS. */
export const IArrow = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M2.5 8h11" />
    <path d="M8.6 3.6C9.4 5.9 11.2 7.4 13.5 8 11.2 8.6 9.4 10.1 8.6 12.4" />
  </svg>
);

/** The mega menus' "Browse all" arrow. */
export const IArrowThin = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M2 8h11M9 4l4 4-4 4" />
  </svg>
);

/** The "More" menu's chevron. */
export const IMore = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 6l4 4 4-4" />
  </svg>
);

/** The reference build's arrow (his TEER): a straight shaft with a gently curved head on a 16-unit grid. */
const Teer = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M2.5 8h11" />
    <path d="M8.6 3.6C9.4 5.9 11.2 7.4 13.5 8 11.2 8.6 9.4 10.1 8.6 12.4" />
  </svg>
);

/** The carousel buttons' arrow (his CHEV since 2026-11-20): two TEERs, one sliding out as the other slides in on hover; mirrored for "previous". */
export const IArw = ({ dir }: { dir: -1 | 1 }) => (
  <span className={`cf-arw__i${dir < 0 ? " cf-arw__i--flip" : ""}`} aria-hidden="true">
    <Teer />
    <Teer />
  </span>
);

/**
 * The card's "View course" (his 2026-11-20, the reference build's outlined disc button): the label and its copy, which
 * rolls up into its place on hover, and the arrow in an orange disc, sliding out as its copy slides in.
 */
export const GoButton = () => (
  <span className="cf-k__go">
    <span className="cf-go__l">
      <span className="cf-go__t">View course</span>
      <span className="cf-go__t" aria-hidden="true">
        View course
      </span>
    </span>
    <span className="cf-go__d" aria-hidden="true">
      <Teer />
      <Teer />
    </span>
  </span>
);
