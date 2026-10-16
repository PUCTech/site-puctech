import type { Metadata } from "next";
import { Block, SidebarLayout, button, withBold } from "@/components/Section";
import { ExternalIcon } from "@/components/SocialIcons";
import { apply, prepare, selectionPage } from "@/data/selection";

export const metadata: Metadata = {
  title: "Processo Seletivo",
  description:
    "Saiba como se preparar para o próximo processo seletivo da PUC Tech, previsto para o primeiro semestre de 2027.",
};

export default function ProcessoSeletivoPage() {
  return (
    <SidebarLayout title={selectionPage.title}>
      <Block>
        <p className="font-display text-2xl leading-snug font-semibold tracking-[-0.015em] text-balance text-muted md:text-[2rem]">
          {withBold(selectionPage.intro)}
        </p>
      </Block>

      {/* Duas colunas separadas por uma linha: como se preparar | inscrição. */}
      <div className="grid border-t border-border pt-12 md:grid-cols-2 md:pt-16">
        <Block title={prepare.title}>
          <p className="leading-relaxed text-muted">{withBold(prepare.text)}</p>
          <a
            href={prepare.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${button.base} ${button.dark} mt-6`}
          >
            {prepare.linkLabel}
            <ExternalIcon className="size-4" />
          </a>
        </Block>

        <section className="flex flex-col items-start justify-between gap-8 border-t border-border py-12 md:border-t-0 md:border-l md:py-0 md:pl-10">
          <p className="font-display text-3xl leading-tight font-bold tracking-[-0.02em] text-balance md:text-4xl">
            <span aria-hidden className="mb-4 block size-3 rounded-full bg-accent" />
            {selectionPage.badge}
          </p>
          {apply.applyUrl ? (
            <a
              href={apply.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${button.base} ${button.primary}`}
            >
              {apply.applyLabel}
              <ExternalIcon className="size-4" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-full border border-dashed border-border px-5 py-2.5 text-left text-[15px] font-semibold text-muted"
            >
              {apply.soonLabel}
            </button>
          )}
        </section>
      </div>
    </SidebarLayout>
  );
}
