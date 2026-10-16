import Link from "next/link";
import type { ReactNode } from "react";

export const container = "mx-auto w-full max-w-6xl px-5 sm:px-6";

export const button = {
  base: "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors",
  primary: "bg-accent text-ink hover:bg-ink hover:text-white",
  dark: "bg-ink text-white hover:bg-accent hover:text-ink",
  outline: "border border-border bg-white text-ink hover:border-ink",
};

export const h2 =
  "font-display text-2xl font-bold tracking-[-0.02em] text-balance md:text-3xl";

/**
 * Páginas internas: coluna fixa à esquerda (título, introdução e atalhos)
 * e o conteúdo à direita. No celular, a coluna vira o topo da página.
 */
export function SidebarLayout({
  title,
  intro,
  aside,
  children,
}: {
  title: string;
  intro?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className={`${container} grid gap-10 py-10 md:py-14 lg:grid-cols-[18rem_1fr] lg:gap-14`}>
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <h1 className="font-display text-4xl font-bold tracking-[-0.03em] md:text-5xl">
          {title}
        </h1>
        {intro && <div className="mt-4 leading-relaxed text-muted">{intro}</div>}
        {aside && <div className="mt-8">{aside}</div>}
      </aside>
      <div className="min-w-0">{children}</div>
    </main>
  );
}

/** Lista de atalhos para as seções da página (vai no `aside`). */
export function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="Nesta página" className="hidden lg:block">
      <ul className="space-y-1 border-l-2 border-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="-ml-0.5 block border-l-2 border-transparent py-1.5 pl-4 text-[15px] text-muted transition-colors hover:border-accent hover:text-ink"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Seção de conteúdo, sem caixa: separada da anterior por uma linha fina. */
export function Block({
  id,
  title,
  subtitle,
  tone = "white",
  children,
}: {
  id?: string;
  title?: string;
  subtitle?: string;
  tone?: "white" | "accent";
  children?: ReactNode;
}) {
  // "accent" ganha uma barra ciano à esquerda; os outros tons ficam iguais.
  return (
    <section
      id={id}
      className={`scroll-mt-24 border-t border-border py-12 first:border-t-0 first:pt-0 md:py-16 ${
        tone === "accent" ? "border-l-4 border-l-accent pl-6 md:pl-8" : ""
      }`}
    >
      {title && <h2 className={h2}>{title}</h2>}
      {subtitle && (
        <p className="mt-3 max-w-[62ch] leading-relaxed text-muted">{subtitle}</p>
      )}
      {children && <div className={title || subtitle ? "mt-8" : ""}>{children}</div>}
    </section>
  );
}

/**
 * Seção da home com a largura da tela toda: o conteúdo fica centralizado e
 * `art` vai numa camada de fundo, para animações ASCII como a da abertura.
 */
export function Stage({
  id,
  art,
  className = "",
  children,
}: {
  id?: string;
  art?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`relative isolate scroll-mt-20 ${className}`}>
      {art && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {art}
        </div>
      )}
      <div className={container}>{children}</div>
    </section>
  );
}

/** Link para outra página escrito como comando de terminal, no tom da abertura da home. */
export function CdLink({ href, className = "" }: { href: string; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-block font-mono text-sm text-accent-ink underline decoration-accent/40 underline-offset-4 transition-colors hover:text-ink hover:decoration-accent ${className}`}
    >
      cd {href}
    </Link>
  );
}

// Texto entre **dois asteriscos** vira negrito.
export function withBold(text: string) {
  return text.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-ink">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}
