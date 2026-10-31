"use client";

import { useRef } from "react";
import { CloseIcon } from "@/components/icons";
import { SPLIT_BUTTON, SplitButtonParts } from "@/components/ui/Buttons";
import { showToast } from "@/lib/toast";

/**
 * "Watch video": two small white boxes, the label and a chevron. It opens the hero video with sound
 * and controls in a dialog; Escape, the close button or a click outside the video closes it.
 * Until a video is set it shows a toast instead.
 */
export default function WatchVideoButton({ video }: { video?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);

  const open = () => {
    if (!video) {
      showToast("The hero video has not been added yet");
      return;
    }
    dialogRef.current?.showModal();
    playerRef.current?.play().catch(() => {});
  };

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button type="button" onClick={open} className={SPLIT_BUTTON}>
        <SplitButtonParts>Watch video</SplitButtonParts>
      </button>
      {video && (
        <dialog
          ref={dialogRef}
          aria-label="Vajiram & Ravi video"
          className="m-auto w-[1120px] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-neutral-950/80"
          onClose={() => playerRef.current?.pause()}
          onClick={(event) => event.target === dialogRef.current && close()}
        >
          <video ref={playerRef} className="aspect-video w-full rounded-lg bg-neutral-950" src={video} controls playsInline />
          <button
            type="button"
            onClick={close}
            aria-label="Close video"
            className="absolute -top-12 right-0 flex size-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-200 hover:bg-white/25"
          >
            <CloseIcon />
          </button>
        </dialog>
      )}
    </>
  );
}
