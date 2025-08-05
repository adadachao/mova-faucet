import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/faucet/:path*',
  //       destination: 'https://faucet.mars.movachain.com/api/faucet/:path*',
  //     },
  //   ];
  // },
};

export default nextConfig;
