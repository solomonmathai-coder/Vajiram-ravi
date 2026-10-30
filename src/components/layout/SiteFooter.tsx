import FooterWordmark from "@/components/sections/ClosingCta/FooterWordmark";
import Photo from "@/components/ui/Photo";
import { footerColumns, footerCopyright, footerLegal, footerWordmark } from "@/data/footer";
import { contact } from "@/data/site";

/**
 * The dark footer under the closing banner: the logo plate and email, six link columns, the giant
 * wordmark over a breathing orange glow, and the legal bar. It is its own stacking context, so the glow
 * can sit behind the links, and it clips the glow so the page does not grow below it.
 */
export default function SiteFooter() {
  return (
    <footer className="relative isolate overflow-clip bg-coal">
      <div className="relative mx-auto flex w-canvas flex-col gap-[72px] px-20 pt-[72px]">
        <div data-reveal-group className="flex items-start gap-6">
          <div className="flex w-[220px] shrink-0 flex-col items-start gap-4">
            <a href="#top" aria-label="Vajiram & Ravi, back to top" className="rounded-full bg-paper px-4 py-2.5">
              <Photo src="/images/logo.webp" alt="" sizes="150px" fit="contain" className="relative h-[34px] w-[150px]" />
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="text-[13px]/[1.5] whitespace-nowrap text-cream/60 transition-colors duration-200 hover:text-cream"
            >
              {contact.email}
            </a>
          </div>
          {footerColumns.map((column) => (
            <div key={column.heading} className="flex min-w-px flex-1 flex-col gap-3.5 text-[13px]">
              <h2 className="leading-[1.5] font-medium text-tangerine">{column.heading}</h2>
              <ul className="flex flex-col gap-[9px] leading-[1.4] text-cream/70">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="transition-colors duration-200 hover:text-cream">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <FooterWordmark text={footerWordmark} />

        {/* Not scroll-revealed: at the very foot of the page it might never reach the reveal line. */}
        <div className="flex items-center justify-between border-t border-paper/10 py-6 text-[13px]/[1.5] whitespace-nowrap">
          <p className="text-cream/55">{footerCopyright}</p>
          <nav aria-label="Legal" className="flex gap-6 text-cream/70">
            {footerLegal.map((link) => (
              <a key={link.label} href={link.href} className="transition-colors duration-200 hover:text-cream">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
