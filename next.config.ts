import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The site has no server features, so `next build` writes plain HTML, CSS and JS to `out/`.
  // Any static host can serve that folder, including Netlify drag-and-drop deploys.
  output: "export",
  // Image optimisation needs a server. The photos are already sized webp files, so serve them as they are.
  images: { unoptimized: true },
};

export default nextConfig;
