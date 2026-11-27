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
 * Pages that lay themselves out at every width (27 Nov 2026, user: "make Courses page responsive"): never zoomed, at any
 * window size, with their own phone and tablet rules (course-finder.css, Kevin's media queries). Matched exactly, so
 * /courses/books keeps its canvas and phone layout.
 */
export const FLUID_PAGES = ["/courses"];

const isFluid = (path: string) => FLUID_PAGES.includes(path.replace(/\/+$/, "") || "/");

/**
 * Re-fits the canvas to the current viewport and returns the zoom factor applied.
 * The factor is also published as `--canvas-zoom`, because the zoom shrinks viewport units too:
 * a full-screen height is `calc(100svh / var(--canvas-zoom, 1))`.
 */
export function fitCanvas(): number {
  const root = document.documentElement;
  root.style.zoom = "";
  const viewport = root.clientWidth || window.innerWidth;
  const fluid = isFluid(location.pathname);
  // html.phone also gives a fluid page the shared footer's phone layout (footer-ref/ref-footer.css)
  const phone = viewport <= PHONE_MAX && (fluid || PHONE_PAGES.some((p) => location.pathname.startsWith(p)));
  root.classList.toggle("phone", phone);
  const zoom = phone || fluid ? 1 : Math.min(1, viewport / CANVAS_WIDTH);
  if (zoom < 1) root.style.zoom = String(zoom);
  root.style.setProperty("--canvas-zoom", String(zoom));
  return zoom;
}

/** Inline <head> version of fitCanvas, so the very first paint is already scaled. */
export const fitCanvasScript = `(function(){var r=document.documentElement,w=r.clientWidth||innerWidth,f=${JSON.stringify(FLUID_PAGES)}.indexOf(location.pathname.replace(/\\/+$/,"")||"/")>=0,p=w<=${PHONE_MAX}&&(f||${JSON.stringify(PHONE_PAGES)}.some(function(x){return location.pathname.indexOf(x)===0})),z=p||f?1:Math.min(1,w/${CANVAS_WIDTH});if(p)r.classList.add("phone");if(z<1)r.style.zoom=String(z);r.style.setProperty("--canvas-zoom",String(z))})();`;

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
