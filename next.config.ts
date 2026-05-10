import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@aisoldier/ui-kit"],
  experimental: {
    externalDir: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    if (config.resolve) {
      config.resolve.symlinks = false;
    }
    return config;
  },
};

export default config;
