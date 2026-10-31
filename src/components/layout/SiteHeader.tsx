"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDownSmIcon, CloseIcon, MoreIcon } from "@/components/icons";
import { SplitButton } from "@/components/ui/Buttons";
import { contact, isNavMenu, mainNav } from "@/data/site";
import { cx } from "@/lib/cx";
import NavPanel from "./NavPanel";

/** Scroll position, in pixels, past which the left pill folds down to the logo and the menu button. */
const COLLAPSE_AT = 80;
/** Grace period before a hover menu closes once the pointer leaves, so a slightly off path doesn't shut it. */
const CLOSE_DELAY_MS = 160;

/** The header's pills and the menu background: light grey, slightly see-through and blurred. */
const SURFACE = "rounded-2xl bg-neutral-200/85 backdrop-blur-md";

/** A text link's label that rolls up on hover, with a copy rolling in from below. The copy is hidden from screen readers. */
function Roll({ children }: { children: ReactNode }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-300 ease-smooth group-hover/roll:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-y-full transition-transform duration-300 ease-smooth group-hover/roll:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

const ITEM =
  "group/roll flex h-9 items-center gap-1 rounded-lg px-2.5 font-display text-[15px]/[22px] font-medium whitespace-nowrap text-neutral-700 transition-colors duration-200 hover:text-neutral-900 focus-visible:-outline-offset-2";

/**
 * The header, after butter.video's floating pills, with menus that open on hover after harvey.ai.
 * - The left pill holds the logo and the main items: links to pages on the main site, and items that
 *   open a menu. Hovering a menu item drops its panel under the pill; moving to the next item keeps
 *   the panel open, resizes its background to fit and crossfades the contents. Hovering a plain link
 *   or leaving the header closes it.
 * - Once the page scrolls, the items fold away and the pill shrinks to the logo and a button that
 *   unfolds them again. The right pill holds the phone link and "Let's talk".
 * Accessibility: menu items are buttons that report whether their panel is open and which panel it
 * is; Enter or Space opens a panel and Tab moves through its links. Escape, a click outside or tabbing
 * out of the header closes it, and Escape returns focus to the item. Folded or closed content is
 * `inert`, so it can't be focused or read out.
 */
export default function SiteHeader() {
  const groupRef = useRef<HTMLDivElement>(null);
  const unfoldRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const contentRefs = useRef(new Map<string, HTMLDivElement>());
  const closeTimer = useRef(0);
  const id = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [unfolded, setUnfolded] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [panelHeight, setPanelHeight] = useState(0);
  const [warm, setWarm] = useState(false);
  const itemsShown = !collapsed || unfolded;

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const past = window.scrollY > COLLAPSE_AT;
      setCollapsed(past);
      if (!past) setUnfolded(false);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Menus can't stay open on items that have folded away.
  useEffect(() => {
    if (!itemsShown) setActive(null);
  }, [itemsShown]);

  // The shared background takes the height of whichever panel is open.
  useLayoutEffect(() => {
    if (active) setPanelHeight(contentRefs.current.get(active)?.offsetHeight ?? 0);
  }, [active]);

  useEffect(() => {
    if (!active && !unfolded) return;
    const group = groupRef.current;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (active) {
        triggerRefs.current.get(active)?.focus();
        setActive(null);
      } else {
        setUnfolded(false);
        unfoldRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (group && !group.contains(event.target as Node)) {
        setActive(null);
        setUnfolded(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [active, unfolded]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const keepOpen = () => window.clearTimeout(closeTimer.current);
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActive(null), CLOSE_DELAY_MS);
  };
  const close = () => {
    setActive(null);
    setUnfolded(false);
  };

  return (
    <header className="sticky top-0 z-40 h-20">
      <div className="mx-auto flex w-canvas items-center justify-between px-10 pt-6">
        <div
          ref={groupRef}
          className="relative"
          onPointerEnter={() => {
            keepOpen();
            setWarm(true);
          }}
          onPointerLeave={(event) => event.pointerType === "mouse" && closeSoon()}
          onFocus={() => setWarm(true)}
          // Tabbing out of the header's left side closes whatever is open there.
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close();
          }}
        >
          <div className={cx(SURFACE, "flex h-16 items-center gap-2 pr-3 pl-5")}>
            <a
              href="#top"
              aria-label="Vajiram & Ravi – Institute for IAS Examination, home"
              className="relative block h-10 w-[176px] shrink-0 rounded-lg bg-no-repeat [background-image:var(--image-logo)] [background-position:0_50%] [background-size:100%_106.67%]"
            />

            <nav
              id={`${id}-items`}
              aria-label="Main"
              inert={!itemsShown}
              className={cx(
                "grid transition-[grid-template-columns,opacity] duration-500 ease-smooth",
                itemsShown ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0",
              )}
            >
              <div className="min-w-0 overflow-hidden">
                <ul className="flex items-center pl-2">
                  {mainNav.map((item, index) => {
                    if (!isNavMenu(item)) {
                      return (
                        <li key={item.label} onPointerEnter={() => setActive(null)} onFocus={() => setActive(null)}>
                          <a href={item.href} className={ITEM}>
                            <Roll>{item.label}</Roll>
                          </a>
                        </li>
                      );
                    }
                    const open = active === item.label;
                    const panelId = `${id}-menu-${index}`;
                    return (
                      <li
                        key={item.label}
                        // Focus reaching another item closes a menu left open from the keyboard.
                        onFocus={() => active && active !== item.label && setActive(null)}
                      >
                        <button
                          ref={(button) => {
                            if (button) triggerRefs.current.set(item.label, button);
                          }}
                          type="button"
                          aria-expanded={open}
                          aria-controls={panelId}
                          onPointerEnter={(event) => event.pointerType === "mouse" && setActive(item.label)}
                          // Clicking a menu the hover already opened keeps it open; Enter, Space or a tap toggles it.
                          onClick={(event) => {
                            const mouse = (event.nativeEvent as PointerEvent).pointerType === "mouse";
                            if (!(mouse && open)) setActive(open ? null : item.label);
                          }}
                          className={cx(ITEM, "cursor-pointer", open && "bg-white/70 text-neutral-900")}
                        >
                          <Roll>{item.label}</Roll>
                          <ChevronDownSmIcon
                            className={cx("transition-transform duration-300 ease-smooth", open && "rotate-180")}
                          />
                        </button>
                        <NavPanel
                          id={panelId}
                          menu={item}
                          open={open}
                          warm={warm}
                          onNavigate={close}
                          contentRef={(element) => {
                            if (element) contentRefs.current.set(item.label, element);
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>

            <button
              ref={unfoldRef}
              type="button"
              aria-expanded={unfolded}
              aria-controls={`${id}-items`}
              aria-label={unfolded ? "Hide menu" : "Show menu"}
              inert={!collapsed}
              onClick={() => setUnfolded((current) => !current)}
              className={cx(
                "grid h-10 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-xl text-neutral-900 transition-[width,opacity,background-color] duration-500 ease-smooth hover:bg-white/70 focus-visible:rounded-xl",
                collapsed ? "w-10 opacity-100" : "w-0 opacity-0",
              )}
            >
              {unfolded ? <CloseIcon width={18} height={18} /> : <MoreIcon />}
            </button>
          </div>

          {/* The menus' shared background: it fades in under the pill and resizes to the open panel. */}
          <div
            aria-hidden="true"
            className={cx(
              SURFACE,
              "pointer-events-none absolute top-full left-0 -z-10 mt-2 w-full transition-[height,opacity] duration-300 ease-smooth",
              active ? "opacity-100" : "opacity-0",
            )}
            style={{ height: panelHeight }}
          />
        </div>

        <div className={cx(SURFACE, "flex h-[60px] items-center gap-3 pr-3 pl-4")}>
          <a href={contact.phoneHref} className={cx(ITEM, "px-2")}>
            <Roll>Call us</Roll>
          </a>
          <SplitButton href="#contact" tone="primary">
            Let&apos;s talk
          </SplitButton>
        </div>
      </div>
    </header>
  );
}
