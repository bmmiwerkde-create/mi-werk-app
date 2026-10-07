import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [{ source: "/demo", destination: "/demo-entwurf.html" }];
  },
  async headers() {
    return [
      { source: "/demo", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/demo-entwurf.html", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
