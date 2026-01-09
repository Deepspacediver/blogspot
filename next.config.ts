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
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          { key: "Access-Control-Allow-Methods", value: "GET, DELETE, PATCH, PUT, POST" },
          { key: "Access-Control-Allow-Headers", value: "content-type" },
        ],
      },
    ];
  },
};

export default nextConfig;
