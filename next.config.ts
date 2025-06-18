import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'plus.unsplash.com'],
  },
  experimental: {
    authInterrupts: true,
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/unauthorized",
  //       destination: "/401",
  //       permanent: false,
  //     },
  //     {
  //       source: "/forbidden",
  //       destination: "/403",
  //       permanent: false,
  //     },
  //     {
  //       source: "/service-unavailable",
  //       destination: "/503",
  //       permanent: false,
  //     },
  //   ];
  // },
};

export default nextConfig;
