import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Ignorer les erreurs ESLint au build
  eslint: { ignoreDuringBuilds: true },
  // Ignorer les erreurs TypeScript au build
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;