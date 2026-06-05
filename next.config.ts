import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: "/noc",
        destination: "/noc-format",
        permanent: true,
      },
      {
        source: "/dir2",
        destination: "/dir-2-format",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
