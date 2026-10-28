// Serves the static export in `out/` the way Netlify does, to check a build before deploying.
// Usage: npm run build && npm start   (optional: PORT=4000 npm start)
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve("out");
const port = Number(process.env.PORT) || 3000;
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function findFile(urlPath) {
  const base = join(root, normalize(decodeURIComponent(urlPath)));
  if (!base.startsWith(root)) return null;
  for (const candidate of [base, join(base, "index.html"), `${base}.html`]) {
    const info = await stat(candidate).catch(() => null);
    if (info?.isFile()) return candidate;
  }
  return null;
}

createServer(async (req, res) => {
  const path = new URL(req.url ?? "/", "http://localhost").pathname;
  const file = await findFile(path);
  const target = file ?? join(root, "404.html");
  res.writeHead(file ? 200 : 404, { "Content-Type": types[extname(target)] ?? "application/octet-stream" });
  createReadStream(target).on("error", () => res.end("Not found. Run `npm run build` first.")).pipe(res);
}).listen(port, () => console.log(`Serving out/ at http://localhost:${port}`));
