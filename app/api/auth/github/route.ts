import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { STATE_COOKIE } from "@/lib/admin-auth";

// "Entrar com GitHub": manda para o GitHub com um `state` aleatório, que volta no
// callback e precisa bater com o cookie (impede que alguém injete o login de outra conta).
// Variáveis: GITHUB_CLIENT_ID e GITHUB_CLIENT_SECRET, de um OAuth App do GitHub com o
// callback <site>/api/auth/github/callback.

export function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) return NextResponse.redirect(new URL("/admin/login?erro=config", request.url));

  const state = randomBytes(16).toString("hex");
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", new URL("/api/auth/github/callback", request.url).toString());
  url.searchParams.set("state", state);
  url.searchParams.set("allow_signup", "false");

  const response = NextResponse.redirect(url);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/github",
    maxAge: 10 * 60,
  });
  return response;
}
