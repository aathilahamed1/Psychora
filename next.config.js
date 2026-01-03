import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Increase the timeout to 5 minutes (300 seconds)
  staticPageGenerationTimeout: 300,

  // Ignore TypeScript and ESLint errors during the build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configure allowed image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default nextConfig;
