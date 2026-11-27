# Vajiram-ravi

The Vajiram & Ravi homepage, built with Next.js (App Router, React, TypeScript) and Tailwind CSS v4.
It is built from the Figma frame "the final design" and its motion spec, one component per section.

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
- **Vercel from GitHub:** `vercel.json` tells Vercel to run `npm run build` and serve the static `out` folder, whatever the project's dashboard settings say. Every push to a branch gets its own deployment; the project's production address follows its production branch.

`netlify.toml` also turns off Netlify's Next.js adapter with `NETLIFY_NEXT_PLUGIN_SKIP`. The adapter is for server-rendered sites and would reject `out` as the publish folder.

## Layout of the code

```
src/
  app/
    layout.tsx        fonts (Mukta, Source Sans 3), metadata, header and footer
    page.tsx          the homepage: sections in the order of the client's information architecture
    globals.css       Tailwind import, colour and motion tokens, base rules, keyframes, reveal classes
  components/
    layout/           SiteHeader (main header with mega menus, announcement ticker),
                      LetsTalkSheet, SearchDialog, SiteFooter, Preloader (the intro),
                      PageTransition (the curtain before leaving the page)
    sections/         one folder per section: the component and any client parts
      Hero/ Journey/ About/ Programmes/
      Admissions/ (batches and the counselling form) Faculty/ (educators) SuccessStories/
      FreeResources/ Faq/ Contact/ (locations) ClosingCta/
    ui/               shared pieces: Cta, IndianLink, Medallion, TraditionalTabs, CrossFade,
                      CarouselControls, Ornament, CountUp, Photo, Icon, LinkOrText,
                      ScrollReveal, SmoothScroll, CanvasFit, Toast, PointerGlow, CursorLabel,
                      NoteCard, ProgressRule
  data/               all copy, lists and links, one file per section; links.ts holds every external link
  lib/                small helpers (canvas zoom, motion, the shared reveal observer, hover classes,
                      smooth scroll, in-view hook, photo parallax)
public/images/        logo, photos, illustrations, ornaments and icons
scripts/serve-out.mjs preview server for the static export (npm start)
scripts/course-art.py  draws the programme cards' illustrations into public/images/courses/art
netlify.toml          Netlify build settings
```

To change content, edit the files in `src/data`. To change a section's look, edit the Tailwind classes in its component.

## Design source

- **Layout:** the Figma frame of the new version (file `TMjGmOJSfBGEgGxfO2JqMU`, node `2377:4172`, 1440 × 9,368px), laid out in the order of the client's homepage IA of 10 Nov 2026 and filled with the client's homepage content of the same day. The design's own inconsistencies are evened out into one system (see Styling): one button, one heading face and scale, palette colours only. The preparation journey has no frame and is drawn in the same language. The shared components follow "CTA / Indian" (`2262:5786`) and the ornament eyebrows (`2104:3626`, `2104:3616`).
- **Motion:** the "V&R Homepage — Motion & Interaction Spec" (5 Nov 2026): one set of motion tokens, seven shared component behaviours, and a few named moments per section.
- **Motion references:** a later round of effects follows animation references the client picked. Each one is fitted into the existing layout, so nothing moves or resizes:
  - Skiper UI: the parallax image (skiper55) for photos, the scroll-drawn SVG line (skiper19) for the thread in "Why Vajiram & Ravi", the gradient hover card (skiper90) for the glow on the faculty cards, and the hover-members cursor follower (skiper6) for the cursor labels.
  - Unlumen "Animate Digits" for the stats, "Tilt Card" for the reason and faculty cards and "Dia Text Reveal" for the heading emphasis, Uilora "Stroke Fill" for the footer wordmark, the AutoAE "3D spin" for the seal and stamp, and chanhdai "Icon Swap" for the button spinner.
  - React Bits "Aurora" was tried in the hero and taken out at the client's request.
  - Homepage v3 (11 Nov 2026): React Bits "Scroll Expand" for the campus building photograph, "Fade Content" for body content with no entrance of its own and "Gradual Blur" for the foot of the screen and the edges of the batch rail and stories ring; wabcoffeeco.com's large scrolling type for the brand line band; React Bits Pro "Parallax Cards" for the batch tickets' opening and "Preloader" (stairs) for the section jump from the header and search. Then trimmed for readability at the client's request (see "Text, section, scroll and ambient motion").
  - Homepage v2: a pinned scroll film (text reveal, stack, arc, gradient carousel) for the about cards, the `kevin` branch's book wall for the courses, a ring after React Bits "Circular Gallery" for the educators, and a pinned scroll for the preparation journey. Some effects of the earlier round went with the sections they belonged to (the why-section thread and tilt, the hero aurora).
  - Not used: the Skiper UI card stacks (skiper16, skiper17), which scale sections as they stack and would change the layout, and the Apple-style navbar (skiper75), which would replace the header. animos, originkit, the animmasterlib sliders and the Framer marketplace gave no single effect to take.
- **Earlier designs:** the "final design" (`2258:10453`), V8 and the "new modern design" are replaced. The final design's build is commit `634d371`; the older two are kept under `refs/backups/v8` and `refs/backups/pre-v8`.

## Styling

- Everything is styled with Tailwind utilities in the components. There are no per-component CSS files.
- The palette is a set of theme tokens in `src/app/globals.css`, and the default Tailwind colours are switched off:
  - `ink` (dark text, primary buttons), `mahogany` (the darkest band), `clay` (secondary text)
  - the papers `paper`, `cream` and `parchment`
  - `saffron` (buttons and emphasis on dark, the focus ring), `burnt` (links and active states on light), `orange` (eyebrow labels)
- The logo is the client's updated one (Figma 2568:4299): the emblem with "Vajiram & Ravi" in orange and "Institute for IAS Examination" under it, rebuilt on a transparent ground (`public/images/logo.webp`, 617 × 206), used in the header, the footer and the newspaper's masthead. Its emblem alone (`logo-mark.webp`) is in About, the page and section curtains, the favicon and inside the cover of every open book (bottom right).
- No text is set smaller than 12px (the lettering inside the ink stamps and postmarks is part of their artwork).
- The type is Mukta for headings (`font-heading`; it has no italic, so emphasis words are set apart by colour), and Source Sans 3 for everything else, text, UI and labels (`font-sans`). No other fonts, the newspaper included. Both load with next/font and are bundled into the build.
- **Motion tokens** are CSS variables on `:root`:
  - durations `--dur-instant` (120ms), `--dur-fast` (200ms), `--dur-base` (320ms), `--dur-slow` (600ms) and `--dur-ambient` (40s)
  - distances `--rise` (24px), `--rise-sm` (8px) and `--lift` (−4px), and `--stagger` (60ms)
  - the easings `ease-out`, `ease-in-out` and `ease-in`, and the shadows `shadow-rest` and `shadow-hover`, as Tailwind utilities
  - Components use these, not hand-picked values. Only transform, opacity, filter and clip-path animate (plus colours on hover); the FAQ accordion's row height is the one exception.
- **Shared components** carry almost every interaction:
  - `ui/Cta`: the button, in five variants and two sizes, with hover, press, disabled and loading states. Hover behaves as the `kevin` branch's buttons do: the fill steps one shade deeper over 200ms (an outline firms its border and takes a faint tint) and the arrow slides 4px on over 300ms; a soft, shining bright-orange ripple (a light core, slow, 1.4s) spreads inside it from where the pointer came in, and it pops a little (102%, springy). On press it sinks to 97% while a stronger shining orange ripple (1.1s) spreads inside from the point pressed (`lib/pressRipple`, shared with the carousel arrows; nothing spills past the button's edge), then springs back.
  - `ui/IndianLink`: a text link with the scalloped arrow medallion and a drawn underline.
  - `ui/Medallion`: while hovered, the scalloped flower turns round and round (a turn every 4 seconds) and the arrow holds still. When the pointer leaves, the flower stops where it is. The contact cards' icon medallions turn the same way.
  - `ui/TraditionalTabs`: the site's tabs, a segmented control: a cream track with a burnt pill that slides under the chosen tab, used with `ui/CrossFade` for the content below.
  - `ui/CarouselControls`: the arrows (an outline at rest, dark only on hover, with a ripple and a ring pulse when pressed, the same on every carousel) and the stretching dots.
  - `lib/hover`: the card lift, shadow and image zoom.
- **Section reveals** are data attributes that `ui/ScrollReveal` plays once, when 20% of a section is in view:
  - `data-reveal="heading"`, with `data-reveal-em` on the italic words that arrive 120ms later
  - `"sub"` for the sub text, and `data-reveal` / `"sm"` / `"fade"` or `data-reveal-group` for content, staggered 60ms
  - The eyebrows reveal themselves: their rules grow out from the label.
  - Once the italic words are in, a soft light sweeps across them once. They keep their own colour before and after.
  - One-off moments (stamps, wipes, flips, the FAQ scroll) use `whenVisible` from `lib/reveal`. That is the page's single IntersectionObserver.
- **Effects that follow the pointer or the scroll** are shared too, and run only with a mouse or trackpad and with motion allowed:
  - `lib/parallax`: a photo drifts inside its fixed frame as the frame crosses the screen, on a scroll-driven animation (no scroll handler).
  - `ui/PointerGlow`: a soft glow follows the pointer inside a card (the faculty cards).
  - `ui/ProgressRule`: a carousel's progress line as an ornamented rule: a hairline between two diamonds, filled saffron to burnt up to the share seen so far, with a butta flower at the fill's end.
  - `ui/CursorLabel`: a small saffron label follows the pointer over a carousel ("Drag", or "View" over a linked card).

## How it behaves

### The homepage (/): the team's, as it is (updated 27 Nov 2026)

"/" is the team's latest homepage: github.com/abhishekps-web/vajiram-ravi, branch `main` (354a2ba, 27 Nov 2026), as
deployed on vajiram-ravi.abhishek-ps.workers.dev (it replaced Kevin's copy from the `kevin` branch). That repository is
where all the pages are built and updated; we only read from it (its `main`, `staging` and `courses-page` branches are
not ours to change; anything we add to it goes on a new branch of its own). It is fetched here as the git remote `team`.
The page is a finished build rather than source code, kept as it is in `public/index.html`: its Next.js scripts in
`public/team-home/static/` (moved from `/_next/`, which our own Next.js reserves; the page's paths and the scripts'
chunk base path changed to match, but not the runtime's `/_next/image` and `/_next/static/immutable` checks), its
stylesheet `public/css/base.bundle.css`, and the images it uses under `public/assets/` (those named in the page, its
scripts and its stylesheet). Nothing of ours is in it (user 26 Nov 2026: "I just want to see the homepage version in
that repo"): its links are its own, and its Programmes cards link to `/courses/<slug>`, the team's course pages, which
this site does not have. Our options for it (the boarding passes, notice board and chalkboard timetable below, and
`toppers-fit.css`) stay in `public/css` and `public/js`, not linked; to see them on it, link them as the next paragraph says.
To bring in a newer version, run the copy script again (it downloads the deployed page, its scripts, stylesheet and
images, and moves `/_next/` to `/team-home/`). Our sheets would go after `base.bundle.css` (`toppers-fit.css`,
`passes.css`, `notices.css`, `chalkboard.css`) and our scripts before `</body>` (`passes.js`, then `notices.js` and
`chalkboard.js`, which read the list `passes.js` shares).

Programmes as boarding passes (25 Nov 2026; `public/css/passes.css` and `public/js/passes.js`, linked in `index.html`;
768px and wider, one to a row below 1100px): under his book shelf (#courses), for the client to compare, the same eight programmes drawn as passes
for the journey from aspirant to civil servant, so the section reads as something to join rather than to read. Each is
cream paper with an airline-style band in its programme's colour (his book covers' colours: "Vajiram & Ravi · Since
1976" and the category), the route ASP → IAS (a dot travels along it under the pointer), the programme's name and the
courses it holds, the fields (courses, mode "Classroom · LIVE-Online", boarding "UPSC CSE 2027"), and past a
perforation a stub with its code (GS, CSAT, OPT …), his emblem as a stamp, a barcode drawn from its name and "View
course" (his course-finder link, `/courses#cat=…`). Under the pointer the pass lifts and the stub tilts as if starting
to tear; his tabs (All, Foundation, Optional, Tests, Guidance) filter them. The data is his script's own list. Once the
client has chosen between them, the others go. The passes were kept (25 Nov 2026).

Two more options under the passes, for the client to compare (25 Nov 2026; 768px and wider, two to a row below 1100px; in place of tries with
course boxes on a shelf and student ID cards on lanyards, which did not work). Both read his list from js/passes.js
(`window.vrProgrammes`), clone his emblems, and show only what his books show (category, emblem, name) with his books'
own "View course" button (his markup and classes; his course-finder link; a click anywhere on an item follows it):

- Notice board (`public/css/notices.css`, `public/js/notices.js`; 717px at 1440): a cork board in a wooden frame,
  the eight programmes pinned as paper notices in two rows of four, each a little askew and held by a strip of torn
  tape in its programme's colour carrying its category. Under the pointer a notice straightens and lifts.
- Chalkboard timetable (`public/css/chalkboard.css`, `public/js/chalkboard.js`; 672px at 1440): a green blackboard in
  a wooden frame with a ledge (chalk and a duster), four columns divided by chalk lines, one for each category, the
  programmes under them as periods with his emblem in chalk. Under the pointer a period is ringed in chalk and the
  button shows. The writing is Kalam (Google Fonts, loaded by the stylesheet).

The toppers section is his, in his layout (25 Nov 2026), sized by one stylesheet of ours, `public/css/toppers-fit.css`,
linked after his in `index.html`, so that on desktop everything down to his decade panel reads in one screen: the same
parts in the same order (his label and two-line heading, the "36/50 Ranks" caption over his moving 2025 shields, "For
a decade…" and his year tabs, his framed decade panel with the topper shown large beside the list), his scripts
running them, and only their sizes changed: smaller type (heading 42px for his 64), smaller shields (his --dw 96px for
172), a shorter panel (his --col 196px for 406, its shield 144px), with room between the parts and about 30px inside
the frame under the topper and the list. His "View all toppers" follows just below the fold. At 1440 x 900 the panel's
frame closes at 869px and the button starts at 905px; two further steps for shorter screens, by sizes rather than zoom
(his tabs place their orange by measuring, which zoom throws off): at 1536 x 864 the frame closes at 841px (button at
871), at 1366 x 768 at 739px (button at 771). Phones keep his sizes. A version of ours that showed his two showcases as
two scenes behind a switch replaced his for a while (24 Nov 2026, last at commit 4d7f83e: `toppers-oneview.css`,
`toppers-years.js`); the client chose his layout, so those were removed.
The built site serves it at "/" (vercel.json `cleanUrls`); the dev server sends "/" to `/index.html` (a
development-only redirect in next.config.ts). Our own homepage (v2, below) is at /home-v2, its intro playing there.

### The Free Resources page (/free-resources, 21 Nov 2026)

The Figma workfile's "UPSC Study Materials – consistent – 22 Oct" (1361:38711): its sections and words
(`data/free-resources.ts`), in the language of Kevin's homepage. Its parts are his own: `kevin-parts.css` holds the
rules for his folder cards, buttons, section labels, headings, sand sheets and FAQ, pulled from his stylesheet and
scoped under `.kv` (the extraction script kept the 1440 canvas rules, as for his course finder, and leaves out his
high-contrast, dark-mode and print rules; one rule of his, the rising grid's start, is split in two there, because
this site's CSS minifier folds its `transform: none`, `translate` and `scale` into one transform that is never cleared,
which left every folder 4% small and 40px low and made the hover jump); `free-resources.css`
gives `.kv` his stylesheet's values at 1440 and his fonts as ours, and draws the rest in his tokens. The head is the
About page's head (the plain Top Picks orange). Then: the nine study materials as his manila folders (his photographs where he
has one, otherwise the design's icon on a sheet of paper), each with its tag and his white pill button ("Explore",
opening the material on the live site; a click anywhere on a folder follows it). Under the pointer a folder behaves exactly as
the homepage's Free resources folders: it lifts 6px and grows a little, and the material in it rises out and bobs
(FolderFloat, the homepage's own script and amounts). Then the sources on the About page's orange band with its faint jaali: the words in a
reading column on the left (the heading, the first paragraph as a lead, the rest smaller under a white rule, staying
in view while the cards pass), the four sources two by two beside it as white cards, the photograph above the words
and his orange button; six "why it matters" cards in the homepage contact card's frame, each icon white on an orange
disc, tilting toward the pointer with a soft glare as the About page's leadership cards (AboutTilt; no colour change,
as they are not links); the role of study material as the About page's story list (StoryChapters: a photograph beside the three
points, moving on by itself) under its heading and his button; and his FAQ (one answer open at a time, "Talk to a counsellor"). "Explore free resources" in the
Study materials menu opens it, in our nav (CourseFinderNav, on /about and /courses) and in Kevin's homepage (the one
link changed in his script). To confirm: the design lists "One Pagers" twice (here once), and several materials have
no page of their own on the live site yet, so they open its free study material page.

### The About page (/about, branch `about-page`; rebuilt 26 Nov 2026)

Built from the team site's own components (github.com/abhishekps-web/vajiram-ravi, `main`; the user, 26 Nov 2026: "use the
exact components from Abhishek's repository, just change the content and images"), copied as they are into `src/team` by
`scripts/copy-team-parts.py` (`git fetch team`, then `python scripts/copy-team-parts.py`; it follows their imports, points
them at the copies and adds `// @ts-nocheck`, as that project allows JS). Only their words and pictures are ours, in their
data copies (`src/team/lib/data/hero.ts` STATS, `why-choose.ts` LEGACY, PHOTO and REASONS) and in `HeroIntro`'s heading and
paragraph, which it writes inline; the script leaves those three alone once they exist. The page (`src/components/about/AboutPage.tsx`, inside one `.team-scope` wrapper with the footer in `src/app/about/page.tsx`), in order:

- **Its nav** (`NavigationBar`), on its cream band.
- **The head:** its course page head's beige band (#F3E8D6, the paper grain, the India Gate drawing faint at both sides,
  the left one mirrored, sized to the band's height; the crumb centred, Home dark), with the tag and "Preparing India’s civil
  servants since 1976." (Abhishek's review: "use the same secondary hero style of course page".)
- **The sections, in the Figma file's order** ("Vajiram & Ravi Website", About Us – 1445, 38:43088; the user, 26 Nov 2026:
  its look is old, but its IA stays, no section skipped): the head (as above, with its "Est. 1976 · New Delhi" tag in its
  dark `SectionLabel`) and the title, then the institute's photograph in a white frame, rising over the band's foot so the
  beige and its drawing run on behind it, with the four figures (its intro's figures row, `Stats`) white over its foot on a
  dark fade; then, in the homepage's own rhythm (26 Nov 2026, the
  user: take the reference from its repository): **who we are** as its homepage intro block (`HeroIntro`, as the homepage has
  it under its banner: the label "Who we are", "Excellence in UPSC coaching, at every stage.", the Figma's two paragraphs as
  one; `stats={false}`, as the figures are on the photograph); **how it started** as its "Why Vajiram & Ravi" block (`WhyChoose`), its
  own tall photograph of the building beside "How it started." and the story, the pair centred and the story held to 600px
  on desktop (`about.css`), so its lines stay easy to read, on its beige band (`--ground-beige`, 90px above and below); **our values** as a centred head (its `SectionWrapper`, `SectionLabel`, heading and introduction: "A holistic approach to
  education.") over the values as stops on one path (`ValuesPath`, brought back 26 Nov 2026 at the user's choice: a dotted
  orange line, each value's icon a stop on it, the five manila cards above and below it by turns), 44px under the
  introduction as the homepage's heads. The words are the Figma's.
- **The people who lead Vajiram & Ravi:** three layouts to compare (Abhishek asked for explorations), each headed by its
  `SectionLabel` and heading: A, three cards that tilt toward the pointer (`AboutTilt`); B, the founder first, large, the
  two directors as smaller cards (`LeadersOptions`); C, tall portraits whose story rises over the photograph under the
  pointer. Once one is chosen, the others go.
- **Its faculty carousel** (`Faculties`, headed "Meet our top educators." with the Figma's line, in its data) and **its "Contact us" card** (`ContactUs`, headed "Our locations." with our line on the New Delhi centre), then our note that Vajiram & Ravi has no other branches.
- **Its footer** (`Footer`), with its curtain: parked under the page and uncovered as the page scrolls off it.

Their behaviours (the nav's menus, scrolled state and language switch, the figures rolling in, the reasons' dots on phones,
the footer's curtain) are started by `AboutBehaviour` from each component's own module, as its `lib/behaviour.js` does; as on
its pages away from the homepage, its in-page links (#toppers …) lead to the homepage. Their reveals (`.rv`, `.rise`) are
run by `AboutReveal`. Their utilities come from its Tailwind entry (`src/team/tailwind-sections.css`); the few global rules
they rely on (its variables, buttons, base, headings, reveals, the nav band) are in `src/team/team-globals.css`, taken from
its built homepage and scoped under `:where(.team-scope)`, so they reach nothing else and keep their weight (its utilities
still win). Our own styles left are `about.css` (the head band, the leader layouts, the note). Nothing is written to the
team repository. The earlier version (Kevin's nav and course-finder head, StoryChapters, the three values layouts) is in
git history (before this change); `StoryChapters` stays, as /free-resources uses it.
- To confirm with the client: the leaders' bios are placeholders in the design; the leaders' portraits are stand-ins.

### The courses page: Kevin's course finder v2 (/courses, 19 Nov 2026)

/courses is now Kevin's course finder v2 (the `kevin` branch, `course-finder.html`; ported at commit 39e7bc9 and brought up to his 58f580a on 21 Nov 2026: the sunset Top Picks headed "Our N Top Picks", the reference build's arrows and "View course" disc buttons, the outlined filter fields on a paper bar, stroke-2 card icons, his nav that stays in place, and his footer without the news card and wordmark), ported to React to be improved here. The nav's "All courses" opens it; "View all courses" inside that menu opens our book-strip version (/courses/books): `src/components/course-finder/` (the page, his nav, the hero, the bar and dropdowns, the category rail, Top Picks, a section per category with its book and row of cards, the counsellor banner), his CSS kept with his class names and comments under `.cf-page` (so it can be compared with his), and his data in `src/data/course-finder.ts`; images in `public/images/course-finder/`. Laid out at the 1440 canvas: his phone and tablet media queries are dropped, and the ones true at 1440 always apply. This site's footer, not his. His stand-in (DUMMY) dates, durations, times, frequencies and badges are kept and marked `data-dummy` on each card, to be replaced before launch.

### Our book-strip version (/courses/books, 17–19 Nov 2026)

**On a phone (21 Nov 2026; this page only).** Below 768px wide the page is not zoomed (`lib/canvas` PHONE_PAGES: `<html>` gets the class `phone`, styled with Tailwind's `phone:` variant from `globals.css` and `html.phone` rules); tablets and desktops keep the zoomed 1440 canvas exactly as before. On a phone: a slimmer header pill (logo and "Let's talk"); the head at phone sizes; in place of the search, the filters and the rail, one bar pinned under the header: a menu button (the burger in a saffron circle, "Browse courses" and the category in view, and a search mark with how many filters are set). It opens a menu, a panel sliding in from the left over the dimmed page (a modal dialog: Escape or a tap outside closes it, and the page holds still behind it): Kevin's search with Mode, Medium and Target year side by side under it, then every category with its flower and how many courses the filters leave (the one in view lit, an empty one greyed), and at its foot "Clear all" and "Show N courses". A category chosen closes the menu and brings its strip up under the bar. Then each category: its band (white, or Top Picks' mahogany), headed by the category's book (small, standing beside the category's name and how many courses it holds), then its chips, then the courses as Kevin's cards at full size (285 × 414) with their illustrations, in one row that swipes sideways and snaps, the next card peeking in at the edge. On a phone the book does not take the cards in (the finger moves the row). The page now has the final site's footer (`footer-ref/RefFooter`, also on /about and /courses), with Kevin's phone rules under `html.phone`.

**21 Nov 2026: Kevin's filters, cards and data in our strips.** The page now reads Kevin's course data and model (`components/course-finder/model`: his cards, badges and stand-ins, marked `data-dummy`) and uses his bar (`course-finder/FilterBar`: the search, then Mode, Medium and Target year dropdowns with counts, kept in the address), his chips over each strip (All, New, Trending, Bestseller, Upcoming) and his card (picture, title, badges, duration, time with how often, mode; batch date and "View course"), 285 × 414, in our rows; the book is drawn larger (2.15 ×, 318 × 460) to stand taller than his card. Our Top Picks comes first, the one strip highlighted (Kevin's mahogany Top Picks ground, with its own dark "Top Picks" book); every other strip is white. The sidebar lists Our Top Picks and the categories with what the filters leave. Later the same day: no course count over the strips (only the chips); four cards in view in each strip: Kevin's card is drawn at his size and shown at 83% (237 × 344, with room to spare at the strip's end), the book in proportion (1.75 ×, 259 × 375, still taller than a card), and the categories list is a slim rail of the flowers down the left that opens over the strips into the full list (names and counts) under the pointer or the keyboard, as Kevin's rail does; the lit category is one orange pill that slides to the category in view, and a category chosen in the rail stays lit while the page glides past the others to it (no flicker through them). Also: Kevin's dropdowns in white like the search (his 88af1a4); a strip whose book is open rises over the categories' rail, so the open cover passes in front of it (still under the bar); and the cards' pictures are flat black-and-orange line illustrations from the Figma workfile's sheets (2788:44810, cut into public/images/course-illus), each card's matching its course (an interview, a mentorship, essay or answer writing, current affairs, CSAT, a test series, a crash course, the postal course, Forestry or Geology, GS, or an optional subject, read from its title in English or Hindi; LIVE-Online courses lean to a laptop or a video call), no two neighbouring cards sharing one, on a warm paper, in place of the course pages' banners; the cards' text is unchanged. The previous version of the page component is not kept in the repository; the description below is of the strips and the books, which are unchanged.

A second page beside the homepage (both on the one Netlify link): the client's course finder content rebuilt in the language of the homepage on the `kevin` branch (its pill header, cream jaali ground, cartouche label, Newsreader headings over IBM Plex Sans, orange pill buttons), with this site's footer. The app now has an `(home)` route group for the homepage's frame (intro, header, footer, WhatsApp, foot blur, section jump); the root layout holds only what both pages share, and the intro plays on `/` only.

- **The idea (18 Nov 2026, in place of the shelf):** the client's course-finder content (its 13 course categories, Mode and Medium filters, one card per course version) as a strip for each category, its courses in one row that scrolls sideways, so a category holds as many as it has; the layout after the course rows of Coursera, LinkedIn Learning and Great Learning, in the homepage's language (`components/courses/CoursesExplorer`). The head ("Every course, in one place."), the bar, then the strips.
- **The bar:** search, Mode, Medium (and Clear). It stays under the header, on a cream ground once there, running the whole width of the window.
- **The categories:** down the left, as in the design reference (the bar, the list and the strips run the header's width, their edges in line with its own), in the design's order (GS Foundation, with its 11-month and 2-year courses, then Optional Subject, CSAT, Interview Guidance, Mentorship, Mains, Prelims and Optional Test Series, Module Courses, Optional Crash Course, Optional Enrichment, IFoS, Postal Course), each with its colour and count; the list stays in view under the bar, the category in view lit in orange, and a click brings its strip up under the bar.
- **The strips (19 Nov 2026; 21 Nov: no "Category 01", name or line over them, the name kept for screen readers):** over each, pills for how many courses the filters leave and in which modes and media. Then the band, coloured and plain by turns: in its book's cloth colours (with its pressed motif, faint) or white; on it, its book standing on the left, as far in from the band's edge as from its top and foot (its cover, swung open, reaches out past that edge into the gap beside the categories), taller than a ticket (1.95 × the homepage book, 289 × 417), and its courses beside it in one row, the round arrows at the row's two edges. The row moves a ticket at a time (the arrows, a sideways swipe on a trackpad or touch screen, or ← → when it has focus): for each ticket going in, the book's cover swings open on its spine (its endpaper inside), the ticket is laid on the pages, and the cover closes over it; going back, the cover opens and the last one laid in comes out to its place. A category the filters empty is left out.
- **The opening:** the first time a strip comes into view its book's cover swings open and the first tickets come out of the pages to their places one after another; then the cover closes. Reduced motion: all in place, still.
- **The courses (19 Nov 2026, redesigned for room and order):** each as the homepage's batch ticket (`Admissions/BatchTicket`), 296 × 394, in four tiers: the orange head with when the batch starts (the day large; "Starts in 11 days" over it when close, "Batch started" once running) and a cream block-print flower; the course's name, large, with its study mode and medium as two small tags under it, and its duration and timing, a row each, in one soft box; then, past the perforation between the notches, the stub: the fee, large, in the Indian style ("Rs. 19,000", however the page writes it) with "incl. GST" under it when it says so, and the "Know more" pill (its page on vajiramandravi.com). The category's name is no longer repeated on each ticket (the strip's head says it). A detail its page does not give reads "To be announced"; the full fee (an offer, a second price, who it is for) and any long value show on hover. The category list's bullets are the same flower, each in its category's colour (cream on the lit one). The filters are kept in the address (`#mode=online&q=essay`).
- **Data:** `src/data/courses.ts`, from the design's data and each course page on vajiramandravi.com as it read on 17 Nov 2026; a detail a page does not give reads "To be announced". The CMS should feed it, so it stays current.

### Homepage v2 (12 Nov 2026; at /home-v2 since 21 Nov 2026)

The client chose between this site's v1 (design J, vajiram-ravi-solomon.netlify.app) and design S (vajiram-ravi.vercel.app). v2 follows their brief section by section; v1 is kept at the git tag `homepage-v1`. Design S's art, photographs and topper archive were copied into the project with the client's go-ahead.

- **Order:** hero, programmes, toppers, testimonials, educators, why Vajiram & Ravi, upcoming batches, talk to us, resources, contact, FAQ, final call to action, footer. The journey section, the announcement strip, the brand-line band and the newspaper are out of the page (their code is kept).
- **Opening:** design S's intro (`layout/Preloader`, `intro.css`): an orange iris on a dark cover, its mandala settling behind the logo, "Understanding India. Shaping its Future.", a saffron bar along the top, then at 2.5 s the panel slides up with its kinari border; Skip intro, Esc or a scroll ends it early and brings the hero's entrance forward.
- **Hero (J):** a "What's new" card in the panel's bottom right corner with two tabs, the next three batches (from `data/admissions`) and the new courses (placeholders, `data/hero`). The stats are a slim white band in the Reith manner: fine mahogany laurels round the figures, an orange rule along the foot.
- **Programmes:** the shelf of v1, at most two rows ("View all" beyond eight), on design S's jaali ground, with a heavier heading. Design S's way in: the hero stays pinned, darkens and draws back while the programmes sheet slides over it (`ui/CoverSheet`).
- **Toppers:** Figma 2392:5005's dark portrait cards in a masonry (after React Bits' Masonry: cards rise in from below out of a blur, one after another), with the Figma's year rail, 2025 back to 2016 (`data/topperArchive`, from design S); ten a year, "Show all" for the rest.
- **Testimonials:** design S's running cards: tilted paper cards in a seamless loop that the pointer holds; the hovered card straightens and lifts while the rest blur back (`SuccessStories/running.css`).
- **Educators:** v1's ring carousel, each card in the Figma topper card's look, the front card carrying the subject, name and experience itself; no caption under the ring and no lead under the heading.
- **Why Vajiram & Ravi:** design S's chapters and scroll: the section pins and each of the six points swings in from 30° about its corner while the row slides a screen; design S's photographs, this site's titles and sentences.
- **Upcoming batches:** the tickets in design S's card styling (orange head in a fine frame, a bolder lotus, "Target exam", the category tag, "Study mode", "Enroll now") at v1's size and with v1's motion; no lead box beside the heading.
- **Talk to us:** design S's sentence form on its framed note ("Hi, I'm ___ and I'm preparing for ___ …", `Admissions/SentenceForm`).
- **Resources:** design S's bento of six cards, each now with a preview of what is inside.
- **Footer:** v1's design with design S's content: four columns, the tagline, the latest current affairs and four social links. Design S's floating WhatsApp button sits in the bottom right corner.
- **Buttons:** a magnetic pull: a button leans towards the pointer and its arrow a little further, springing back as it leaves (`lib/magnetic`).


- The design is a fixed 1440px canvas. On narrower screens the page is zoomed down to fit; the zoom factor is also available to CSS as `--canvas-zoom`. There is no separate mobile layout yet.
- **Opening intro:** on every load, a reload included, a mahogany curtain covers the page for a moment, then lifts with a curved edge and the hero enters behind it, about 1.1 seconds in all (`layout/Preloader`). The page stays still under it. A page restored with the browser's back button does not replay it.
- **Header:** sticky, and out of the way while reading (the mahogany contact strip that sat above it was removed at the client's request). It is whole at the top of the page; scrolling down past 80px slides it out of view, and scrolling back up brings it back. It stays while it holds the keyboard focus or a menu is open. Its links to a section of this page (and the search's results) jump there behind a quick curtain after React Bits Pro "Preloader" (its stairs variant, `layout/SectionJump`): six mahogany stairs with saffron edges rise one after another to cover the screen, the emblem shows on them for a moment, the page jumps under them and they rise on off the top, about 0.7s in all. The section is in place and readable as they clear it (its waiting entrances are finished behind the curtain), the address takes its hash and the keyboard focus lands on it. Only those jumps: other in-page links glide as before, and scrolling never shows it. Reduced motion: no curtain, an instant jump, the focus the same.
  - Nav links turn burnt with a soft burnt pill behind them. The link of the section in view keeps it.
  - All Courses, Study Materials and UPSC Exam open mega menus, on hover after 120ms or on click and Enter; Escape closes them.
  - "Let's talk" is the site's own ink button with the phone in its saffron medallion. It opens a sheet with the ways to reach the admissions team, and its phone rings once on the first hover.
  - The announcement ticker loops every 40 seconds and pauses on hover and focus.
- **Search:** ⌘K or Ctrl+K anywhere opens a search box over the page's own data (`src/data/search.ts`). A result on this page is reached through the section jump's curtain (see Header).
- **Page transitions:** leaving the page for another (a programme, the selections page) a mahogany curtain with the emblem rises from the foot of the screen before the browser goes on; it is the closing twin of the intro. In-page links, new tabs, phone and email links go through untouched.
- **Hero:** the toppers' slideshow from the `kevin` branch's hero, in this site's type and colours. On the orange gradient of Figma 2484:4261, a large rounded panel in which the top three of UPSC CSE 2025 follow one another in wide portraits: each pushes in slowly for 6.5 seconds and cross-fades to the next. The rank is the loudest thing on it: "AIR 01" large and bold in saffron in the top right corner, clear of every portrait, on a frosted warm-brown panel so the name and exam read over a bright window (the washes are brown, never black), "AIR" centred on the figures with the line and dot level with it, while the headline stays white. The panel fills the first screen with the stats strip under it; the announcement strip waits just below. Over it, the pill (a bold saffron "CSE 2025 results" badge, the topper's line gliding past, to the selections page), the client's headline, the lead and the two buttons; dots at the foot of the panel show which topper is on, fill with the slide's time and jump to a topper; a pause button appears when reached with the keyboard. Under the panel, with room above and below, the four points of Figma's stats bar (2425:51305): 50+ years of experience since 1976, 59 questions reflected in Prelims, 10/10 top rankers from V&R courses and 36/50 CSE 2025 rankers, each figure in a cream laurel (the figures roll in; the laurels sway gently, out of step, while the hero is on screen). The slideshow starts once the intro curtain has lifted.
- **Preparation journey:** the centred heading (no lead paragraph), then the three stages, Prelims, Mains and Interview, as medallions on a garland thread that runs in from past the left edge of the screen and out past the right, over the chosen stage's panel and its card "How Vajiram & Ravi supports you" (key words in bold, not colour). The whole band pins to the screen while the page scrolls through the stages one after another; the thread fills with the scroll; when the Interview comes in, its thread runs out to the screen's edge by itself and the band lets go a moment later. Choosing a stage on the rail glides the page to it. The heading rises in letter by letter, the Ashoka dome behind it rises slowly through the run, the chosen medallion's halo breathes, and the Prelims figures (300+, 900+, 18, 30) count up when first seen.
- **About:** on a deep orange band with Parliament House standing on its foot (the client's picture, Figma 2586:4289: toned orange and cut out against a transparent sky, `public/images/about/parliament-orange.webp`, its far sides fading out), the logo's round mark (no plate, in a soft halo of light), the heading "Five decades of experience and / a legacy in civil services preparation." on two lines, its emphasis kept to one line, and the lead "Established in 1976, Vajiram & Ravi has guided generations of aspirants…", then the six cards in a coverflow (`ui/Coverflow`) projected outward like the Parliament colonnade: the centre card large and open in its dark look with its sentence, the side cards smaller, turned away and showing only their title. It plays on its own (pausing on hover, focus and off screen; dots only, no pause button, the active dot in white), and the arrows, dots, arrow keys, swipe or a click on a side card move it. Motion is kept to one entrance so the text reads at once: as the band arrives the mark, heading and lead rise into place together in one 450ms move, with no delay or stagger, and the cards are simply there. Behind them the band's edge opens out from an inset card as it rises in and a warm light breathes at the head of the centre card. (The photo's scroll expand with a parting "Since 1976", the heading's word-by-word rise and emphasis glint, the delayed lead, the photo's drift and the cards' scrubbed rise were removed at the client's request: they collided and the text could not be read.) Reduced motion: no autoplay or entrance.
- **Programmes:** in the `kevin` branch's copy (`src/data/programmes.ts`), on the cream of the journey band: the heading, then the flagship General Studies Prelims & Mains Programme on a card in the hero's orange gradient: a "Flagship programme" pill after the hero's, led by the turning butta flower (no arrow), with the admissions line gliding through it (admissions open, the next batch's start date and the days to go, from `data/admissions.ts`); classroom and campus photographs fading from one to the next (placeholders until real classroom photos come); the client's three lines (300+ lectures and 900+ teaching hours, 18 Yellow Books and The Recitals, 30 Prelims tests and the Mains support programme), their figures in bold, and "Classroom and LIVE-Online" as a small note under them; "Enrol for the programme" (opens the counselling form with the programme chosen) and "View programme details". Then the course shelf: category chips (All, Foundation, Optional, Tests, Guidance) over two walnut planks built in CSS, with kevin's eight programme groups as cloth-bound books (spine, page block, gold frame and emblem), each with the earlier wall's geometric motif pressed faintly into its cloth. On hover the cloth grows brighter and more vivid, the motif moves, the foil brightens and a band of light sweeps across. The books arrive as a stack lying flat on the middle of the lower plank and are dealt off it one by one into their places, the upper plank first, all within about 1.2s of the shelf coming into view. Filtering lays the outgoing books down flat where they stand, slides the rest along the plank and stands the incoming ones up in their places, settled within about 500ms; with four or fewer the shelf closes up to one plank. A hovered book lifts; choosing one opens it as before (a chip above it shows "Page 1 of 4"; a round close button at its top right corner, besides Escape or a click away), its pages turning through the group, a page per course, then the way to all of them on vajiramandravi.com. The right-hand page's corner peels like a sticker (after the reactbits.dev sticker peel, in CSS): a little at rest, more on hover; a click on it or pulling it over turns the page. Reduced motion: no entrance or filter motion, and a still corner. Under the shelf, the card pointing to the counsellors. Course counts and lines are kevin's and still to be confirmed. Motion: the collage drifts down slowly behind the flagship card and its lotus turns with the scroll; the card's name rises letter by letter, its points come in one by one, its detail labels settle out of shuffling type and the duration counts up; now and then a glint of the foil passes across one of the books.
- **Batches:** on cream, the featured General Studies batch as a long ticket with its "Admissions open" stamp, labelled "Upcoming batch", then the mode tabs (All / Classroom / LIVE-Online) and the ticket rail of the other batches (General Studies is not repeated there), with a round arrow at either side, each ticket with its own faint line drawing (`Admissions/TicketArt`) in a small loop of its own (the flag waves, the globe turns, the paper's columns type in, the book's rays pulse; the featured ticket's lotus turns). Hovering a ticket lifts it a little. "Register now" scrolls to the counselling form and fills in the programme. The tickets open after React Bits Pro "Parallax Cards" (`data-depth-cards`): as the rail comes into view they start at different depths, some lower, smaller and fainter, each a little turned, and settle together into the flat row (560ms); their dates flip in like a departure board and the "Limited seats" stamps come down as they settle, all within about 0.8s. The rail's edges soften into a stepped blur (`ui/GradualBlur`) on the side where more tickets wait. The featured ticket's labels settle out of shuffling type, "View all upcoming batches" fades in out of a soft blur (`data-fade`), and once down, the stamps give a short wobble every few seconds while the band is on screen.
- **Counselling:** the client's six-field postcard with the client's Vajiram & Ravi postage stamp (Figma 2572:4287, "₹5 Postage", cut out with its perforations, `Admissions/PostageStamp`) cancelled by a vermilion postmark, on a deep orange ground with a faint lattice, darker behind the white heading and at the sides, lighter behind the card. Fields have outlined floating labels that move up onto the border as you type; "Programme of interest" and "Preferred time" (morning, afternoon or evening) are the site's own dropdowns (`Admissions/SelectMenu`: a dark rounded menu with a saffron tick, keyboard and screen-reader ready) in place of the browser's; the mobile number has no +91 prefix. The card slides in and settles and the stamp presses with an ink ring. Fields validate as you leave them; submitting sends the card with a postmark. The form does not send anything yet: `src/components/sections/Admissions/submitEnquiry.ts` is where a form service plugs in.
- **Educators:** a circular carousel after React Bits' "Circular Carousel" (`ui/CircularCarousel`): the portraits stand round a 3D ring, each card bent to follow it, the camera looking a little down; only the cards' fronts are drawn (their backs poked through the near cards as cream steps while the ring turned, so they were taken out). The card at the front is in colour, the rest black and white until hovered; under the ring the front educator's name, subject, introduction and qualifications cross-fade quickly (250ms) as it changes. It turns by drag (with a throw that settles on a card), a sideways trackpad swipe, the arrows, dots, ← → keys or a click on a card, and plays on its own, pausing while the pointer is on the front card (not anywhere on the ring), on keyboard focus and off screen (no pause button; the dots sit right under the ring and the arrows just beside its ends); reduced motion turns autoplay off and makes moves instant. It rises into place with the scroll and turns in once it is in view, coming to rest within about a second; the first autoplay step waits 6 seconds, so the first educator can be read.
- **Student stories:** the students' words on postcards, turning on a 3D ring after the `kevin` branch's stories: the front postcard flat, those either side turned away and set back. The next comes round every 4.5 seconds, pausing under the pointer or focus; the arrows, a click on a side postcard, the arrow keys and a swipe turn it too. The postcards fan out from the front one as the ring comes into view, and with the scroll the postmarks' rings turn (the ring itself holds still while it is read). The ring's far sides soften into a stepped blur (`ui/GradualBlur`). After the stories, a band of large brand type, "Vajiram & Ravi · Since 1976 ·" in ink and orange (`ui/TextMarquee`), slides slowly sideways with the scroll, after wabcoffeeco.com's scrolling words; it is decoration (its words are already on the page) and is still with reduced motion. Two are the toppers' stories; four are dummy stories (kevin's sample students, with placeholder ranks) to be replaced. The heading reads "The journeys of our toppers and alumni, in their own words.", with no lead under it. Every postcard carries a rank, once: the postmark shows "AIR" over it, and the line under the name gives only the exam and year.
- **Free study material:** a broadsheet front page on the cream: a masthead with the Vajiram & Ravi logo between two ears, a dateline (volume, issue and the reader's date) between double rules, the newspaper headline with a drop-cap standfirst and a pull-quote, then three columns (Prelims pointers, Mains articles & editorial analysis, UPSC study materials) under heavy rules, black headings and a lead photo each (the study-materials column: open study books on a library table, under "18 Yellow Books covering the General Studies syllabus"), the client's link at the foot of each, "Other free resources" and a folio. The page prints in as the band arrives, its small mono labels settling out of shuffling type, and the halftone photos drift in their frames with the scroll. The headlines are a snapshot of vajiramandravi.com's latest articles (14 Nov 2026), to be fed from the CMS; the ears are format labels for the client to approve.
- **FAQ:** the client's seven questions; the client's terracotta Vajiram & Ravi seal (Figma 2572:4286, its ink lifted off the paper) presses on beside the heading. The questions are numbered 1, 2, 3. One answer open at a time, the open one on a tinted panel with a burnt bar down its edge and no rule above or below it and the question in semibold; every answer is in the page's HTML and its FAQPage structured data. The campus section follows (`#locations`), shorter than before: the heading "Where can you find us?" (no lead), a cream details tile for the New Delhi centre (the one centre, so no city tabs), and the street map with "View on maps" (an orange button with a folded-map icon) beside a carousel of the institute's photographs (placeholders until real campus photos come), one at a time filling the right half: each captioned at its foot, only the dots over it at the foot on the right (no arrows); they slide across every 5 seconds (holding under the pointer or focus), and the dots and arrow keys move it too. Four photographs: the building, the library and two of a class in session, over a dark wash at the foot so the caption and dots read. The street map has a + and − at its right that zoom it about the campus pin (the pin keeps its size). Reduced motion: no autoplay, instant changes. The FAQ seal turns a little with the scroll.
- **Text, section, scroll and ambient motion (the whole page):** after wabcoffeeco.com and React Bits (`ui/TextMotion`), set by data attributes and run by one requestAnimationFrame loop (it runs when the page scrolls, and keeps going only while a figure counts or a label shuffles). Only transform (and its translate, scale and rotate properties), opacity, filter and clip-path change, and nothing is hidden before the script runs.
  - **Readability first** (the client, 11 Nov 2026: effects colliding left people unable to read): one entrance per block, never stacked; every entrance on text is over within about 600ms of it coming into view, with no delay over 200ms and staggers of at most 50ms; nothing anyone reads is scrubbed by the scroll (scroll effects move decoration only: photos, ornaments, a band's edge, the large brand line), and text never waits for them; no loop runs over text; after an entrance everything is in its final state even if the visitor stops scrolling. The section reveals (`ui/ScrollReveal`) follow the same rule: 450ms, heading at once, sub text 60ms later, content from 100ms, 25ms apart, never more than 200ms.
  - **Text:** headings (`data-split`) rise in letter by letter out of a mask per word as they reach 82% of the screen (480ms, the letters at most 120ms apart from first to last); small labels (`data-scramble`) settle out of shuffling glyphs, left to right, like a departure board (at most 600ms); figures (`data-count`) count up from 0 the first time they are seen (600ms), their width held so the line never moves. Leads (`data-words`) are simply there. Taken out: the leads lit word by word with the scroll, headings drifting with the scroll, the emphasis glint that ran through heading words (`.tm-glint`, `data-sweep`) and the reveal's emphasis shimmer.
  - **Entrances:** cards rise and grow into place (`data-zoom`, 520ms), lists come in one by one (`data-stagger`, 480ms, 40ms apart), large blocks rise into place (`data-rise`, 560ms, timed now rather than scrubbed), photos are uncovered from their foot up while they settle from 108% (`data-wipe`, 700ms), and body content with no entrance of its own fades in out of a soft blur, after React Bits "Fade Content" (`data-fade`, 6px to sharp, 500ms: the programmes' counsellor card, "View all upcoming batches", the footer's logo row). The batch tickets open after React Bits Pro "Parallax Cards" (`data-depth-cards`, see Batches).
  - **Scroll-linked (decoration only):** photos drift against the scroll inside their frames (`data-par`, 6% or the amount given): the featured programme's photographs, the newspaper's halftones and the campus gallery. Decoration drifts and ornaments turn over their section's crossing of the screen (`data-drift`, `data-turn`): the Ashoka dome in the journey, the newspaper collage behind the programmes, the postmarks' rings, the flagship card's lotus and the FAQ seal. The about, counselling, free study material, locations and closing bands' edges open out from a slightly inset, rounded card as they rise in (`data-curtain`). The campus building's photograph opens with the scroll expand (`data-expand`, after React Bits "Scroll Expand"), and the brand line band slides sideways (`data-marquee`, `ui/TextMarquee`).
  - **Gradual blur** (`ui/GradualBlur`, after React Bits "Gradual Blur"): a few stacked backdrop-blur layers, each twice as strong and masked nearer the edge than the one before, so content softens by degrees into an edge. A 40px band along the foot of the screen, under the header and dialogs, shown once the page has left its first screen and gone near its end (off with reduced motion); the batch rail's edges where more tickets wait; and the stories ring's far sides. Still, pointer-transparent and aria-hidden.
  - **Ambient loops:** slow, small and only while their section is on screen, and never on text. TextMotion sets `--lp: running` on a section in view, and the loop classes in `globals.css` take their play state from it; otherwise they hold their first frame, the element at rest. The hero's laurels sway, out of step (`.lp-sway`); the chosen journey medallion's halo breathes (`.lp-breathe`); a warm light breathes at the head of the About centre card (`.lp-glow`); the "Limited seats" and "Admissions open" stamps give a short wobble now and then (`.lp-wobble`); and a glint of gold light passes across a book's cover from time to time (`.lp-glint`).
  - Screen readers get each heading whole. Reduced motion turns it all off: no letters, labels or figures move, nothing drifts, wipes, expands, slides or loops, the foot-of-screen blur is gone, and the thread is not drawn.
- **Closing banner and footer:** the banner plays. The scroll scrubs its sunrise: as the band comes up the screen the sun, its rays and glow rise from below the horizon into place, the halo rings scale and fade in from the inside out, and the sky warms out of dusk. With a mouse over the band the sun and its glow follow the pointer on a lagged spring, the rings at falling depths; the rays turn faster, the glow warms, a soft light follows the pointer, and the heading's letters lift and lean towards it as it passes. A click or tap anywhere but the buttons sends a halo ripple out from the point and makes the sun flash (on touch there is the tap ripple and no follow). While on screen a wave of light runs out through the rings and the glow breathes; all of it runs on one animation-frame loop, only while the band is on screen, and with reduced motion the art is simply in place and still. Its main button is the saffron one used on the orange counselling band. The footer has the contents of Figma "Footer – v5 (minimal)" (2567:4286): the logo over a hairline, six link columns (Vajiram & Ravi, Courses, Test series & mentorship, UPSC exam, Exam updates, Free resources; the last five the same lists as the mega menus), the social icons on the right of the logo row, opposite the logo (addresses still to come from the client), and the legal bar; its column heads in Mukta semibold capitals and its links at 16px, the same as the column heads (the columns share the width in proportion and a long link wraps); between the columns and the icons the wordmark, large and bold, pressed into the paper like the client's reference (trove.quest): a shade deeper than the cream, shaded inside the top of each stroke and lit along the bottom, still.
- **Smooth scrolling:** the page scrolls with Lenis (`ui/SmoothScroll`). In-page links glide to their section and land under the 120px sticky header, and the page holds still while the search or the "Let's talk" sheet is open.
- **Opening at the hero:** the page always opens at the top. A head script (`startAtTopScript` in `lib/smoothScroll`) turns off the browser's scroll restoration and drops a section hash from the address.
- **Reduced motion:** reveals become a 150ms fade without movement, counters show their final numbers, carousels do not move on their own, and ambient loops (the hero's slideshow, ticker, pin, the closing banner's wave, rays and sun glow, the medallion flowers, and TextMotion's laurels, halo, card glow, stamp wobble and foil glint) stay still. TextMotion's letters, labels, figures, wipes, fades, expands, the tickets' depth opening, the brand line's slide and the drifts are all off, and so is the foot-of-screen blur. There is no intro, page curtain, section-jump curtain (the jump is instant), deal, spread, ring roll, parallax, tilt, glow, cursor label or spin. The journey still follows the scroll, its stages changing without the rise.
- **Accessibility:** every control is a real link or button with the saffron focus ring. Tabs follow the WAI-ARIA tabs pattern, accordion rows are buttons with `aria-expanded`, carousel arrows are labelled and slides are announced as "3 of 10", and decorative art is hidden from screen readers.
- The footer's last line is never scroll-revealed, and nothing in the last screen of the page is pre-hidden, so the foot of the page always shows.
- Every link that leaves the page is in `src/data/links.ts`, checked against vajiramandravi.com. A page that does not exist yet is `null` there and its link renders as plain text. There are no `href="#"` links.
- Images are served as webp and svg files. Next.js image resizing needs a server, so it is off.

## Content still to confirm

- Placeholders, marked `TODO: placeholder` in the data: the featured GS 2028 batch's start date (`src/data/admissions.ts`), and the educators' qualifications, experience and introductions, which are made-up statements about real people and must be replaced before launch (`src/data/faculty.ts`).
- Pages the live site does not have yet: faculty, student stories, Prelims Pointers (it opens the Prelims current affairs), a test-series hub (it opens the Prelims test series), grievance redressal (`src/data/links.ts`). "Meet our faculty" and "Watch student stories" stay hidden until their pages exist.
- More student stories: only two are in `src/data/stories.ts`; a third turns the postcards into a carousel.
- Social media links for the footer: the live site lists none.
- A real street map for the New Delhi centre (`src/data/contact.ts`).
- The batch dates and seat flags (`src/data/admissions.ts`; "SMART Current Affairs Program 2026" targets a year that has passed).
