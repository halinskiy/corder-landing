import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repo = "corder-landing";

const config: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default config;
