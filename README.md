# Vajiram-ravi

The Vajiram & Ravi homepage, built with Next.js (App Router, React, TypeScript) and Tailwind CSS v4.
It is built from the Figma design "new modern design", one component per section.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm start          # serve out/ at http://localhost:3000, the way Netlify will
npm run typecheck
```

The npm scripts call `node node_modules/...` directly instead of the usual `next dev`.
On Windows, npm's command shims break when the project path contains `&`, as `D:\vajiram&ravi` does.

## Deploy

The site is a static export. `npm run build` writes plain HTML, CSS, JS and images to `out/`, and any static host can serve that folder.

- **Netlify from GitHub:** connect the repo and deploy. `netlify.toml` sets the build command, the `out` publish folder and Node 22, and it overrides the settings in the Netlify UI.
- **Netlify drag-and-drop:** run `npm run build`, then drag the `out` folder onto the Netlify deploys page. Dragging the project folder or `.next` gives a 404, because neither has an `index.html` at the top.

`netlify.toml` also turns off Netlify's Next.js adapter with `NETLIFY_NEXT_PLUGIN_SKIP`. The adapter is for server-rendered sites and would reject `out` as the publish folder.

## Layout of the code

```
src/
  app/
    layout.tsx        Geist font, metadata, site chrome, canvas-fit script
    page.tsx          the homepage: sections in the Figma order
    globals.css       Tailwind import, design tokens (@theme), base rules, keyframes
  components/
    layout/           AnnouncementBar (ticker), SiteHeader (floating nav), LetsTalkSheet, SiteFooter
    sections/         one folder per section: the component and any client parts
      Hero/ Toppers/ WhyChoose/ Courses/ ProgrammeFinder/ GsProgramme/ Faculty/
      Admissions/ SuccessStories/ FreeResources/ Faq/ Contact/ ClosingCta/
    ui/               shared pieces: Pill (buttons and chips), Sheet (light panels),
                      CountUp, WordRise, Photo, Toast, ScrollReveal, CanvasFit
  data/               all copy and lists, one file per section (hero, toppers, finder, ...)
  lib/                small helpers (canvas zoom, motion, in-view hook, toast events)
public/images/        logo, photos, illustrations and the globe artwork
scripts/serve-out.mjs preview server for the static export (npm start)
netlify.toml          Netlify build settings
```

To change content, edit the files in `src/data`. To change a section's look, edit the Tailwind classes in its component.

## Design source

The page follows the Figma frame "new modern design" (file `TMjGmOJSfBGEgGxfO2JqMU`, node `1928:1061`), 1440 × 14,684px. Its notes on motion and interaction (count-ups, the expanding gallery, the sticky reasons, the filters, the finder, the drag carousel and so on) are built as described there.

## Styling

- Everything is styled with Tailwind utilities in the components. There are no per-component CSS files.
- The palette is a set of theme tokens in `src/app/globals.css`: `coal` (page), `char` (near-black), `soot` (dark cards), `cream` (text on dark), `paper` (near-white), `shell` and `sand` (light panels and cards), `sand-line` (rules on light), `stone` (secondary text on light), `orange` (Vajiram orange), `tangerine` (accent on dark) and `plum` (the dark end of the brand gradients). The default Tailwind colours are switched off, so only design colours can be used.
- The type is Geist throughout (`font-sans`, weights 300 to 600), loaded with next/font/google and bundled into the build.
- The page alternates between the dark page and light panels. `Sheet` draws a light panel: full width, 40px rounded corners, the content on the 1440px canvas.
- Buttons are pills from `ui/Pill`: `ArrowPill` has a round ↗ knob that slips out and back on hover, `PlainPill` is a label-only pill, and `Chip` is a small label. Each takes a `surface` (and `knob`) tone.
- Glows are soft radial gradients or the design's blurred SVG ellipses, placed where the design puts them.
- The scroll-reveal classes `rv-pre` and `rv-in` are plain CSS in `globals.css`; put `data-reveal` on a block, or `data-reveal-group` on a parent to stagger its children.

## How it behaves

- The design is a fixed 1440px canvas. On narrower screens the page is zoomed down to fit. The zoom factor is also available to CSS as `--canvas-zoom`.
- **Ticker:** it runs at the very top, loops at 40px a second with faded edges, and pauses on hover.
- **Nav:** a floating glass pill under the ticker. It rides up and docks 12px from the top, condenses from 64px to 56px after 80px of scroll, slides away while you scroll down and comes back on scroll up. The link of the section in view gets an orange dot. "Let's talk" opens a sheet with the ways to reach the admissions team.
- **Search:** the nav's search button, or ⌘K / Ctrl+K anywhere, opens a search box in the middle of the screen. It finds sections, programmes, batches, faculty, study materials, FAQs and toppers of every year (`src/data/search.ts`, built from the page's data) and takes you there; picking a topper also switches the toppers gallery to their year.
- **Hero:**
  - The headline rises in word by word.
  - The India globe is a particle globe in the manner of Framer's Atomic Globe. The world is a field of dots on a sphere built from Natural Earth outlines (`public/images/hero/globe/globe-points.json`), with India in the denser brand dots, drawn on a canvas in orthographic view. At rest it faces India so New Delhi and Chennai sit exactly on the design's pins, and the dots shrink and dim towards the edge as the design's do.
  - On load the dots bloom out of the core; then the globe turns a full circle every so often and always settles back on India. It can be dragged any way and springs back; the dots light up around the pointer, a press sends a sonar ring across the surface, a light runs along the Delhi–Chennai route, and clicking a city flies the globe to it. Hovering or focusing New Delhi or Chennai shows the campus address.
  - The globe sits inside its two orbits: the far half of each ring passes behind it and the near half in front. It floats, the city rings pulse and the orbit tags glide along their orbits. The layers shift with the pointer for depth. Without JavaScript or with reduced motion, the design's still artwork shows (its 1,514 world dots rebuilt as one SVG from the Figma positions).
  - The record figures count up once in view.
- **Programme banners:** story-style, 6 seconds each with a segmented progress bar, neighbours peeking at 35%, drag and arrow keys, paused on hover. The list is `programmeBanners` in `src/data/hero.ts`. The first banner is made for the 1136 × 400 slot; the older strip banners are shown whole over a blurred copy of themselves.
- **Toppers:** a year switch with a sliding thumb. Picking a year cross-fades the gallery to that year's toppers and sets `?year=` in the address; loading the page with `?year=` opens that year. In the expanding gallery the hovered or focused topper opens to 440px. The 2016 to 2024 toppers and photos come from vajiramandravi.com/ias-selections-from-vajiram (`toppersByYear` in `src/data/toppers.ts`); only the ranks listed there appear, and programmes are listed from 2023 on.
- **Why choose:** the statement lights up word by word as you scroll. The six reasons are a pinned scroll story, with the photo and the "01 / 06" counter following the active reason, and an orange line along the top of the active reason that fills as you read.
- **Courses:** the stage filter rearranges the programme bento with a layout animation.
- **Programme finder:** three questions with a live "likely match" card. Steps 2 and 3 and the matching rules are in `src/data/finder.ts`.
- **GS programme:** the score meters fill segment by segment.
- **Faculty:** a drag carousel with momentum, a custom "Drag" cursor and a scrubber.
- **Admissions:** a mode filter, a January calendar that highlights batch days (with the month arrows at either end of the strip), batch cards with "View all batches" after them, and a two-step enquiry form (`#counsellor`).
- **Success stories, study materials and FAQ** stack like cards as you scroll (`ui/StackedSections`). Every card is the full page width and the same height (shorter sections grow to the tallest, their content centred), and every card pins in the same place, just under the nav when there is room, so the next one slides up over the current one and covers it completely; cards never shrink or move aside. A card taller than the screen pins by its bottom edge once all of it has been read. The study materials panel is a little more compact than the design (padding, gaps and card heights).
- **Success stories:** two fixed cards, the current story and a preview of the next. The stories change like a carousel, in both cards at once: the old one slides out to one side as the new slides in from the other, its portrait settling from a slight zoom while the quote and then the name rise in. It plays on its own every six seconds while on screen (the active dot fills as the time runs) and pauses while hovered or focused; the arrows, dots, arrow keys, a swipe and a click on the side card move it by hand.
- **Study materials:** stage tabs and a hover-linked article list.
- **FAQ:** questions play into a chat with a counsellor. As the last card of the stack it fills the screen, so a "Scroll down" nudge at its foot points on to the contact section.
- **Contact:** a New Delhi / Chennai switch that pans the map.
- **Closing banner and footer:** a drifting gradient banner, then the footer's giant wordmark, whose letters assemble as you scroll after Skiper UI's Skiper 31: each starts pushed out from the centre and tipped back in 3D, and they come together as the footer rises (and part again if you scroll back).
- **Headings:** section headings rise word by word out of a mask as they come into view (`ui/RevealWords` with `data-reveal-words`), and blocks fade up with the same easing.
- **Smooth scrolling:** the page scrolls with Lenis (`ui/SmoothScroll`); in-page links glide to their section and land under the nav, and the page holds still while the search or the "Let's talk" sheet is open. The FAQ chat takes the wheel only while it has more to show (`data-scroll-inside`); dialogs keep native scrolling (`data-lenis-prevent`).
- **Opening at the hero:** the page always opens at the top. A head script (`startAtTopScript` in `lib/smoothScroll`) turns off the browser's scroll restoration and drops a section hash from the address, and the page scrolls to the top on load.
- With reduced motion, the animations are skipped and everything shows in its final state.
- The footer's last line (copyright and legal links) is never scroll-revealed, and nothing in the last screen of the page is pre-hidden, so the foot of the page always shows.
- Sections are server components; only the interactive parts are client components.
- Links with `href="#"` point at pages that do not exist yet. Clicking one shows a short toast.
- The enquiry form validates input and shows a thank-you state, but it does not send anything yet. Because the site is static, sending it later needs a form service such as Netlify Forms or a serverless function.
- Images are served as webp files. Next.js image resizing needs a server, so it is off.

## Content still to confirm

- FAQ answers 2 to 4 (`src/data/faq-chat.ts`) and the Prelims and Quest tabs of the study materials (`src/data/study-materials.ts`).
- Chennai's address, landmark and map (`src/data/contact.ts`), and the WhatsApp number (assumed to be the admissions line).
- The finder's steps 2 and 3, and the batch dates, which are set to January 2027 (`src/data/admissions.ts`).
- Photos for reasons 2 to 6 in "Why choose" (`src/data/why-choose.ts`), the missing ranks for 2016 to 2024, and sharper topper photos for those years (the selections page's are 130 to 600px).
