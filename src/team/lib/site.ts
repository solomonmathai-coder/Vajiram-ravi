// Copied from abhishekps-web/vajiram-ravi (team/main 9374635): lib/site.js. Read-only copy, do not edit; re-copy with scripts/copy-team-parts.py.
// @ts-nocheck
// Shared helpers and site-wide constants for the behaviour modules (they run in the browser only, from lib/behaviour.js).

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export const PHONE = '080-6220-6330';
export const SITE = 'https://vajiramandravi.com/';
const IMG = 'assets/img/';
export const PHOTO = n => IMG + 'photos/' + n;
export const ICON = n => IMG + 'icons/' + n;
// an icon from assets/img/icons as an <img> string, for markup the behaviours build
export const ico = (n, s = 16) => `<img src="${ICON(n)}" alt="" width="${s}" height="${s}">`;
