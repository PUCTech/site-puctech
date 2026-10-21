import "server-only";
import { NextResponse } from "next/server";

// Fala com o Supabase pela API REST (PostgREST) e pelo Storage. Só roda no servidor.
// Variáveis: SUPABASE_URL e SUPABASE_SECRET_KEY (a secret key ignora o RLS: nunca no navegador).

function env() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL ou SUPABASE_SECRET_KEY não configurado.");
  // sem o Authorization o PostgREST roda como anon (só leitura)
  return { url, headers: { apikey: key, Authorization: `Bearer ${key}` } };
}

export function db(path: string, init?: RequestInit) {
  const { url, headers } = env();
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...headers,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init?.headers,
    },
  });
}

// Fotos do /admin ficam no bucket público "imagens" (supabase/migrations).
const BUCKET = "imagens";
const publicPrefix = () => `${env().url}/storage/v1/object/public/${BUCKET}/`;

/** Sobe uma imagem e devolve o endereço público dela. */
export async function uploadImage(path: string, content: Buffer, type: string) {
  const { url, headers } = env();
  const response = await fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": type },
    body: new Uint8Array(content),
  });
  if (!response.ok) throw new Error(`Não deu para enviar a imagem (${response.status}).`);
  return publicPrefix() + path;
}

/** Apaga uma imagem que veio do uploadImage. Fotos antigas (em public/) ficam como estão. */
export async function removeImage(address: string | null | undefined) {
  if (!address?.startsWith(publicPrefix())) return;
  const { url, headers } = env();
  // Melhor esforço: se falhar, sobra só um arquivo solto no bucket.
  await fetch(`${url}/storage/v1/object/${BUCKET}/${address.slice(publicPrefix().length)}`, {
    method: "DELETE",
    headers,
  }).catch(() => {});
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
