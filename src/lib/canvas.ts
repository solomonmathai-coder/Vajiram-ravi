/**
 * The homepage is designed as a fixed 1440px canvas (rebuilt 1:1 from Figma).
 * On narrower viewports the root element is zoomed down so the whole canvas fits.
 */
export const CANVAS_WIDTH = 1440;

/**
 * Pages with a phone layout of their own (21 Nov 2026: our course finder only). Below PHONE_MAX wide they are not
 * zoomed: <html> gets the class "phone" and the page lays itself out for the phone (the `phone:` variant,
 * globals.css). Every other page, and these on wider screens, keep the zoomed canvas.
 */
export const PHONE_PAGES = ["/courses/books"];
export const PHONE_MAX = 767;

/**
 * Re-fits the canvas to the current viewport and returns the zoom factor applied.
 * The factor is also published as `--canvas-zoom`, because the zoom shrinks viewport units too:
 * a full-screen height is `calc(100svh / var(--canvas-zoom, 1))`.
 */
export function fitCanvas(): number {
  const root = document.documentElement;
  root.style.zoom = "";
  const viewport = root.clientWidth || window.innerWidth;
  const phone = viewport <= PHONE_MAX && PHONE_PAGES.some((p) => location.pathname.startsWith(p));
  root.classList.toggle("phone", phone);
  const zoom = phone ? 1 : Math.min(1, viewport / CANVAS_WIDTH);
  if (zoom < 1) root.style.zoom = String(zoom);
  root.style.setProperty("--canvas-zoom", String(zoom));
  return zoom;
}

/** Inline <head> version of fitCanvas, so the very first paint is already scaled. */
export const fitCanvasScript = `(function(){var r=document.documentElement,w=r.clientWidth||innerWidth,p=w<=${PHONE_MAX}&&${JSON.stringify(PHONE_PAGES)}.some(function(x){return location.pathname.indexOf(x)===0}),z=p?1:Math.min(1,w/${CANVAS_WIDTH});if(p)r.classList.add("phone");if(z<1)r.style.zoom=String(z);r.style.setProperty("--canvas-zoom",String(z))})();`;

/** Current canvas zoom. Pointer deltas are divided by it so drags track the pointer exactly. */
export function getCanvasZoom(): number {
  return parseFloat(document.documentElement.style.zoom) || 1;
}

/** Distance from the viewport top to an element, in canvas pixels. */
export function canvasTop(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const scale = rect.width && el.offsetWidth ? rect.width / el.offsetWidth : 1;
  return rect.top / scale;
}
