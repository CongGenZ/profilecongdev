import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["nodemailer"],
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
};

export default nextConfig;
