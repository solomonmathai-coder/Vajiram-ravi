// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): lib/photo.js. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
// Responsive photos (performance audit 2026-11-16): the large photos in public/assets/img/photos also exist as an 800px-wide copy
// (<name>-800.webp; the tall campus-entrance as -480). photoSrcSet(src, width) gives the srcset for both, so phones and small
// cards fetch the small copy and wide screens the original. Pair it with a `sizes` that says how wide the photo is shown.
const SMALL = { 'campus-entrance.webp': 480, 'campus-entrance-clean.webp': 480, 'institute-exterior.webp': 480 };
export function photoSrcSet(src, w) {
  const file = src.split('/').pop(), sw = SMALL[file] || 800;
  if (!src.includes('/assets/img/photos/') || w <= sw) return undefined;
  return `${src.replace(/\.webp$/, `-${sw}.webp`)} ${sw}w, ${src} ${w}w`;
}
