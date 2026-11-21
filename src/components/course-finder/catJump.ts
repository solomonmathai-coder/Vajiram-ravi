/*
 * The course finder's category jump (Kevin's window.__cfSetCat): the nav's "All courses" menu, its "Browse all"
 * link and the category rail send a category here, and the finder scrolls to that section, clear of the
 * sticky bar, and writes #cat=… into the address.
 */
let handler: ((k: string) => void) | null = null;

/** The finder registers its scroll; returns the unregister. */
export function setCategoryHandler(fn: (k: string) => void) {
  handler = fn;
  return () => {
    if (handler === fn) handler = null;
  };
}

/**
 * Goes to a category ("all" for the top of the list). On a page without the finder (the nav is also on /about),
 * it opens the courses page at that category.
 */
export function goToCategory(k: string) {
  if (handler) handler(k);
  else window.location.href = `/courses#cat=${k}`;
}
