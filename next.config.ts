import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
    ],
  },
  headers: async function () {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.ADMIN_DASHBOARD_URL!,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
