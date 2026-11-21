import { links } from "@/data/links";

/** The links of the homepage on the `kevin` branch, pointing back to its sections from this page. */
const NAV = [
  { label: "All courses", href: "/courses", current: true },
  { label: "Toppers", href: "/#toppers" },
  { label: "Study materials", href: links.studyMaterial },
  { label: "UPSC exam", href: links.upscExam },
  { label: "Upcoming batches", href: "/#batches" },
  { label: "FAQs", href: "/#faq" },
];

/**
 * The courses page's header, in the language of the homepage on the `kevin` branch (its `.nav`): a white
 * pill floating over the page, the logo at its left and the links in the middle (the current one, All
 * courses, in burnt orange with a line under it), and beside it the orange "Let's talk" pill with its arrow
 * in a white circle. It stays at the top as the page scrolls. On a phone (`phone:`, lib/canvas) it is a slimmer
 * pill with the logo alone, and "Let's talk" beside it.
 */
export default function CoursesHeader() {
  return (
    <header className="sticky top-0 z-40 px-6 pt-4 phone:px-3 phone:pt-2">
      <div className="mx-auto flex w-canvas max-w-full items-center gap-4 phone:gap-2">
        <div className="flex h-[60px] flex-1 items-center rounded-full bg-white pr-3 pl-6 phone:h-[52px] phone:pl-4 shadow-[0_10px_30px_-18px_rgb(60_20_0/0.45),0_0_0_1px_rgb(26_23_20/0.06)]">
          <a href="/" aria-label="Vajiram & Ravi, home" className="shrink-0">
            <img src="/images/logo.webp" alt="" width={617} height={206} className="h-10 w-auto phone:h-8" />
          </a>
          <nav aria-label="Main" className="mx-auto flex items-center gap-1 phone:hidden">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className="group/nav relative rounded-full px-3.5 py-2 text-[15px]/[20px] font-medium text-[#3a2a22] [transition:color_200ms_ease] hover:text-[#c2410c] aria-[current=page]:text-[#c2410c]"
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3.5 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-[#c2410c] [transition:scale_250ms_ease] group-hover/nav:scale-x-100 group-aria-[current=page]/nav:scale-x-100"
                />
              </a>
            ))}
          </nav>
        </div>
        <a
          href="/#counselling"
          className="group/talk flex h-[60px] shrink-0 items-center gap-3 rounded-full phone:h-[52px] phone:gap-2 phone:pr-1.5 phone:pl-4 phone:text-[14px] bg-[linear-gradient(135deg,#f06a2c_0%,#e85020_45%,#c2410c_100%)] pr-2.5 pl-6 text-[16px] font-semibold text-white shadow-[0_12px_24px_-12px_rgb(194_65_12/0.7)] [transition:translate_250ms_ease] hover:-translate-y-0.5"
        >
          Let&apos;s talk
          <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-white text-[#c2410c] phone:size-9">
            <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="[transition:translate_300ms_ease] group-hover/talk:translate-x-0.5">
              <path d="M2.5 8h11M8.6 3.6C9.4 5.9 11.2 7.4 13.5 8 11.2 8.6 9.4 10.1 8.6 12.4" />
            </svg>
          </span>
        </a>
      </div>
    </header>
  );
}
