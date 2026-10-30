import Image from "next/image";
import type { CSSProperties } from "react";

type PhotoProps = {
  src: string;
  alt: string;
  /** Rendered width on the 1440px canvas, e.g. "302px"; lets next/image pick the right file size. */
  sizes: string;
  /** Classes for the frame. They must position it (`relative` or `absolute`); the image fills the frame. */
  className: string;
  style?: CSSProperties;
  id?: string;
  /** "cover" fills the frame and may crop; "contain" shows the whole image. */
  fit?: "cover" | "contain";
};

/** A photo inside a frame. The frame carries the hover and zoom transforms from the design. */
export default function Photo({ src, alt, sizes, className, style, id, fit = "cover" }: PhotoProps) {
  return (
    <div className={className} style={style} id={id}>
      <Image src={src} alt={alt} fill sizes={sizes} className={fit === "contain" ? "object-contain" : "object-cover"} />
    </div>
  );
}
