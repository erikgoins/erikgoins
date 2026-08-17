import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is one static route with no server work, so `next build` writes a
  // plain HTML/CSS/JS tree to `out/`. Cloudflare serves that directly from
  // Workers static assets — no Node runtime, no OpenNext adapter.
  output: "export",
  // Static export has no image optimizer. Every file in /public ships at its
  // source size, so source dimensions are a delivery decision.
  images: { unoptimized: true },
  reactCompiler: true,
  // This project is not part of the surrounding pnpm workspace; pin the root so
  // Turbopack does not try to resolve against it.
  turbopack: { root: __dirname },
};

export default nextConfig;
