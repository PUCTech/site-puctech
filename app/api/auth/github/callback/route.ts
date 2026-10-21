import { NextResponse, type NextRequest } from "next/server";
import { admit, startSession, STATE_COOKIE } from "@/lib/admin-auth";

// Volta do GitHub: confere o state, troca o code pelo token, pergunta ao GitHub quem
// é a pessoa e, se ela estiver na lista de admins, abre a sessão.

export async function GET(request: NextRequest) {
  const fail = (erro: string) => {
    const response = NextResponse.redirect(new URL(`/admin/login?erro=${erro}`, request.url));
    response.cookies.delete({ name: STATE_COOKIE, path: "/api/auth/github" });
    return response;
  };

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  if (!code || !state || state !== request.cookies.get(STATE_COOKIE)?.value) return fail("login");

  try {
    const token = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: new URL("/api/auth/github/callback", request.url).toString(),
      }),
    }).then((r) => r.json() as Promise<{ access_token?: string }>);
    if (!token.access_token) return fail("login");

    const user = await fetch("https://api.github.com/user", {
      headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token.access_token}` },
    }).then((r) => (r.ok ? (r.json() as Promise<{ id: number; login: string }>) : null));
    if (!user?.id || !user.login) return fail("login");

    if (!(await admit(user.id, user.login))) return fail("sem-acesso");
    await startSession(user.id);
  } catch (error) {
    console.error("Login com GitHub falhou.", error);
    return fail("login");
  }

  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.delete({ name: STATE_COOKIE, path: "/api/auth/github" });
  return response;
}
