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
};

/** A cover-fit photo inside a frame. The frame carries the hover and zoom transforms from the design. */
export default function Photo({ src, alt, sizes, className, style, id }: PhotoProps) {
  return (
    <div className={className} style={style} id={id}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
