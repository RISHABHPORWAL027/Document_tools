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
        source: "/management-representation-letter",
        destination: "/management-representation-letter-format",
        permanent: true,
      },
      {
        source: "/director-resignation-letter",
        destination: "/director-resignation-letter-format",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
