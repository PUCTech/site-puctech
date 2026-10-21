import type { NextConfig } from "next";

// Fotos enviadas pelo /admin ficam no Storage do Supabase.
const supabase = process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL) : null;

const nextConfig: NextConfig = {
  // Só no `next dev`: libera abrir o site pela rede local e por túnel do Cloudflare
  // (testar em outro PC/celular). Sem isso o JS do dev é bloqueado e nada anima.
  allowedDevOrigins: ["192.168.15.3", "*.trycloudflare.com"],
  // Fotos do /admin vão no corpo da ação (até 4 MB, validado lá; o padrão do Next é 1 MB).
  experimental: { serverActions: { bodySizeLimit: "5mb" } },
  images: {
    remotePatterns: supabase
      ? [{ protocol: supabase.protocol.replace(":", "") as "http" | "https", hostname: supabase.hostname, port: supabase.port, pathname: "/storage/v1/object/public/**" }]
      : [],
    // O Supabase local roda em 127.0.0.1, que o otimizador de imagens bloqueia por padrão.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
  async redirects() {
    return [
      { source: "/equipe", destination: "/membros", permanent: true },
      { source: "/links", destination: "/linktree", permanent: true },
    ];
  },
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