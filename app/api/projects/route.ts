import { isAdmin } from "@/lib/admin-auth";
import { db, reply, unauthorized } from "@/lib/supabase";

// Lista pública, na ordem do site (order e, no empate, título em português).
export async function GET() {
  return reply(await db("projects?select=*&order=order,title->>pt"));
}

// Cria um projeto. Só com a sessão do /admin; o banco recusa área/status inválidos e slug repetido.
export async function POST(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  return reply(await db("projects", { method: "POST", body: await request.text() }), { one: true });
}
