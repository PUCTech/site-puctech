import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { button, Stage } from "@/components/Section";
import { isAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

// ?erro= vem da volta do GitHub (app/api/auth/github/callback).
const errors: Record<string, string> = {
  "sem-acesso": "Sua conta do GitHub não tem acesso. Peça para um admin adicionar o seu usuário.",
  login: "Não deu para entrar com o GitHub. Tente de novo.",
  config: "Login com GitHub não configurado (falta GITHUB_CLIENT_ID).",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { erro } = await searchParams;
  const error = erro && (errors[erro] ?? errors.login);

  return (
    <main>
      <Stage className="flex min-h-[calc(100svh-4rem)] items-center py-16">
        <div className="max-w-md">
          <p className="fade-in font-mono text-sm text-accent-ink">~/puctech/admin</p>
          <h1 className="fade-in mt-4 text-4xl font-bold tracking-[-0.04em] md:text-6xl">Área restrita</h1>
          <p className="fade-in mt-5 text-lg leading-relaxed text-pretty text-muted [animation-delay:250ms]">
            Entre com a sua conta do GitHub para gerenciar os projetos e os membros da PUC Tech.
          </p>

          {error && (
            <p role="alert" className="mt-8 text-[15px] font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          {/* Link comum (não <Link>): o destino redireciona para fora do site. */}
          <a href="/api/auth/github" className={`fade-in mt-10 ${button.base} ${button.primary} [animation-delay:400ms]`}>
            Entrar com GitHub →
          </a>
        </div>
      </Stage>
    </main>
  );
}
