"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { PauseIcon, PlayIcon } from "@/components/icons";
import type { HeroContent } from "@/data/home";
import { prefersReducedMotion } from "@/lib/motion";

type HeroVideoProps = Pick<HeroContent, "video" | "poster"> & { children: ReactNode };

/**
 * The hero's full-width media band: the poster photo, the muted background video over it, a dark
 * scrim so the white text stays readable, and the content in the canvas at the bottom left.
 * It slides up under the transparent header (-mt-20) and marks itself dark so the header turns white;
 * the top of the scrim keeps the header's white links readable.
 * The video starts on its own unless the visitor prefers reduced motion, and a small button at the
 * bottom right pauses or plays it.
 */
export default function HeroVideo({ video, poster, children }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!prefersReducedMotion()) videoRef.current?.play().catch(() => {});
  }, []);

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  return (
    <div className="relative -mt-20 h-[720px] overflow-hidden bg-neutral-900">
      <Image
        className="object-cover"
        src={poster.src}
        alt={poster.alt}
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        style={{ objectPosition: poster.position }}
      />
      {video && (
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          style={{ objectPosition: poster.position }}
          src={video}
          poster={poster.src}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.55),rgba(0,0,0,0)_30%),linear-gradient(to_top,rgba(0,0,0,.6),rgba(0,0,0,0)_62%),linear-gradient(to_right,rgba(0,0,0,.35),rgba(0,0,0,0)_60%)]" />

      <div className="relative mx-auto flex h-full w-canvas items-end justify-between px-10 pb-16">
        <div className="flex flex-col items-start gap-8">{children}</div>
        {video && (
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause background video" : "Play background video"}
            className="flex size-9 items-center justify-center rounded-[4px] bg-white/20 text-white backdrop-blur-[8px] transition-colors duration-200 hover:bg-white/30"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
        )}
      </div>
    </div>
  );
}
