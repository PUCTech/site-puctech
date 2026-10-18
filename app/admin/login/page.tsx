import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { login } from "@/app/admin/actions";
import { AdminForm, Field } from "@/components/admin/forms";
import { input } from "@/components/admin/styles";
import { Stage } from "@/components/Section";
import { isAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main>
      <Stage className="flex min-h-[calc(100svh-4rem)] items-center py-16">
        <div className="max-w-md">
          <p className="fade-in font-mono text-sm text-accent-ink">~/puctech/admin</p>
          <h1 className="fade-in mt-4 text-4xl font-bold tracking-[-0.04em] md:text-6xl">Área restrita</h1>
          <p className="fade-in mt-5 text-lg leading-relaxed text-pretty text-muted [animation-delay:250ms]">
            Entre com a chave de acesso para gerenciar os projetos e os membros da PUC Tech.
          </p>

          <AdminForm action={login} submit="Entrar →" busy="Entrando…" className="fade-in mt-10 [animation-delay:400ms]">
            <Field label="chave de acesso">
              <input
                name="key"
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                spellCheck={false}
                className={`${input} font-mono`}
              />
            </Field>
          </AdminForm>
        </div>
      </Stage>
    </main>
  );
}
