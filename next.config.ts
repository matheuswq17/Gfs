import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  outputFileTracingIncludes: {
    "/*": ["./prisma/deploy.db"],
  },
};

export default nextConfig;
