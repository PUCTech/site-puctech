import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Stage } from "@/components/Section";
import { isAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

// ?erro= vem da volta do GitHub (app/api/auth/github/callback).
const errors: Record<string, string> = {
  "sem-acesso": "Sua conta do GitHub não tem acesso. Peça para um admin adicionar o seu usuário.",
  login: "Não deu para entrar com o GitHub. Tente de novo.",
  config: "Login com GitHub não configurado (falta GITHUB_CLIENT_ID).",
};

// Marca oficial do GitHub (octicon mark-github).
function GithubMark() {
  return (
    <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  );
}

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
          {/* Cores do botão do próprio GitHub; no tema escuro, borda para não sumir no fundo. */}
          <a
            href="/api/auth/github"
            className="fade-in mt-10 inline-flex items-center gap-3 rounded-full border border-transparent bg-[#24292f] px-5 py-2.5 text-[15px] font-semibold text-white transition-colors [animation-delay:400ms] hover:bg-[#32383f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292f] dark:border-white/20"
          >
            <GithubMark />
            Entrar com GitHub
          </a>
        </div>
      </Stage>
    </main>
  );
}
