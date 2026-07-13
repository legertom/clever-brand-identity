import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Brand content endpoints (llms.txt, tokens, guidelines) are public data
  // consumed by agents and browsers alike.
  async headers() {
    return [
      {
        source: "/:path(llms.txt|brand-guidelines.md|brand-guidelines.json|tokens.css|tokens.json|fonts.css|tailwind-preset.mjs)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=300, s-maxage=3600" }
        ]
      }
    ];
  }
};

export default nextConfig;
