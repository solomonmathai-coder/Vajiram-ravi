# Vajiram-ravi

The Vajiram & Ravi homepage, built with Next.js (App Router, React, TypeScript) and Tailwind CSS v4.
It is a 1:1 port of the design prototype in `Vajiram & Ravi Homepage.html`, split into one component per section.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run typecheck
```

The npm scripts call `node node_modules/...` directly instead of the usual `next dev`.
On Windows, npm's command shims break when the project path contains `&`, as `D:\vajiram&ravi` does.

## Layout of the code

```
src/
  app/
    layout.tsx        fonts, metadata, site chrome, canvas-fit script
    page.tsx          the homepage: sections in order
    globals.css       Tailwind import, design tokens (@theme), base rules, keyframes
    fonts/            Figtree and Geist (latin), loaded with next/font/local
  components/
    layout/           UtilityBar, SiteHeader, AnnouncementBar, SiteFooter
    sections/         one folder per section: the component and any client parts
      Hero/ Toppers/ WhyChoose/ Courses/ GsProgramme/ Faculty/ Batches/
      Counselling/ SuccessStories/ FreeResources/ Faq/ ContactOptions/
      Locations/ ClosingCta/
    ui/               shared pieces: Buttons, Typography, PeekCarousel,
                      TrackCarousel, CarouselControls, Photo, RankBadge,
                      Toast, ScrollReveal, CanvasFit
    icons.tsx         every inline SVG from the design, as typed components
  data/               all copy and lists (toppers, courses, faculty, FAQs, ...)
  lib/                small helpers (canvas zoom, motion, toast events)
public/images/        logo, photos and illustrations
```

To change content, edit the files in `src/data`. To change a section's look, edit the Tailwind classes in its component.

## Styling

- Everything is styled with Tailwind utilities in the components. There are no per-component CSS files.
- The design's palette, fonts, easing and canvas width are Tailwind theme tokens in `src/app/globals.css`. For example `bg-brand-500`, `text-neutral-600`, `font-display`, `ease-smooth`, `w-canvas`. The default Tailwind colours are switched off, so only design colours can be used.
- `font-display` is Figtree and `font-sans` is Geist.
- Shared looks live in small components instead of `@apply`: `Buttons.tsx` for the pill buttons and text links, `Typography.tsx` for eyebrows, section titles and lead paragraphs.
- A few states are toggled outside React and styled with arbitrary variants: `dragging` on carousels, `swap` on the toppers grid, `run` on the marquee. The scroll-reveal classes `rv-pre` and `rv-in` are plain CSS in `globals.css`.

## How it behaves

- The design is a fixed 1440px canvas. On narrower screens the page is zoomed down to fit, exactly like the prototype.
- Sections are server components. Only the interactive parts are client components: the header, marquee, carousels, year tabs, stat counters, FAQ, city tabs and map zoom, and the counselling form.
- Links with `href="#"` point at pages that do not exist yet. Clicking one shows a short toast.
- The counselling form validates input and shows a thank-you state, but it does not send anything yet.
