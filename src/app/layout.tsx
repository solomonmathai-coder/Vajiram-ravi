import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import CanvasFit from "@/components/ui/CanvasFit";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Toast from "@/components/ui/Toast";
import { fitCanvasScript } from "@/lib/canvas";
import { startAtTopScript } from "@/lib/smoothScroll";
import "./globals.css";

// Geist is the type of the redesign: Light for large list numbers, Regular for body copy, Medium for headings
// and UI, SemiBold for small labels.
const geist = Geist({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  // Consumed by the --font-sans theme token in globals.css.
  variable: "--font-geist-face",
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
      className={geist.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: fitCanvasScript }} />
        <script dangerouslySetInnerHTML={{ __html: startAtTopScript }} />
      </head>
      <body>
        <CanvasFit />
        <SmoothScroll />
        <a className="sr-only" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Toast />
      </body>
    </html>
  );
}
