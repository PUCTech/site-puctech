import { isAdmin } from "@/lib/admin-auth";
import { db, reply, unauthorized } from "@/lib/supabase";

type Context = { params: Promise<{ id: string }> };
const row = async ({ params }: Context) => `members?id=eq.${encodeURIComponent((await params).id)}`;

export async function GET(_: Request, context: Context) {
  return reply(await db(await row(context)), { one: true });
}

export async function PATCH(request: Request, context: Context) {
  if (!(await isAdmin())) return unauthorized();
  return reply(await db(await row(context), { method: "PATCH", body: await request.text() }), { one: true });
}

export async function DELETE(_: Request, context: Context) {
  if (!(await isAdmin())) return unauthorized();
  return reply(await db(await row(context), { method: "DELETE" }), { one: true });
}
