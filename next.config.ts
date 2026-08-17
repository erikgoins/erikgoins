import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // This project is not part of the surrounding pnpm workspace; pin the root so
  // Turbopack does not try to resolve against it.
  turbopack: { root: __dirname },
};

export default nextConfig;
