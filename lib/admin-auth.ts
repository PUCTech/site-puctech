import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/lib/supabase";

// Acesso ao /admin: login com GitHub (app/api/auth/github). Só entra quem está na
// tabela admins; ADMIN_GITHUB é o dono, sempre admin (cobre o primeiro login).
// O cookie, válido por 8 horas, guarda o id da conta do GitHub, assinado com o
// GITHUB_CLIENT_SECRET (trocar o secret desloga todo mundo). A tabela é consultada
// a cada pedido: quem for removido perde o acesso na hora.

const COOKIE = "puctech_admin";
const MAX_AGE = 8 * 60 * 60; // segundos
export const STATE_COOKIE = "puctech_oauth_state"; // state do login com GitHub

const secret = () => process.env.GITHUB_CLIENT_SECRET ?? "";
export const owner = () => (process.env.ADMIN_GITHUB ?? "").trim().toLowerCase();
const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("hex");

// Compara sem vazar pelo tempo de resposta quantos caracteres batem.
function same(a: string, b: string) {
  const digest = (text: string) => createHash("sha256").update(text).digest();
  return timingSafeEqual(digest(a), digest(b));
}

export type Admin = {
  id: string;
  github_login: string;
  github_id: number | null;
  added_by: string;
  created_at: string;
};

export async function admins(query: string, init?: RequestInit): Promise<Admin[]> {
  const response = await db(`admins?${query}`, init);
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${(await response.text()).slice(0, 200)}`);
  return response.json();
}

const patch = (body: object): RequestInit => ({ method: "PATCH", body: JSON.stringify(body) });

/**
 * Decide se a conta do GitHub entra. No primeiro login trava o github_id: daí em
 * diante vale a conta, não o nome (que pode trocar de dono). `null` = sem acesso.
 */
export async function admit(githubId: number, githubLogin: string): Promise<Admin | null> {
  const login = githubLogin.toLowerCase();

  const [known] = await admins(`github_id=eq.${githubId}`);
  if (known) {
    if (known.github_login === login) return known;
    // Trocou de nome no GitHub: a lista acompanha (se o nome novo não estiver reservado).
    try {
      return (await admins(`id=eq.${known.id}`, patch({ github_login: login })))[0] ?? known;
    } catch {
      return known;
    }
  }

  const [invited] = await admins(`github_login=eq.${encodeURIComponent(login)}`);
  if (invited) {
    if (invited.github_id !== null) return null; // o nome já foi confirmado por outra conta
    return (await admins(`id=eq.${invited.id}&github_id=is.null`, patch({ github_id: githubId })))[0] ?? null;
  }

  if (login === owner()) {
    const body = JSON.stringify({ github_login: login, github_id: githubId, added_by: "ADMIN_GITHUB" });
    return (await admins("", { method: "POST", body }))[0];
  }
  return null;
}

export async function startSession(githubId: number) {
  const value = `${githubId}.${Math.floor(Date.now() / 1000) + MAX_AGE}`;
  (await cookies()).set(COOKIE, `${value}.${sign(value)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // lax: o cookie precisa chegar na volta do GitHub
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

/** Admin logado neste pedido (ou null). Uma consulta por pedido, mesmo chamando várias vezes. */
export const currentAdmin = cache(async (): Promise<Admin | null> => {
  if (secret().length < 16) return null;
  const [githubId, expires, signature] = ((await cookies()).get(COOKIE)?.value ?? "").split(".");
  if (!githubId || !expires || !signature) return null;
  if (!/^\d+$/.test(githubId) || !(Number(expires) > Date.now() / 1000)) return null;
  if (!same(signature, sign(`${githubId}.${expires}`))) return null;
  return (await admins(`github_id=eq.${githubId}`))[0] ?? null;
});

export async function isAdmin() {
  return (await currentAdmin()) !== null;
}

/** Use no começo de toda página e de toda ação do admin (o layout sozinho não protege as ações). */
export async function requireAdmin() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
