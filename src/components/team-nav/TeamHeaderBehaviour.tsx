"use client";

import { useEffect } from "react";

/**
 * Starts the team header's behaviours, as its own pages do (SiteBehaviour): its menus, its "More" menu, its scrolled state
 * and its language switch, each from its own module (src/team), after hydration. Its in-page links (#toppers …) lead to
 * those sections on the homepage, as on the team site's pages away from the homepage; only the header's own links are
 * changed, never the page's.
 */
export default function TeamHeaderBehaviour() {
  useEffect(() => {
    let off = false;
    import("@/team/components/layout/NavigationBar").then((nav) => {
      if (off) return;
      for (const init of [nav.initNavMenus, nav.initNavMore, nav.initNavScrolled, nav.initLangSwitch]) {
        try {
          init();
        } catch (e) {
          console.error("[header] a team behaviour failed", e);
        }
      }
      document.querySelectorAll<HTMLAnchorElement>('.team-header a[href^="#"]').forEach((a) => {
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
