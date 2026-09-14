import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enables next/navigation's forbidden()/forbidden.tsx for the
    // authenticated-but-unauthorized state required by RBAC (§14, §40).
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      // Cloudinary — where real cover/gallery uploads are hosted (§20).
      { protocol: "https", hostname: "res.cloudinary.com" },
      // picsum.photos — used only by the dev seed script's placeholder images.
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
