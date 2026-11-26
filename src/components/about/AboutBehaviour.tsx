"use client";

import { useEffect } from "react";

/**
 * Starts the behaviours of the team site's components on the About page, as its own SiteBehaviour/lib/behaviour does on its
 * pages (26 Nov 2026): the nav's menus, its "More" menu, its scrolled state and language switch, the intro's figures rolling
 * in, the Since 1976 photographs taking turns, and the footer's curtain, each from the component's own module (src/team), after
 * hydration. As on its pages away from the homepage, its in-page links (#toppers …) lead to those sections on the homepage.
 */
export default function AboutBehaviour() {
  useEffect(() => {
    let off = false;
    Promise.all([
      import("@/team/components/layout/NavigationBar"),
      import("@/team/components/sections/Hero/HeroIntro"),
      import("@/team/components/layout/Footer"),
      import("@/team/components/sections/WhyChoose"),
    ]).then(([nav, intro, foot, why]) => {
      if (off) return;
      for (const init of [nav.initNavMenus, nav.initNavMore, intro.initHeroStats, nav.initNavScrolled, foot.initFooterCurtain, nav.initLangSwitch, why.initStoryPhotos]) {
        try {
          init();
        } catch (e) {
          console.error("[about] a team behaviour failed", e);
        }
      }
      document.querySelectorAll<HTMLAnchorElement>('.team-scope a[href^="#"]').forEach((a) => {
        const h = a.getAttribute("href") || "";
        if (h.length > 1) a.setAttribute("href", "/" + h);
      });
    });
    return () => {
      off = true;
    };
  }, []);
  return null;
}
