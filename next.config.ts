import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The site has no server features, so `next build` writes plain HTML, CSS and JS to `out/`.
  // Any static host can serve that folder, including Netlify drag-and-drop deploys.
  output: "export",
  // Image optimisation needs a server. The photos are already sized webp files, so serve them as they are.
  images: { unoptimized: true },
  // "/" is Kevin's homepage, a finished page kept as it is in public/index.html (our homepage is at /home-v2). The
  // built site serves it at "/" (static hosts open index.html there; vercel.json cleanUrls), but the dev server
  // serves public files only by their own name, so in development "/" goes to /index.html. (Exported sites ignore
  // redirects, so this is added in development only.)
  ...(process.env.NODE_ENV === "development"
    ? { redirects: async () => [{ source: "/", destination: "/index.html", permanent: false }] }
    : {}),
};

export default nextConfig;
