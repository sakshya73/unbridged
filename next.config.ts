import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The playgrounds intentionally count real renders (a ref bumped in render).
  // StrictMode's dev-only double-invoke would show doubled counts and muddy the
  // teaching; production never double-invokes, so turn it off for consistency.
  reactStrictMode: false,
};

export default nextConfig;
