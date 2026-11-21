"use client";

import { useEffect, useState } from "react";
import { links } from "@/data/links";
import "./whatsapp.css";

/** The chat opens with this line already written (design S's). */
const MESSAGE = "Hello, I would like to know about UPSC programmes at Vajiram & Ravi";

/**
 * The floating WhatsApp button, after design S's (the client asked for it on homepage v2): a green pill in
 * the bottom right corner, the logo in a 56px circle, which opens out to "Chat on WhatsApp" on hover while
 * the logo tips a little; a soft green ring pulses out from it now and then. It springs in once the intro
 * has gone (vr:intro-done, layout/PreloaderCurtain), or at once where there is none. Reduced motion: it is
 * simply there, still. Opens WhatsApp in a new tab.
 */
export default function WhatsAppButton() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!document.documentElement.classList.contains("intro")) {
      const t = window.setTimeout(() => setShown(true), 600);
      return () => window.clearTimeout(t);
    }
    const show = () => setShown(true);
    document.addEventListener("vr:intro-done", show, { once: true });
    return () => document.removeEventListener("vr:intro-done", show);
  }, []);
  return (
    <a
      className={`wa${shown ? " wa--in" : ""}`}
      href={`${links.whatsapp}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noopener"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
    >
      <span className="wa__ic" aria-hidden="true">
        <svg viewBox="0 0 32 32">
          <path d="M16.04 3C9.02 3 3.3 8.7 3.3 15.72c0 2.42.68 4.76 1.97 6.8L3 29l6.68-2.17a12.7 12.7 0 0 0 6.36 1.7c7.02 0 12.74-5.7 12.74-12.72S23.06 3 16.04 3zm0 23.26c-2.06 0-4.08-.56-5.84-1.6l-.42-.25-3.96 1.29 1.31-3.84-.27-.4a10.5 10.5 0 0 1-1.64-5.74c0-5.82 4.75-10.56 10.6-10.56 5.84 0 10.59 4.74 10.59 10.56S21.9 26.26 16.04 26.26zm5.8-7.9c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.72.16-.21.32-.82 1.03-1 1.24-.19.21-.37.24-.69.08-.32-.16-1.34-.5-2.56-1.58a9.6 9.6 0 0 1-1.77-2.2c-.19-.32-.02-.5.14-.65.14-.15.32-.37.48-.56.16-.19.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.72-.98-2.36-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.65s1.14 3.08 1.3 3.29c.16.21 2.25 3.43 5.45 4.81.76.33 1.36.52 1.82.67.76.24 1.46.21 2.01.13.61-.09 1.88-.77 2.15-1.51.26-.74.26-1.38.18-1.51-.08-.13-.29-.21-.61-.37z" />
        </svg>
      </span>
      <span className="wa__t">Chat on WhatsApp</span>
    </a>
  );
}
