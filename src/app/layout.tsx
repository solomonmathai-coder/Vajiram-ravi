import type { Metadata, Viewport } from "next";
import { Caveat, IBM_Plex_Sans, Mukta, Newsreader, Source_Sans_3 } from "next/font/google";
import type { ReactNode } from "react";
import { introScript } from "@/components/layout/Preloader";
import CanvasFit from "@/components/ui/CanvasFit";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Toast from "@/components/ui/Toast";
import { fitCanvasScript } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { startAtTopScript } from "@/lib/smoothScroll";
import "./globals.css";

/*
 * The site's type, and no other fonts: Mukta for headings (Light to Bold; it has no italics, so the
 * emphasis in a heading is set apart by its colour alone) and Source Sans 3 for everything else, text, UI
 * and labels alike (Regular to Bold, with italics). The variables feed the --font-heading and --font-sans
 * theme tokens.
 */
const sourceSans = Source_Sans_3({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-text-face",
  display: "swap",
});
const mukta = Mukta({ weight: ["300", "400", "500", "600", "700"], subsets: ["latin"], variable: "--font-heading-face", display: "swap" });
/** Design S's handwriting, for the blanks of the "Talk to us" sentence form only (the client asked for it). */
const caveat = Caveat({ weight: ["500", "600"], subsets: ["latin"], variable: "--font-hand", display: "swap" });
/**
 * The courses page's type (/courses), after the homepage on the `kevin` branch, its design language: IBM Plex
 * Sans for text and Newsreader for headings. Only that page uses them.
 */
const plex = IBM_Plex_Sans({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-plex", display: "swap" });
const newsreader = Newsreader({ weight: ["400", "500", "600"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-news", display: "swap" });

export const metadata: Metadata = {
  title: "Vajiram & Ravi · UPSC Civil Services Examination preparation",
  description:
    "Prepare for the Civil Services Examination with experienced educators, structured programmes and focused academic guidance at every stage. Since 1976.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The canvas-fit script sets an inline zoom on <html> before hydration.
    <html
      lang="en"
      className={cx(sourceSans.variable, mukta.variable, caveat.variable, plex.variable, newsreader.variable)}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: fitCanvasScript }} />
        <script dangerouslySetInnerHTML={{ __html: startAtTopScript }} />
        {/* Marks <html> for the intro (layout/Preloader, design S's opening) before the first paint, on every load. */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <CanvasFit />
        <SmoothScroll />
        <a className="sr-only" href="#main">
          Skip to content
        </a>
        {/* Each page brings its own header and footer: the homepage's in (home)/layout, the courses page's in courses/. */}
        {children}
        <Toast />
      </body>
    </html>
  );
}
