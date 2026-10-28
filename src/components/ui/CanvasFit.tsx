"use client";

import { useEffect } from "react";
import { fitCanvas } from "@/lib/canvas";

/** Keeps the 1440px canvas fitted to the viewport as the window resizes. */
export default function CanvasFit() {
  useEffect(() => {
    fitCanvas();
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fitCanvas);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
