import { isAdmin } from "@/lib/admin-auth";
import { db, reply, unauthorized } from "@/lib/supabase";

// Lista pública, na ordem do site.
export async function GET() {
  return reply(await db("members?select=*&order=position,name"));
}

// Cria um membro. Só com a sessão do /admin; o banco recusa grupo/área inválidos.
export async function POST(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  return reply(await db("members", { method: "POST", body: await request.text() }), { one: true });
}
