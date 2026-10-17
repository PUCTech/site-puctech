import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Só no `next dev`: libera abrir o site pela rede local e por túnel do Cloudflare
  // (testar em outro PC/celular). Sem isso o JS do dev é bloqueado e nada anima.
  allowedDevOrigins: ["192.168.15.3", "*.trycloudflare.com"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;