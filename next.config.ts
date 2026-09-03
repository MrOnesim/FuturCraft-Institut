import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "**.futurcraft.bj",
      },
    ],
  },
  // Autorise le rechargement à chaud (HMR) depuis les aperçus distants en développement.
  allowedDevOrigins: ["*.e2b.app"],
};

export default nextConfig;
