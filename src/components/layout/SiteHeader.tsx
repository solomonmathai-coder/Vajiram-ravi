"use client";

import { useEffect, useRef, useState } from "react";
import { KnobButton } from "@/components/ui/Buttons";
import { mainNav } from "@/data/site";
import { cx } from "@/lib/cx";

const STUCK_AFTER_PX = 40;
/** A section counts as "current" while it crosses a thin band just below the middle of the viewport. */
const BAND = { rootMargin: "-45% 0px -50% 0px" };

/**
 * Sticky header. While it floats over the hero video it is transparent with light text and a glass
 * call to action. Past the hero it is the white bar, which gains a shadow and highlights the nav link
 * of the section in view.
 */
export default function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [stuck, setStuck] = useState(false);
  // Pages load at the top, over the hero, so start transparent to avoid a white flash.
  const [overHero, setOverHero] = useState(true);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setStuck(window.scrollY > STUCK_AFTER_PX);
      const hero = document.getElementById("hero");
      const header = headerRef.current;
      setOverHero(!!hero && !!header && hero.getBoundingClientRect().bottom > header.getBoundingClientRect().bottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observers: IntersectionObserver[] = [];

    const tracked = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setCurrent(`#${entry.target.id}`);
    }, BAND);
    for (const link of mainNav) {
      if (link.href.length < 2) continue;
      const section = document.querySelector(link.href);
      if (section) tracked.observe(section);
    }
    observers.push(tracked);

    // Sections without a nav link clear the highlight.
    document
      .querySelectorAll(
        'main > section:not([id]), main > section[id="hero"], main > section[id="contact"], main > section[id="location"]',
      )
      .forEach((section) => {
        const clearer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) setCurrent(null);
        }, BAND);
        clearer.observe(section);
        observers.push(clearer);
      });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return (
    <header
      ref={headerRef}
      id="hdr"
      className={cx(
        "sticky top-0 z-40 border-b [transition:background-color_.35s_var(--ease-smooth),border-color_.35s_var(--ease-smooth),box-shadow_.3s_var(--ease-smooth)]",
        overHero ? "border-transparent bg-transparent [&_a:focus-visible]:outline-white" : "border-line-warm bg-white",
        stuck && !overHero && "shadow-[0_8px_24px_-12px_rgba(28,25,23,.18)]",
      )}
    >
      <div className="relative mx-auto flex h-[79px] w-canvas items-center justify-between px-10 pt-3.5 pb-[13px]">
        <a
          className="flex w-[180px] items-center rounded-lg"
          href="#top"
          aria-label="Vajiram & Ravi – Institute for IAS Examination, home"
        >
          {/* The full-colour logo stays on the video too: a white silhouette loses the emblem. */}
          <span
            className="h-10 w-[176px] bg-no-repeat [background-image:var(--image-logo)] [background-position:0_50%] [background-size:100%_106.67%]"
            role="img"
            aria-label="Vajiram & Ravi logo"
          />
        </a>
        <nav className="flex items-center gap-1" aria-label="Main">
          {mainNav.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cx(
                "rounded-full px-3.5 py-2 font-display text-[16px]/[23px] font-medium whitespace-nowrap transition-colors duration-200",
                overHero
                  ? "text-mist hover:bg-white/10 hover:text-white"
                  : cx("hover:bg-neutral-100", current === link.href ? "text-brand-700" : "text-neutral-900"),
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
        {overHero ? (
          <a
            href="#contact"
            className="liquid-glass inline-flex items-center rounded-full px-6 py-2.5 font-inter text-sm text-white [transition:scale_.3s_var(--ease-smooth)] hover:scale-[1.03]"
          >
            Let&apos;s talk
          </a>
        ) : (
          <KnobButton href="#contact" size="md" icon="phone">
            Let&apos;s talk
          </KnobButton>
        )}
      </div>
    </header>
  );
}
