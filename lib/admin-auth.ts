import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Acesso ao /admin: uma chave só, na variável ADMIN_KEY (gere com `openssl rand -hex 32`).
// Quem acerta a chave ganha um cookie assinado com ela, válido por 8 horas.
// Trocar a ADMIN_KEY desloga todo mundo.

const COOKIE = "puctech_admin";
const MAX_AGE = 8 * 60 * 60; // segundos

const key = () => process.env.ADMIN_KEY ?? "";
const sign = (value: string) => createHmac("sha256", key()).update(value).digest("hex");

// Compara sem vazar pelo tempo de resposta quantos caracteres batem.
function same(a: string, b: string) {
  const digest = (text: string) => createHash("sha256").update(text).digest();
  return timingSafeEqual(digest(a), digest(b));
}

/** Confere a chave digitada. Sem ADMIN_KEY configurada (ou curta demais), ninguém entra. */
export function checkKey(attempt: string) {
  return key().length >= 32 && same(attempt.trim(), key());
}

export async function startSession() {
  const expires = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  (await cookies()).set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (key().length < 32) return false;
  const [expires, signature] = ((await cookies()).get(COOKIE)?.value ?? "").split(".");
  if (!expires || !signature) return false;
  return Number(expires) > Date.now() / 1000 && same(signature, sign(expires));
}

/** Use no começo de toda página e de toda ação do admin (o layout sozinho não protege as ações). */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
