import "server-only";
import { NextResponse } from "next/server";

// Fala com o Supabase pela API REST (PostgREST). Só roda no servidor.
// Variáveis: SUPABASE_URL e SUPABASE_SECRET_KEY (a secret key ignora o RLS: nunca no navegador).

export function db(path: string, init?: RequestInit) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL ou SUPABASE_SECRET_KEY não configurado.");
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`, // sem isto o PostgREST roda como anon (só leitura)
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init?.headers,
    },
  });
}

/** Repassa a resposta do Supabase. Com `one`, devolve só a primeira linha (ou 404). */
export async function reply(response: Response, { one = false, status = response.status } = {}) {
  const data = await response.json();
  if (!response.ok) return NextResponse.json(data, { status: response.status });
  if (!one) return NextResponse.json(data, { status });
  return data[0]
    ? NextResponse.json(data[0], { status })
    : NextResponse.json({ error: "Não encontrado." }, { status: 404 });
}

export const unauthorized = () => NextResponse.json({ error: "Não autorizado." }, { status: 401 });
