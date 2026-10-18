import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

export const container = "mx-auto w-full max-w-6xl px-5 sm:px-6";

export const button = {
  base: "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors",
  primary: "bg-accent text-on-accent hover:bg-ink hover:text-paper",
  dark: "bg-ink text-paper hover:bg-accent hover:text-on-accent",
  outline: "border border-border bg-paper text-ink hover:border-ink",
};

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

/** Título de seção da home e das páginas internas: título grande, texto logo abaixo. */
export function Heading({
  title,
  href,
  wide = false,
  children,
}: {
  title: string;
  href?: string;
  wide?: boolean; // texto em duas colunas, ocupando a largura toda
  children?: ReactNode;
}) {
  return (
    <Reveal>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
        <h2 className="text-3xl font-bold tracking-[-0.03em] text-balance md:text-5xl md:leading-[1.05]">
          {title}
        </h2>
        {href && <CdLink href={href} />}
      </div>
      {children && <div
        className={`mt-4 text-lg leading-relaxed text-pretty text-muted ${
          wide ? "gap-12 space-y-3 md:columns-2 md:space-y-0 [&>p]:break-inside-avoid md:[&>p+p]:mt-0" : "max-w-3xl space-y-3"
        }`}
      >
        {children}
      </div>}
    </Reveal>
  );
}
