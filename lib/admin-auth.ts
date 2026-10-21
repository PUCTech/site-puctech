import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/lib/supabase";

// Acesso ao /admin: login com GitHub (app/api/auth/github). Só entra a conta do GitHub
// (pelo id, que nunca muda) que está na tabela admins; ADMIN_GITHUB_ID é o dono,
// sempre admin (cobre o primeiro login).
// O cookie, válido por 8 horas, guarda o id da conta do GitHub, assinado com o
// GITHUB_CLIENT_SECRET (trocar o secret desloga todo mundo). A tabela é consultada
// a cada pedido: quem for removido perde o acesso na hora.

const COOKIE = "puctech_admin";
const MAX_AGE = 8 * 60 * 60; // segundos
export const STATE_COOKIE = "puctech_oauth_state"; // state do login com GitHub

const secret = () => process.env.GITHUB_CLIENT_SECRET ?? "";
/** Id da conta do GitHub do dono (ADMIN_GITHUB_ID), ou null se não configurado. */
export const ownerId = () => Number(process.env.ADMIN_GITHUB_ID) || null;
const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("hex");

// Compara sem vazar pelo tempo de resposta quantos caracteres batem.
function same(a: string, b: string) {
  const digest = (text: string) => createHash("sha256").update(text).digest();
  return timingSafeEqual(digest(a), digest(b));
}

export type Admin = {
  id: string;
  github_login: string;
  github_id: number;
  added_by: string;
  created_at: string;
};

export async function admins(query: string, init?: RequestInit): Promise<Admin[]> {
  const response = await db(`admins?${query}`, init);
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${(await response.text()).slice(0, 200)}`);
  return response.json();
}

/**
 * Conta do GitHub pelo nome de usuário (id e nome com a grafia certa), ou null se não
 * existir. Com as credenciais do OAuth App o limite do GitHub sobe de 60 para 5.000 por hora.
 */
export async function githubUser(login: string): Promise<{ id: number; login: string } | null> {
  const credentials = Buffer.from(`${process.env.GITHUB_CLIENT_ID}:${secret()}`).toString("base64");
  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
    cache: "no-store",
    headers: { Accept: "application/vnd.github+json", Authorization: `Basic ${credentials}` },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Não deu para consultar o GitHub (${response.status}). Tente de novo.`);
  const user = (await response.json()) as { id: number; login: string };
  return { id: user.id, login: user.login };
}

/** Decide se a conta do GitHub entra: só pelo id. `null` = sem acesso. */
export async function admit(githubId: number, githubLogin: string): Promise<Admin | null> {
  const login = githubLogin.toLowerCase();

  const [known] = await admins(`github_id=eq.${githubId}`);
  if (known) {
    if (known.github_login === login) return known;
    // Trocou de nome no GitHub: o nome na lista acompanha (é só para mostrar).
    const body = JSON.stringify({ github_login: login });
    return (await admins(`id=eq.${known.id}`, { method: "PATCH", body }))[0] ?? known;
  }

  if (githubId === ownerId()) {
    const body = JSON.stringify({ github_login: login, github_id: githubId, added_by: "ADMIN_GITHUB_ID" });
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
