import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requires unsafe-inline (CSS-in-JS, inline event handlers) and
      // unsafe-eval (dynamic code evaluation in dev + some RSC internals).
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      // Geist is self-hosted via next/font at build time → no external font CDN needed.
      "font-src 'self'",
      // Client components call the external API directly (fetchBilletDetail, postCommentaire…).
      "connect-src 'self' https://www.ryanfonseca.fr",
      "frame-ancestors 'none'",
    ].join("; "),
  },
  // Belt-and-suspenders alongside frame-ancestors for older browsers.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/login",
        headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }],
      },
      {
        source: "/register",
        headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
