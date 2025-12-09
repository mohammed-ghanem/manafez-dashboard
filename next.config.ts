import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "backend.wecandevmode.online",
    ], // add imgur domain here
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: { serverMinification: false}
};

export default nextConfig;