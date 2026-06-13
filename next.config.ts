import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  serverExternalPackages: ["@prisma/client", "@neondatabase/serverless"],
};

export default nextConfig;
