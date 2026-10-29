"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Full-bleed looping background video. It is decorative, so it is hidden from assistive tech.
 * Playback is started from script as well, because the server-rendered `muted` flag is only set on
 * hydration and browsers refuse to autoplay video with sound. Reduced-motion visitors get a still frame.
 */
export default function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    if (prefersReducedMotion()) video.pause();
    else video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      className="pointer-events-none absolute inset-0 z-0 size-full object-cover"
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
