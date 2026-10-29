import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import UtilityBar from "@/components/layout/UtilityBar";
import CanvasFit from "@/components/ui/CanvasFit";
import Toast from "@/components/ui/Toast";
import { fitCanvasScript } from "@/lib/canvas";
import "./globals.css";

const figtree = localFont({
  src: [
    { path: "./fonts/figtree-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/figtree-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/figtree-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/figtree-700.woff2", weight: "700", style: "normal" },
  ],
  // Consumed by the --font-display theme token in globals.css.
  variable: "--font-figtree-face",
  display: "swap",
});

const geist = localFont({
  src: [
    { path: "./fonts/geist-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/geist-500.woff2", weight: "500", style: "normal" },
  ],
  // Consumed by the --font-sans theme token in globals.css.
  variable: "--font-geist-face",
  display: "swap",
});

// Hero redesign: Instrument Serif for display type, Inter for body text.
// next/font downloads them at build time and serves them from this site, so the static export needs no Google request.
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  // Consumed by the --font-serif theme token in globals.css.
  variable: "--font-instrument-face",
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500"],
  subsets: ["latin"],
  // Consumed by the --font-inter theme token in globals.css.
  variable: "--font-inter-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vajiram & Ravi Homepage",
  description: "Working prototype of the redesigned Vajiram & Ravi homepage.",
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
      className={`${figtree.variable} ${geist.variable} ${instrumentSerif.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: fitCanvasScript }} />
      </head>
      <body>
        <CanvasFit />
        <a className="sr-only" href="#main">
          Skip to content
        </a>
        <UtilityBar />
        <SiteHeader />
        {children}
        <SiteFooter />
        <Toast />
      </body>
    </html>
  );
}
