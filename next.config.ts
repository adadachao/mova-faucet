import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  async rewrites() {
    return [
      {
        source: '/api/faucet/:path*',
        destination: 'http://15.206.227.101:38070/api/faucet/:path*',
      },
    ];
  },
};

export default nextConfig;
