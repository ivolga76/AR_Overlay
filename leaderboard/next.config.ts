import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  // Turbopack root — avoid workspace detection conflict
  turbopack: {
    root: __dirname,
  },

  // Allow images from external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
