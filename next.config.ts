import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      
    ], // add imgur domain here
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;